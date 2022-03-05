import programasStyles from "./programas.module.scss"
import Link from "next/link"
import Image from 'next/image'
//Slider
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, {Pagination,Autoplay} from "swiper"
import { useMediaQuery } from 'react-responsive'
import { useEffect, useState } from "react"

SwiperCore.use([Pagination,Autoplay]);

const NuestrosProgramas = ({ programas, titulo="Nuestros programas" }) => {

    const [slidesProgramas, setSlidesProgramas] = useState([])

    //Crear las slides con los programas
    useEffect(()=>{
        setSlidesProgramas([])
        const crearSlide = (programa) =>{
            setSlidesProgramas( prevSlide => [...prevSlide, 
                <SwiperSlide key={programa.slug} className={programasStyles.swiperSlide}>
                    <Link href={`/programas/${programa.slug}`} >
                        <a tabIndex={-1}>
                            <div className={programasStyles.portadaPrograma}>
                                <div className={programasStyles.portadaPlaceholder}></div>
                                <Image src={programa.portada.data.attributes.url} alt="Portada de un programa de veoteve" layout={'fill'} objectFit={'cover'} quality="85" priority="true" sizes="50vw"/>
                            </div>
                        </a>
                    </Link> 
                </SwiperSlide>]
            )
        }
        programas.map(programa =>{
            crearSlide(programa.attributes)
        })
    },[programas])

    //Query para la cantidad de programas que se muestran en el slider
    const tresProgramas = useMediaQuery({
        query: '(min-width: 45em)'
    })
    const cuatroProgramas = useMediaQuery({
        query: '(min-width: 64em)'
    })

    return (
        <section aria-label="Nuestros programas" className={programasStyles.nuestrosProgramas}>
            {/* Header */}
            <header>
                <h1 >{titulo}</h1>
                <Link href="/programas">
                    <a>
                        Ver todos
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z"></path></svg>
                    </a>
                </Link>
            </header>
            {/* Swiper con programas */}
            <Swiper className={programasStyles.swiperProgramas} loop={true} autoplay={{"delay": 1500, "disableOnInteraction":false}} grabCursor="true"  speed={400} slidesPerView={(tresProgramas ? cuatroProgramas ? 4 : 3 : 2)}  spaceBetween={30} pagination={{clickable: "true"}} >
                {slidesProgramas}
            </Swiper>
        </section>
    );
}
 
export default NuestrosProgramas;