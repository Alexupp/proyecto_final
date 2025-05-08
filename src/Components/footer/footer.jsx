    import React from 'react';
    import './footer.css';
    import { Facebook, GitHub, Instagram } from '@mui/icons-material';

    const Footer = () => {
        return (
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Plataforma Escolar</h3>
                        <p>Impulsando la educación con tecnología y colaboración.</p>
                    </div>

                    <div className="footer-section">
                        <h4>Enlaces Rápidos</h4>
                        <ul>
                            <li><a href="/login">Iniciar Sesión</a></li>
                            <li><a href="/register">Registrarse</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Síguenos</h4>
                        <div className="social-icons">
                            <a href="https://www.facebook.com/profile.php?id=100008998086700&locale=es_LA" target="_blank" rel="noopener noreferrer"><Facebook /></a>
                            <a href="https://github.com/Alexupp" target="_blank" rel="noopener noreferrer"><GitHub /></a>
                            <a href="https://www.instagram.com/alexander_correa31/" target="_blank" rel="noopener noreferrer"><Instagram /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Plataforma de Proyectos Escolares. Todos los derechos reservados (Autor: Alexander Pérez Correa).</p>
                </div>
            </footer>
        );
    };

    export default Footer;
