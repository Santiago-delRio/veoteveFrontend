import programasStyles from "./programas.module.scss"
import Link from "next/link"
import Image from 'next/image'
//Slider
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, {Pagination,Autoplay} from "swiper"


SwiperCore.use([Pagination,Autoplay]);

const NuestrosProgramas = ({ programas }) => {

    return (
        <div className={programasStyles.nuestrosProgramas}>
            {/* Titulo */}
            <h1>Nuestros programas</h1>
            {/* Swiper con programas */}
            <Swiper className={programasStyles.swiperProgramas} pagination loop={true} autoplay={{"delay": 1500, "disableOnInteraction":false}} grabCursor="true"  speed={400} slidesPerView={2} spaceBetween={30}>
                {programas.map((programa) =>(
                    <SwiperSlide key={programa.id} className={programasStyles.swiperSlide}>
                        <Link href={`/programas/${programa.attributes.slug}`} >
                            <a>
                                <div className={programasStyles.portadaPrograma}>
                                    <div className={programasStyles.portadaPlaceholder}></div>
                                    <Image src={programa.attributes.portada.data.attributes.url} alt="Portada de un programa de veoteve" layout={'fill'} objectFit={'cover'} quality="90" priority="true"/>
                                </div>
                            </a>
                        </Link> 
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
 
export default NuestrosProgramas;