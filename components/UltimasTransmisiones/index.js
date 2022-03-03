import transmisionesStyles from "./transmisiones.module.scss"
import Transmision from "../TransmisionCard"
import Link from "next/link"

const UltimasTransmisiones = ({ transmisiones }) => {

    return (
        <section aria-label="Últimas transmisiones" className={transmisionesStyles.ultimasTransmisiones}>
            {/* Header */}
            <header>
                <h1 >Últimas transmisiones</h1>
                <Link href="/transmisiones">
                    <a className={transmisionesStyles.verTodas}>
                        Ver todas
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z"></path></svg>
                    </a>
                </Link>
            </header>
            {/* Transmisiones */}
            <div className={transmisionesStyles.transmisiones}>
                {transmisiones.map((transmision) =>(
                    <Transmision key={transmision.id} transmision={transmision}/>
                ))}
            </div>
        </section>
    );
}
 
export default UltimasTransmisiones;