import Head from 'next/head'
import Link from "next/link"
import Image from 'next/image'
import programasStyles from "./programas.module.scss"
import Heading from '../../components/HeadingPaginas'
import UltimasTransmisiones from '../../components/UltimasTransmisiones'
import Boton from '../../components/Boton'
import { useState } from 'react'

const Programas = ({ programas, transmisiones }) => {

    const [programasMostrados, setProgramasMostrados] = useState(8)

    //Cargar mas programas
    const cargarMasResultados = () =>{
        const cantTotalProgramas = programas.data.length
        let programasRestantes = cantTotalProgramas - programasMostrados;

        if(programasRestantes >= 4){
            setProgramasMostrados((prevProgramasMostrados) => prevProgramasMostrados + 4)
        }else if(programasRestantes < 4 && programasRestantes > 0){
            setProgramasMostrados((prevProgramasMostrados) => prevProgramasMostrados + programasRestantes)
        }
    }

    return (
        <main className={programasStyles.programas}>
            <Head>
                <title>Programas • Veo Teve</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Heading */}
            <Heading texto="Nuestros programas"/>

            {/* Grid programas */}
            <section aria-label='Programas del canal' className={programasStyles.gridProgramas}>
                {programas.data.slice(0, programasMostrados).map((programa)=>(
                    <Link key={programa.id} href={`/programas/${programa.attributes.slug}`}>  
                        <a className={programasStyles.programa}>
                            {/* IMAGEN */}
                            <div className={programasStyles.filtro}></div>
                            <Image src={programa.attributes.portada.data.attributes.url} alt="Portada programa de veoteve" layout={'fill'} objectFit={'cover'} quality="90"/>
                            {/* Nombre programa */}
                            <div className={programasStyles.nombre}>
                                <h3>{programa.attributes.nombre}</h3>
                                <div className={programasStyles.btnPlay}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={programasStyles.trianguloPlay} width="80" height="80" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#597e8d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M7 4v16l13 -8z" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </Link> 
                ))}
            </section>
            {(programas.data.length > programasMostrados) ? 
                <Boton texto={"Cargar más resultados"} onClick={cargarMasResultados}/>
            : ""}

            {/* Ultimas transmisiones */}
            <UltimasTransmisiones transmisiones={transmisiones.data}/>
        </main>
    );
}
 
export default Programas;


export async function getStaticProps(){

    const resProgramas = await fetch(`${process.env.SERVER_IP}/api/programas?populate=portada`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })
    const resTransmisiones = await fetch(`${process.env.SERVER_IP}/api/transmisiones?populate=portada&pagination[limit]=4&sort[0]=fecha:desc`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })
  
    const programas = await resProgramas.json()
    const transmisiones = await resTransmisiones.json()
  
    //Arreglar ruta de las imagenes 
    const regexSrc = /^\/uploads/g
    //Cambiar formato de la fecha
    const regexFormato = /(202\d)-(\d\d)-(\d\d)/
  
    programas.data.map((programa)=>{
      programa.attributes.portada.data.attributes.url = programa.attributes.portada.data.attributes.url.replace(regexSrc, `${process.env.SERVER_IP}/uploads`)
    })
    transmisiones.data.map((transmision)=>{
      transmision.attributes.portada.data.attributes.url = transmision.attributes.portada.data.attributes.url.replace(regexSrc, `${process.env.SERVER_IP}/uploads`)
      transmision.attributes.fecha = transmision.attributes.fecha.replace(regexFormato, '$3/$2/$1')
    })
  
    return{
        props: { programas, transmisiones },
        revalidate: 120,
    }
  }