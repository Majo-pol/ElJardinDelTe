import { CATEGORIAS_MENU } from '../datos/sitio.js';

function MenuMesa() {
    return (
        <section id="menu" className="seccion-bloque">
            <h2 className="seccion-titulo">Nuestro Menú en Mesa</h2>

            <div className="menu-columnas">
                {CATEGORIAS_MENU.map((categoria) => (
                    <div className="menu-categoria" key={categoria.titulo}>
                        <h3>{categoria.titulo}</h3>
                        <ul className="lista-menu">
                            {categoria.platos.map((plato) => (
                                <li key={plato.nombre}>
                                    <span>{plato.nombre}</span>
                                    <strong>${plato.precio.toLocaleString('es-CO')}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default MenuMesa;
