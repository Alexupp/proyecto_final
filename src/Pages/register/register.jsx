import React, { useState } from 'react';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    MenuItem,
} from '@mui/material';
import './register.css';

const Register = () => {
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
        tipo: 'estudiante',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        console.log('Datos del registro:', form);
        // Aquí enviarías los datos al backend
    };

    return (
        <Box className="register-container">
            <Paper elevation={10} className="register-box">
                <Typography variant="h5" gutterBottom>
                    Crear Cuenta
                </Typography>
                <form onSubmit={handleRegister}>
                    <TextField
                        label="Nombre completo"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        select
                        label="Tipo de usuario"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="estudiante">Estudiante</MenuItem>
                        <MenuItem value="docente">Docente</MenuItem>
                        <MenuItem value="coordinador">Coordinador</MenuItem>
                    </TextField>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="register-button"
                    >
                        Registrarse
                    </Button>
                </form>
                <Typography variant="body2" align="center" className="register-footer">
                    ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Register;
