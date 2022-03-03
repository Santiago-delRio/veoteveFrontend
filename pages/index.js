import Head from 'next/head'
import dynamic from 'next/dynamic'
import inicioStyles from "./inicio.module.scss"
import NuestrosProgramas from '../components/NuestrosProgramasInicio';
import UltimasTransmisiones from '../components/UltimasTransmisiones';
import UltimasNoticias from '../components/UltimasNoticias';
import { useState } from 'react';
const ReactPlayer = dynamic(() => import('react-player/youtube'))

const Home = ({ programas, transmisiones, noticias }) => {

  //Estado del directo
  const [reproduciendo, setReproduciendo] = useState(false)


  return (
    <main className={inicioStyles.inicio}>
      <Head>
          <title>Veo Teve • Canal de Televisión</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <section aria-label='Transmisión en vivo y programas del canal' className={inicioStyles.stream_programas_container}>
        <div className={inicioStyles.stream_programas}>
          {/* Stream */}
          <div className={inicioStyles.stream}>
            {/* Header */}
            <h1>TV en vivo</h1>
            {/* Reproductor */}
            <div className={inicioStyles.reproductor} onClick={()=>{setReproduciendo(true)}}>
              <div className={inicioStyles.btnPlay}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={inicioStyles.trianguloPlay} width="80" height="80" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#597e8d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 4v16l13 -8z" />
                  </svg>
              </div>
              {reproduciendo ? 
              <ReactPlayer url="https://www.youtube.com/embed/21X5lGlDOfg" 
                  playing = {reproduciendo}
                  muted = {false}
                  controls = {true}
                  loop= {false}
                  className={inicioStyles.video}
              />  
              : ""}
            </div>
          </div>
          {/* Programas */}
          <NuestrosProgramas programas={programas.data}/>
        </div>
      </section>

      <UltimasTransmisiones transmisiones={transmisiones.data}/>
      <UltimasNoticias noticias={noticias.data}/>

    </main>
  );
}
 
export default Home;


// Fetch programas
export async function getStaticProps(){

  const resProgramas = await fetch(`${process.env.SERVER_IP}/api/programas?populate=portada&pagination[limit]=5`, {
      headers: {
      'Authorization': process.env.API_AUTH
      },
  })
  const resTransmisiones = await fetch(`${process.env.SERVER_IP}/api/transmisiones?populate=portada&pagination[limit]=4&sort[0]=fecha:desc`, {
      headers: {
      'Authorization': process.env.API_AUTH
      },
  })
  const resNoticias = await fetch(`${process.env.SERVER_IP}/api/noticias?populate=portada&pagination[limit]=4&sort[0]=fecha:desc`, {
      headers: {
      'Authorization': process.env.API_AUTH
      },
  })

  const noticias = await resNoticias.json()
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
  noticias.data.map((noticia)=>{
    noticia.attributes.portada.data.attributes.url = noticia.attributes.portada.data.attributes.url.replace(regexSrc, `${process.env.SERVER_IP}/uploads`)
  })

  return{
      props: { programas, transmisiones, noticias },
      revalidate: 120,
  }
}