import React, { useState } from 'react';
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
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './reporte.css';

const proyectosMock = [
    {
        id: 1,
        titulo: 'Proyecto A',
        institucion: 'Institución 1',
        docente: 'Prof. Juan Pérez',
        estado: 'Activo',
    },
    {
        id: 2,
        titulo: 'Proyecto B',
        institucion: 'Institución 2',
        docente: 'Dra. Ana Ruiz',
        estado: 'Finalizado',
    },
];

const VistaReportes = () => {
    const [titulo, setTitulo] = useState('');
    const [institucion, setInstitucion] = useState('');
    const [docente, setDocente] = useState('');
    const [estado, setEstado] = useState('');
    const [resultados, setResultados] = useState(proyectosMock);

    const handleBuscar = () => {
        const filtrados = proyectosMock.filter((p) => {
            return (
                (!titulo || p.titulo.toLowerCase().includes(titulo.toLowerCase())) &&
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
            head: [['ID', 'Título', 'Institución', 'Docente', 'Estado']],
            body: resultados.map(p => [p.id, p.titulo, p.institucion, p.docente, p.estado]),
            startY: 20,
        });

        doc.save('reporte_proyectos.pdf');
    };

    return (
        <Box className="reportes-container">
            <Paper elevation={6} className="reportes-box">
                <Typography variant="h5" gutterBottom>
                    Reportes y Búsqueda de Proyectos
                </Typography>

                <Box className="filtros">
                    <TextField
                        label="Título del proyecto"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <Select
                        value={institucion}
                        onChange={(e) => setInstitucion(e.target.value)}
                        displayEmpty
                        fullWidth
                        margin="dense"
                    >
                        <MenuItem value="">Todas las instituciones</MenuItem>
                        <MenuItem value="Institución 1">Institución 1</MenuItem>
                        <MenuItem value="Institución 2">Institución 2</MenuItem>
                    </Select>

                    <Select
                        value={docente}
                        onChange={(e) => setDocente(e.target.value)}
                        displayEmpty
                        fullWidth
                        margin="dense"
                    >
                        <MenuItem value="">Todos los docentes</MenuItem>
                        <MenuItem value="Prof. Juan Pérez">Prof. Juan Pérez</MenuItem>
                        <MenuItem value="Dra. Ana Ruiz">Dra. Ana Ruiz</MenuItem>
                    </Select>

                    <Select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        displayEmpty
                        fullWidth
                        margin="dense"
                    >
                        <MenuItem value="">Todos los estados</MenuItem>
                        <MenuItem value="Activo">Activo</MenuItem>
                        <MenuItem value="Finalizado">Finalizado</MenuItem>
                        <MenuItem value="En evaluación">En evaluación</MenuItem>
                    </Select>

                    <Button variant="contained" onClick={handleBuscar} sx={{ mt: 2 }}>
                        Buscar
                    </Button>
                </Box>

                <Table className="tabla-proyectos" sx={{ mt: 4 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Título</TableCell>
                            <TableCell>Institución</TableCell>
                            <TableCell>Docente</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resultados.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>{p.id}</TableCell>
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
                    sx={{ marginTop: '20px' }}
                >
                    Exportar PDF
                </Button>
            </Paper>
        </Box>
    );
};

export default VistaReportes;
