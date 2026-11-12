import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './estilos.css';

// Punto de entrada: React toma el <div id="root"> de index.html
// y dibuja dentro todo el componente App.
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
