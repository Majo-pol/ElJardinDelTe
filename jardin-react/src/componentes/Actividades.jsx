import { ACTIVIDADES } from '../datos/sitio.js';
import { abrirWhatsApp } from '../utilidades/whatsapp.js';

// onAvisar llega desde App: es la función que muestra la notificación
// flotante. El componente no la implementa, sólo la usa.
function Actividades({ onAvisar }) {
    function reservarCupo(actividad) {
        onAvisar('Redirigiendo a WhatsApp para: ' + actividad.titulo);

        const mensaje =
            '¡Hola El Jardín del Té! Me gustaría consultar disponibilidad y ' +
            'reservar cupo para la actividad: *' + actividad.titulo + '* (' +
            actividad.horario + ').';

        abrirWhatsApp(mensaje);
    }

    return (
        <section id="actividades" className="seccion-bloque">
            <h2 className="seccion-titulo">Calendario de Actividades</h2>

            <div className="actividades-grid">
                {ACTIVIDADES.map((actividad) => (
                    <div className="tarjeta-actividad" key={actividad.id}>
                        {actividad.imagen && (
                            <img
                                src={actividad.imagen}
                                alt={actividad.titulo}
                                className="actividad-imagen"
                                loading="lazy"
                            />
                        )}

                        <div className="actividad-cuerpo">
                            <div>
                                <span className="fecha-evento">{actividad.horario}</span>
                                <h3>{actividad.titulo}</h3>
                                <p>{actividad.descripcion}</p>
                            </div>

                            <button
                                type="button"
                                className="boton-actividad-wa"
                                onClick={() => reservarCupo(actividad)}
                            >
                                Reservar cupo por WhatsApp
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Actividades;
