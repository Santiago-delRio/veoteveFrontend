import transmisionStyles from "./transmision.module.scss"
import Link from "next/link"
import Image from 'next/image'

const Transmision = ({transmision}) => {
    return (
        <>
           <Link href={`/transmisiones/${transmision.attributes.slug}`}>
                <a className={transmisionStyles.transmision}>
                    <div className={transmisionStyles.portadaContainer}>
                        <Image src={transmision.attributes.portada.data.attributes.url} alt="Portada de una transmision pasada de veoteve" layout={'fill'} objectFit={'cover'} quality="75" sizes="50vw"/>
                        <div className={transmisionStyles.filtroPortada}></div>
                        <div className={transmisionStyles.btnPlay}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={transmisionStyles.trianguloPlay} width="80" height="80" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#597e8d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M7 4v16l13 -8z" />
                            </svg>
                        </div>
                    </div>
                    <div className={transmisionStyles.infoTransmision}>
                        <h2 className={transmisionStyles.titulo}>{transmision.attributes.titulo}</h2>
                        <span className={transmisionStyles.fecha}>{transmision.attributes.fecha}</span>
                    </div>
                </a>
            </Link> 
        </>
    );
}
 
export default Transmision;