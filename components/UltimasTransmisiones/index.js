import transmisionesStyles from "./transmisiones.module.scss"
import Link from "next/link"
import Image from 'next/image'
import { useEffect } from "react"

const UltimasTransmisiones = ({ transmisiones }) => {

    useEffect(()=>{
        console.log(transmisiones)
    },[])

    return (
        <section className={transmisionesStyles.ultimasTransmisiones}>
            {/* Header */}
            <header>
                <h1 >Últimas transmisiones</h1>
                <Link href="/transmisiones">
                    <a className={transmisionesStyles.verTodas}>Ver todas</a>
                </Link>
            </header>
            {/* Transmisiones */}
            <div className={transmisionesStyles.transmisiones}>

            </div>
        </section>
    );
}
 
export default UltimasTransmisiones;