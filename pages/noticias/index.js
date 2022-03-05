import Head from 'next/head'
import noticiasStyles from "./noticias.module.scss"
import Heading from '../../components/HeadingPaginas'
import Boton from '../../components/Boton'
import Noticia from '../../components/NoticiaCard'
import NuestrosProgramas from '../../components/NuestrosProgramas'
import { useState } from 'react'

const Noticias = ({ programas, noticias }) => {

    const [noticiasMostradas, setNoticiasMostradas] = useState(4)

    //Cargar mas programas
    const cargarMasResultados = () =>{
        const cantTotalNoticias = noticias.data.length
        let noticiasRestantes = cantTotalNoticias - noticiasMostradas;

        if(noticiasRestantes >= 4){
            setNoticiasMostradas((prevNoticiasMostradas) => prevNoticiasMostradas + 4)
        }else if(noticiasRestantes < 4 && noticiasRestantes > 0){
            setNoticiasMostradas((prevNoticiasMostradas) => prevNoticiasMostradas + noticiasRestantes)
        }
    }

    return (
        <main className={noticiasStyles.noticias}>
            <Head>
                <title>Noticias • Veo Teve</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Heading */}
            <Heading texto="Últimas noticias"/>

            {/* Noticias */}
            <section aria-label='Últimas noticias' className={noticiasStyles.gridNoticias}>
                {noticias.data.slice(0, noticiasMostradas).map((noticia)=>(
                    <Noticia key={noticia.id} noticia={noticia.attributes}/>
                ))}
            </section>
            {/* Boton cargar mas resultados */}
            {(noticias.data.length > noticiasMostradas) ? 
                <Boton texto={"Cargar más resultados"} onClick={cargarMasResultados}/>
            : ""}
            
            {/* Nuestros programas */}
            <NuestrosProgramas programas={programas.data}/>

        </main>
    );
}
 
export default Noticias;

export async function getStaticProps(){

    const resNoticias = await fetch(`${process.env.SERVER_IP}/api/noticias?populate=portada&sort[0]=fecha:desc`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })

    const resProgramas = await fetch(`${process.env.SERVER_IP}/api/programas?populate=portada&pagination[limit]=5`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })
  
    const noticias = await resNoticias.json()
    const programas = await resProgramas.json()
  
    //Arreglar ruta de las imagenes 
    const regexSrc = /^\/uploads/g
  
    programas.data.map((programa)=>{
      programa.attributes.portada.data.attributes.url = programa.attributes.portada.data.attributes.url.replace(regexSrc, `${process.env.SERVER_IP}/uploads`)
    })
    noticias.data.map((noticia)=>{
        noticia.attributes.portada.data.attributes.url = noticia.attributes.portada.data.attributes.url.replace(regexSrc, `${process.env.SERVER_IP}/uploads`)
      })
  
    return{
        props: { programas, noticias },
        revalidate: 120,
    }
  }