import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/login/login';
import Register from './Pages/register/register';
import UserManagement from './Pages/gestion_usuario/gestion_usuario';
import RegistroProyecto from './Pages/registro_proyecto/registro_proyecto';
import RegistroAvance from './Pages/registro_avance/registro_avance';
import ListaProyectos from './Pages/lista_proyecto/lista_proyecto';
import DetalleProyecto from './Pages/detalle_proyecto/detalle_proyecto';
import EstadoProyecto from './Pages/estado_proyecto/estado_proyecto';
import VistaReportes from './Pages/reporte/reporte';
import Inicio from './Pages/inicio/inicio';
import NotFoundPage from './Pages/error_pagina/error_pagina';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gestion-usuarios" element={<UserManagement />} />
        <Route path="/registro-proyecto" element={<RegistroProyecto />} />
        <Route path="/registro-avance" element={<RegistroAvance />} />
        <Route path="/proyectos" element={<ListaProyectos />} />
        <Route path="/proyecto/:id" element={<DetalleProyecto />} />
        <Route path="/estado-proyecto" element={<EstadoProyecto />} />
        <Route path="/reportes" element={<VistaReportes />} />

        {/* Ruta comodín para manejar 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;