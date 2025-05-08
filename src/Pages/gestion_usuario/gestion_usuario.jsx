import React, { useState, useEffect } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    MenuItem, Typography
} from '@mui/material';
import './gestion_usuario.css';
import { Edit, Delete } from '@mui/icons-material';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
    collection, getDocs, deleteDoc, doc, updateDoc, setDoc
} from 'firebase/firestore';


const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        id: null,
        nombre: '',
        email: '',
        tipo: 'estudiante',
        password: ''
    });
    const [userToDelete, setUserToDelete] = useState(null);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "usuarios"));
            const userList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
        } catch (e) {
            setError("Error al obtener usuarios: " + e.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpen = (user = null) => {
        if (user) {
            setForm(user);
            setEditMode(true);
        } else {
            setForm({ id: null, nombre: '', email: '', tipo: 'estudiante', password: '' });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setForm({ id: null, nombre: '', email: '', tipo: 'estudiante', password: '' });
        setOpen(false);
        setEditMode(false);
        setError('');
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const { nombre, email, password, tipo } = form;

        if (!nombre || !email || (!editMode && !password)) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        try {
            if (editMode) {
                const userRef = doc(db, "usuarios", form.id);
                await updateDoc(userRef, { nombre, email, tipo });
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid;

                await setDoc(doc(db, "usuarios", uid), {
                    uid, // agregar esta línea
                    nombre,
                    email,
                    tipo
                });
            }

            await fetchUsers();
            handleClose();
        } catch (error) {
            console.error("Error al guardar usuario:", error.message);
            setError("Error al guardar usuario: " + error.message);
        }
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
    };

    const handleConfirmDelete = async () => {
        try {
            // Primero elimina en Authentication
            const eliminarUsuarioAuth = httpsCallable(functions, 'eliminarUsuarioAuth');
            await eliminarUsuarioAuth({ uid: userToDelete.uid });
    
            // Luego elimina de Firestore
            await deleteDoc(doc(db, "usuarios", userToDelete.id));
            await fetchUsers();
            setUserToDelete(null);
        } catch (error) {
            console.error("Error al eliminar usuario:", error.message);
            setError("Error al eliminar usuario: " + error.message);
        }
    };

    const handleCloseError = () => {
        setError('');
    };

    return (
        <div className="user-management-container">
            <Typography variant="h4" gutterBottom>🌿 Gestión de Usuarios</Typography>
            <Button variant="contained" onClick={() => handleOpen()}>Crear Usuario</Button>

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
                                    <IconButton onClick={() => handleOpen(user)}><Edit /></IconButton>
                                    <IconButton onClick={() => confirmDelete(user)}><Delete color="error" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
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
                    {!editMode && (
                        <TextField
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                        />
                    )}
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
                    <Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!userToDelete} onClose={() => setUserToDelete(null)}>
                <DialogTitle>¿Eliminar usuario?</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar a <strong>{userToDelete?.nombre}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUserToDelete(null)}>Cancelar</Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!error} onClose={handleCloseError}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <Typography>{error}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseError} autoFocus>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserManagement;
