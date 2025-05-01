import React, { useState } from 'react';
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
    const [users, setUsers] = useState([
        { id: 1, nombre: 'Juan Pérez', email: 'juan@mail.com', tipo: 'estudiante' },
        { id: 2, nombre: 'Ana Gómez', email: 'ana@mail.com', tipo: 'docente' },
    ]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ id: null, nombre: '', email: '', tipo: 'estudiante' });

    const handleOpen = (user = null) => {
        if (user) {
            setForm(user);
            setEditMode(true);
        } else {
            setForm({ id: null, nombre: '', email: '', tipo: 'estudiante' });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (editMode) {
            setUsers(users.map((u) => (u.id === form.id ? form : u)));
        } else {
            setUsers([...users, { ...form, id: Date.now() }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        setUsers(users.filter((u) => u.id !== id));
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
                            <TableRow key={user.id}>
                                <TableCell>{user.nombre}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.tipo}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(user)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(user.id)} color="error">
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
