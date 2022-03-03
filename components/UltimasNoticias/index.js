import Link from "next/link"
import noticiasStyles from "./noticias.module.scss"
import Noticia from "../NoticiaCard"

const UltimasNoticias = ({ noticias }) => {

    return (
        <section aria-label="Ultimas noticias" className={noticiasStyles.ultimasNoticias}>
            {/* Header */}
            <header>
                <h1 >Últimas noticias</h1>
                <Link href="/noticias">
                    <a className={noticiasStyles.verTodas}>
                        Ver todas
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z"></path></svg>
                    </a>
                </Link>
            </header>
            {/* Noticias */}
            <div className={noticiasStyles.noticias}>
                {noticias.map((noticia)=>(
                    <Noticia key={noticia.id} noticia={noticia.attributes}/>
                ))}
            </div>
        </section>
    );
}
 
export default UltimasNoticias;
