// DATOS DEL SITIO
// Todo lo que cambia con el tiempo vive aquí, separado de los
// componentes: así actualizar un precio o agregar un taller es tocar
// este archivo y no andar buscando entre el HTML.

// Número de WhatsApp de la cafetería (con el código 57 de Colombia)
export const NUMERO_WHATSAPP = '573115811518';

export const CONTACTO = {
    direccion: 'Bogotá, Colombia (Chapinero). Calle 71 # 11-12',
    horarioSemana: '11:00 AM – 8:00 PM',
    horarioFinDeSemana: '10:00 AM – 7:00 PM',
    mapa: 'https://www.google.com/maps/place/El+Jard%C3%ADn+del+T%C3%A9+-+Quinta+Camacho/@4.6566023,-74.0596281,17z/data=!4m7!3m6!1s0x8e3f91671d221c93:0x9432e3e3e0ce7391!8m2!3d4.6566023!4d-74.0596281!10e1!16s%2Fg%2F11ng6lbdtq'
};

export const ENLACES_MENU = [
    { href: '#inicio', texto: 'Inicio' },
    { href: '#nosotros', texto: 'Acerca de Nosotros' },
    { href: '#catalogo', texto: 'Productos Destacados' },
    { href: '#menu', texto: 'Menú' },
    { href: '#actividades', texto: 'Actividades' },
    { href: '#reservas', texto: 'Contáctanos / Reserva' },
    { href: '#redes', texto: 'Nuestras Redes' }
];

export const FOTOS_SALON = [
    { src: 'imagenes/salon-01.jpg', alt: 'Salón con flores colgantes del techo y mesas ocupadas' },
    { src: 'imagenes/salon-02.jpg', alt: 'Vista del salón hacia la entrada, con el techo florido' },
    { src: 'imagenes/salon-03.jpg', alt: 'Mesas junto al ventanal con vista a la calle' },
    { src: 'imagenes/salon-04.jpg', alt: 'Mesa servida con platos para compartir' },
    { src: 'imagenes/salon-05.jpg', alt: 'Detalle de la decoración artesanal sobre una mesa pintada a mano' },
    { src: 'imagenes/salon-06.jpg', alt: 'Las flores colgantes iluminadas de noche' }
];

// PRODUCTOS DESTACADOS (consumo en mesa)
export const PRODUCTOS = [
    {
        id: 1,
        nombre: 'Producto 1',
        descripcion: 'Descripción del producto 1.',
        precio: 0,
        imagen: 'imagenes/producto-01.jpg'
    },
    {
        id: 2,
        nombre: 'Producto 2',
        descripcion: 'Descripción del producto 2.',
        precio: 0,
        imagen: 'imagenes/producto-02.jpg'
    },
    {
        id: 3,
        nombre: 'Producto 3',
        descripcion: 'Descripción del producto 3.',
        precio: 0,
        imagen: 'imagenes/producto-03.jpg'
    }
];

// MENÚ EN MESA, por categorías
export const CATEGORIAS_MENU = [
    {
        titulo: 'Infusiones, Tés y Bebidas',
        platos: [
            { nombre: 'Producto 1', precio: 0 },
            { nombre: 'Producto 2', precio: 0 },
            { nombre: 'Producto 3', precio: 0 },
            { nombre: 'Producto 4', precio: 0 }
        ]
    },
    {
        titulo: 'Postres y Empanadas Horneadas',
        platos: [
            { nombre: 'Producto 5', precio: 0 },
            { nombre: 'Producto 6', precio: 0 },
            { nombre: 'Producto 7', precio: 0 },
            { nombre: 'Producto 8', precio: 0 }
        ]
    }
];

// TALLERES Y ACTIVIDADES CREATIVAS
export const ACTIVIDADES = [
    {
        id: 1,
        titulo: 'Actividad 1',
        horario: 'Sábados - 4:00 PM',
        descripcion: 'Descripción de la actividad 1.',
        imagen: 'imagenes/actividad-01.jpg'
    },
    {
        id: 2,
        titulo: 'Actividad 2',
        horario: 'Domingos - 3:00 PM',
        descripcion: 'Descripción de la actividad 2.',
        imagen: 'imagenes/actividad-02.jpg'
    },
    {
        id: 3,
        titulo: 'Actividad 3',
        horario: 'Jueves - 6:00 PM',
        descripcion: 'Descripción de la actividad 3.',
        imagen: 'imagenes/actividad-03.jpg'
    }
];

export const REDES = [
    { nombre: 'Instagram', url: 'https://www.instagram.com/el_jardin_del_te/?hl=es' },
    { nombre: 'TikTok', url: 'https://tiktok.com' },
    { nombre: 'WhatsApp', url: `https://wa.me/${NUMERO_WHATSAPP}` },
    { nombre: 'Reseñas Google', url: 'https://share.google/7ezLyxmduYvV16g8F' }
];
