import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Select,
    MenuItem,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    InputLabel,
    FormControl
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './reporte.css';

const VistaReportes = () => {
    const [titulo, setTitulo] = useState('');
    const [institucion, setInstitucion] = useState('');
    const [docente, setDocente] = useState('');
    const [estado, setEstado] = useState('');
    const [proyectos, setProyectos] = useState([]);
    const [resultados, setResultados] = useState([]);

    const fetchProyectos = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'proyectos'));
            const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProyectos(lista);
            setResultados(lista);
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        }
    };

    useEffect(() => {
        fetchProyectos();
    }, []);

    const handleBuscar = () => {
        const filtrados = proyectos.filter((p) => {
            return (
                (!titulo || p.titulo?.toLowerCase().includes(titulo.toLowerCase())) &&
                (!institucion || p.institucion === institucion) &&
                (!docente || p.docente === docente) &&
                (!estado || p.estado === estado)
            );
        });
        setResultados(filtrados);
    };

    const generarPDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Proyectos', 14, 15);

        autoTable(doc, {
            head: [['Título', 'Institución', 'Docente', 'Estado']],
            body: resultados.map(p => [p.titulo, p.institucion, p.docente, p.estado]),
            startY: 20,
        });

        doc.save('reporte_proyectos.pdf');
    };

    return (
        <Box className="reportes-container">
            <Paper elevation={6} className="reportes-box">
                <Typography variant="h5" gutterBottom className="titulo-reportes">
                    📊 Reportes y Búsqueda de Proyectos
                </Typography>

                <Box className="filtros">
                    <TextField
                        label="Título del proyecto"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Institución</InputLabel>
                        <Select
                            value={institucion}
                            onChange={(e) => setInstitucion(e.target.value)}
                            label="Institución"
                        >
                            <MenuItem value="">Todas las instituciones</MenuItem>
                            <MenuItem value="Universidad de la Amazonia">Universidad de la Amazonia</MenuItem>
                            <MenuItem value="Normal Superior">Normal Superior</MenuItem>
                            <MenuItem value="Juan Bautista La Salle">Juan Bautista La Salle</MenuItem>
                            <MenuItem value="Sagrados Corazones">Sagrados Corazones</MenuItem>
                            <MenuItem value="Juan Bautista Migani">Juan Bautista Migani</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Docente</InputLabel>
                        <Select
                            value={docente}
                            onChange={(e) => setDocente(e.target.value)}
                            label="Docente"
                        >
                            <MenuItem value="">Todos los docentes</MenuItem>
                            <MenuItem value="Denis Lorena Álvarez Guayara">Denis Lorena Álvarez Guayara</MenuItem>
                            <MenuItem value="Christian Andrés Arteaga Rojas">Christian Andrés Arteaga Rojas</MenuItem>
                            <MenuItem value="Wilmer Arley Patiño Perdomo">Wilmer Arley Patiño Perdomo</MenuItem>
                            <MenuItem value="Jesús Emilio Pinto Lopera">Jesús Emilio Pinto Lopera</MenuItem>
                            <MenuItem value="Edwin Eduardo Millán Rojas">Edwin Eduardo Millán Rojas</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            label="Estado"
                        >
                            <MenuItem value="">Todos los estados</MenuItem>
                            <MenuItem value="Activo">Activo</MenuItem>
                            <MenuItem value="En evaluación">En evaluación</MenuItem>
                            <MenuItem value="Finalizado">Finalizado</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" onClick={handleBuscar} sx={{ mt: 2 }}>
                        Buscar
                    </Button>
                </Box>

                <Table className="tabla-proyectos">
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Institución</TableCell>
                            <TableCell>Docente</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resultados.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>{p.titulo}</TableCell>
                                <TableCell>{p.institucion}</TableCell>
                                <TableCell>{p.docente}</TableCell>
                                <TableCell>{p.estado}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Button
                    variant="outlined"
                    onClick={generarPDF}
                    sx={{ mt: 3 }}
                    disabled={resultados.length === 0}
                >
                    Exportar PDF
                </Button>
            </Paper>
        </Box>
    );
};

export default VistaReportes;
