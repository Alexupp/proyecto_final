import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './lista_proyecto.css';

const ListaProyectos = () => {
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [proyectoAEliminar, setProyectoAEliminar] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

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

    const handleEliminar = async () => {
        if (!proyectoAEliminar) return;
        try {
            await deleteDoc(doc(db, 'proyectos', proyectoAEliminar));
            setProyectos(prev => prev.filter(p => p.id !== proyectoAEliminar));
        } catch (error) {
            console.error('Error al eliminar proyecto:', error);
        } finally {
            setConfirmOpen(false);
            setProyectoAEliminar(null);
        }
    };

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
                                <Box display="flex" gap={1} mt={2}>
                                    <Link to={`/proyecto/${proyecto.id}`} style={{ textDecoration: 'none' }}>
                                        <Button className="boton-verde" size="small">
                                            Ver Detalles
                                        </Button>
                                    </Link>
                                    <Button
                                        color="error"
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setProyectoAEliminar(proyecto.id);
                                            setConfirmOpen(true);
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </Box>
                            </CardContent>
                        </div>
                    ))}
                </div>
            )}

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                    <Button onClick={handleEliminar} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ListaProyectos;
