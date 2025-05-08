import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
} from '@mui/material';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import './registro_avance.css';

const RegistroAvance = () => {
    const [proyectos, setProyectos] = useState([]);
    const [avance, setAvance] = useState({
        proyecto: '',
        fecha: '',
        descripcion: '',
        documentos: null,
        imagenes: null,
    });

    const today = new Date().toISOString().split('T')[0];

    // Cargar proyectos desde Firestore
    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'proyectos'));
                const listaProyectos = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProyectos(listaProyectos);
            } catch (error) {
                console.error('Error al cargar proyectos:', error);
            }
        };

        fetchProyectos();
    }, []);

    // Manejo de cambios en los inputs
    const handleChange = (e) => {
        setAvance({ ...avance, [e.target.name]: e.target.value });
    };

    // Manejo de la carga de archivos
    const handleFileChange = (e) => {
        setAvance({ ...avance, [e.target.name]: e.target.files });
    };

    // Subir archivos a Firebase Storage y obtener las URLs
    const subirArchivos = async (archivos, rutaBase) => {
        const urls = [];
        for (let i = 0; i < archivos.length; i++) {
            const archivo = archivos[i];
            const ruta = `${rutaBase}/${Date.now()}_${archivo.name}`;
            const archivoRef = ref(storage, ruta);
            await uploadBytes(archivoRef, archivo);
            const url = await getDownloadURL(archivoRef);
            urls.push(url);
        }
        return urls;
    };

    // Enviar los datos del avance a Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Subir archivos (documentos e imágenes)
            const urlsDocs = avance.documentos ? await subirArchivos(avance.documentos, 'documentos') : [];
            const urlsImgs = avance.imagenes ? await subirArchivos(avance.imagenes, 'imagenes') : [];

            // Crear el objeto para guardar en Firestore
            const nuevoAvance = {
                proyecto: avance.proyecto,
                fecha: Timestamp.fromDate(new Date(avance.fecha)),
                descripcion: avance.descripcion,
                documentos: urlsDocs,
                imagenes: urlsImgs,
                creadoEn: Timestamp.now(),
            };

            // Guardar el avance en Firestore
            await addDoc(collection(db, 'avances'), nuevoAvance);

            alert('✅ Avance registrado con éxito');
            setAvance({
                proyecto: '',
                fecha: '',
                descripcion: '',
                documentos: null,
                imagenes: null,
            });
        } catch (error) {
            console.error('Error al registrar avance:', error);
            alert('❌ Error al registrar el avance');
        }
    };

    return (
        <Box className="avance-container">
            <Paper elevation={8} className="avance-box">
                <Typography variant="h5" gutterBottom>
                    🚀 Registro de Avance de Proyecto
                </Typography>

                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="proyecto-label">Proyecto</InputLabel>
                        <Select
                            labelId="proyecto-label"
                            id="proyecto"
                            name="proyecto"
                            value={avance.proyecto}
                            label="Proyecto"
                            onChange={handleChange}
                        >
                            {proyectos.map((proy) => (
                                <MenuItem key={proy.id} value={proy.titulo}>
                                    {proy.titulo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Fecha del avance"
                        name="fecha"
                        type="date"
                        value={avance.fecha}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        required
                        inputProps={{ min: today }}
                    />

                    <TextField
                        label="Descripción"
                        name="descripcion"
                        value={avance.descripcion}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        required
                    />

                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12}>
                            <InputLabel>Documentos (PDF, DOCX, etc.)</InputLabel>
                            <Button variant="outlined" component="label" fullWidth>
                                Seleccionar Documentos
                                <input
                                    type="file"
                                    name="documentos"
                                    onChange={handleFileChange}
                                    multiple
                                    accept=".pdf,.doc,.docx"
                                    hidden
                                />
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <InputLabel>Fotografías (JPG, PNG, etc.)</InputLabel>
                            <Button variant="outlined" component="label" fullWidth>
                                Seleccionar Imágenes
                                <input
                                    type="file"
                                    name="imagenes"
                                    onChange={handleFileChange}
                                    multiple
                                    accept="image/*"
                                    hidden
                                />
                            </Button>
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Registrar Avance
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default RegistroAvance;
