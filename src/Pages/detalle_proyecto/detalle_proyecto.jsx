import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Box, CircularProgress, Divider } from '@mui/material';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './detalle_proyecto.css';

const DetalleProyecto = () => {
    const { id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avances, setAvances] = useState([]);

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

    useEffect(() => {
        const fetchAvances = async () => {
            try {
                const q = query(collection(db, 'avances'), where('proyectoId', '==', id));
                const querySnapshot = await getDocs(q);
                const listaAvances = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAvances(listaAvances);
            } catch (error) {
                console.error('Error al obtener avances:', error);
            }
        };

        if (id) fetchAvances();
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
            <Paper className="detalle-box" elevation={6}>
                <Typography variant="h3" className="titulo">
                    {proyecto.titulo}
                </Typography>

                <Divider className="divider" />

                <div className="info">
                    <p><strong>Área:</strong> {proyecto.area}</p>
                    <p><strong>Objetivos:</strong> {proyecto.objetivos}</p>
                    <p><strong>Cronograma:</strong> {proyecto.cronograma?.fechaInicio} a {proyecto.cronograma?.fechaFin}</p>
                    <p><strong>Presupuesto:</strong> ${Number(proyecto.presupuesto).toLocaleString()}</p>
                    <p><strong>Institución:</strong> {proyecto.institucion}</p>
                    <p><strong>Observaciones:</strong> {proyecto.observaciones}</p>
                </div>

                {proyecto.integrantes?.length > 0 && (
                    <>
                        <Divider className="divider" />
                        <Typography variant="h5" className="subtitulo">Integrantes</Typography>
                        <ul className="lista">
                            {proyecto.integrantes.map((int, idx) => (
                                <li key={idx}>{int.nombre} {int.apellido} - Grado: {int.grado}</li>
                            ))}
                        </ul>
                    </>
                )}

                {proyecto.archivos?.length > 0 && (
                    <>
                        <Divider className="divider" />
                        <Typography variant="h5" className="subtitulo">Archivos</Typography>
                        {proyecto.archivos.map((file, idx) => (
                            <div key={idx}>
                                <a href={file} target="_blank" rel="noopener noreferrer" download>
                                    {file.split('/').pop()}
                                </a>
                            </div>
                        ))}
                    </>
                )}

                {proyecto.imagenes?.length > 0 && (
                    <>
                        <Divider className="divider" />
                        <Typography variant="h5" className="subtitulo">Fotografías</Typography>
                        <Box className="imagen-box">
                            {proyecto.imagenes.map((img, idx) => (
                                <img key={idx} src={img} alt={`evidencia-${idx}`} className="imagen" />
                            ))}
                        </Box>
                    </>
                )}
{avances.length > 0 && (
    <>
        <Divider className="divider" />
        <Typography variant="h5" className="subtitulo">Avances</Typography>
        <Box className="avance-grid-wrapper">
            {avances.map((avance) => (
                <Paper key={avance.id} elevation={3} className="avance-card">
                    <Typography className="avance-fecha">
                        {avance.fecha?.toDate().toLocaleDateString()}
                    </Typography>

                    <Typography className="avance-descripcion">
                        {avance.descripcion}
                    </Typography>

                    {(avance.documentos?.length > 0 || avance.imagenes?.length > 0) && (
                        <Box className="avance-enlaces">
                            {avance.documentos?.map((docUrl, i) => (
                                <a
                                    key={`doc-${i}`}
                                    href={docUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="avance-boton"
                                >
                                    Documento
                                </a>
                            ))}
                            {avance.imagenes?.map((imgUrl, i) => (
                                <a
                                    key={`img-${i}`}
                                    href={imgUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="avance-boton"
                                >
                                    Imagen
                                </a>
                            ))}
                        </Box>
                    )}
                </Paper>
            ))}
        </Box>
    </>
)}


            </Paper>
        </Box>
    );
};

export default DetalleProyecto;
