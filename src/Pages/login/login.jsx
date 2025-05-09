import React, { useState } from 'react';
import {
    TextField, Button, Paper, Typography, Box,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openError, setOpenError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            const userDocRef = doc(db, 'usuarios', user.uid);
            const userDocSnap = await getDoc(userDocRef);
    
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
    
                setTimeout(() => {
                    if (userData.tipo === 'estudiante') {
                        navigate('/inicio');
                    } else if (userData.tipo === 'docente') {
                        navigate('/inicio');
                    } else if (userData.tipo === 'coordinador') {
                        navigate('/inicio');
                    } else {
                        navigate('/inicio'); 
                    }
                }, 1000);
            } else {
                showError('No se encontró el perfil del usuario.');
            }
        } catch (error) {
            const errorCode = error.code;
            let message = 'Ocurrió un error';
    
            if (errorCode === 'auth/user-not-found') {
                message = 'Usuario no encontrado';
            } else if (errorCode === 'auth/wrong-password') {
                message = 'Contraseña incorrecta';
            } else if (errorCode === 'auth/invalid-email') {
                message = 'Correo electrónico inválido';
            }
    
            showError(message);
        }
    };
    

    const showError = (msg) => {
        setError(msg);
        setOpenError(true);
    };

    const handleCloseError = () => {
        setOpenError(false);
        setError('');
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

            {/* Modal de error */}
            <Dialog open={openError} onClose={handleCloseError}>
                <DialogTitle>Error al iniciar sesión</DialogTitle>
                <DialogContent>
                    <Typography>{error}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseError} autoFocus>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Login;
