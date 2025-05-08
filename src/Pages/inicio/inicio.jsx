import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/sidebar/sidebar';
import Footer from '../../Components/footer/footer';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './inicio.css';

const Inicio = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);  // Estado para almacenar la información del usuario
    const navigate = useNavigate();

    // Verificar si el usuario está autenticado al cargar el componente
    useEffect(() => {
        const checkUser = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Obtener información del usuario desde Firestore
                const userDocRef = doc(db, 'usuarios', currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setUser(userDocSnap.data());
                }
            } else {
                // Si no hay usuario autenticado, redirigir al login
                navigate('/login');
            }
        };

        checkUser();
    }, [navigate]);

    return (
        <div className="inicio-layout">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} />

            <div className="inicio-content">
                <header className="inicio-header">
                    <h1>Plataforma de Proyectos Escolares 🎓</h1>
                    <p>Bienvenido a la plataforma de gestión y seguimiento de proyectos escolares. ¡Inicia tu camino hacia el éxito educativo!</p>
                </header>

                <main className="inicio-main">
                    <section className="info-ondas">
                        <img 
                            src="/proyectobanner.jpg" 
                            alt="Proyecto Escolar" 
                            className="section-image"
                        />
                        <h2>¿Qué es el Proyecto Escolar? 📚</h2>
                        <p>
                            El Proyecto Escolar tiene como objetivo mejorar el proceso educativo mediante el uso de tecnologías innovadoras y herramientas digitales que fomenten la creatividad, el aprendizaje activo y la colaboración entre estudiantes. Está dirigido a niños, niñas y jóvenes en edad escolar, buscando ofrecerles recursos para desarrollar habilidades en investigación, resolución de problemas y pensamiento crítico.
                        </p>
                    </section>

                    <section className="objetivos-section">
                        <h2>Objetivos del Sistema 🎯</h2>
                        <ul>
                            <li>Facilitar el registro de proyectos escolares.</li>
                            <li>Permitir el seguimiento de avances por parte de los docentes.</li>
                            <li>Fomentar la investigación en niveles escolares.</li>
                            <li>Generar reportes del estado de cada proyecto.</li>
                        </ul>
                    </section>

                    <section className="beneficios-section">
                        <h2>Beneficios 🚀</h2>
                        <div className="beneficios-grid">
                            <div className="beneficio-card">
                                <img 
                                    src="/acceso.jpg" 
                                    alt="Acceso Rápido" 
                                />
                                <h3>Acceso Rápido ⏱️</h3>
                                <p>Consulta y registra proyectos de manera ágil y sin complicaciones.</p>
                            </div>
                            <div className="beneficio-card">
                                <img 
                                    src="/organizacion.jpeg" 
                                    alt="Organización" 
                                />
                                <h3>Organización 📅</h3>
                                <p>Mantén tus proyectos organizados por fases, facilitando el seguimiento.</p>
                            </div>
                            <div className="beneficio-card">
                                <img 
                                    src="/seguimiento.jpeg" 
                                    alt="Seguimiento" 
                                />
                                <h3>Seguimiento 🔍</h3>
                                <p>Observa el progreso de cada proyecto y equipo en tiempo real.</p>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Inicio;
