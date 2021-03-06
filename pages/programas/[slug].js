import Image from 'next/image'
import Head from 'next/head'
import programaStyles from "./programa.module.scss"
import TransmisionCard from '../../components/TransmisionCard'
import NuestrosProgramas from '../../components/NuestrosProgramas';
import Boton from '../../components/Boton'
import { useState } from 'react'


const Programa = ({programa, transmisiones, programas}) => {

    //Slug del programa
    const slug = programa.slug
    //Transmisiones del programa 
    const transmisionesProgramaActual = transmisiones.data.filter(transmision => transmision.attributes.programa.data.attributes.slug == slug)

    //Cantidad de transmisiones del programa mostradas 
    const [cantTransmisionesMostradas, setCantTransmisionesMostradas] = useState(4)
    
    //Cargar mas transmisiones
    const cargarMasResultados = () =>{
        const cantTotalTransmisiones = transmisionesProgramaActual.length
        let transmisionesRestantes = cantTotalTransmisiones - cantTransmisionesMostradas;

        if(transmisionesRestantes >= 4){
            setCantTransmisionesMostradas((prevTransmisionesMostradas) => prevTransmisionesMostradas + 4)
        }else if(transmisionesRestantes < 4 && transmisionesRestantes > 0){
            setCantTransmisionesMostradas((prevTransmisionesMostradas) => prevTransmisionesMostradas + transmisionesRestantes)
        }
    }

    return (
        <main className={programaStyles.programa}>
            <Head>
                <title>{programa.nombre} • Veo Teve</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            {/* Info del programa */}
            <section aria-label='Información del programa' className={programaStyles.infoPrograma}>
                <div className={programaStyles.portada}>
                    <Image src={programa.portada.data.attributes.url} alt="Portada programa de veoteve" layout={'fill'} objectFit={'cover'} quality="90" priority="true"/>
                </div>
                <div className={programaStyles.info}>
                    <h1>{programa.nombre}</h1>
                    <span>{programa.horarios}</span>
                    <p>{programa.descripcion}</p>
                </div>
            </section>

            {/* Transmisiones */}
            <section className={programaStyles.transmisiones}>
                {/* Titulo -- ver si hay transmisiones para mostrar */}
                <h1>{(transmisionesProgramaActual.length > 0 ) ? "Últimas transmisiones" : "Todavía no hay transmisiones de este programa"}</h1>
                <div className={programaStyles.gridTransmisiones}>
                    {/* Ver si hay transmisiones del programa */}
                    {(transmisionesProgramaActual.length > 0 ) ? 
                        transmisionesProgramaActual.slice(0, cantTransmisionesMostradas).map(transmision => (
                            <TransmisionCard key={transmision.id} transmision={transmision}/>
                        ))
                    :
                        transmisiones.data.slice(0, 4).map(transmision => (
                            <TransmisionCard key={transmision.id} transmision={transmision}/>
                        ))
                    }
                </div>
                {/* Boton cargar más resultados */}
                {(transmisionesProgramaActual.length > cantTransmisionesMostradas) ?
                    <Boton texto={"Cargar más resultados"} onClick={cargarMasResultados}/>
                : ""}
            </section>

            {/* Otros programas */}
            <NuestrosProgramas programas={programas.data} titulo="Otros programas"/>
        </main>
    );
}
 
export default Programa;

export async function getStaticPaths(){
    
    const res = await fetch(`${process.env.SERVER_IP}/api/programas`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })

    const programas = await res.json()

    const paths = programas.data.map((programa)=>({
        params: {slug: programa.attributes.slug}
    }))

    return{
        paths,
        fallback: 'blocking'
    }
}

export async function getStaticProps({params}){

    const {slug} = params;

    try{

        //Fetch programa
        const resPrograma = await fetch(`${process.env.SERVER_IP}/api/programas?filters[slug][$eq]=${slug}&populate=portada`, {
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
        const resProgramas = await fetch(`${process.env.SERVER_IP}/api/programas?populate=portada&filters[slug][$ne]=${slug}&pagination[limit]=5`, {
            headers: {
            'Authorization': process.env.API_AUTH
            },
        })
        
        //Info transmision
        const data = await resPrograma.json()
        let programa = data.data[0].attributes
        //Trasmisiones
        let transmisiones = await resTransmisiones.json()
        //Programas
        const programas = await resProgramas.json()
    
        //Cambiar formato de la fecha
        const regexFormato = /(202\d)-(\d\d)-(\d\d)/
        
        // Fecha transmisiones
        transmisiones.data.map((transmision)=>{
            transmision.attributes.fecha = transmision.attributes.fecha.replace(regexFormato, '$3/$2/$1')
        })

        return{
            props: {programa, transmisiones, programas},
            revalidate: 120,
        }

    }catch(error){
        return{
            notFound: true
        }
    }

}