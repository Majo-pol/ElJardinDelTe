(function () {
    'use strict';

    const seccionLogin = document.getElementById('seccion-login');
    const seccionPanel = document.getElementById('seccion-panel');
    const btnCerrar = document.getElementById('btn-cerrar-sesion');
    const errorLogin = document.getElementById('error-login');

    let editandoProdId = null;
    let editandoActId = null;
    let editandoMenuId = null;
    let itemsMenuCache = [];
    let diapoActual = 0;

    function notificar(texto) {
        const n = document.getElementById('notificacion');
        n.textContent = texto;
        n.classList.add('visible');
        setTimeout(function () { n.classList.remove('visible'); }, 3000);
    }

    function formatoCOP(valor) {
        const num = parseInt(valor, 10);
        return isNaN(num) ? '$0' : '$' + num.toLocaleString('es-CO');
    }

    function fechaBonita(valor) {
        if (!valor) return '';
        return new Date(valor).toLocaleString('es-CO', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    function normalizarTexto(texto) {
        return (texto || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    // ====================================================
    //  NAVEGACIÓN POR DIAPOSITIVAS
    // ====================================================
    const diapositivas = document.querySelectorAll('.diapositiva-admin');
    const tabs = document.querySelectorAll('.diapo-tab');
    const indicadorDiapo = document.getElementById('diapo-indicador');

    function irADiapositiva(indice) {
        diapoActual = indice;
        diapositivas.forEach(function (d, i) {
            d.classList.toggle('activa', i === diapoActual);
        });
        tabs.forEach(function (t, i) {
            t.classList.toggle('activa', i === diapoActual);
        });
        indicadorDiapo.textContent = 'Diapositiva ' + (diapoActual + 1) + ' de ' + diapositivas.length;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            irADiapositiva(parseInt(this.getAttribute('data-diapo'), 10));
        });
    });

    document.getElementById('diapo-prev').addEventListener('click', function () {
        irADiapositiva((diapoActual - 1 + diapositivas.length) % diapositivas.length);
    });

    document.getElementById('diapo-next').addEventListener('click', function () {
        irADiapositiva((diapoActual + 1) % diapositivas.length);
    });

    // ====================================================
    //  VISTAS PREVIAS EN VIVO
    // ====================================================
    function actualizarPreviaProducto() {
        document.getElementById('prev-prod-nombre').textContent =
            document.getElementById('prod-nombre').value.trim() || 'Nombre de tu producto';
        document.getElementById('prev-prod-desc').textContent =
            document.getElementById('prod-desc').value.trim() || 'Aquí aparecerá la descripción apetitosa que escribas para tus clientes.';
        document.getElementById('prev-prod-precio').textContent =
            formatoCOP(document.getElementById('prod-precio').value);
        const urlImg = document.getElementById('prod-img').value.trim();
        document.getElementById('prev-prod-img').src = urlImg || 'imagenes/producto-01.jpg';
    }

    function actualizarPreviaActividad() {
        document.getElementById('prev-act-titulo').textContent =
            document.getElementById('act-titulo').value.trim() || 'Título del taller';
        document.getElementById('prev-act-horario').textContent =
            document.getElementById('act-horario').value.trim() || 'Fecha por definir';
        document.getElementById('prev-act-desc').textContent =
            document.getElementById('act-desc').value.trim() || 'Aquí verás los detalles de tu actividad tal como los leerán los clientes.';
        const urlImg = document.getElementById('act-img').value.trim();
        document.getElementById('prev-act-img').src = urlImg || 'imagenes/actividad-01.jpg';
    }

    function actualizarPreviaMenu() {
        document.getElementById('prev-menu-categoria').textContent =
            document.getElementById('menu-categoria').value;
        document.getElementById('prev-menu-nombre').textContent =
            document.getElementById('menu-nombre').value.trim() || 'Nombre del producto';
        document.getElementById('prev-menu-detalle').textContent =
            document.getElementById('menu-detalle').value.trim();
        document.getElementById('prev-menu-precio').textContent =
            formatoCOP(document.getElementById('menu-precio').value);
    }

    ['prod-nombre', 'prod-desc', 'prod-precio', 'prod-img'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', actualizarPreviaProducto);
    });
    ['act-titulo', 'act-horario', 'act-desc', 'act-img'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', actualizarPreviaActividad);
    });
    ['menu-categoria', 'menu-nombre', 'menu-detalle', 'menu-precio'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', actualizarPreviaMenu);
        document.getElementById(id).addEventListener('change', actualizarPreviaMenu);
    });

    // ====================================================
    //  CRUD: PRODUCTOS, ACTIVIDADES Y MENÚ
    // ====================================================
    function crearFilaAdmin(textoPrincipal, alEditar, alBorrar) {
        const fila = document.createElement('div');
        fila.className = 'admin-item-fila';

        const texto = document.createElement('span');
        texto.textContent = textoPrincipal;

        const acciones = document.createElement('div');
        acciones.className = 'admin-item-acciones';

        const btnEd = document.createElement('button');
        btnEd.type = 'button';
        btnEd.className = 'btn-mini btn-mini-editar';
        btnEd.textContent = 'Editar';
        btnEd.onclick = alEditar;

        const btnDel = document.createElement('button');
        btnDel.type = 'button';
        btnDel.className = 'btn-mini btn-mini-borrar';
        btnDel.textContent = 'Eliminar';
        btnDel.onclick = alBorrar;

        acciones.appendChild(btnEd);
        acciones.appendChild(btnDel);
        fila.appendChild(texto);
        fila.appendChild(acciones);
        return fila;
    }

    async function cargarListasAdmin() {
        const listaProd = document.getElementById('lista-admin-productos');
        listaProd.textContent = '';
        const { data: prods } = await clienteSupabase.from('productos').select('*').order('id');
        if (prods) {
            prods.forEach(function (p) {
                const fila = crearFilaAdmin(
                    p.nombre + ' (' + formatoCOP(p.precio) + ')',
                    function () {
                        editandoProdId = p.id;
                        document.getElementById('prod-nombre').value = p.nombre || '';
                        document.getElementById('prod-desc').value = p.descripcion || '';
                        document.getElementById('prod-precio').value = p.precio || '';
                        document.getElementById('prod-img').value = p.imagen_url || '';
                        document.getElementById('btn-submit-prod').textContent = 'Actualizar Producto';
                        document.getElementById('btn-cancelar-prod').style.display = 'inline-block';
                        actualizarPreviaProducto();
                        window.scrollTo({ top: 140, behavior: 'smooth' });
                    },
                    async function () {
                        if (!confirm('¿Eliminar "' + p.nombre + '"?')) return;
                        await clienteSupabase.from('productos').delete().eq('id', p.id);
                        notificar('Producto eliminado');
                        cargarListasAdmin();
                    }
                );
                listaProd.appendChild(fila);
            });
        }

        const listaAct = document.getElementById('lista-admin-actividades');
        listaAct.textContent = '';
        const { data: acts } = await clienteSupabase.from('actividades').select('*').order('id');
        if (acts) {
            acts.forEach(function (a) {
                const fila = crearFilaAdmin(
                    a.titulo + ' — ' + a.horario,
                    function () {
                        editandoActId = a.id;
                        document.getElementById('act-titulo').value = a.titulo || '';
                        document.getElementById('act-horario').value = a.horario || '';
                        document.getElementById('act-desc').value = a.descripcion || '';
                        document.getElementById('act-img').value = a.imagen_url || '';
                        document.getElementById('btn-submit-act').textContent = 'Actualizar Actividad';
                        document.getElementById('btn-cancelar-act').style.display = 'inline-block';
                        actualizarPreviaActividad();
                        window.scrollTo({ top: 140, behavior: 'smooth' });
                    },
                    async function () {
                        if (!confirm('¿Eliminar "' + a.titulo + '"?')) return;
                        await clienteSupabase.from('actividades').delete().eq('id', a.id);
                        notificar('Actividad eliminada');
                        cargarListasAdmin();
                    }
                );
                listaAct.appendChild(fila);
            });
        }

        cargarListaMenu();
    }

    async function cargarListaMenu() {
        const { data, error } = await clienteSupabase
            .from('menu_items')
            .select('*')
            .order('categoria', { ascending: true })
            .order('id', { ascending: true });

        const contenedor = document.getElementById('lista-admin-menu');
        if (error) {
            contenedor.textContent = 'Ejecuta el script SQL de menu_items en Supabase para activar la edición del menú.';
            return;
        }
        itemsMenuCache = data || [];
        pintarListaMenu();
    }

    function pintarListaMenu() {
        const contenedor = document.getElementById('lista-admin-menu');
        const filtro = document.getElementById('filtro-menu-admin').value;
        const inputBuscador = document.getElementById('buscador-menu-admin');
        const termino = normalizarTexto(inputBuscador ? inputBuscador.value.trim() : '');
        contenedor.textContent = '';

        const filtrados = itemsMenuCache.filter(function (item) {
            const coincideCategoria = (filtro === 'Todas') || (item.categoria === filtro);
            if (!coincideCategoria) return false;

            if (!termino) return true;
            const textoItem = normalizarTexto(item.nombre + ' ' + (item.detalle || '') + ' ' + item.categoria);
            return textoItem.includes(termino);
        });

        if (filtrados.length === 0) {
            const vacio = document.createElement('p');
            vacio.style.color = 'var(--texto-suave)';
            vacio.textContent = termino
                ? 'No se encontraron productos que coincidan con "' + inputBuscador.value.trim() + '".'
                : 'Aún no hay productos guardados en esta categoría.';
            contenedor.appendChild(vacio);
            return;
        }

        filtrados.forEach(function (item) {
            const etiqueta = '[' + item.categoria + '] ' + item.nombre +
                (item.detalle ? ' (' + item.detalle + ')' : '') + ' — ' + formatoCOP(item.precio);

            const fila = crearFilaAdmin(
                etiqueta,
                function () {
                    editandoMenuId = item.id;
                    document.getElementById('menu-categoria').value = item.categoria;
                    document.getElementById('menu-nombre').value = item.nombre;
                    document.getElementById('menu-detalle').value = item.detalle || '';
                    document.getElementById('menu-precio').value = item.precio;
                    document.getElementById('btn-submit-menu').textContent = 'Actualizar en Menú';
                    document.getElementById('btn-cancelar-menu').style.display = 'inline-block';
                    actualizarPreviaMenu();
                    window.scrollTo({ top: 140, behavior: 'smooth' });
                },
                async function () {
                    if (!confirm('¿Quitar "' + item.nombre + '" del menú?')) return;
                    await clienteSupabase.from('menu_items').delete().eq('id', item.id);
                    notificar('Eliminado del menú');
                    cargarListaMenu();
                }
            );
            contenedor.appendChild(fila);
        });
    }

    document.getElementById('filtro-menu-admin').addEventListener('change', pintarListaMenu);
    document.getElementById('buscador-menu-admin').addEventListener('input', pintarListaMenu);

    function resetearFormProd() {
        editandoProdId = null;
        document.getElementById('form-nuevo-producto').reset();
        document.getElementById('btn-submit-prod').textContent = 'Guardar Producto';
        document.getElementById('btn-cancelar-prod').style.display = 'none';
        actualizarPreviaProducto();
    }

    function resetearFormAct() {
        editandoActId = null;
        document.getElementById('form-nueva-actividad').reset();
        document.getElementById('btn-submit-act').textContent = 'Guardar Actividad';
        document.getElementById('btn-cancelar-act').style.display = 'none';
        actualizarPreviaActividad();
    }

    function resetearFormMenu() {
        editandoMenuId = null;
        document.getElementById('form-nuevo-menu').reset();
        document.getElementById('btn-submit-menu').textContent = 'Agregar al Menú';
        document.getElementById('btn-cancelar-menu').style.display = 'none';
        actualizarPreviaMenu();
    }

    document.getElementById('btn-cancelar-prod').addEventListener('click', resetearFormProd);
    document.getElementById('btn-cancelar-act').addEventListener('click', resetearFormAct);
    document.getElementById('btn-cancelar-menu').addEventListener('click', resetearFormMenu);

    document.getElementById('form-nuevo-producto').addEventListener('submit', async function (e) {
        e.preventDefault();
        const datos = {
            nombre: document.getElementById('prod-nombre').value.trim(),
            descripcion: document.getElementById('prod-desc').value.trim(),
            precio: parseInt(document.getElementById('prod-precio').value, 10),
            imagen_url: document.getElementById('prod-img').value.trim()
        };
        const res = editandoProdId
            ? await clienteSupabase.from('productos').update(datos).eq('id', editandoProdId)
            : await clienteSupabase.from('productos').insert([datos]);

        if (!res.error) {
            notificar(editandoProdId ? '¡Producto actualizado!' : '¡Producto guardado!');
            resetearFormProd();
            cargarListasAdmin();
        } else {
            notificar('Error al guardar: ' + res.error.message);
        }
    });

    document.getElementById('form-nueva-actividad').addEventListener('submit', async function (e) {
        e.preventDefault();
        const datos = {
            titulo: document.getElementById('act-titulo').value.trim(),
            horario: document.getElementById('act-horario').value.trim(),
            descripcion: document.getElementById('act-desc').value.trim(),
            imagen_url: document.getElementById('act-img').value.trim()
        };
        const res = editandoActId
            ? await clienteSupabase.from('actividades').update(datos).eq('id', editandoActId)
            : await clienteSupabase.from('actividades').insert([datos]);

        if (!res.error) {
            notificar(editandoActId ? '¡Actividad actualizada!' : '¡Actividad guardada!');
            resetearFormAct();
            cargarListasAdmin();
        } else {
            notificar('Error al guardar: ' + res.error.message);
        }
    });

    document.getElementById('form-nuevo-menu').addEventListener('submit', async function (e) {
        e.preventDefault();
        const datos = {
            categoria: document.getElementById('menu-categoria').value,
            nombre: document.getElementById('menu-nombre').value.trim(),
            detalle: document.getElementById('menu-detalle').value.trim() || null,
            precio: parseInt(document.getElementById('menu-precio').value, 10)
        };
        const res = editandoMenuId
            ? await clienteSupabase.from('menu_items').update(datos).eq('id', editandoMenuId)
            : await clienteSupabase.from('menu_items').insert([datos]);

        if (!res.error) {
            notificar(editandoMenuId ? '¡Ítem del menú actualizado!' : '¡Agregado al menú!');
            resetearFormMenu();
            cargarListaMenu();
        } else {
            notificar('Error al guardar: ' + res.error.message);
        }
    });

    // ====================================================
    //  BUZÓN: PQRS Y POSTULACIONES
    // ====================================================
    function filaPlegable(titulo, subtitulo) {
        const caja = document.createElement('details');
        caja.className = 'tarjeta-solicitud';
        const resumen = document.createElement('summary');

        const fuerte = document.createElement('strong');
        fuerte.textContent = titulo;
        resumen.appendChild(fuerte);

        const menor = document.createElement('span');
        menor.className = 'solicitud-meta';
        menor.textContent = subtitulo;
        resumen.appendChild(menor);

        caja.appendChild(resumen);
        return caja;
    }

    function lineaDato(etiqueta, valor) {
        const p = document.createElement('p');
        const b = document.createElement('strong');
        b.textContent = etiqueta + ': ';
        p.appendChild(b);
        p.appendChild(document.createTextNode(valor || '—'));
        return p;
    }

    async function cargarPQRS() {
        const contenedor = document.getElementById('lista-admin-pqrs');
        const contador = document.getElementById('contador-pqrs');
        contenedor.textContent = '';

        const { data, error } = await clienteSupabase
            .from('pqrs')
            .select('*')
            .order('creado_en', { ascending: false });

        if (error) {
            contador.textContent = 'No se pudo cargar PQRS.';
            return;
        }
        if (!data || data.length === 0) {
            contador.textContent = 'Todavía no hay solicitudes.';
            return;
        }

        const pendientes = data.filter(function (s) { return s.estado === 'Recibida'; }).length;
        contador.textContent = data.length + ' en total · ' + pendientes + ' sin atender';

        data.forEach(function (s) {
            const caja = filaPlegable(
                s.tipo + ' — ' + s.nombre,
                s.radicado + ' · ' + fechaBonita(s.creado_en) +
                (s.estado === 'Recibida' ? ' · SIN ATENDER' : ' · Atendida')
            );

            caja.appendChild(lineaDato('Correo', s.correo));
            caja.appendChild(lineaDato('Teléfono', s.telefono));

            const mensaje = document.createElement('p');
            mensaje.className = 'solicitud-mensaje';
            mensaje.textContent = s.mensaje;
            caja.appendChild(mensaje);

            if (s.estado === 'Recibida') {
                const btn = document.createElement('button');
                btn.textContent = 'Marcar como atendida';
                btn.className = 'etiqueta-sitio';
                btn.style.cursor = 'pointer';
                btn.style.border = 'none';
                btn.onclick = async function () {
                    btn.disabled = true;
                    const { error: err } = await clienteSupabase
                        .from('pqrs')
                        .update({ estado: 'Atendida' })
                        .eq('id', s.id);
                    if (err) {
                        btn.disabled = false;
                        notificar('No se pudo actualizar');
                        return;
                    }
                    notificar('PQRS ' + s.radicado + ' marcada como atendida');
                    cargarPQRS();
                };
                caja.appendChild(btn);
            }
            contenedor.appendChild(caja);
        });
    }

    async function cargarPostulaciones() {
        const contenedor = document.getElementById('lista-admin-postulaciones');
        const contador = document.getElementById('contador-postulaciones');
        contenedor.textContent = '';

        const { data, error } = await clienteSupabase
            .from('postulaciones')
            .select('*')
            .order('creado_en', { ascending: false });

        if (error) {
            contador.textContent = 'No se pudo cargar postulaciones.';
            return;
        }
        if (!data || data.length === 0) {
            contador.textContent = 'Todavía no hay postulaciones.';
            return;
        }

        contador.textContent = data.length + ' postulación(es)';

        data.forEach(function (p) {
            const caja = filaPlegable(p.nombre + ' — ' + p.cargo, fechaBonita(p.creado_en));
            caja.appendChild(lineaDato('Correo', p.correo));
            caja.appendChild(lineaDato('Teléfono', p.telefono));

            if (p.mensaje) {
                const mensaje = document.createElement('p');
                mensaje.className = 'solicitud-mensaje';
                mensaje.textContent = p.mensaje;
                caja.appendChild(mensaje);
            }

            if (p.archivo_ruta) {
                const btn = document.createElement('button');
                btn.textContent = 'Abrir hoja de vida';
                btn.className = 'etiqueta-sitio';
                btn.style.cursor = 'pointer';
                btn.style.border = 'none';
                btn.onclick = async function () {
                    btn.disabled = true;
                    const { data: firmado, error: errFirma } = await clienteSupabase
                        .storage
                        .from('hojas-de-vida')
                        .createSignedUrl(p.archivo_ruta, 60);
                    btn.disabled = false;
                    if (errFirma || !firmado) {
                        notificar('No se pudo abrir el archivo');
                        return;
                    }
                    window.open(firmado.signedUrl, '_blank', 'noopener');
                };
                caja.appendChild(btn);

                const nombreArchivo = document.createElement('span');
                nombreArchivo.className = 'solicitud-meta';
                nombreArchivo.textContent = ' ' + (p.archivo_nombre || '');
                caja.appendChild(nombreArchivo);
            }
            contenedor.appendChild(caja);
        });
    }

    // ====================================================
    //  CARRUSEL: CONOCE EL SALÓN
    // ====================================================
    const inputCarruselArchivo = document.getElementById('carrusel-archivo');
    const inputCarruselUrl = document.getElementById('carrusel-url');
    const inputCarruselDesc = document.getElementById('carrusel-desc');
    const prevCarruselImg = document.getElementById('prev-carrusel-img');
    const prevCarruselDesc = document.getElementById('prev-carrusel-desc');

    function actualizarPreviaCarrusel() {
        if (prevCarruselDesc) {
            prevCarruselDesc.textContent = inputCarruselDesc.value.trim() ||
                'Aquí verás el encuadre de tu foto en el carrusel del salón.';
        }
        if (inputCarruselArchivo && inputCarruselArchivo.files && inputCarruselArchivo.files[0]) {
            prevCarruselImg.src = URL.createObjectURL(inputCarruselArchivo.files[0]);
            return;
        }
        if (inputCarruselUrl && inputCarruselUrl.value.trim()) {
            prevCarruselImg.src = inputCarruselUrl.value.trim();
        } else {
            prevCarruselImg.src = 'imagenes/logo.jpg';
        }
    }

    if (inputCarruselArchivo) inputCarruselArchivo.addEventListener('change', actualizarPreviaCarrusel);
    if (inputCarruselUrl) inputCarruselUrl.addEventListener('input', actualizarPreviaCarrusel);
    if (inputCarruselDesc) inputCarruselDesc.addEventListener('input', actualizarPreviaCarrusel);

    async function cargarListaCarrusel() {
        const contenedor = document.getElementById('lista-admin-carrusel');
        if (!contenedor) return;
        contenedor.textContent = '';

        const { data, error } = await clienteSupabase
            .from('carrusel_fotos')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            contenedor.textContent = 'Ejecuta el script SQL de carrusel_fotos en Supabase para activar esta sección.';
            return;
        }
        if (!data || data.length === 0) {
            const vacio = document.createElement('p');
            vacio.style.color = 'var(--texto-suave)';
            vacio.textContent = 'Aún no has subido fotos desde el panel (se muestran las fotos por defecto).';
            contenedor.appendChild(vacio);
            return;
        }

        data.forEach(function (foto) {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-miniatura-admin';

            const img = document.createElement('img');
            img.src = foto.imagen_url;
            img.alt = foto.descripcion || 'Foto del salón';

            const pie = document.createElement('div');
            pie.className = 'tarjeta-miniatura-pie';

            const texto = document.createElement('span');
            texto.textContent = foto.descripcion || 'Sin descripción';

            const btnDel = document.createElement('button');
            btnDel.type = 'button';
            btnDel.className = 'btn-mini btn-mini-borrar';
            btnDel.textContent = 'Eliminar foto';
            btnDel.onclick = async function () {
                if (!confirm('¿Quitar esta foto del carrusel?')) return;
                if (foto.archivo_ruta) {
                    await clienteSupabase.storage.from('galeria-salon').remove([foto.archivo_ruta]);
                }
                await clienteSupabase.from('carrusel_fotos').delete().eq('id', foto.id);
                notificar('Foto eliminada del carrusel');
                cargarListaCarrusel();
            };

            pie.appendChild(texto);
            pie.appendChild(btnDel);
            tarjeta.appendChild(img);
            tarjeta.appendChild(pie);
            contenedor.appendChild(tarjeta);
        });
    }

    const formCarrusel = document.getElementById('form-nueva-foto-carrusel');
    if (formCarrusel) {
        formCarrusel.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = document.getElementById('btn-submit-carrusel');
            const archivo = inputCarruselArchivo.files[0];
            let imagenUrlFinal = inputCarruselUrl.value.trim();
            let archivoRuta = null;

            if (!archivo && !imagenUrlFinal) {
                notificar('Selecciona una imagen o pega una ruta/URL.');
                return;
            }

            btn.disabled = true;
            btn.textContent = 'Subiendo...';

            if (archivo) {
                const punto = archivo.name.lastIndexOf('.');
                const ext = punto > -1 ? archivo.name.slice(punto).toLowerCase() : '.jpg';
                archivoRuta = 'salon-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7) + ext;

                const { error: errUpload } = await clienteSupabase
                    .storage
                    .from('galeria-salon')
                    .upload(archivoRuta, archivo, { contentType: archivo.type, upsert: false });

                if (errUpload) {
                    btn.disabled = false;
                    btn.textContent = 'Agregar al Carrusel';
                    notificar('Error al subir imagen: ' + errUpload.message);
                    return;
                }

                const { data: urlPublica } = clienteSupabase
                    .storage
                    .from('galeria-salon')
                    .getPublicUrl(archivoRuta);

                imagenUrlFinal = urlPublica.publicUrl;
            }

            const { error } = await clienteSupabase.from('carrusel_fotos').insert([{
                imagen_url: imagenUrlFinal,
                descripcion: inputCarruselDesc.value.trim(),
                archivo_ruta: archivoRuta
            }]);

            btn.disabled = false;
            btn.textContent = 'Agregar al Carrusel';

            if (!error) {
                notificar('¡Foto agregada al carrusel!');
                formCarrusel.reset();
                actualizarPreviaCarrusel();
                cargarListaCarrusel();
            } else {
                notificar('Error al guardar: ' + error.message);
            }
        });
    }

    // ====================================================
    //  SESIÓN Y ARRANQUE
    // ====================================================
    function mostrarPanelAdmin() {
        seccionLogin.style.display = 'none';
        seccionPanel.style.display = 'block';
        btnCerrar.style.display = 'inline';
        cargarListasAdmin();
        cargarPQRS();
        cargarPostulaciones();
        cargarListaCarrusel();
    }

    document.getElementById('form-login-admin').addEventListener('submit', async function (e) {
        e.preventDefault();
        errorLogin.textContent = '';
        const email = document.getElementById('email-admin').value;
        const password = document.getElementById('password-admin').value;

        const { error } = await clienteSupabase.auth.signInWithPassword({ email, password });
        if (error) {
            errorLogin.textContent = 'Correo o contraseña incorrectos.';
        } else {
            mostrarPanelAdmin();
        }
    });

    btnCerrar.addEventListener('click', async function (e) {
        e.preventDefault();
        await clienteSupabase.auth.signOut();
        location.reload();
    });

    document.getElementById('boton-inicio-logo').addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    document.addEventListener('DOMContentLoaded', async function () {
        const { data: { session } } = await clienteSupabase.auth.getSession();
        if (session) {
            mostrarPanelAdmin();
        }
    });
})();