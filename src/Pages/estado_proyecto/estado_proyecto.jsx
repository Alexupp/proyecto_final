import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
    collection,
    getDocs,
    updateDoc,
    addDoc,
    doc,
    Timestamp
} from 'firebase/firestore';
import './estado_proyecto.css';

const EstadoProyecto = () => {
    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
    const [estadoActual, setEstadoActual] = useState('Formulación');
    const [observacion, setObservacion] = useState('');
    const [historial, setHistorial] = useState([]);
    const [modalMensaje, setModalMensaje] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const estados = ['Formulación', 'Ejecución', 'Seguimiento', 'Finalizado', 'Cancelado'];

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'proyectos'));
                const lista = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProyectos(lista);
                if (lista.length > 0) {
                    setProyectoSeleccionado(lista[0].id);
                    setEstadoActual(lista[0].estado || 'Formulación');
                }
            } catch (error) {
                mostrarModal('Error al obtener proyectos.');
                console.error(error);
            }
        };
        obtenerProyectos();
    }, []);

    useEffect(() => {
        const obtenerHistorial = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'historial'));
                const lista = querySnapshot.docs
                    .map(doc => doc.data())
                    .filter(entry => entry.proyectoId === proyectoSeleccionado)
                    .sort((a, b) => b.fecha.seconds - a.fecha.seconds);
                setHistorial(lista);
            } catch (error) {
                mostrarModal('Error al obtener historial.');
                console.error(error);
            }
        };

        if (proyectoSeleccionado) {
            obtenerHistorial();
        }
    }, [proyectoSeleccionado]);

    const mostrarModal = (mensaje) => {
        setModalMensaje(mensaje);
        setModalVisible(true);
    };

    const cambiarEstado = async () => {
        if (!observacion.trim()) {
            mostrarModal('Por favor, escribe una observación.');
            return;
        }

        try {
            const proyectoRef = doc(db, 'proyectos', proyectoSeleccionado);
            await updateDoc(proyectoRef, {
                estado: estadoActual
            });

            await addDoc(collection(db, 'historial'), {
                proyectoId: proyectoSeleccionado,
                estado: estadoActual,
                observacion: observacion.trim(),
                fecha: Timestamp.now()
            });

            mostrarModal('Estado actualizado correctamente.');
            setObservacion('');
        } catch (error) {
            console.error(error);
            mostrarModal('Ocurrió un error al actualizar el estado.');
        }
    };

    return (
        <div className="estado-fondo">
            <div className="estado-container">
                <h2 className="estado-titulo">Gestión de Estado del Proyecto</h2>

                <div className="campo">
                    <label>Seleccionar Proyecto</label>
                    <select
                        value={proyectoSeleccionado}
                        onChange={(e) => {
                            const seleccionado = proyectos.find(p => p.id === e.target.value);
                            setProyectoSeleccionado(seleccionado.id);
                            setEstadoActual(seleccionado.estado || 'Formulación');
                        }}
                    >
                        {proyectos.map((proyecto) => (
                            <option key={proyecto.id} value={proyecto.id}>
                                {proyecto.titulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Estado del Proyecto</label>
                    <select
                        value={estadoActual}
                        onChange={(e) => setEstadoActual(e.target.value)}
                    >
                        {estados.map((estado) => (
                            <option key={estado} value={estado}>
                                {estado}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Observación</label>
                    <textarea
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                        placeholder="Escribe una observación sobre este cambio..."
                    ></textarea>
                </div>

                <button className="btn-guardar" onClick={cambiarEstado}>
                    Guardar Cambio
                </button>

                <h3 className="estado-subtitulo">Historial de Cambios</h3>
                {historial.length === 0 ? (
                    <p className="estado-mensaje">No hay cambios registrados para este proyecto.</p>
                ) : (
                    <ul className="historial-lista">
                        {historial.map((item, index) => (
                            <li key={index}>
                                <strong>{item.estado}</strong> — {item.observacion} <br />
                                <small>{new Date(item.fecha.seconds * 1000).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-contenido">
                        <p>{modalMensaje}</p>
                        <button className="btn-cerrar" onClick={() => setModalVisible(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstadoProyecto;
