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
                {transmisiones.map((transmision) =>(
                    <Link key={transmision.id} href={`/transmisiones/${transmision.attributes.slug}`}>
                        <a className={transmisionesStyles.transmision}>
                            <div className={transmisionesStyles.portadaContainer}>
                                <Image src={transmision.attributes.portada.data.attributes.url} alt="Portada de una transmision pasada de veoteve" layout={'fill'} objectFit={'cover'} quality="90" />
                                <div className={transmisionesStyles.filtroPortada}></div>
                                <div className={transmisionesStyles.btnPlay}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={transmisionesStyles.trianguloPlay} width="80" height="80" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#597e8d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M7 4v16l13 -8z" />
                                    </svg>
                                </div>
                            </div>
                            <div className={transmisionesStyles.infoTransmision}>
                                <h2 className={transmisionesStyles.titulo}>{transmision.attributes.titulo}</h2>
                                <span className={transmisionesStyles.fecha}>{transmision.attributes.fecha}</span>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>
        </section>
    );
}
 
export default UltimasTransmisiones;