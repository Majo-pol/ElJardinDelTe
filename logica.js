(function () {
    'use strict';

    // Número de WhatsApp de la cafetería (con código 57 de Colombia)
    const NUMERO_WHATSAPP = "573115811518";

    // LISTA DE PRODUCTOS DESTACADOS (Solo consumo en el sitio)
    const inventarioProductos = [
        {
            identificador: 1,
            nombre: "Producto 1",
            descripcion: "Descripción del producto 1.",
            precio: 0,
            imagenUrl: ""
        },
        {
            identificador: 2,
            nombre: "Producto 2",
            descripcion: "Descripción del producto 2.",
            precio: 0,
            imagenUrl: ""
        },
        {
            identificador: 3,
            nombre: "Producto 3",
            descripcion: "Descripción del producto 3.",
            precio: 0,
            imagenUrl: ""
        }
    ];

    // 2. LISTA DE ACTIVIDADES (Redireccionan a WhatsApp)
    const calendarioActividades = [
        {
            identificador: 1,
            titulo: "Actividad 1",
            horario: "Sábados - 4:00 PM",
            descripcion: "Descripción de la actividad 1."
        },
        {
            identificador: 2,
            titulo: "Actividad 2",
            horario: "Domingos - 3:00 PM",
            descripcion: "Descripción de la actividad 2."
        },
        {
            identificador: 3,
            titulo: "Actividad 3",
            horario: "Jueves - 6:00 PM",
            descripcion: "Descripción de la actividad 3."
        }
    ];

    // MOSTRAR LOS PRODUCTOS EN LA PANTALLA
    function mostrarCatalogoProductos() {
        const contenedorProductos = document.getElementById('contenedor-productos');
        
        while (contenedorProductos.firstChild) {
            contenedorProductos.removeChild(contenedorProductos.firstChild);
        }

        inventarioProductos.forEach(function(producto) {
            const tarjetaDiv = document.createElement('div');
            tarjetaDiv.className = 'tarjeta-producto';
            
            const imagenTarjeta = document.createElement('img');
            imagenTarjeta.src = producto.imagenUrl;
            imagenTarjeta.alt = producto.nombre;
            imagenTarjeta.className = 'tarjeta-imagen';
            tarjetaDiv.appendChild(imagenTarjeta);

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

        while (contenedorActividades.firstChild) {
            contenedorActividades.removeChild(contenedorActividades.firstChild);
        }

        calendarioActividades.forEach(function(actividad) {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-actividad';

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
            botonInscribirse.setAttribute('data-idactividad', actividad.identificador);
            botonInscribirse.textContent = 'Reservar cupo por WhatsApp';

            tarjeta.appendChild(infoDiv);
            tarjeta.appendChild(botonInscribirse);
            contenedorActividades.appendChild(tarjeta);
        });
    }

    function mostrarMensajeFlotante(mensajeTexto) {
        const elementoNotificacion = document.getElementById('notificacion');
        elementoNotificacion.textContent = mensajeTexto;
        elementoNotificacion.classList.add('visible');
        setTimeout(function() {
            elementoNotificacion.classList.remove('visible');
        }, 3000);
    }

    // ACTIVAR LOS CLICS DE ACTIVIDADES Y RESERVAS
    function activarBotonesDeLaPagina() {
        document.body.addEventListener('click', function(evento) {
            const objetivo = evento.target;

            // Si hacen clic en el botón de una Actividad -> Redirigir a WhatsApp
            if (objetivo.classList.contains('boton-actividad-wa')) {
                const id = parseInt(objetivo.getAttribute('data-idactividad'), 10);
                const actividadElegida = calendarioActividades.find(function(a) {
                    return a.identificador === id;
                });

                if (actividadElegida) {
                    mostrarMensajeFlotante('Redirigiendo a WhatsApp para: ' + actividadElegida.titulo);
                    const mensaje = '¡Hola El Jardín del Té! Me gustaría consultar disponibilidad y reservar cupo para la actividad: *' + actividadElegida.titulo + '* (' + actividadElegida.horario + ').';
                    const urlWhatsApp = 'https://wa.me/' + 573115811518 + '?text=' + encodeURIComponent(mensaje);
                    
                    setTimeout(function() {
                        window.open(urlWhatsApp, '_blank');
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
            formularioReserva.addEventListener('submit', function(evento) {
                evento.preventDefault();
                const nombre = document.getElementById('nombre-reserva').value;
                const fecha = document.getElementById('fecha-reserva').value;
                const personas = document.getElementById('personas-reserva').value;
                const notas = document.getElementById('notas-reserva').value;

                let textoReserva = '¡Hola El Jardín del Té! Quiero reservar una mesa:\n\n' +
                                   '• *Nombre:* ' + nombre + '\n' +
                                   '• *Fecha:* ' + fecha + '\n' +
                                   '• *Personas:* ' + personas;
                if (notas) {
                    textoReserva += '\n• *Notas:* ' + notas;
                }

                mostrarMensajeFlotante('¡Abriendo WhatsApp para confirmar tu reserva!');
                setTimeout(function() {
                    window.open('https://wa.me/' + 573115811518 + '?text=' + encodeURIComponent(textoReserva), '_blank');
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
        let indiceActual = 0;

        function actualizarPosicionCarrusel() {
            const anchoImagen = imagenes[0].getBoundingClientRect().width;
            track.style.transform = 'translateX(-' + (indiceActual * anchoImagen) + 'px)';
        }

        botonNext.addEventListener('click', function() {
            indiceActual++;
            if (indiceActual >= imagenes.length) {
                indiceActual = 0; // Si llega al final, vuelve a la primera foto
            }
            actualizarPosicionCarrusel();
        });

        botonPrev.addEventListener('click', function() {
            indiceActual--;
            if (indiceActual < 0) {
                indiceActual = imagenes.length - 1; // Si está en la primera, salta a la última
            }
            actualizarPosicionCarrusel();
        });
    }

    // INICIAR LA PÁGINA
    function iniciarPagina() {
        mostrarCatalogoProductos();
        mostrarActividades();
        iniciarCarrusel();
        activarBotonesDeLaPagina();
    }

    document.addEventListener('DOMContentLoaded', iniciarPagina);
})();