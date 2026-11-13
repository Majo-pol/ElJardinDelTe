(function () {
    'use strict';

    // Número de WhatsApp de la cafetería (con código 57 de Colombia).
    // Va como texto y en un solo sitio: antes estaba escrito a mano en
    // cada enlace, así que cambiarlo obligaba a buscarlo por todo el
    // archivo y era fácil dejar uno viejo.
    const NUMERO_WHATSAPP = "573115811518";

    // LISTA DE PRODUCTOS DESTACADOS (Solo consumo en el sitio)
    const inventarioProductos = [
        {
            identificador: 1,
            nombre: "Chocolate Especial con Tostada Francesa",
            descripcion: "Delicioso chocolate caliente con una tostada francesa.",
            precio: 0,
            imagenUrl: "imagenes/producto-01.jpg"
        },
        {
            identificador: 2,
            nombre: "Capuccino con Tostada Italiana",
            descripcion: "Delicioso capuccino caliente con una tostada italiana.",
            precio: 0,
            imagenUrl: "imagenes/producto-02.jpg"
        },
        {
            identificador: 3,
            nombre: "Latte con Tostada Francesa",
            descripcion: "Delicioso latte caliente con una tostada francesa.",
            precio: 0,
            imagenUrl: "imagenes/producto-03.jpg"
        }
    ];

    // 2. LISTA DE ACTIVIDADES (Redireccionan a WhatsApp)
    const calendarioActividades = [
        {
            identificador: 1,
            titulo: "Pinta & Crea",
            horario: "Por definir",
            descripcion: "Puedes seleccionar entre ceramicas, lienzos y tote bags. Puedes escoger este plan con o sin brunch. Cupos limitados, reserva con anticipación.",
            imagenUrl: "imagenes/actividad-01.jpg"
        },
        {
            identificador: 2,
            titulo: "Brunch astrológico",
            horario: "Por definir",
            descripcion: "Disfruta de un brunch con un toque astrológico. Prepárate con la energía de cada mes y no te dejes sorprender por los astros. Cupos limitados, reserva con anticipación.",
            imagenUrl: "imagenes/actividad-02.jpg"
        },
        {
            identificador: 3,
            titulo: "Decora & disfruta",
            horario: "Por definir",
            descripcion: "Disfruta de un taller de decoración Diseña tu propia torta y disfruta una experiencia deliciosa y creativa. Puedes escoger este plan con o sin brunch. Cupos limitados, reserva con anticipación.",
            imagenUrl: "imagenes/actividad-03.jpg"
        }
    ];

    // Arma el enlace de WhatsApp con el mensaje ya codificado.
    // encodeURIComponent es lo que hace que los acentos, los saltos de
    // línea y los asteriscos de negrita lleguen bien al chat.
    function enlaceWhatsApp(mensaje) {
        return 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + encodeURIComponent(mensaje);
    }

    // MOSTRAR LOS PRODUCTOS EN LA PANTALLA
    function mostrarCatalogoProductos() {
        const contenedorProductos = document.getElementById('contenedor-productos');
        if (!contenedorProductos) return;

        while (contenedorProductos.firstChild) {
            contenedorProductos.removeChild(contenedorProductos.firstChild);
        }

        inventarioProductos.forEach(function (producto) {
            const tarjetaDiv = document.createElement('div');
            tarjetaDiv.className = 'tarjeta-producto';

            // Sólo se crea la etiqueta <img> si de verdad hay una foto.
            // Un src vacío no muestra nada y algunos navegadores vuelven
            // a pedir la página entera.
            if (producto.imagenUrl) {
                const imagenTarjeta = document.createElement('img');
                imagenTarjeta.src = producto.imagenUrl;
                imagenTarjeta.alt = producto.nombre;
                imagenTarjeta.className = 'tarjeta-imagen';
                imagenTarjeta.loading = 'lazy';
                tarjetaDiv.appendChild(imagenTarjeta);
            }

            const contenidoTarjeta = document.createElement('div');
            contenidoTarjeta.className = 'tarjeta-contenido';

            const infoDiv = document.createElement('div');
            const tituloProducto = document.createElement('h3');
            tituloProducto.textContent = producto.nombre;
            const descripcionProducto = document.createElement('p');
            descripcionProducto.textContent = producto.descripcion;
            infoDiv.appendChild(tituloProducto);
            infoDiv.appendChild(descripcionProducto);
            contenidoTarjeta.appendChild(infoDiv);

            const precioYDetalle = document.createElement('div');
            precioYDetalle.className = 'precio-y-accion';

            const etiquetaPrecio = document.createElement('span');
            etiquetaPrecio.className = 'precio';
            etiquetaPrecio.textContent = '$' + producto.precio.toLocaleString('es-CO');
            precioYDetalle.appendChild(etiquetaPrecio);

            const etiquetaSitio = document.createElement('span');
            etiquetaSitio.className = 'etiqueta-sitio';
            etiquetaSitio.textContent = 'Consumo en mesa';
            precioYDetalle.appendChild(etiquetaSitio);

            contenidoTarjeta.appendChild(precioYDetalle);
            tarjetaDiv.appendChild(contenidoTarjeta);
            contenedorProductos.appendChild(tarjetaDiv);
        });
    }

    // MOSTRAR LAS ACTIVIDADES CON SU BOTÓN A WHATSAPP
    function mostrarActividades() {
        const contenedorActividades = document.getElementById('contenedor-actividades');
        if (!contenedorActividades) return;

        while (contenedorActividades.firstChild) {
            contenedorActividades.removeChild(contenedorActividades.firstChild);
        }

        calendarioActividades.forEach(function (actividad) {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-actividad';

            if (actividad.imagenUrl) {
                const foto = document.createElement('img');
                foto.src = actividad.imagenUrl;
                foto.alt = actividad.titulo;
                foto.className = 'actividad-imagen';
                foto.loading = 'lazy';
                tarjeta.appendChild(foto);
            }

            const cuerpo = document.createElement('div');
            cuerpo.className = 'actividad-cuerpo';

            const infoDiv = document.createElement('div');

            const fechaSpan = document.createElement('span');
            fechaSpan.className = 'fecha-evento';
            fechaSpan.textContent = actividad.horario;
            infoDiv.appendChild(fechaSpan);

            const tituloH3 = document.createElement('h3');
            tituloH3.textContent = actividad.titulo;
            infoDiv.appendChild(tituloH3);

            const descripcionP = document.createElement('p');
            descripcionP.textContent = actividad.descripcion;
            infoDiv.appendChild(descripcionP);

            const botonInscribirse = document.createElement('button');
            botonInscribirse.className = 'boton-actividad-wa';
            botonInscribirse.type = 'button';
            botonInscribirse.setAttribute('data-idactividad', actividad.identificador);
            botonInscribirse.textContent = 'Reservar cupo por WhatsApp';

            cuerpo.appendChild(infoDiv);
            cuerpo.appendChild(botonInscribirse);
            tarjeta.appendChild(cuerpo);
            contenedorActividades.appendChild(tarjeta);
        });
    }

    function mostrarMensajeFlotante(mensajeTexto) {
        const elementoNotificacion = document.getElementById('notificacion');
        if (!elementoNotificacion) return;

        elementoNotificacion.textContent = mensajeTexto;
        elementoNotificacion.classList.add('visible');
        setTimeout(function () {
            elementoNotificacion.classList.remove('visible');
        }, 3000);
    }

    // MENÚ HAMBURGUESA (sólo se ve en pantallas angostas)
    function activarMenuResponsive() {
        const boton = document.getElementById('menu-boton');
        const lista = document.getElementById('menu-navegacion');
        if (!boton || !lista) return;

        function cerrarMenu() {
            lista.classList.remove('abierto');
            boton.setAttribute('aria-expanded', 'false');
            boton.textContent = '☰';
        }

        boton.addEventListener('click', function () {
            const abierto = lista.classList.toggle('abierto');
            boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
            boton.textContent = abierto ? '✕' : '☰';
        });

        // Al tocar un enlace el menú se cierra solo: si no, tapa la
        // sección a la que el usuario acaba de saltar.
        lista.addEventListener('click', function (evento) {
            if (evento.target.tagName === 'A') cerrarMenu();
        });

        // Si la ventana se agranda hasta el diseño de escritorio, se
        // limpia el estado para no dejar el menú a medias.
        window.addEventListener('resize', function () {
            if (window.innerWidth > 900) cerrarMenu();
        });
    }

    // ACTIVAR LOS CLICS DE ACTIVIDADES Y RESERVAS
    function activarBotonesDeLaPagina() {
        document.body.addEventListener('click', function (evento) {
            const objetivo = evento.target;

            // Si hacen clic en el botón de una Actividad -> Redirigir a WhatsApp
            if (objetivo.classList.contains('boton-actividad-wa')) {
                const id = parseInt(objetivo.getAttribute('data-idactividad'), 10);
                const actividadElegida = calendarioActividades.find(function (a) {
                    return a.identificador === id;
                });

                if (actividadElegida) {
                    mostrarMensajeFlotante('Redirigiendo a WhatsApp para: ' + actividadElegida.titulo);
                    const mensaje = '¡Hola El Jardín del Té! Me gustaría consultar disponibilidad y reservar cupo para la actividad: *' +
                        actividadElegida.titulo + '* (' + actividadElegida.horario + ').';

                    setTimeout(function () {
                        window.open(enlaceWhatsApp(mensaje), '_blank');
                    }, 800);
                }
            }

            // Volver arriba al tocar el logo
            if (objetivo.id === 'boton-inicio-logo' || objetivo.closest('#boton-inicio-logo')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        // Enviar el formulario de Reserva de Mesa a WhatsApp
        const formularioReserva = document.getElementById('form-reserva');
        if (formularioReserva) {
            formularioReserva.addEventListener('submit', function (evento) {
                evento.preventDefault();

                const nombre = document.getElementById('nombre-reserva').value;
                // El teléfono se pedía en el formulario pero nunca se leía,
                // así que la reserva llegaba sin forma de devolver la llamada.
                const telefono = document.getElementById('telefono-reserva').value;
                const fecha = document.getElementById('fecha-reserva').value;
                const personas = document.getElementById('personas-reserva').value;
                const notas = document.getElementById('notas-reserva').value;

                let textoReserva = '¡Hola El Jardín del Té! Quiero reservar una mesa:\n\n' +
                    '• *Nombre:* ' + nombre + '\n' +
                    '• *Teléfono:* ' + telefono + '\n' +
                    '• *Fecha:* ' + fecha + '\n' +
                    '• *Personas:* ' + personas;
                if (notas) {
                    textoReserva += '\n• *Notas:* ' + notas;
                }

                mostrarMensajeFlotante('¡Abriendo WhatsApp para confirmar tu reserva!');
                setTimeout(function () {
                    window.open(enlaceWhatsApp(textoReserva), '_blank');
                    formularioReserva.reset();
                }, 1000);
            });
        }
    }

    // CARRUSEL DE FOTOS
    function iniciarCarrusel() {
        const track = document.getElementById('carrusel-track');
        if (!track) return;

        const imagenes = Array.from(track.children);
        const botonNext = document.getElementById('carrusel-next');
        const botonPrev = document.getElementById('carrusel-prev');
        if (!imagenes.length || !botonNext || !botonPrev) return;

        let indiceActual = 0;

        function actualizarPosicionCarrusel() {
            const anchoImagen = imagenes[0].getBoundingClientRect().width;
            track.style.transform = 'translateX(-' + (indiceActual * anchoImagen) + 'px)';
        }

        botonNext.addEventListener('click', function () {
            indiceActual++;
            if (indiceActual >= imagenes.length) {
                indiceActual = 0; // Si llega al final, vuelve a la primera foto
            }
            actualizarPosicionCarrusel();
        });

        botonPrev.addEventListener('click', function () {
            indiceActual--;
            if (indiceActual < 0) {
                indiceActual = imagenes.length - 1; // Si está en la primera, salta a la última
            }
            actualizarPosicionCarrusel();
        });

        // La posición se calcula en píxeles a partir del ancho de la foto.
        // Si la ventana cambia de tamaño ese ancho cambia, así que hay que
        // volver a calcularla o el carrusel queda desalineado.
        window.addEventListener('resize', actualizarPosicionCarrusel);
    }

    // INICIAR LA PÁGINA
    function iniciarPagina() {
        mostrarCatalogoProductos();
        mostrarActividades();
        iniciarCarrusel();
        activarMenuResponsive();
        activarBotonesDeLaPagina();
    }

    document.addEventListener('DOMContentLoaded', iniciarPagina);
})();

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los desplegables
    const selectoresTamano = document.querySelectorAll('.selector-tamano');

    selectoresTamano.forEach(selector => {
        selector.addEventListener('change', function () {
            const nuevoPrecio = this.value;

            // Buscamos el elemento de la lista (li) que contiene este selector
            const contenedorBebida = this.closest('li');

            if (contenedorBebida) {
                // Buscamos la etiqueta strong dentro de ese mismo li
                const precioElemento = contenedorBebida.querySelector('strong');

                if (precioElemento) {
                    // Actualizamos el precio con el formato correcto
                    precioElemento.textContent = '$' + Number(nuevoPrecio).toLocaleString('es-CO');
                }
            }
        });
    });
});