import { REDES } from '../datos/sitio.js';

function Redes() {
    return (
        <section id="redes" className="seccion-bloque seccion-redes">
            <h2 className="seccion-titulo">Síguenos en Nuestras Redes</h2>
            <p>Comparte tu experiencia usando <strong>#ElJardinDelTeBogota</strong></p>

            <div className="botones-redes">
                {REDES.map((red) => (
                    <a
                        key={red.nombre}
                        href={red.url}
                        target="_blank"
                        rel="noopener"
                        className="boton-red"
                    >
                        {red.nombre}
                    </a>
                ))}
            </div>
        </section>
    );
}

export default Redes;
