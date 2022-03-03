import horariosStyles from "./horarios.module.scss"
import Transmisiones from '../../components/UltimasTransmisiones';
import Link from "next/link"
import Head from 'next/head'
//Slider
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, {FreeMode} from "swiper"
//Media queries
import { useMediaQuery } from 'react-responsive'
import { useState } from "react"

SwiperCore.use([FreeMode]);

const Horarios = ({ transmisiones, horarios }) => {

    //Query para cambiar la cantidad de dias en el slider
    const esEscritorio = useMediaQuery({
        query: '(min-width: 64em)'
    })

    //State para mostrar los datos del dia seleccionado
    const [diaSeleccionado, setDiaSeleccionado] = useState("Lunes")

    return (
        <main className={horariosStyles.horarios}>
            <Head>
                <title>Horarios • Veo Teve</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* Dias */}
            <div className={horariosStyles.dias}>
                <h1 className={horariosStyles.titulo}>Horarios</h1>
                <Swiper className={horariosStyles.swiperDias} freeMode={true, {sticky:true}} slidesPerView="auto" spaceBetween={30} noSwiping={esEscritorio ? true : false} noSwipingClass={'swiper-slide'} >
                    {/* Dia lunes */}
                    <SwiperSlide className={horariosStyles.swiperSlide}>
                        <h2 className={(diaSeleccionado == "Lunes" ? horariosStyles.diaActivo : "")} onClick={()=>{setDiaSeleccionado("Lunes")}} tabIndex={0} onKeyPress={(event)=>{(event.key == "Enter") ? event.target.click() : ""}}>Lunes</h2>
                    </SwiperSlide>
                    {/* Dia martes */}
                    <SwiperSlide className={horariosStyles.swiperSlide}>
                        <h2 className={(diaSeleccionado == "Martes" ? horariosStyles.diaActivo : "")} onClick={()=>{setDiaSeleccionado("Martes")}} tabIndex={0} onKeyPress={(event)=>{(event.key == "Enter") ? event.target.click() : ""}}>Martes</h2>
                    </SwiperSlide>
                    {/* Dia miércoles */}
                    <SwiperSlide className={horariosStyles.swiperSlide}>
                        <h2 className={(diaSeleccionado == "Miércoles" ? horariosStyles.diaActivo : "")} onClick={()=>{setDiaSeleccionado("Miércoles")}} tabIndex={0} onKeyPress={(event)=>{(event.key == "Enter") ? event.target.click() : ""}}>Miércoles</h2>
                    </SwiperSlide>
                    {/* Dia jueves */}
                    <SwiperSlide className={horariosStyles.swiperSlide}>
                        <h2 className={(diaSeleccionado == "Jueves" ? horariosStyles.diaActivo : "")} onClick={()=>{setDiaSeleccionado("Jueves")}} tabIndex={0} onKeyPress={(event)=>{(event.key == "Enter") ? event.target.click() : ""}}>Jueves</h2>
                    </SwiperSlide>
                    {/* Dia viernes */}
                    <SwiperSlide className={horariosStyles.swiperSlide}>
                        <h2 className={(diaSeleccionado == "Viernes" ? horariosStyles.diaActivo : "")} onClick={()=>{setDiaSeleccionado("Viernes")}} tabIndex={0} onKeyPress={(event)=>{(event.key == "Enter") ? event.target.click() : ""}}>Viernes</h2>
                    </SwiperSlide>
                    {/* Dia sábado */}
                    <SwiperSlide className={horariosStyles.swiperSlide}>
                        <h2 className={(diaSeleccionado == "Sábado" ? horariosStyles.diaActivo : "")} onClick={()=>{setDiaSeleccionado("Sábado")}} tabIndex={0} onKeyPress={(event)=>{(event.key == "Enter") ? event.target.click() : ""}}>Sábado</h2>
                    </SwiperSlide>
                    {/* Dia domingo */}
                    <SwiperSlide className={horariosStyles.swiperSlide}>
                        <h2 className={(diaSeleccionado == "Domingo" ? horariosStyles.diaActivo : "")} onClick={()=>{setDiaSeleccionado("Domingo")}} tabIndex={0} onKeyPress={(event)=>{(event.key == "Enter") ? event.target.click() : ""}}>Domingo</h2>
                    </SwiperSlide>
                </Swiper>
            </div>

            {/* Programas */}
            <div className={horariosStyles.programas}>
                {horarios.data.filter((horario) => horario.attributes.dias.data.some( dia => dia.attributes.nombre == diaSeleccionado)).sort((a, b) => (a.attributes.horaInicio > b.attributes.horaInicio) ? 1 : -1).map( horario => {
                    return(
                        <div className={horariosStyles.programa} key={horario.id}>
                            <div className={horariosStyles.hora}>
                                <span className={horariosStyles.horaInicio}>{horario.attributes.horaInicio}</span>
                                <span className={horariosStyles.separador}>-</span>
                                <span className={horariosStyles.horaFin}>{horario.attributes.horaFin}</span>
                            </div>
                            <div className={horariosStyles.info}>
                                <h2 className={horariosStyles.nombre}>{horario.attributes.programa.data.attributes.nombre}</h2>
                                <p className={horariosStyles.descripcion} >{horario.attributes.descripcion}</p>
                                <Link href={`programas/${horario.attributes.programa.data.attributes.slug}`}>
                                    <a className={horariosStyles.btnVerPrograma}>
                                        Ver programa
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z"></path></svg>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Transmisiones transmisiones = {transmisiones.data}/>
            
        </main>
    );
}
 
export default Horarios;


export async function getStaticProps(){

    const resTransmisiones = await fetch(`${process.env.SERVER_IP}/api/transmisiones?populate=portada&pagination[limit]=4`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })
    const resHorarios = await fetch(`${process.env.SERVER_IP}/api/horarios?populate=programa&populate=dias`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })
  
    const transmisiones = await resTransmisiones.json()
    const horarios = await resHorarios.json()
  
    //Arreglar ruta de las imagenes 
    const regexSrc = /^\/uploads/g
  
    transmisiones.data.map((transmision)=>{
      transmision.attributes.portada.data.attributes.url = transmision.attributes.portada.data.attributes.url.replace(regexSrc, `${process.env.SERVER_IP}/uploads`)
    })
  
    return{
        props: { transmisiones, horarios },
        revalidate: 120,
    }
  }