import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import './gestion_usuario.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]); // Estado para los usuarios
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ _id: null, nombre: '', email: '', tipo: 'estudiante' });

    // Cargar los usuarios desde el backend
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users');
            if (!response.ok) throw new Error('No se pudieron cargar los usuarios');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };


    // Llamar a la función cuando el componente se monta
    useEffect(() => {
        fetchUsers();
    }, []);


    const handleOpen = (user = null) => {
        if (user) {
            setForm(user); // Si se pasa un usuario, configurar el formulario para editar
            setEditMode(true);
        } else {
            // Resetear el formulario para creación de usuario
            setForm({ _id: null, nombre: '', email: '', tipo: 'estudiante' });
            setEditMode(false);
        }
        setOpen(true); // Abrir el Dialog
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (editMode) {
                // Actualizar usuario (PUT)
                const response = await fetch(`http://localhost:5000/api/users/${form._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form),
                });
    
                if (!response.ok) throw new Error('Error al actualizar el usuario');
                const updatedUser = await response.json();
    
                setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
            } else {
                // Crear nuevo usuario (POST)
                const response = await fetch('http://localhost:5000/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form),
                });
    
                if (!response.ok) throw new Error('Error al crear el usuario');
                const newUser = await response.json();
    
                setUsers([...users, newUser]);
            }
    
            handleClose();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
        }
    };
    

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setUsers(users.filter((u) => u._id !== id)); // Eliminar el usuario del estado
            } else {
                const data = await response.json();
                console.error('Error al eliminar usuario:', data.error || 'Desconocido');
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };
    
    

    return (
        <div className="user-management-container">
            <Typography variant="h4" gutterBottom>
                Gestión de Usuarios
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Crear Usuario
            </Button>

            <TableContainer component={Paper} className="user-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.nombre}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.tipo}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(user)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(user._id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        select
                        label="Tipo"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    >
                        <MenuItem value="estudiante">Estudiante</MenuItem>
                        <MenuItem value="docente">Docente</MenuItem>
                        <MenuItem value="coordinador">Coordinador</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserManagement;
