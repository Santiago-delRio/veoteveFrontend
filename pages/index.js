import Head from 'next/head'
import inicioStyles from "./inicio.module.scss"
import NuestrosProgramas from '../components/NuestrosProgramas';
import UltimasTransmisiones from '../components/UltimasTransmisiones';

const Home = ({ programas, transmisiones }) => {
  return (
    <section className={inicioStyles.inicio}>
      <Head>
          <title>Veo Teve • Canal de Televisión</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <section className={inicioStyles.stream_programas_container}>
        <section className={inicioStyles.stream_programas}>
          {/* Stream */}
          <div className={inicioStyles.stream}>
            {/* Header */}
            <h1>TV en vivo</h1>
            {/* Reproductor */}
            <div className={inicioStyles.reproductor}>
              <div className={inicioStyles.btnPlay}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={inicioStyles.trianguloPlay} width="80" height="80" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#597e8d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 4v16l13 -8z" />
                  </svg>
              </div>
            </div>
          </div>
          {/* Programas */}
          <NuestrosProgramas programas={programas.data}/>
        </section>
      </section>

      <UltimasTransmisiones transmisiones={transmisiones.data}/>

    </section>
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
  const resTransmisiones = await fetch(`${process.env.SERVER_IP}/api/transmisiones?populate=portada&pagination[limit]=4`, {
      headers: {
      'Authorization': process.env.API_AUTH
      },
  })

  const programas = await resProgramas.json()
  const transmisiones = await resTransmisiones.json()

  //Arreglar ruta de las imagenes 
  const regexSrc = /^\/uploads/g

  programas.data.map((programa)=>{
    programa.attributes.portada.data.attributes.url = programa.attributes.portada.data.attributes.url.replace(regexSrc, `${process.env.SERVER_IP}/uploads`)
  })
  transmisiones.data.map((transmision)=>{
    transmision.attributes.portada.data.attributes.url = transmision.attributes.portada.data.attributes.url.replace(regexSrc, `${process.env.SERVER_IP}/uploads`)
  })

  return{
      props: { programas, transmisiones },
      revalidate: 120,
  }
}