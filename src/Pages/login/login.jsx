import React, { useState } from 'react';
import {
    TextField, Button, Paper, Typography, Box
} from '@mui/material';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Obtener documento del usuario en Firestore
            const userDocRef = doc(db, 'usuarios', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                // Redirigir según tipo de usuario
                setTimeout(() => {
                    if (userData.tipo === 'estudiante') {
                        navigate('/registro-proyecto'); // Redirigir a la página de estudiante
                    } else if (userData.tipo === 'docente') {
                        navigate('/proyectos'); // Redirigir a la página de docente
                    } else if (userData.tipo === 'coordinador') {
                        navigate('/gestion-usuarios'); // Redirigir a la página de coordinador
                    } else {
                        navigate('/'); // Página principal por defecto
                    }
                }, 2000);
            } else {
                alert('No se encontró el perfil del usuario.');
            }
        } catch (error) {
            const errorCode = error.code;
            let message = 'Ocurrió un error';
            if (errorCode === 'auth/user-not-found') {
                message = 'Usuario no encontrado';
            } else if (errorCode === 'auth/wrong-password') {
                message = 'Contraseña incorrecta';
            }
            alert(message);
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
        </Box>
    );
};

export default Login;
