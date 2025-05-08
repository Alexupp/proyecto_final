import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './lista_proyecto.css';

const ListaProyectos = () => {
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'proyectos'));
                const lista = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProyectos(lista);
            } catch (error) {
                console.error('Error al obtener proyectos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProyectos();
    }, []);

    return (
        <div className="lista-container">
            <Typography variant="h4" gutterBottom className="titulo-lista">
                📚 Lista de Proyectos
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <div className="proyectos-grid">
                    {proyectos.map((proyecto) => (
                        <div className="proyecto-card" key={proyecto.id}>
                            <CardContent>
                                <Typography variant="h6" className="titulo-proyecto" gutterBottom>
                                    {proyecto.titulo}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <span className="resaltado">Área:</span> {proyecto.area}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <span className="resaltado">Institución:</span> {proyecto.institucion}
                                </Typography>
                                <Link to={`/proyecto/${proyecto.id}`} style={{ textDecoration: 'none' }}>
                                    <Button className="boton-verde" size="small" sx={{ mt: 2 }}>
                                        Ver Detalles
                                    </Button>
                                </Link>
                            </CardContent>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListaProyectos;
