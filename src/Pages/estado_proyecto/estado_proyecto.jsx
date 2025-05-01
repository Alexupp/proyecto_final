import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Select,
    MenuItem,
    TextField,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import './estado_proyecto.css';

const EstadosDisponibles = [
    'Formulación',
    'Evaluación',
    'Activo',
    'Inactivo',
    'Finalizado',
];

const EstadoProyecto = () => {
    const [estadoActual, setEstadoActual] = useState('Formulación');
    const [observacion, setObservacion] = useState('');
    const [historial, setHistorial] = useState([
        {
            fecha: new Date().toLocaleString(),
            estado: 'Formulación',
            observacion: 'Inicio del proyecto',
        },
    ]);

    const cambiarEstado = () => {
        if (!observacion.trim()) return alert('Agrega una observación');

        const nuevoHistorial = [
            ...historial,
            {
                fecha: new Date().toLocaleString(),
                estado: estadoActual,
                observacion,
            },
        ];
        setHistorial(nuevoHistorial);
        setObservacion('');
    };

    return (
        <Box className="estado-container">
            <Paper elevation={6} className="estado-box">
                <Typography variant="h5" gutterBottom>
                    Estado del Proyecto
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    Estado actual: <strong>{estadoActual}</strong>
                </Typography>

                <Select
                    value={estadoActual}
                    onChange={(e) => setEstadoActual(e.target.value)}
                    fullWidth
                >
                    {EstadosDisponibles.map((estado) => (
                        <MenuItem key={estado} value={estado}>
                            {estado}
                        </MenuItem>
                    ))}
                </Select>

                <TextField
                    label="Observación"
                    multiline
                    rows={3}
                    fullWidth
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                    sx={{ mt: 2 }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={cambiarEstado}
                >
                    Cambiar estado
                </Button>

                <Typography variant="h6" sx={{ mt: 4 }}>
                    Historial de cambios
                </Typography>

                <List>
                    {historial.map((item, index) => (
                        <ListItem key={index} className="historial-item">
                            <ListItemText
                                primary={`Estado: ${item.estado} - ${item.fecha}`}
                                secondary={`Observación: ${item.observacion}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default EstadoProyecto;
