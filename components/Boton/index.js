import botonStyles from "./boton.module.scss"

const Boton = ({ onClick, texto }) => {
    return (
        <>
            <button className={botonStyles.boton} onClick={onClick}> { texto } </button>
        </>
    );
}
 
export default Boton;