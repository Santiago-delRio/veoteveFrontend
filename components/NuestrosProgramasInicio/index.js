import programasStyles from "./programas.module.scss"
import Link from "next/link"
import Image from 'next/image'
//Slider
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, {Pagination,Autoplay} from "swiper"
import { useMediaQuery } from 'react-responsive'
import { useEffect, useState } from "react"

SwiperCore.use([Pagination,Autoplay]);

const NuestrosProgramas = ({ programas }) => {

    const [slidesProgramas, setSlidesProgramas] = useState([])

    //Crear las slides con los programas
    useEffect(()=>{
        setSlidesProgramas([])
        const crearSlide = (programa) =>{
            setSlidesProgramas( prevSlide => [...prevSlide, 
                <SwiperSlide key={programa.slug} className={programasStyles.swiperSlide}>
                    <Link href={`/programas/${programa.slug}`} >
                        <a>
                            <div className={programasStyles.portadaPrograma}>
                                <div className={programasStyles.portadaPlaceholder}></div>
                                <Image src={programa.portada.data.attributes.url} alt="Portada de un programa de veoteve" layout={'fill'} objectFit={'cover'} quality="90" priority="true"/>
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

    //Query para mostrar dos o tres programas en el slider
    const tresProgramas = useMediaQuery({
        query: '(min-width: 45em)'
    })

    return (
        <div className={programasStyles.nuestrosProgramas}>
            {/* Titulo */}
            <h1>Nuestros programas</h1>
            {/* Swiper con programas */}
            <Swiper className={programasStyles.swiperProgramas} pagination loop={true} autoplay={{"delay": 1500, "disableOnInteraction":false}} grabCursor="true"  speed={400} slidesPerView={(tresProgramas ? 3 : 2)} spaceBetween={30} >
                {slidesProgramas}
            </Swiper>
            {/* Programas escritorio */}
            <div className={programasStyles.programasEscritorio}>
                {programas.slice(0,3).map((programa)=>(
                    <Link href={`/programas/${programa.attributes.slug}`} key={programa.id}>
                        <a>
                            <div className={programasStyles.portadaPrograma}>
                                <div className={programasStyles.portadaPlaceholder}></div>
                                <Image src={programa.attributes.portada.data.attributes.url} alt="Portada de un programa de veoteve" layout={'fill'} objectFit={'cover'} quality="90" priority="true"/>
                            </div>
                            <span>{programa.attributes.nombre}</span>
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    );
}
 
export default NuestrosProgramas;