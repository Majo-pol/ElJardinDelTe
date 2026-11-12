import { PRODUCTOS } from '../datos/sitio.js';
import TarjetaProducto from './TarjetaProducto.jsx';

function Catalogo() {
    return (
        <section id="catalogo" className="seccion-bloque">
            <h2 className="seccion-titulo">Productos Destacados</h2>
            <div className="catalogo-grid">
                {/* map recorre la lista y devuelve una tarjeta por producto.
                    key le sirve a React para saber cuál es cuál cuando la
                    lista cambia; sin ella avisa por consola. */}
                {PRODUCTOS.map((producto) => (
                    <TarjetaProducto key={producto.id} producto={producto} />
                ))}
            </div>
        </section>
    );
}

export default Catalogo;
