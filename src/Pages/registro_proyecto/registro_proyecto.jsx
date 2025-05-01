import React, { useState } from 'react';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    Grid
} from '@mui/material';
import './registro_proyecto.css';

const RegistroProyecto = () => {
    const [proyecto, setProyecto] = useState({
        titulo: '',
        area: '',
        objetivos: '',
        cronograma: '',
        presupuesto: '',
        institucion: '',
        observaciones: '',
        integrantes: [{ nombre: '', apellido: '', identificacion: '', grado: '' }],
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Proyecto registrado:', proyecto);
        // Aquí puedes enviarlo al backend
    };

    return (
        <Box className="registro-container">
            <Paper elevation={8} className="registro-box">
                <Typography variant="h5" gutterBottom>
                    Registro de Proyecto
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Título"
                        name="titulo"
                        value={proyecto.titulo}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Área"
                        name="area"
                        value={proyecto.area}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Objetivos"
                        name="objetivos"
                        value={proyecto.objetivos}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        required
                    />
                    <TextField
                        label="Cronograma"
                        name="cronograma"
                        value={proyecto.cronograma}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        required
                    />
                    <TextField
                        label="Presupuesto"
                        name="presupuesto"
                        value={proyecto.presupuesto}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Institución"
                        name="institucion"
                        value={proyecto.institucion}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Typography variant="h6" mt={3}>
                        Integrantes del equipo
                    </Typography>
                    {proyecto.integrantes.map((integrante, index) => (
                        <Grid container spacing={2} key={index} className="integrante-box">
                            <Grid item xs={6}>
                                <TextField
                                    label="Nombre"
                                    name="nombre"
                                    value={integrante.nombre}
                                    onChange={(e) => handleIntegranteChange(index, e)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Apellido"
                                    name="apellido"
                                    value={integrante.apellido}
                                    onChange={(e) => handleIntegranteChange(index, e)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Identificación"
                                    name="identificacion"
                                    value={integrante.identificacion}
                                    onChange={(e) => handleIntegranteChange(index, e)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Grado Escolar"
                                    name="grado"
                                    value={integrante.grado}
                                    onChange={(e) => handleIntegranteChange(index, e)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                    ))}
                    <Button onClick={agregarIntegrante} variant="outlined" fullWidth sx={{ mt: 2 }}>
                        Agregar Integrante
                    </Button>

                    <TextField
                        label="Observaciones adicionales"
                        name="observaciones"
                        value={proyecto.observaciones}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                        Registrar Proyecto
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default RegistroProyecto;
