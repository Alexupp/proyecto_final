import React, { useState } from 'react';
import {
    TextField, Button, Paper, Typography, Box, MenuItem,
    Dialog, DialogActions, DialogContent, DialogTitle, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './register.css';

const Register = () => {
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
        tipo: 'estudiante',
    });

    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!form.nombre || !form.email || !form.password) {
            setModalTitle('Campos incompletos');
            setModalMessage('Por favor, completa todos los campos.');
            setOpenModal(true);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            const user = userCredential.user;

            await setDoc(doc(db, 'usuarios', user.uid), {
                nombre: form.nombre,
                email: form.email,
                tipo: form.tipo,
                uid: user.uid
            });

            setModalTitle('Éxito');
            setModalMessage('Usuario registrado con éxito.');
            setOpenModal(true);

            setTimeout(() => {
                setOpenModal(false);
                navigate('/');
            }, 2000);
        } catch (error) {
            let message = '';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'El correo ya está en uso. Si fue eliminado anteriormente, contacta al administrador para reactivarlo.';
                    break;
                case 'auth/email-already-in-use':
                    message = 'El correo ya está en uso.';
                    break;
                case 'auth/invalid-email':
                    message = 'El correo no es válido.';
                    break;
                case 'auth/weak-password':
                    message = 'La contraseña debe tener al menos 6 caracteres.';
                    break;
                default:
                    message = error.message;
            }

            setModalTitle('Error');
            setModalMessage(message);
            setOpenModal(true);
        }
    };

    return (
        <Box className="register-container">
            <Paper elevation={10} className="register-box">
                <Typography variant="h5" gutterBottom align="center">
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
                        fullWidth
                        className="register-button"
                    >
                        Registrarse
                    </Button>
                </form>

                <Typography variant="body2" align="center" className="register-footer">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" underline="hover" className="login-link">
                        Inicia sesión
                    </Link>
                </Typography>
            </Paper>

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>{modalTitle}</DialogTitle>
                <DialogContent>
                    <Typography>{modalMessage}</Typography>
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

export default Register;
