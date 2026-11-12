import { useEffect, useState } from 'react';
import { ENLACES_MENU } from '../datos/sitio.js';

// El menú tiene siete enlaces: en pantallas angostas no caben al lado
// del logo, así que se guardan detrás del botón hamburguesa.
// useState recuerda si está abierto; en la versión sin React esto era
// una clase que se ponía y se quitaba a mano sobre el <ul>.
function Encabezado() {
    const [abierto, setAbierto] = useState(false);

    // Si la ventana se agranda hasta el diseño de escritorio, se cierra
    // el menú para no dejarlo a medias.
    useEffect(() => {
        function alRedimensionar() {
            if (window.innerWidth > 900) setAbierto(false);
        }
        window.addEventListener('resize', alRedimensionar);
        // La función que se devuelve limpia el listener cuando el
        // componente se desmonta: si no, quedaría vivo para siempre.
        return () => window.removeEventListener('resize', alRedimensionar);
    }, []);

    function irArriba() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <header>
            <div className="logo-contenedor" onClick={irArriba}>
                El Jardín del Té
            </div>

            <button
                className="menu-boton"
                aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={abierto}
                onClick={() => setAbierto(!abierto)}
            >
                {abierto ? '✕' : '☰'}
            </button>

            <nav>
                <ul className={abierto ? 'abierto' : ''}>
                    {ENLACES_MENU.map((enlace) => (
                        <li key={enlace.href}>
                            {/* Al tocar un enlace el menú se cierra solo:
                                si no, tapa la sección a la que saltaste */}
                            <a href={enlace.href} onClick={() => setAbierto(false)}>
                                {enlace.texto}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Encabezado;
