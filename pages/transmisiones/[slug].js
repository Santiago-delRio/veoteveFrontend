import { useEffect, useState } from "react";
import transmisionStyles from "./transmision.module.scss"
import Link from "next/link"
import Image from 'next/image'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import NuestrosProgramas from '../../components/NuestrosProgramas';
import TransmisionCard from '../../components/TransmisionCard'
import Boton from '../../components/Boton'
import { useRouter } from "next/router";
const ReactPlayer = dynamic(() => import('react-player/youtube'))

const Transmision = ({ transmision, transmisiones, programas }) => {

    const router = useRouter()
    
    const [cantTransmisionesMostradas, setCantTransmisionesMostradas] = useState(4)
    //Estado del video de la transmision
    const [reproduciendo, setReproduciendo] = useState(false)

    //Slug de la transmision principal para filtrar las transmisiones del mismo programa
    const slug = transmision.slug

    //Transmisiones que sean del mismo programa que la transmision principal
    const programaTransmision = transmision.programa.data.attributes.slug 
    const transmisionesMismoPrograma = transmisiones.data.filter((transmision) => transmision.attributes.programa.data.attributes.slug == programaTransmision).filter((transmision) => transmision.attributes.slug != slug)

    //Cargar mas transmisiones
    const cargarMasResultados = () =>{
        const cantTotalTransmisiones = transmisionesMismoPrograma.length
        let transmisionesRestantes = cantTotalTransmisiones - cantTransmisionesMostradas;

        if(transmisionesRestantes >= 4){
            setCantTransmisionesMostradas((prevTransmisionesMostradas) => prevTransmisionesMostradas + 4)
        }else if(transmisionesRestantes < 4 && transmisionesRestantes > 0){
            setCantTransmisionesMostradas((prevTransmisionesMostradas) => prevTransmisionesMostradas + transmisionesRestantes)
        }
    }
    
    //Pausar el video cuando se cambia de pagina
    useEffect(()=>{
        setReproduciendo(false)
    },[router.asPath])
    
    return (
        <main className={transmisionStyles.transmision}>
            <Head>
                <title>{transmision.titulo} • Veo Teve</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* Transmision */}
            <section aria-label="Información y video de la transmisión" className={transmisionStyles.infoTransmision}>
                {/* Links volver a transmisiones / programa de la transmision */}
                <div className={transmisionStyles.linkVolver}>
                    <Link href="/transmisiones">
                        <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path></svg>
                            Transmisiones&nbsp;
                        </a>
                    </Link>
                    <Link href={`/programas/${transmision.programa.data.attributes.slug}`}>
                        <a> / {transmision.programa.data.attributes.nombre}</a>
                    </Link>
                </div>
                {/* Titulo transmision */}
                <h1 className={transmisionStyles.titulo}>{transmision.titulo}</h1>
                {/* fecha */}
                <span className={transmisionStyles.fecha}>Programa del {transmision.fecha}</span>
                {/* Reproductor */}
                <div className={transmisionStyles.reproductor}>
                    {reproduciendo ? 
                    // Video
                    <ReactPlayer url={transmision.link} 
                        playing = {reproduciendo}
                        muted = {false}
                        controls = {true}
                        loop= {false}
                        className={transmisionStyles.video}
                    />
                    :
                    //Portada
                    <div className={transmisionStyles.portada} onClick={()=>{setReproduciendo(true)}}>
                        <Image src={transmision.portada.data.attributes.url} alt="Portada de una transmision pasada de veoteve" layout={'fill'} objectFit={'cover'} quality="90" priority="true"/>
                        <div className={transmisionStyles.filtroPortada}></div>
                        <div className={transmisionStyles.btnPlay}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={transmisionStyles.trianguloPlay} width="80" height="80" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#597e8d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M7 4v16l13 -8z" />
                            </svg>
                        </div>
                    </div>
                    }
                </div>
            </section>
            {/* Transmisiones relacionadas */}
            <section aria-label="Transmisiones del mismo programa" className={transmisionStyles.transmisionesRelacionadas}>
                {/* Titulo -- ver si hay mas transmisiones del mismo programa para mostrar */}
                <h1>{(transmisionesMismoPrograma.length > 0) ? "Transmisiones relacionadas" : "Otras transmisiones"}</h1>
                {/* Transmisiones */}
                <div className={transmisionStyles.gridTransmisiones}>
                    {/* Si hay transmisiones del mismo programa para mostrar */}
                    {(transmisionesMismoPrograma.length > 0) ? 
                    //Mostrar las transmisiones del mismo programa
                    transmisionesMismoPrograma.slice(0, cantTransmisionesMostradas).map((transmision) =>(
                        <TransmisionCard key={transmision.id} transmision={transmision}/>
                    ))
                    : 
                    //Mostrar las ultimas transmisiones en general
                        transmisiones.data.filter((transmision) => transmision.attributes.slug != slug).slice(0,4).map((transmision) =>(
                            <TransmisionCard key={transmision.id} transmision={transmision}/>
                        ))
                    }
                </div>
                {/* Boton cargar mas resultados */}
                {(transmisionesMismoPrograma.length > cantTransmisionesMostradas) ?
                    <Boton texto={"Cargar más resultados"} onClick={cargarMasResultados}/>
                : ""}
            </section>
            {/* Otros programas */}
            <NuestrosProgramas programas={programas.data}/>
        </main>
    );
}
 
export default Transmision;


export async function getStaticPaths(){
    
    const resTransmisiones = await fetch(`${process.env.SERVER_IP}/api/transmisiones`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })

    const transmisiones = await resTransmisiones.json()

    const paths = transmisiones.data.map((transmision)=>({
        params: {slug: transmision.attributes.slug}
    }))

    return{
        paths,
        fallback: 'blocking'
    }
}

export async function getStaticProps({params}){

    const {slug} = params;

    try{

        //Fetch transmision
        const resTransmision = await fetch(`${process.env.SERVER_IP}/api/transmisiones?filters[slug][$eq]=${slug}&populate=portada&populate=programa`, {
            headers: {
            'Authorization': process.env.API_AUTH
            },
        })

        //Fetch transmisiones
        const resTransmisiones = await fetch(`${process.env.SERVER_IP}/api/transmisiones?populate=portada&populate=programa&sort[0]=fecha:desc`, {
            headers: {
            'Authorization': process.env.API_AUTH
            },
        })
        //Fetch programas
        const resProgramas = await fetch(`${process.env.SERVER_IP}/api/programas?populate=portada&pagination[limit]=5`, {
            headers: {
            'Authorization': process.env.API_AUTH
            },
        })
        
        //Info transmision
        const data = await resTransmision.json()
        let transmision = data.data[0].attributes
        //Trasmisiones
        let transmisiones = await resTransmisiones.json()
        //Programas
        const programas = await resProgramas.json()
    
        //Cambiar formato de la fecha
        const regexFormato = /(202\d)-(\d\d)-(\d\d)/
        
        // Fecha transmision
        transmision.fecha = transmision.fecha.replace(regexFormato, '$3/$2/$1')
        // Fecha transmisiones
        transmisiones.data.map((transmision)=>{
            transmision.attributes.fecha = transmision.attributes.fecha.replace(regexFormato, '$3/$2/$1')
        })

        return{
            props: {transmision, transmisiones, programas},
            revalidate: 120,
        }

    }catch(error){
        return{
            notFound: true
        }
    }

}