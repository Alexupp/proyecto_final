import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Home, Settings, Info, Menu } from '@mui/icons-material';
import './sidebar.css';

const Sidebar = ({ isOpen, toggleDrawer }) => {
    return (
        <Drawer variant="persistent" anchor="left" open={isOpen} className="sidebar">
            <div className="sidebar-header">
                <IconButton onClick={toggleDrawer}>
                    <Menu />
                </IconButton>
                <h2>Mi App</h2>
            </div>
            <List>
                <ListItem button>
                    <ListItemIcon><Home /></ListItemIcon>
                    <ListItemText primary="Inicio" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><Settings /></ListItemIcon>
                    <ListItemText primary="Configuración" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><Info /></ListItemIcon>
                    <ListItemText primary="Acerca de" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
