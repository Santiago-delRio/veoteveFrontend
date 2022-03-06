import Head from 'next/head'
import transmisionesStyles from "./transmisiones.module.scss"
import Heading from '../../components/HeadingPaginas'
import NuestrosProgramas from '../../components/NuestrosProgramas';
import Transmision from '../../components/TransmisionCard'
import Boton from '../../components/Boton'
import { useState } from 'react';

const Transmisiones = ({ programas, transmisiones }) => {

    const [cantTransmisionesMostradas, setCantTransmisionesMostradas] = useState(4)

    //Cargar mas transmisiones
    const cargarMasResultados = () =>{
        const cantTotalTransmisiones = transmisiones.data.length
        let transmisionesRestantes = cantTotalTransmisiones - cantTransmisionesMostradas;

        if(transmisionesRestantes >= 4){
            setCantTransmisionesMostradas((prevTransmisionesMostradas) => prevTransmisionesMostradas + 4)
        }else if(transmisionesRestantes < 4 && transmisionesRestantes > 0){
            setCantTransmisionesMostradas((prevTransmisionesMostradas) => prevTransmisionesMostradas + transmisionesRestantes)
        }
    }

    return (
        <main className={transmisionesStyles.transmisiones}>
            <Head>
                <title>Transmisiones • Veo Teve</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            {/* Heading */}
            <Heading texto="Últimas transmisiones"/>

            <section aria-label='Últimas transmisiones' className={transmisionesStyles.gridTransmisiones}>
                {transmisiones.data.slice(0, cantTransmisionesMostradas).map((transmision) =>(
                    <Transmision key={transmision.id} transmision={transmision}/>
                ))}
            </section>
            {(transmisiones.data.length > cantTransmisionesMostradas) ? 
                <Boton texto={"Cargar más resultados"} onClick={cargarMasResultados}/>
            : ""}

            <NuestrosProgramas programas={programas.data}/>
        </main>
    );
}
 
export default Transmisiones;


export async function getStaticProps(){

    const resProgramas = await fetch(`${process.env.SERVER_IP}/api/programas?populate=portada&pagination[limit]=5`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })
    const resTransmisiones = await fetch(`${process.env.SERVER_IP}/api/transmisiones?populate=portada&sort[0]=fecha:desc`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })
  
    const programas = await resProgramas.json()
    const transmisiones = await resTransmisiones.json()
  
    //Cambiar formato de la fecha
    const regexFormato = /(202\d)-(\d\d)-(\d\d)/
  
    transmisiones.data.map((transmision)=>{
      transmision.attributes.fecha = transmision.attributes.fecha.replace(regexFormato, '$3/$2/$1')
    })
  
    return{
        props: { programas, transmisiones },
        revalidate: 120,
    }
  }