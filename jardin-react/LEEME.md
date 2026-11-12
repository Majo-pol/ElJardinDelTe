# El Jardín del Té — versión React

Misma página, misma paleta y mismas fotos que la versión de
HTML/CSS/JS que está en la carpeta de arriba. Lo que cambia es que
ahora está partida en componentes.

## Cómo correrlo

Necesitas Node.js instalado (compruébalo con `node -v`).

```
cd jardin-react
npm install      # sólo la primera vez
npm run dev
```

Te imprime una dirección tipo `http://localhost:5173/`. Ábrela en el
navegador. Mientras `npm run dev` esté corriendo, cada vez que guardes
un archivo la página se actualiza sola.

Para parar el servidor: `Ctrl + C` en la terminal.

Para generar la versión final que se publicaría:

```
npm run build    # deja todo en la carpeta dist/
npm run preview  # sirve dist/ para revisarlo
```

## Cómo está organizado

```
index.html                 el único HTML: React se monta en <div id="root">
src/
  main.jsx                 punto de entrada
  App.jsx                  arma la página y maneja la notificación flotante
  estilos.css              los estilos (sin cambios respecto a la otra versión)
  datos/sitio.js           TODO el contenido: productos, menú, actividades, redes
  utilidades/whatsapp.js   arma los enlaces de wa.me
  assets/                  la foto del hero (la importa Portada.jsx)
  componentes/
    Encabezado.jsx         menú de navegación y botón hamburguesa
    Portada.jsx            el hero
    Nosotros.jsx           historia, misión, visión y cómo llegar
    Carrusel.jsx           galería del salón
    Catalogo.jsx           rejilla de productos destacados
    TarjetaProducto.jsx    una tarjeta suelta
    MenuMesa.jsx           el menú por categorías
    Actividades.jsx        talleres + botón a WhatsApp
    Reserva.jsx            formulario de reserva
    Redes.jsx              botones de redes sociales
    Notificacion.jsx       el cartelito flotante
    PiePagina.jsx          el footer
public/imagenes/           las fotos
```

## Para cambiar el contenido

Casi todo está en **`src/datos/sitio.js`**: los productos con su precio,
las categorías del menú, las actividades con su horario y los enlaces de
redes. No hace falta tocar ningún componente para actualizar un precio o
agregar un taller.
