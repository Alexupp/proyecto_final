import React, { useState } from 'react';
import {
    TextField, Button, Paper, Typography, Box, Grid,
    MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import './registro_proyecto.css';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const RegistroProyecto = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaMaxima = '2025-12-31';

    const [proyecto, setProyecto] = useState({
        titulo: '',
        area: '',
        objetivos: '',
        fechaInicio: '',
        fechaFin: '',
        presupuesto: '',
        institucion: '',
        docente: '',
        estado: '',
        observaciones: '',
        integrantes: [{ nombre: '', apellido: '', identificacion: '', grado: '' }],
    });

    const [enviando, setEnviando] = useState(false);

    const handleChange = (e) => {
        setProyecto({ ...proyecto, [e.target.name]: e.target.value });
    };

    const handleIntegranteChange = (index, e) => {
        const nuevosIntegrantes = [...proyecto.integrantes];
        nuevosIntegrantes[index][e.target.name] = e.target.value;
        setProyecto({ ...proyecto, integrantes: nuevosIntegrantes });
    };

    const agregarIntegrante = () => {
        setProyecto({
            ...proyecto,
            integrantes: [
                ...proyecto.integrantes,
                { nombre: '', apellido: '', identificacion: '', grado: '' },
            ],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const presupuestoFloat = parseFloat(proyecto.presupuesto);
        if (isNaN(presupuestoFloat)) {
            alert('❌ El presupuesto debe ser un número válido.');
            return;
        }

        if (!proyecto.estado || !proyecto.area || !proyecto.institucion || !proyecto.docente || !proyecto.objetivos) {
            alert('❌ Todos los campos de selección son obligatorios.');
            return;
        }

        if (proyecto.fechaFin < proyecto.fechaInicio) {
            alert('❌ La fecha de fin no puede ser anterior a la fecha de inicio.');
            return;
        }

        try {
            setEnviando(true);

            await addDoc(collection(db, "proyectos"), {
                ...proyecto,
                presupuesto: presupuestoFloat,
                cronograma: {
                    fechaInicio: proyecto.fechaInicio,
                    fechaFin: proyecto.fechaFin,
                },
                fechaRegistro: Timestamp.now()
            });

            alert('✅ Proyecto registrado correctamente');
            setProyecto({
                titulo: '',
                area: '',
                objetivos: '',
                fechaInicio: '',
                fechaFin: '',
                presupuesto: '',
                institucion: '',
                docente: '',
                estado: '',
                observaciones: '',
                integrantes: [{ nombre: '', apellido: '', identificacion: '', grado: '' }],
            });
        } catch (error) {
            console.error("Error al registrar el proyecto:", error);
            alert('❌ Hubo un error al registrar el proyecto.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <Box className="registro-container">
            <Paper elevation={8} className="registro-box">
                <Typography variant="h5" gutterBottom>
                    📘 Registro de Proyecto Escolar
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Título" name="titulo" value={proyecto.titulo} onChange={handleChange} fullWidth margin="normal" required />

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="area-label">Área</InputLabel>
                        <Select labelId="area-label" name="area" value={proyecto.area} onChange={handleChange}>
                            <MenuItem value="Matemáticas">Matemáticas</MenuItem>
                            <MenuItem value="Lengua Castellana">Lengua Castellana</MenuItem>
                            <MenuItem value="Física">Física</MenuItem>
                            <MenuItem value="Química">Química</MenuItem>
                            <MenuItem value="Artística">Artística</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="objetivos-label">Objetivos</InputLabel>
                        <Select
                            labelId="objetivos-label"
                            name="objetivos"
                            value={proyecto.objetivos}
                            onChange={handleChange}
                        >
                            <MenuItem value="Mejorar el rendimiento académico">Mejorar el rendimiento académico</MenuItem>
                            <MenuItem value="Fomentar la investigación escolar">Fomentar la investigación escolar</MenuItem>
                            <MenuItem value="Aplicar conocimientos en proyectos prácticos">Aplicar conocimientos en proyectos prácticos</MenuItem>
                        </Select>
                    </FormControl>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Fecha de inicio"
                                name="fechaInicio"
                                type="date"
                                value={proyecto.fechaInicio}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: hoy }}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Fecha de fin"
                                name="fechaFin"
                                type="date"
                                value={proyecto.fechaFin}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ max: fechaMaxima }}
                                required
                            />
                        </Grid>
                    </Grid>

                    <TextField label="Presupuesto" name="presupuesto" value={proyecto.presupuesto} onChange={handleChange} type="number" fullWidth margin="normal" required />

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="institucion-label">Institución</InputLabel>
                        <Select labelId="institucion-label" name="institucion" value={proyecto.institucion} onChange={handleChange}>
                            <MenuItem value="Normal Superior">Normal Superior</MenuItem>
                            <MenuItem value="Juan Bautista La Salle">Juan Bautista La Salle</MenuItem>
                            <MenuItem value="Sagrados Corazones">Sagrados Corazones</MenuItem>
                            <MenuItem value="Juan Bautista Migani">Juan Bautista Migani</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="docente-label">Docente</InputLabel>
                        <Select labelId="docente-label" name="docente" value={proyecto.docente} onChange={handleChange}>
                            <MenuItem value="Denis Lorena Álvarez Guayara">Denis Lorena Álvarez Guayara</MenuItem>
                            <MenuItem value="Christian Andrés Arteaga Rojas">Christian Andrés Arteaga Rojas</MenuItem>
                            <MenuItem value="Wilmer Arley Patiño Perdomo">Wilmer Arley Patiño Perdomo</MenuItem>
                            <MenuItem value="Jesús Emilio Pinto Lopera">Jesús Emilio Pinto Lopera</MenuItem>
                            <MenuItem value="Edwin Eduardo Millán Rojas">Edwin Eduardo Millán Rojas</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="estado-label">Estado</InputLabel>
                        <Select labelId="estado-label" name="estado" value={proyecto.estado} onChange={handleChange}>
                            <MenuItem value="Activo">Activo</MenuItem>
                            <MenuItem value="En evaluación">En evaluación</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="h6" mt={3} className="integrantes-titulo">
  Integrantes del equipo
</Typography>

                    {proyecto.integrantes.map((integrante, index) => (
                        <Grid container spacing={2} key={index} className="integrante-box">
                            <Grid item xs={6}>
                                <TextField label="Nombre" name="nombre" value={integrante.nombre} onChange={(e) => handleIntegranteChange(index, e)} fullWidth required />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="Apellido" name="apellido" value={integrante.apellido} onChange={(e) => handleIntegranteChange(index, e)} fullWidth required />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="Identificación" name="identificacion" value={integrante.identificacion} onChange={(e) => handleIntegranteChange(index, e)} fullWidth required />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="Grado Escolar" name="grado" value={integrante.grado} onChange={(e) => handleIntegranteChange(index, e)} fullWidth required />
                            </Grid>
                        </Grid>
                    ))}
                    <Button
                        className="agregar-integrante-btn"
                        onClick={agregarIntegrante}
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Agregar Integrante
                    </Button>


                    <TextField label="Observaciones adicionales" name="observaciones" value={proyecto.observaciones} onChange={handleChange} fullWidth multiline margin="normal" />

                    <Button type="submit" variant="contained" className="registro-btn" fullWidth sx={{ mt: 3 }} disabled={enviando}>
                        {enviando ? "Registrando..." : "Registrar Proyecto"}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default RegistroProyecto;
