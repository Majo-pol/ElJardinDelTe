// La foto del hero se importa en vez de escribirla en el CSS.
// Al compilar, Vite mueve los archivos y les cambia el nombre; una
// ruta escrita a mano dentro de url(...) deja de apuntar a ningún
// lado. Importándola, Vite la resuelve él mismo en desarrollo y en
// producción.
import fondoHero from '../assets/hero-letrero.jpg';

const estiloFondo = {
    backgroundImage:
        `linear-gradient(rgba(47, 58, 36, 0.58), rgba(47, 58, 36, 0.62)), url(${fondoHero})`
};

function Portada() {
    return (
        <section id="inicio" className="hero-seccion" style={estiloFondo}>
            <h1>El Plan Más Bonito de Bogotá</h1>
            <p>
                Ven y disfruta en nuestra mesa de una amplia variedad de Té e
                infusiones servidos de una forma innovadora, acompañados por
                exquisitos postres y empanadas horneadas. También ofrecemos Café
                y Chocolate caliente.
            </p>
            <a href="#catalogo" className="boton-primario">Explorar</a>
        </section>
    );
}

export default Portada;
