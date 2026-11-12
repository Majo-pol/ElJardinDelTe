import { useEffect, useRef, useState } from 'react';
import { FOTOS_SALON } from '../datos/sitio.js';

function Carrusel() {
    const [indice, setIndice] = useState(0);
    const [anchoFoto, setAnchoFoto] = useState(0);
    // useRef guarda una referencia al elemento del DOM. Es el equivalente
    // en React de document.getElementById, pero atado a este componente.
    const pistaRef = useRef(null);

    // La posición se calcula en píxeles a partir del ancho de la foto, y
    // ese ancho cambia si la ventana cambia de tamaño. Sin volver a
    // medirlo, el carrusel queda desalineado.
    useEffect(() => {
        function medir() {
            const primera = pistaRef.current?.firstElementChild;
            if (primera) setAnchoFoto(primera.getBoundingClientRect().width);
        }
        medir();
        window.addEventListener('resize', medir);
        return () => window.removeEventListener('resize', medir);
    }, []);

    // El resto (%) hace que el carrusel sea circular: después de la
    // última vuelve a la primera, y antes de la primera salta a la última.
    function siguiente() {
        setIndice((actual) => (actual + 1) % FOTOS_SALON.length);
    }

    function anterior() {
        setIndice((actual) => (actual - 1 + FOTOS_SALON.length) % FOTOS_SALON.length);
    }

    return (
        <section id="galeria" className="seccion-bloque">
            <h2 className="seccion-titulo">Conoce Nuestro Salón</h2>

            <div className="carrusel-contenedor">
                <button className="carrusel-btn prev" onClick={anterior} aria-label="Foto anterior">❮</button>

                <div className="carrusel-track-container">
                    <div
                        className="carrusel-track"
                        ref={pistaRef}
                        style={{ transform: `translateX(-${indice * anchoFoto}px)` }}
                    >
                        {FOTOS_SALON.map((foto) => (
                            // Las fotos del carrusel NO llevan loading="lazy":
                            // están desplazadas fuera de la pantalla, el
                            // navegador nunca las considera visibles y al pasar
                            // de foto aparecería un hueco en blanco.
                            <img key={foto.src} src={foto.src} alt={foto.alt} className="carrusel-img" />
                        ))}
                    </div>
                </div>

                <button className="carrusel-btn next" onClick={siguiente} aria-label="Foto siguiente">❯</button>
            </div>
        </section>
    );
}

export default Carrusel;
