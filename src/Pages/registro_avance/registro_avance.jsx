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
    Modal,
} from '@mui/material';
import { collection, getDocs, addDoc, Timestamp, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import './registro_avance.css';

const RegistroAvance = () => {
    const [openModal, setOpenModal] = useState(false);
    const [proyectos, setProyectos] = useState([]);
    const [avance, setAvance] = useState({
        proyecto: '',
        fecha: '',
        descripcion: '',
        documentos: null,
        imagenes: null,
    });

    const today = new Date().toISOString().split('T')[0];

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

    const handleChange = (e) => {
        setAvance({ ...avance, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const archivos = Array.from(e.target.files);
        setAvance({ ...avance, [e.target.name]: archivos });
    };

    const subirArchivos = async (archivos, rutaBase) => {
        const urls = [];
        for (const archivo of archivos) {
            const ruta = `${rutaBase}/${Date.now()}_${archivo.name}`;
            const archivoRef = ref(storage, ruta);
            await uploadBytes(archivoRef, archivo);
            const url = await getDownloadURL(archivoRef);
            urls.push(url);
        }
        return urls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const urlsDocs = avance.documentos ? await subirArchivos(avance.documentos, 'documentos') : [];
            const urlsImgs = avance.imagenes ? await subirArchivos(avance.imagenes, 'imagenes') : [];

            const nuevoAvance = {
                proyecto: avance.proyecto,
                proyectoId: proyectos.find(p => p.titulo === avance.proyecto)?.id || '',
                fecha: Timestamp.fromDate(new Date(avance.fecha)),
                descripcion: avance.descripcion,
                documentos: urlsDocs,
                imagenes: urlsImgs,
                creadoEn: Timestamp.now(),
            };

            const docRef = await addDoc(collection(db, 'avances'), nuevoAvance);
            await setDoc(docRef, { id: docRef.id }, { merge: true });

            // Abrir el modal después de registrar el avance
            setOpenModal(true);

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
            {/* Modal que se abre cuando se registra el avance */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)} 
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                closeAfterTransition
                BackdropProps={{
                    timeout: 500, 
                }}
            >
                <Box className="modal-box">
                    <Typography id="modal-title" variant="h6" component="h2" className="modal-title" gutterBottom>
                        ✅ Avance registrado
                    </Typography>
                    
                    <Button variant="contained" className="modal-close-btn" onClick={() => setOpenModal(false)}>
                        Cerrar
                    </Button>
                </Box>
            </Modal>


            <Paper elevation={8} className="avance-box">
                <Typography variant="h5">
                    🚀 Registro de Avance de Proyecto
                </Typography>

                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="proyecto-label">Proyecto</InputLabel>
                        <Select
                            labelId="proyecto-label"
                            name="proyecto"
                            value={avance.proyecto}
                            onChange={handleChange}
                            label="Proyecto"
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

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                        Registrar Avance
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default RegistroAvance;
