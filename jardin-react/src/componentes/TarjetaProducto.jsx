// Una sola tarjeta. Recibe el producto por props y no sabe nada del
// resto de la página: ésa es la ventaja de partirlo en componentes.
function TarjetaProducto({ producto }) {
    return (
        <div className="tarjeta-producto">
            {producto.imagen && (
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="tarjeta-imagen"
                    loading="lazy"
                />
            )}

            <div className="tarjeta-contenido">
                <div>
                    <h3>{producto.nombre}</h3>
                    <p>{producto.descripcion}</p>
                </div>

                <div className="precio-y-accion">
                    <span className="precio">
                        ${producto.precio.toLocaleString('es-CO')}
                    </span>
                    <span className="etiqueta-sitio">Consumo en mesa</span>
                </div>
            </div>
        </div>
    );
}

export default TarjetaProducto;
