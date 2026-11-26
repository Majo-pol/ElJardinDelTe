(function () {
    'use strict';

    const NUMERO_WHATSAPP = "573001365169";

    // Datos de RESPALDO por si aún no se ha conectado Supabase
    let inventarioProductos = [
        {
            identificador: 1,
            nombre: "Chocolate Especial con Tostada Francesa",
            descripcion: "Delicioso chocolate caliente con una tostada francesa.",
            precio: 38000,
            imagenUrl: "imagenes/producto-01.jpg"
        },
        {
            identificador: 2,
            nombre: "Capuccino con Tostada Italiana",
            descripcion: "Delicioso capuccino caliente con una tostada italiana.",
            precio: 38000,
            imagenUrl: "imagenes/producto-02.jpg"
        },
        {
            identificador: 3,
            nombre: "Latte con Tostada Francesa",
            descripcion: "Delicioso latte caliente con una tostada francesa.",
            precio: 32000,
            imagenUrl: "imagenes/producto-03.jpg"
        }
    ];

    let calendarioActividades = [
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
            imagenUrl: "imagenes/ceramica6.jpg"
        },
        {
            identificador: 3,
            titulo: "Decora & disfruta",
            horario: "Por definir",
            descripcion: "Disfruta de un taller de decoración Diseña tu propia torta y disfruta una experiencia deliciosa y creativa. Puedes escoger este plan con o sin brunch. Cupos limitados, reserva con anticipación.",
            imagenUrl: "imagenes/decora-y-disfruta.jpeg"
        }
    ];

    function enlaceWhatsApp(mensaje) {
        return 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + encodeURIComponent(mensaje);
    }

    // CARGAR DATOS DESDE SUPABASE
    async function cargarDatosDesdeSupabase() {
        if (typeof clienteSupabase === 'undefined' || !clienteSupabase) {
            mostrarCatalogoProductos();
            mostrarActividades();
            llenarSelectorActividades();
            return;
        }

        // 1. Consultar Productos en Supabase
        if (document.getElementById('contenedor-productos')) {
            const { data: prodBD, error: errProd } = await clienteSupabase
                .from('productos')
                .select('*')
                .order('id', { ascending: true });

            if (!errProd && prodBD && prodBD.length > 0) {
                inventarioProductos = prodBD.map(function (p) {
                    return {
                        identificador: p.id,
                        nombre: p.nombre,
                        descripcion: p.descripcion,
                        precio: p.precio,
                        imagenUrl: p.imagen_url
                    };
                });
            }
            mostrarCatalogoProductos();
        }

        // 2. Consultar Actividades en Supabase (para actividades.html y contacto.html)
        if (document.getElementById('contenedor-actividades') || document.getElementById('actividad-reserva')) {
            const { data: actBD, error: errAct } = await clienteSupabase
                .from('actividades')
                .select('*')
                .order('id', { ascending: true });

            if (!errAct && actBD && actBD.length > 0) {
                calendarioActividades = actBD.map(function (a) {
                    return {
                        identificador: a.id,
                        titulo: a.titulo,
                        horario: a.horario,
                        descripcion: a.descripcion,
                        imagenUrl: a.imagen_url
                    };
                });
            }
            mostrarActividades();
            llenarSelectorActividades();
        }

        // 3. Consultar Menú en Supabase (para menu.html)
        if (document.querySelector('[data-categoria]')) {
            const { data: menuBD, error: errMenu } = await clienteSupabase
                .from('menu_items')
                .select('*')
                .order('id', { ascending: true });

            if (!errMenu && menuBD && menuBD.length > 0) {
                mostrarMenuDinamico(menuBD);
            }
        }

        // 4. Consultar Fotos del Carrusel en Supabase
        const trackCarrusel = document.getElementById('carrusel-track');
        if (trackCarrusel) {
            const { data: fotosBD, error: errFotos } = await clienteSupabase
                .from('carrusel_fotos')
                .select('*')
                .order('id', { ascending: true });

            if (!errFotos && fotosBD && fotosBD.length > 0) {
                trackCarrusel.textContent = '';
                fotosBD.forEach(function (f) {
                    const img = document.createElement('img');
                    img.src = f.imagen_url;
                    img.alt = f.descripcion || 'El Jardín del Té - Salón';
                    img.className = 'carrusel-img';
                    img.loading = 'lazy';
                    trackCarrusel.appendChild(img);
                });
                trackCarrusel.style.transform = 'translateX(0px)';
            }
        }
    }

    function mostrarCatalogoProductos() {
        const contenedorProductos = document.getElementById('contenedor-productos');
        if (!contenedorProductos) return;

        while (contenedorProductos.firstChild) {
            contenedorProductos.removeChild(contenedorProductos.firstChild);
        }

        inventarioProductos.forEach(function (producto) {
            const tarjetaDiv = document.createElement('div');
            tarjetaDiv.className = 'tarjeta-producto';

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
            etiquetaPrecio.textContent = '$' + Number(producto.precio).toLocaleString('es-CO');
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

    function llenarSelectorActividades() {
        const selector = document.getElementById('actividad-reserva');
        if (!selector) return;

        selector.innerHTML = '';

        const optMesa = document.createElement('option');
        optMesa.value = 'Solo reserva de mesa';
        optMesa.textContent = 'Solo reserva de mesa (Sin actividad)';
        selector.appendChild(optMesa);

        calendarioActividades.forEach(function (actividad) {
            const opcion = document.createElement('option');
            const texto = actividad.titulo + ' (' + actividad.horario + ')';
            opcion.value = texto;
            opcion.textContent = texto;
            selector.appendChild(opcion);
        });

        const optOtro = document.createElement('option');
        optOtro.value = 'Otro';
        optOtro.textContent = 'Otro (Especificar)';
        selector.appendChild(optOtro);
    }

    function mostrarMenuDinamico(itemsBD) {
        const listas = document.querySelectorAll('.lista-menu[data-categoria]');
        if (!listas.length) return;

        listas.forEach(function (ul) {
            const categoria = ul.getAttribute('data-categoria');
            const itemsCategoria = itemsBD.filter(function (item) {
                return item.categoria === categoria;
            });

            if (itemsCategoria.length === 0) return;

            ul.textContent = '';

            itemsCategoria.forEach(function (item) {
                const li = document.createElement('li');
                const span = document.createElement('span');
                span.textContent = item.nombre;

                // Si el detalle tiene opciones separadas por "|" (ej: Pequeño:9000 | Tetera:33000)
                if (item.detalle && item.detalle.includes('|')) {
                    li.className = 'item-bebida';
                    const select = document.createElement('select');
                    select.className = 'selector-tamano';

                    const opciones = item.detalle.split('|');
                    opciones.forEach(function (op) {
                        const partes = op.split(':');
                        const option = document.createElement('option');
                        option.textContent = partes[0].trim();
                        option.value = partes[1] ? partes[1].trim() : item.precio;
                        select.appendChild(option);
                    });

                    const strong = document.createElement('strong');
                    strong.className = 'precio-bebida';
                    const precioInicial = select.options[0] ? select.options[0].value : item.precio;
                    strong.textContent = '$' + Number(precioInicial).toLocaleString('es-CO');

                    li.appendChild(span);
                    li.appendChild(select);
                    li.appendChild(strong);
                } else {
                    if (item.detalle) {
                        span.textContent = item.nombre + ' (' + item.detalle + ')';
                    }
                    const strong = document.createElement('strong');
                    strong.textContent = '$' + Number(item.precio).toLocaleString('es-CO');

                    li.appendChild(span);
                    li.appendChild(strong);
                }

                ul.appendChild(li);
            });
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

        lista.addEventListener('click', function (evento) {
            if (evento.target.tagName === 'A') cerrarMenu();
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 900) cerrarMenu();
        });
    }

    function activarBotonesDeLaPagina() {
        document.body.addEventListener('click', function (evento) {
            const objetivo = evento.target;

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

            if (objetivo.id === 'boton-inicio-logo' || objetivo.closest('#boton-inicio-logo')) {
                window.location.href = 'index.html';
            }
        });

        const formularioReserva = document.getElementById('form-reserva');
        if (formularioReserva) {
            const inputTelefono = document.getElementById('telefono-reserva');
            const inputFecha = document.getElementById('fecha-reserva');
            const selectActividad = document.getElementById('actividad-reserva');
            const contenedorOtra = document.getElementById('contenedor-otra-actividad');
            const inputOtra = document.getElementById('otra-actividad-reserva');

            // 1. Solo números enteros y máximo 10 dígitos
            if (inputTelefono) {
                inputTelefono.addEventListener('input', function () {
                    this.value = this.value.replace(/\D/g, '').slice(0, 10);
                });
            }

            // 2. Bloquear fechas anteriores al día actual (hora local)
            function obtenerFechaHoyLocal() {
                const hoy = new Date();
                const anio = hoy.getFullYear();
                const mes = String(hoy.getMonth() + 1).padStart(2, '0');
                const dia = String(hoy.getDate()).padStart(2, '0');
                return anio + '-' + mes + '-' + dia;
            }

            if (inputFecha) {
                inputFecha.setAttribute('min', obtenerFechaHoyLocal());
            }

            // 3. Mostrar u ocultar el campo extra cuando elige "Otro"
            if (selectActividad && contenedorOtra && inputOtra) {
                selectActividad.addEventListener('change', function () {
                    if (this.value === 'Otro') {
                        contenedorOtra.style.display = 'flex';
                        inputOtra.required = true;
                        inputOtra.focus();
                    } else {
                        contenedorOtra.style.display = 'none';
                        inputOtra.required = false;
                        inputOtra.value = '';
                    }
                });
            }

            // 4. Validación final y envío a WhatsApp
            formularioReserva.addEventListener('submit', function (evento) {
                evento.preventDefault();

                const nombre = document.getElementById('nombre-reserva').value.trim();
                const telefono = inputTelefono.value.trim();
                const fecha = inputFecha.value;
                const personas = document.getElementById('personas-reserva').value;
                const notas = document.getElementById('notas-reserva').value.trim();

                if (!/^\d{10}$/.test(telefono)) {
                    mostrarMensajeFlotante('El teléfono debe tener exactamente 10 dígitos numéricos.');
                    inputTelefono.focus();
                    return;
                }

                if (fecha < obtenerFechaHoyLocal()) {
                    mostrarMensajeFlotante('No puedes seleccionar una fecha anterior a hoy.');
                    inputFecha.focus();
                    return;
                }

                let actividadElegida = selectActividad ? selectActividad.value : 'Solo reserva de mesa';
                if (actividadElegida === 'Otro' && inputOtra) {
                    actividadElegida = 'Otro: ' + inputOtra.value.trim();
                }

                let textoReserva = '¡Hola El Jardín del Té! Quiero reservar:\n\n' +
                    '• *Nombre:* ' + nombre + '\n' +
                    '• *Teléfono:* ' + telefono + '\n' +
                    '• *Fecha:* ' + fecha + '\n' +
                    '• *Personas:* ' + personas + '\n' +
                    '• *Plan / Actividad:* ' + actividadElegida;

                if (notas) {
                    textoReserva += '\n• *Notas:* ' + notas;
                }

                mostrarMensajeFlotante('¡Abriendo WhatsApp para confirmar tu reserva!');
                setTimeout(function () {
                    window.open(enlaceWhatsApp(textoReserva), '_blank');
                    formularioReserva.reset();
                    if (contenedorOtra) contenedorOtra.style.display = 'none';
                    if (inputOtra) inputOtra.required = false;
                }, 1000);
            });
        }
    }

    // ========================================================
    //  PQRS
    // ========================================================

    function generarRadicado() {
        const hoy = new Date();
        const fecha = hoy.getFullYear() +
            String(hoy.getMonth() + 1).padStart(2, '0') +
            String(hoy.getDate()).padStart(2, '0');

        const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let aleatorio = '';
        for (let i = 0; i < 6; i++) {
            aleatorio += letras.charAt(Math.floor(Math.random() * letras.length));
        }
        return 'PQRS-' + fecha + '-' + aleatorio;
    }

    function responderEnFormulario(idElemento, texto, tipo) {
        const caja = document.getElementById(idElemento);
        if (!caja) return;
        caja.textContent = texto;
        caja.className = 'mensaje-formulario ' + (tipo || '');
    }

    function activarFormularioPQRS() {
        const formulario = document.getElementById('form-pqrs');
        if (!formulario) return;

        const boton = document.getElementById('pqrs-enviar');

        formulario.addEventListener('submit', async function (evento) {
            evento.preventDefault();

            if (typeof clienteSupabase === 'undefined' || !clienteSupabase) {
                responderEnFormulario('pqrs-resultado',
                    'No hay conexión con la base de datos. Escríbenos por WhatsApp mientras lo revisamos.', 'error');
                return;
            }

            boton.disabled = true;
            boton.textContent = 'Radicando...';
            responderEnFormulario('pqrs-resultado', '', '');

            const radicado = generarRadicado();
            const solicitud = {
                radicado: radicado,
                tipo: document.getElementById('pqrs-tipo').value,
                nombre: document.getElementById('pqrs-nombre').value.trim(),
                correo: document.getElementById('pqrs-correo').value.trim(),
                telefono: document.getElementById('pqrs-telefono').value.trim() || null,
                mensaje: document.getElementById('pqrs-mensaje').value.trim(),
                autoriza_datos: document.getElementById('pqrs-autoriza').checked
            };

            const { error } = await clienteSupabase.from('pqrs').insert([solicitud]);

            boton.disabled = false;
            boton.textContent = 'Radicar solicitud';

            if (error) {
                responderEnFormulario('pqrs-resultado',
                    'No pudimos radicar tu solicitud. Intenta de nuevo en un momento.', 'error');
                return;
            }

            formulario.reset();
            responderEnFormulario('pqrs-resultado',
                '¡Listo! Tu solicitud quedó radicada con el número ' + radicado +
                '. Guárdalo: con ese número puedes preguntarnos por tu caso.', 'exito');
            mostrarMensajeFlotante('Solicitud radicada: ' + radicado);
        });
    }

    // ========================================================
    //  TRABAJA CON NOSOTROS
    // ========================================================

    const TAMANO_MAXIMO_HV = 5 * 1024 * 1024; // 5 MB

    function rutaParaHojaDeVida(nombreOriginal) {
        const punto = nombreOriginal.lastIndexOf('.');
        const extension = punto > -1 ? nombreOriginal.slice(punto).toLowerCase() : '.pdf';
        const hoy = new Date();
        const carpeta = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
        const unico = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
        return carpeta + '/' + unico + extension;
    }

    function activarFormularioEmpleo() {
        const formulario = document.getElementById('form-empleo');
        if (!formulario) return;

        const boton = document.getElementById('empleo-enviar');
        const campoArchivo = document.getElementById('empleo-archivo');

        formulario.addEventListener('submit', async function (evento) {
            evento.preventDefault();

            if (typeof clienteSupabase === 'undefined' || !clienteSupabase) {
                responderEnFormulario('empleo-resultado',
                    'No hay conexión con la base de datos. Intenta más tarde.', 'error');
                return;
            }

            const archivo = campoArchivo.files[0];
            if (!archivo) {
                responderEnFormulario('empleo-resultado', 'Falta adjuntar tu hoja de vida.', 'error');
                return;
            }

            if (archivo.size > TAMANO_MAXIMO_HV) {
                const pesa = (archivo.size / 1024 / 1024).toFixed(1);
                responderEnFormulario('empleo-resultado',
                    'Tu archivo pesa ' + pesa + ' MB y el máximo son 5 MB. Puedes guardarlo de nuevo en PDF para que pese menos.', 'error');
                return;
            }

            const extensionesOk = ['.pdf', '.doc', '.docx'];
            const nombreMinuscula = archivo.name.toLowerCase();
            const extensionValida = extensionesOk.some(function (ext) {
                return nombreMinuscula.endsWith(ext);
            });
            if (!extensionValida) {
                responderEnFormulario('empleo-resultado',
                    'La hoja de vida debe ser un PDF o un documento de Word.', 'error');
                return;
            }

            boton.disabled = true;
            boton.textContent = 'Enviando...';
            responderEnFormulario('empleo-resultado', 'Subiendo tu hoja de vida...', '');

            const ruta = rutaParaHojaDeVida(archivo.name);
            const { error: errorArchivo } = await clienteSupabase
                .storage
                .from('hojas-de-vida')
                .upload(ruta, archivo, { contentType: archivo.type, upsert: false });

            if (errorArchivo) {
                boton.disabled = false;
                boton.textContent = 'Enviar postulación';
                responderEnFormulario('empleo-resultado',
                    'No pudimos subir tu hoja de vida. Revisa que sea PDF o Word y que pese menos de 5 MB.', 'error');
                return;
            }

            const postulacion = {
                nombre: document.getElementById('empleo-nombre').value.trim(),
                correo: document.getElementById('empleo-correo').value.trim(),
                telefono: document.getElementById('empleo-telefono').value.trim(),
                cargo: document.getElementById('empleo-cargo').value,
                mensaje: document.getElementById('empleo-mensaje').value.trim() || null,
                archivo_ruta: ruta,
                archivo_nombre: archivo.name,
                autoriza_datos: document.getElementById('empleo-autoriza').checked
            };

            const { error: errorDatos } = await clienteSupabase
                .from('postulaciones')
                .insert([postulacion]);

            boton.disabled = false;
            boton.textContent = 'Enviar postulación';

            if (errorDatos) {
                await clienteSupabase.storage.from('hojas-de-vida').remove([ruta]);
                responderEnFormulario('empleo-resultado',
                    'No pudimos guardar tu postulación. Intenta de nuevo en un momento.', 'error');
                return;
            }

            formulario.reset();
            responderEnFormulario('empleo-resultado',
                '¡Gracias! Recibimos tu postulación y tu hoja de vida. Te escribimos si se abre una vacante que encaje contigo.', 'exito');
            mostrarMensajeFlotante('¡Postulación enviada!');
        });
    }

    function iniciarCarrusel() {
        const track = document.getElementById('carrusel-track');
        const botonNext = document.getElementById('carrusel-next');
        const botonPrev = document.getElementById('carrusel-prev');
        if (!track || !botonNext || !botonPrev) return;

        let indiceActual = 0;

        function actualizarPosicionCarrusel() {
            const imagenes = track.children;
            if (!imagenes.length) return;
            if (indiceActual >= imagenes.length) indiceActual = 0;
            const anchoImagen = imagenes[0].getBoundingClientRect().width;
            track.style.transform = 'translateX(-' + (indiceActual * anchoImagen) + 'px)';
        }

        botonNext.addEventListener('click', function () {
            const total = track.children.length;
            if (!total) return;
            indiceActual = (indiceActual + 1) % total;
            actualizarPosicionCarrusel();
        });

        botonPrev.addEventListener('click', function () {
            const total = track.children.length;
            if (!total) return;
            indiceActual = (indiceActual - 1 + total) % total;
            actualizarPosicionCarrusel();
        });

        window.addEventListener('resize', actualizarPosicionCarrusel);
    }

    function activarSelectoresTamano() {
        document.addEventListener('change', function (evento) {
            if (!evento.target.classList.contains('selector-tamano')) return;
            const nuevoPrecio = evento.target.value;
            const contenedorBebida = evento.target.closest('li');
            if (contenedorBebida) {
                const precioElemento = contenedorBebida.querySelector('strong');
                if (precioElemento) {
                    precioElemento.textContent = '$' + Number(nuevoPrecio).toLocaleString('es-CO');
                }
            }
        });
    }

    // LIBRITO INTERACTIVO DEL MENÚ
    function iniciarLibroMenu() {
        const paginas = document.querySelectorAll('.pagina-libro');
        const pestanas = document.querySelectorAll('.pestana-btn');
        const btnPrev = document.getElementById('libro-prev');
        const btnNext = document.getElementById('libro-next');
        const indicador = document.getElementById('libro-indicador');

        if (!paginas.length) return;

        let paginaActual = 0;

        function mostrarPagina(indice) {
            paginaActual = indice;
            paginas.forEach(function (pag, i) {
                pag.classList.toggle('activa', i === paginaActual);
            });
            pestanas.forEach(function (pest, i) {
                pest.classList.toggle('activa', i === paginaActual);
            });
            if (indicador) {
                indicador.textContent = 'Página ' + (paginaActual + 1) + ' de ' + paginas.length;
            }
        }

        pestanas.forEach(function (pestana) {
            pestana.addEventListener('click', function () {
                const indice = parseInt(this.getAttribute('data-pagina'), 10);
                mostrarPagina(indice);
            });
        });

        if (btnNext) {
            btnNext.addEventListener('click', function () {
                const siguiente = (paginaActual + 1) % paginas.length;
                mostrarPagina(siguiente);
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', function () {
                const anterior = (paginaActual - 1 + paginas.length) % paginas.length;
                mostrarPagina(anterior);
            });
        }
    }

    function iniciarPagina() {
        cargarDatosDesdeSupabase();
        iniciarCarrusel();
        iniciarLibroMenu();
        activarMenuResponsive();
        activarBotonesDeLaPagina();
        activarSelectoresTamano();
        activarFormularioPQRS();
        activarFormularioEmpleo();
    }

    document.addEventListener('DOMContentLoaded', iniciarPagina);
})();