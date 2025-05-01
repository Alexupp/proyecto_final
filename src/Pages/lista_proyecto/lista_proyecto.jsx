import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './lista_proyecto.css';

const proyectosMock = [
    {
        id: 1,
        titulo: 'Sistema de Gestión Escolar',
        area: 'Educación',
        institucion: 'Colegio Central',
    },
    {
        id: 2,
        titulo: 'App de Reciclaje',
        area: 'Medio Ambiente',
        institucion: 'Escuela Verde',
    },
];

const ListaProyectos = () => {
    return (
        <div className="lista-container">
            <Typography variant="h4" gutterBottom>
                Lista de Proyectos
            </Typography>
            <Grid container spacing={3}>
                {proyectosMock.map((proyecto) => (
                    <Grid item xs={12} sm={6} md={4} key={proyecto.id}>
                        <Card className="proyecto-card">
                            <CardContent>
                                <Typography variant="h6">{proyecto.titulo}</Typography>
                                <Typography variant="body2">Área: {proyecto.area}</Typography>
                                <Typography variant="body2">Institución: {proyecto.institucion}</Typography>
                                <Link to={`/proyecto/${proyecto.id}`}>
                                    <Button variant="contained" size="small" sx={{ mt: 1 }}>
                                        Ver Detalles
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ListaProyectos;
