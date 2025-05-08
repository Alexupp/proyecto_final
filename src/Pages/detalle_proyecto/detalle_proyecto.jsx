import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Asegúrate de que la ruta sea correcta
import './detalle_proyecto.css';

const DetalleProyecto = () => {
    const { id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProyecto = async () => {
            try {
                const docRef = doc(db, 'proyectos', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProyecto(docSnap.data());
                } else {
                    setProyecto(null);
                }
            } catch (error) {
                console.error('Error al obtener el proyecto:', error);
                setProyecto(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProyecto();
    }, [id]);

    if (loading) {
        return (
            <Box className="detalle-container">
                <CircularProgress />
            </Box>
        );
    }

    if (!proyecto) {
        return (
            <Box className="detalle-container">
                <Typography variant="h6">Proyecto no encontrado</Typography>
            </Box>
        );
    }

    return (
        <Box className="detalle-container">
            <Paper className="detalle-box" elevation={4}>
                <Typography variant="h4" gutterBottom>
                    {proyecto.titulo}
                </Typography>
                <Typography variant="body1">
                    <strong>Área:</strong> {proyecto.area}
                </Typography>
                <Typography variant="body1">
                    <strong>Objetivos:</strong> {proyecto.objetivos}
                </Typography>
                <Typography variant="body1">
                    <strong>Cronograma:</strong> {proyecto.cronograma}
                </Typography>
                <Typography variant="body1">
                    <strong>Presupuesto:</strong> {proyecto.presupuesto}
                </Typography>
                <Typography variant="body1">
                    <strong>Institución:</strong> {proyecto.institucion}
                </Typography>
                <Typography variant="body1">
                    <strong>Observaciones:</strong> {proyecto.observaciones}
                </Typography>

                {proyecto.integrantes && proyecto.integrantes.length > 0 && (
                    <>
                        <Typography variant="h6" mt={2}>
                            Integrantes
                        </Typography>
                        {proyecto.integrantes.map((int, idx) => (
                            <Typography key={idx}>
                                {int.nombre} {int.apellido} - Grado: {int.grado}
                            </Typography>
                        ))}
                    </>
                )}

                {proyecto.archivos && proyecto.archivos.length > 0 && (
                    <>
                        <Typography variant="h6" mt={2}>
                            Archivos
                        </Typography>
                        {proyecto.archivos.map((file, idx) => (
                            <div key={idx}>
                                <a
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                >
                                    {file.split('/').pop()}
                                </a>
                            </div>
                        ))}
                    </>
                )}

                {proyecto.imagenes && proyecto.imagenes.length > 0 && (
                    <>
                        <Typography variant="h6" mt={2}>
                            Fotografías
                        </Typography>
                        <Box className="imagen-box">
                            {proyecto.imagenes.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`evidencia-${idx}`}
                                    className="imagen"
                                />
                            ))}
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default DetalleProyecto;
