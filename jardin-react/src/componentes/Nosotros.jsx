import { CONTACTO } from '../datos/sitio.js';

function Nosotros() {
    return (
        <section id="nosotros" className="seccion-historia seccion-bloque">
            <div className="historia-texto">
                <h2 className="seccion-titulo titulo-izquierda">Acerca de Nosotros</h2>
                <p>
                    En <strong>El Jardín del Té</strong> creemos que cada infusión
                    cuenta una historia. Seleccionamos cuidadosamente botánicos,
                    flores y hebras del mundo para crear experiencias sensoriales
                    únicas en nuestro salón que transforman tu rutina en un ritual
                    de autocuidado y calma.
                </p>

                <div className="bloque-vision-mision">
                    <h3>Visión</h3>
                    <p>Acá se escribe la visión.</p>
                    <h3>Misión</h3>
                    <p>Acá se escribe la misión.</p>
                </div>

                <div className="bloque-como-llegar">
                    <h2>¿Cómo llegar?</h2>
                    <p><strong>📍 Dirección:</strong> {CONTACTO.direccion}</p>
                    <p><strong>Horario:</strong></p>
                    <p><strong>Lunes a viernes:</strong> {CONTACTO.horarioSemana}</p>
                    <p><strong>Sábados y domingos:</strong> {CONTACTO.horarioFinDeSemana}</p>
                    <a href={CONTACTO.mapa} target="_blank" rel="noopener" className="boton-mapa">
                        Google Maps
                    </a>
                </div>
            </div>

            <img
                src="imagenes/nosotros-logo.jpg"
                alt="Logo de El Jardín del Té y letrero de neón sobre el muro verde del salón"
                className="historia-imagen"
                loading="lazy"
            />
        </section>
    );
}

export default Nosotros;
