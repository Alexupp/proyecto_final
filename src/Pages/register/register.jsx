import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Paper, Typography, Box, MenuItem,
    Dialog, DialogActions, DialogContent, DialogTitle, Link
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './register.css';

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
        tipo: 'estudiante',
    });

    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);

    useEffect(() => {
        if (location.state?.email) {
            setIsGoogleUser(!!location.state.isGoogle);
            setForm({
                nombre: location.state.nombre || '',
                email: location.state.email,
                password: '',
                tipo: location.state.tipo || 'estudiante'
            });
        }
    }, [location.state]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!form.nombre || !form.email) {
            showModal('Campos incompletos', 'Por favor completa todos los campos requeridos');
            setIsLoading(false);
            return;
        }

        try {
            if (isGoogleUser) {
                await registerGoogleUser();
            } else {
                await registerEmailUser();
            }
        } catch (error) {
            handleRegistrationError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const registerGoogleUser = async () => {
        const user = auth.currentUser;
        if (!user) throw new Error('No se encontró usuario autenticado');

        const userDocRef = doc(db, 'usuarios', user.uid);
        const userDoc = await getDoc(userDocRef);

        // Verificar si ya existe perfil completo
        if (userDoc.exists() && userDoc.data().perfilCompleto) {
            showModal(
                'Cuenta existente', 
                'Ya tienes una cuenta registrada. Serás redirigido al inicio.',
                () => navigate('/inicio')
            );
            return;
        }

        // Crear/actualizar perfil
        await setDoc(userDocRef, {
            nombre: form.nombre,
            email: form.email,
            tipo: form.tipo,
            foto: location.state?.photoURL || '',
            perfilCompleto: true,
            fechaRegistro: new Date(),
            proveedor: 'google'
        }, { merge: true });

        showModal(
            'Registro completado',
            'Tu perfil ha sido registrado exitosamente',
            () => navigate('/inicio')
        );
    };

    const registerEmailUser = async () => {
        if (!form.password) {
            throw new Error('La contraseña es requerida');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;

        await setDoc(doc(db, 'usuarios', user.uid), {
            nombre: form.nombre,
            email: form.email,
            tipo: form.tipo,
            perfilCompleto: true,
            fechaRegistro: new Date(),
            proveedor: 'email'
        });

        showModal(
            'Registro exitoso',
            'Tu cuenta ha sido creada correctamente',
            () => navigate('/inicio')
        );
    };

    const handleRegistrationError = (error) => {
        const errorMessages = {
            'auth/email-already-in-use': 'Este correo ya está registrado. Por favor inicia sesión.',
            'auth/invalid-email': 'El correo electrónico no es válido',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres'
        };

        const message = errorMessages[error.code] || 'Ocurrió un error al registrar tu cuenta';
        
        if (error.code === 'auth/email-already-in-use') {
            showModal('Cuenta existente', message, () => navigate('/login'));
        } else {
            showModal('Error', message);
        }
    };

    const showModal = (title, message, onClose = () => setOpenModal(false)) => {
        setModalTitle(title);
        setModalMessage(message);
        setOpenModal(true);
        
        if (onClose) {
            setTimeout(() => {
                setOpenModal(false);
                onClose();
            }, 2000);
        }
    };

    return (
        <Box className="register-container">
            <Paper elevation={10} className="register-box">
                <Typography variant="h5" gutterBottom align="center">
                    {isGoogleUser ? 'Completa tu registro' : 'Crear Cuenta'}
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
                        autoFocus
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
                        disabled={isGoogleUser}
                        InputLabelProps={{ shrink: true }}
                    />
                    
                    {!isGoogleUser && (
                        <TextField
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            inputProps={{ minLength: 6 }}
                        />
                    )}
                    
                    <TextField
                        select
                        label="Tipo de usuario"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    >
                        <MenuItem value="estudiante">Estudiante</MenuItem>
                        <MenuItem value="docente">Docente</MenuItem>
                        <MenuItem value="coordinador">Coordinador</MenuItem>
                    </TextField>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isLoading}
                        sx={{ mt: 2, height: 45 }}
                    >
                        {isLoading ? 'Procesando...' : (isGoogleUser ? 'Completar Registro' : 'Registrarse')}
                    </Button>
                </form>

                {!isGoogleUser && (
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                    </Typography>
                )}
            </Paper>

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>{modalTitle}</DialogTitle>
                <DialogContent>
                    <Typography>{modalMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Register;