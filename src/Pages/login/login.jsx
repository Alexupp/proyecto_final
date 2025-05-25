import React, { useState } from 'react';
import {
    TextField, Button, Paper, Typography, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../../firebase';
import GoogleIcon from '@mui/icons-material/Google';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openError, setOpenError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleUserProfile(userCredential.user, 'email');
        } catch (error) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await handleUserProfile(result.user, 'google');
        } catch (error) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserProfile = async (user, provider) => {
        try {
            const userDocRef = doc(db, 'usuarios', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            // Si el documento no existe
            if (!userDocSnap.exists()) {
                if (provider === 'google') {
                    // Para Google: redirigir a registro con datos
                    navigate('/register', {
                        state: { 
                            email: user.email,
                            nombre: user.displayName || '',
                            photoURL: user.photoURL || '',
                            isGoogle: true
                        }
                    });
                } else {
                    // Para email/contraseña: crear perfil automáticamente y redirigir
                    await setDoc(userDocRef, {
                        nombre: email.split('@')[0],
                        email: user.email,
                        tipo: 'estudiante',
                        perfilCompleto: true,
                        fechaRegistro: new Date(),
                        proveedor: 'email'
                    });
                    navigate('/inicio');
                }
                return;
            }

            // Si el documento existe pero el perfil está incompleto
            const userData = userDocSnap.data();
            if (!userData.perfilCompleto) {
                navigate('/register', {
                    state: {
                        email: user.email,
                        nombre: userData.nombre || '',
                        tipo: userData.tipo || 'estudiante',
                        isGoogle: provider === 'google',
                        photoURL: user.photoURL || ''
                    }
                });
                return;
            }

            // Perfil completo - redirigir al inicio
            navigate('/inicio');
            
        } catch (error) {
            console.error('Error al manejar perfil:', error);
            showError('Error al verificar tu información de usuario');
        }
    };

    const handleAuthError = (error) => {
        const errorMap = {
            'auth/user-not-found': 'Usuario no encontrado. ¿Quieres registrarte?',
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/invalid-email': 'Correo electrónico inválido',
            'auth/popup-closed-by-user': 'Cancelaste el inicio de sesión con Google',
            'auth/account-exists-with-different-credential': 'Este correo ya está registrado con otro método',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
        };

        const message = errorMap[error.code] || 'Ocurrió un error al iniciar sesión';
        showError(message);
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
                <Typography variant="h5" gutterBottom align="center">
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cargando...' : 'Entrar'}
                    </Button>
                </form>

                <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">O</Typography>
                </Divider>

                <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    startIcon={<GoogleIcon />}
                    sx={{
                        color: '#5F6368',
                        borderColor: '#E0E0E0',
                        '&:hover': {
                            borderColor: '#D2D2D2',
                            backgroundColor: '#F5F5F5'
                        }
                    }}
                >
                    Continuar con Google
                </Button>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </Typography>
            </Paper>

            <Dialog open={openError} onClose={handleCloseError}>
                <DialogTitle>Error al iniciar sesión</DialogTitle>
                <DialogContent>
                    <Typography>{error}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseError}>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Login;