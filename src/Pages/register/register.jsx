import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './register.css';

const Register = () => {
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
        tipo: 'estudiante',
    });
    const [openModal, setOpenModal] = useState(false); // Para abrir y cerrar el modal
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const navigate = useNavigate(); // Hook para redirigir al login

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            
            const data = await response.json();
    
            if (response.ok) {
                setModalTitle('Éxito');
                setModalMessage('Usuario registrado con éxito');
                setOpenModal(true);
                setTimeout(() => {
                    navigate('/login'); // Redirigir al login después de 2 segundos
                }, 2000);
            } else {
                setModalTitle('Error');
                setModalMessage(data.error || 'Hubo un error en el registro');
                setOpenModal(true);
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            setModalTitle('Error');
            setModalMessage('Error en el servidor');
            setOpenModal(true);
        }
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

            {/* Modal para mostrar el resultado del registro */}
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

export default Register;
