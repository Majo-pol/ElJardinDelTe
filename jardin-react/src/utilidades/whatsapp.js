import { NUMERO_WHATSAPP } from '../datos/sitio.js';

// Arma el enlace de WhatsApp con el mensaje ya codificado.
// encodeURIComponent es lo que hace que los acentos, los saltos de
// línea y los asteriscos de negrita lleguen bien al chat.
export function enlaceWhatsApp(mensaje) {
    return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

export function abrirWhatsApp(mensaje, demoraMs = 800) {
    setTimeout(() => {
        window.open(enlaceWhatsApp(mensaje), '_blank', 'noopener');
    }, demoraMs);
}
