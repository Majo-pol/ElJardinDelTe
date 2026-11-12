import { useState } from 'react';
import { abrirWhatsApp } from '../utilidades/whatsapp.js';

const FORMULARIO_VACIO = {
    nombre: '',
    telefono: '',
    fecha: '',
    personas: '',
    notas: ''
};

function Reserva({ onAvisar }) {
    // Un solo useState para todo el formulario. React llama a esto un
    // "componente controlado": el valor de cada campo vive en el estado,
    // no en el DOM, así que siempre sabemos qué escribió el usuario.
    const [datos, setDatos] = useState(FORMULARIO_VACIO);

    function alEscribir(evento) {
        const { name, value } = evento.target;
        setDatos((anterior) => ({ ...anterior, [name]: value }));
    }

    function alEnviar(evento) {
        evento.preventDefault();

        let texto =
            '¡Hola El Jardín del Té! Quiero reservar una mesa:\n\n' +
            '• *Nombre:* ' + datos.nombre + '\n' +
            '• *Teléfono:* ' + datos.telefono + '\n' +
            '• *Fecha:* ' + datos.fecha + '\n' +
            '• *Personas:* ' + datos.personas;

        if (datos.notas) {
            texto += '\n• *Notas:* ' + datos.notas;
        }

        onAvisar('¡Abriendo WhatsApp para confirmar tu reserva!');
        abrirWhatsApp(texto, 1000);
        setDatos(FORMULARIO_VACIO);
    }

    return (
        <section id="reservas" className="seccion-bloque">
            <h2 className="seccion-titulo">Reserva tu Mesa o Contáctanos</h2>

            <form className="formulario-reserva" onSubmit={alEnviar}>
                <label htmlFor="nombre">Nombre completo</label>
                <input
                    type="text" id="nombre" name="nombre"
                    value={datos.nombre} onChange={alEscribir}
                    placeholder="Tu nombre completo" autoComplete="name" required
                />

                <label htmlFor="telefono">Teléfono / WhatsApp</label>
                <input
                    type="tel" id="telefono" name="telefono"
                    value={datos.telefono} onChange={alEscribir}
                    placeholder="Ej: 311 581 1518" autoComplete="tel" required
                />

                <label htmlFor="fecha">Fecha de la reserva</label>
                <input
                    type="date" id="fecha" name="fecha"
                    value={datos.fecha} onChange={alEscribir} required
                />

                <label htmlFor="personas">Número de personas</label>
                <select
                    id="personas" name="personas"
                    value={datos.personas} onChange={alEscribir} required
                >
                    <option value="">Número de personas</option>
                    <option value="2 personas">2 personas</option>
                    <option value="3 a 4 personas">3 a 4 personas</option>
                    <option value="Grupo (5 o más)">Grupo (5 o más)</option>
                </select>

                <label htmlFor="notas">Solicitudes especiales (opcional)</label>
                <textarea
                    id="notas" name="notas" rows="3"
                    value={datos.notas} onChange={alEscribir}
                    placeholder="¿Alguna solicitud especial o celebración?"
                />

                <button type="submit" className="boton-primario">
                    Confirmar Reserva por WhatsApp
                </button>
            </form>
        </section>
    );
}

export default Reserva;
