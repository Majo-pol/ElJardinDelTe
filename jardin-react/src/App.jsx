import { useEffect, useRef, useState } from 'react';

import Encabezado from './componentes/Encabezado.jsx';
import Portada from './componentes/Portada.jsx';
import Nosotros from './componentes/Nosotros.jsx';
import Carrusel from './componentes/Carrusel.jsx';
import Catalogo from './componentes/Catalogo.jsx';
import MenuMesa from './componentes/MenuMesa.jsx';
import Actividades from './componentes/Actividades.jsx';
import Reserva from './componentes/Reserva.jsx';
import Redes from './componentes/Redes.jsx';
import Notificacion from './componentes/Notificacion.jsx';
import PiePagina from './componentes/PiePagina.jsx';

// App arma la página entera y es la dueña de la notificación flotante.
// La maneja aquí y no en cada sección porque hay dos que la usan
// (Actividades y Reserva): si cada una tuviera la suya, podrían
// aparecer dos carteles encimados.
function App() {
    const [aviso, setAviso] = useState({ mensaje: '', visible: false });
    const temporizadorRef = useRef(null);

    function mostrarAviso(mensaje) {
        // Si ya había un aviso en pantalla se cancela su temporizador,
        // o el nuevo desaparecería antes de tiempo.
        if (temporizadorRef.current) clearTimeout(temporizadorRef.current);

        setAviso({ mensaje, visible: true });
        temporizadorRef.current = setTimeout(() => {
            setAviso((anterior) => ({ ...anterior, visible: false }));
        }, 3000);
    }

    // Al desmontar, se limpia el temporizador pendiente.
    useEffect(() => {
        return () => {
            if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
        };
    }, []);

    return (
        <>
            <Encabezado />
            <Portada />

            <main className="contenedor-principal">
                <Nosotros />
                <Carrusel />
                <Catalogo />
                <MenuMesa />
                <Actividades onAvisar={mostrarAviso} />
                <Reserva onAvisar={mostrarAviso} />
                <Redes />
            </main>

            <PiePagina />
            <Notificacion mensaje={aviso.mensaje} visible={aviso.visible} />
        </>
    );
}

export default App;
