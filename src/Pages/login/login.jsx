import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './login.css';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Para mostrar el error si ocurre
    const [openModal, setOpenModal] = useState(false); // Para abrir y cerrar el modal
    const [modalMessage, setModalMessage] = useState(''); // El mensaje del modal
    const [modalTitle, setModalTitle] = useState(''); // Título del modal
    const navigate = useNavigate(); // Usamos el hook para redirigir

    const handleLogin = async (e) => {
        e.preventDefault();

        // Realizamos el request al backend para hacer login
        try {
            const response = await fetch('/api/users/login', { // Asegúrate de que esta ruta sea correcta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Si el login es exitoso, almacenamos el token en el localStorage
                localStorage.setItem('token', data.token); 
                localStorage.setItem('user', JSON.stringify(data.user)); // Guardamos la info del usuario (si lo necesitas)

                setModalTitle('Éxito');
                setModalMessage('Inicio de sesión exitoso');
                setOpenModal(true);

                // Redirigimos a la página correspondiente según el tipo de usuario
                setTimeout(() => {
                    if (data.user.tipo === 'estudiante') {
                        navigate('/registro-avance'); // Redirigir a registro de avances
                    } else if (data.user.tipo === 'coordinador') {
                        navigate('/gestion-usuarios'); // Redirigir a gestión de usuarios
                    } else if (data.user.tipo === 'docente') {
                        navigate('/registro-proyecto'); // Redirigir a registro de proyectos
                    }
                }, 2000); // Redirigir después de 2 segundos
            } else {
                setModalTitle('Error');
                setModalMessage(data.error || 'Usuario o contraseña incorrectos');
                setOpenModal(true);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setModalTitle('Error');
            setModalMessage('Error al conectar con el servidor');
            setOpenModal(true);
        }
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
                    <Link to="/reportes">Reportes y Búsqueda</Link>
                </div>

            </Paper>

            {/* Modal para mostrar el resultado del login */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>{modalTitle}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">{modalMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Login;
