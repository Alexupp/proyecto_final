import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import './login.css';
import { Link } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Aquí puedes manejar el login (ej: enviar a backend)
        console.log('Email:', email, 'Password:', password);
    };

    return (
        <Box className="login-container">
            <Paper elevation={10} className="login-box">
                <Typography variant="h5" gutterBottom>
                    Iniciar Sesión
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Correo electrónico"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Contraseña"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="login-button"
                    >
                        Entrar
                    </Button>
                </form>
                <Typography variant="body2" align="center" className="login-footer">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </Typography>

                <div className="link-container">
                    <Link to="/gestion-usuarios">Ir a gestión de usuarios</Link>
                    <Link to="/registro-proyecto">Registrar un proyecto</Link>
                    <Link to="/registro-avance">Registrar avance</Link>
                    <Link to="/proyectos">Ver proyectos</Link>
                    <Link to="/estado-proyecto">Ver estado de proyecto</Link>
                </div>

            </Paper>
        </Box>
    );
};

export default Login;
