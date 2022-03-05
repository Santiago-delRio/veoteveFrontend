import Link from "next/link"
import Image from 'next/image'
import noticiaStyles from "./noticia.module.scss"

const Noticia = ({ noticia }) => {

    return (
        <>
            <Link href={`/noticias/${noticia.slug}`}>
                <a className={noticiaStyles.noticia}>
                    {/* Portada */}
                    <div className={noticiaStyles.portadaContainer}>
                        <div className={noticiaStyles.portadaPlaceholder}></div>
                        <Image src={noticia.portada.data.attributes.url} alt="Portada noticia" layout={'fill'} objectFit={'cover'} quality="80" sizes="50vw"/>
                    </div>
                    {/* TEXTO NOTICIA */}
                    <div className={noticiaStyles.infoNoticia}>
                        <span className={noticiaStyles.etiquetaNoticia}>{noticia.etiqueta}</span>
                        <h2 className={noticiaStyles.tituloNoticia}>{noticia.titulo}</h2>
                    </div>
                </a>
            </Link>
        </>
    );
}
 
export default Noticia;