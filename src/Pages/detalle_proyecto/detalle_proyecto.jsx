import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Box } from '@mui/material';
import './detalle_proyecto.css';

const mockProyectos = {
    1: {
        titulo: 'Sistema de Gestión Escolar',
        area: 'Educación',
        objetivos: 'Mejorar procesos administrativos escolares.',
        cronograma: 'Febrero - Julio',
        presupuesto: '$5,000',
        institucion: 'Colegio Central',
        integrantes: [
            { nombre: 'Ana', apellido: 'Gómez', grado: '10°' },
            { nombre: 'Luis', apellido: 'Pérez', grado: '11°' },
        ],
        observaciones: 'Proyecto piloto.',
        archivos: ['plan.pdf'],
        imagenes: ['evidencia1.jpg'],
    },
};

const DetalleProyecto = () => {
    const { id } = useParams();
    const proyecto = mockProyectos[id];

    if (!proyecto) {
        return <Typography variant="h6">Proyecto no encontrado</Typography>;
    }

    return (
        <Box className="detalle-container">
            <Paper className="detalle-box">
                <Typography variant="h4">{proyecto.titulo}</Typography>
                <Typography variant="body1">Área: {proyecto.area}</Typography>
                <Typography variant="body1">Objetivos: {proyecto.objetivos}</Typography>
                <Typography variant="body1">Cronograma: {proyecto.cronograma}</Typography>
                <Typography variant="body1">Presupuesto: {proyecto.presupuesto}</Typography>
                <Typography variant="body1">Institución: {proyecto.institucion}</Typography>
                <Typography variant="body1">Observaciones: {proyecto.observaciones}</Typography>

                <Typography variant="h6" mt={2}>Integrantes</Typography>
                {proyecto.integrantes.map((int, idx) => (
                    <Typography key={idx}>
                        {int.nombre} {int.apellido} - Grado: {int.grado}
                    </Typography>
                ))}

                <Typography variant="h6" mt={2}>Archivos</Typography>
                {proyecto.archivos.map((file, idx) => (
                    <a key={idx} href={`/${file}`} download>{file}</a>
                ))}

                <Typography variant="h6" mt={2}>Fotografías</Typography>
                <Box className="imagen-box">
                    {proyecto.imagenes.map((img, idx) => (
                        <img key={idx} src={`/${img}`} alt="evidencia" />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default DetalleProyecto;
