import React, { useState } from 'react';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    Grid,
    InputLabel,
} from '@mui/material';
import './registro_avance.css';

const RegistroAvance = () => {
    const [avance, setAvance] = useState({
        fecha: '',
        descripcion: '',
        documentos: null,
        imagenes: null,
    });

    const handleChange = (e) => {
        setAvance({ ...avance, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setAvance({ ...avance, [e.target.name]: e.target.files });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Avance registrado:', avance);
        // Aquí se enviaría a backend si se desea
    };

    return (
        <Box className="avance-container">
            <Paper elevation={8} className="avance-box">
                <Typography variant="h5" gutterBottom>
                🚀 Registro de Avance de Proyecto
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Fecha del avance"
                        name="fecha"
                        type="date"
                        value={avance.fecha}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Descripción"
                        name="descripcion"
                        value={avance.descripcion}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        required
                    />

<Grid container spacing={2} mt={1}>
    <Grid item xs={12}>
        <InputLabel>Documentos (PDF, DOCX, etc.)</InputLabel>
        <label htmlFor="documentos" className="custom-file-upload">
            Elegir Archivos
        </label>
        <input
            id="documentos"
            type="file"
            name="documentos"
            onChange={handleFileChange}
            multiple
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}  // Oculta el input real
        />
    </Grid>

    <Grid item xs={12}>
        <InputLabel>Fotografías (JPG, PNG, etc.)</InputLabel>
        <label htmlFor="imagenes" className="custom-file-upload">
            Elegir Archivos
        </label>
        <input
            id="imagenes"
            type="file"
            name="imagenes"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            style={{ display: 'none' }}  // Oculta el input real
        />
    </Grid>
</Grid>


                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Registrar Avance
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default RegistroAvance;
