import "./error_pagina.css";
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404 - Página no encontrada</h1>
            <p className="not-found-text">La ruta que intentas acceder no existe.</p>
            
            <img 
                src="https://i.gifer.com/origin/48/48d504169c85043910cb1bcb814f6632_w200.gif" 
                alt="Página no encontrada"
                className="not-found-gif"
            />
            
            <button
                className="back-button"
                onClick={() => navigate('/')}
            >
                Volver al inicio
            </button>
        </div>
    );
}

export default NotFoundPage;