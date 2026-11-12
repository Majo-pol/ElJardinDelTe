// El cartelito flotante de abajo a la derecha.
// Sólo pinta lo que le llega por props: quien decide cuándo aparece y
// cuándo se va es App.
function Notificacion({ mensaje, visible }) {
    return (
        <div
            className={visible ? 'notificacion-flotante visible' : 'notificacion-flotante'}
            role="status"
            aria-live="polite"
        >
            {mensaje}
        </div>
    );
}

export default Notificacion;
