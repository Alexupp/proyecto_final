import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Login,
    PersonAdd,
    Folder,
    Group,
    Assessment,
    Description,
    NoteAdd,
    Visibility,
    TrendingUp
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = ({ isOpen, setIsOpen, user }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();              // Borra al usuario
        navigate('/inicio');   // Redirige a la página de inicio

    };
    return (
        <Drawer
            className="sidebar"
            variant="permanent"
            anchor="left"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            sx={{
                width: isOpen ? 240 : 60,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: isOpen ? 240 : 60,
                    transition: 'width 0.3s',
                    overflowX: 'hidden',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    borderRight: '1px solid #ddd',
                },
            }}
        >
            <div className="sidebar-header">
                <h2 style={{
                    fontSize: isOpen ? '1rem' : 0,
                    margin: '0 auto',
                    color: '#4caf50',
                    transition: '0.3s',
                    whiteSpace: 'nowrap'
                }}>
                    {user
                        ? `MENU ${user.tipo.toUpperCase()}`
                        : 'MENU'}
                </h2>
            </div>
            <List>
                {/* Menú para usuarios no autenticados */}
                {!user && (
                    <>
                        <ListItem button component={Link} to="/login">
                            <ListItemIcon sx={{ color: '#4caf50' }}><Login /></ListItemIcon>
                            {isOpen && <ListItemText primary="Iniciar Sesión" />}
                        </ListItem>
                        <ListItem button component={Link} to="/register">
                            <ListItemIcon sx={{ color: '#4caf50' }}><PersonAdd /></ListItemIcon>
                            {isOpen && <ListItemText primary="Registrarse" />}
                        </ListItem>
                    </>
                )}

                {/* Menú para COORDINADOR */}
                {user && user.tipo === 'coordinador' && (
                    <>
                        <ListItem button component={Link} to="/gestion-usuarios">
                            <ListItemIcon sx={{ color: '#4caf50' }}><Group /></ListItemIcon>
                            {isOpen && <ListItemText primary="Gestión de Usuarios" />}
                        </ListItem>
                        <ListItem button component={Link} to="/proyectos">
                            <ListItemIcon sx={{ color: '#4caf50' }}><Folder /></ListItemIcon>
                            {isOpen && <ListItemText primary="Proyectos" />}
                        </ListItem>
                        <ListItem button component={Link} to="/estado-proyecto">
                            <ListItemIcon sx={{ color: '#4caf50' }}><Assessment /></ListItemIcon>
                            {isOpen && <ListItemText primary="Estado de Proyecto" />}
                        </ListItem>
                        <ListItem button component={Link} to="/reportes">
                            <ListItemIcon sx={{ color: '#4caf50' }}><Description /></ListItemIcon>
                            {isOpen && <ListItemText primary="Reportes" />}
                        </ListItem>
                        <ListItem button component={Link} to="/login">
                            <ListItemIcon sx={{ color: '#4caf50' }}><Description /></ListItemIcon>
                            {isOpen && <ListItemText primary="Cerrar Sesión" />}
                        </ListItem>
                    </>
                )}

                {/* Menú para DOCENTE */}
                {user && user.tipo === 'docente' && (
                    <>
                        <ListItem button component={Link} to="/registro-proyecto">
                            <ListItemIcon sx={{ color: '#4caf50' }}><NoteAdd /></ListItemIcon>
                            {isOpen && <ListItemText primary="Registrar Proyecto" />}
                        </ListItem>
                        <ListItem button component={Link} to="/proyectos">
                            <ListItemIcon sx={{ color: '#4caf50' }}><Visibility /></ListItemIcon>
                            {isOpen && <ListItemText primary="Visualizar Proyectos" />}
                        </ListItem>
                        <ListItem button component={Link} to="/reportes">
                            <ListItemIcon sx={{ color: '#4caf50' }}><Description /></ListItemIcon>
                            {isOpen && <ListItemText primary="Reportes" />}
                        </ListItem>
                        <ListItem button component={Link} to="/login">
                            <ListItemIcon sx={{ color: '#4caf50' }}><Description /></ListItemIcon>
                            {isOpen && <ListItemText primary="Cerrar Sesión" />}
                        </ListItem>
                    </>
                )}

                {/* Menú para ESTUDIANTE */}
                {user && user.tipo === 'estudiante' && (
                    <>
                        <ListItem button component={Link} to="/registro-avance">
                            <ListItemIcon sx={{ color: '#4caf50' }}><TrendingUp /></ListItemIcon>
                            {isOpen && <ListItemText primary="Avance de Proyecto" />}
                        </ListItem>
                        <ListItem button component={Link} to="/login">
                            <ListItemIcon sx={{ color: '#4caf50' }}><Description /></ListItemIcon>
                            {isOpen && <ListItemText primary="Cerrar Sesión" />}
                        </ListItem>
                    </>
                )}
            </List>
        </Drawer>
    );
};

export default Sidebar;
