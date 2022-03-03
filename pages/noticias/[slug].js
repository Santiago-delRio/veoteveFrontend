import noticiaStyles from "./noticia.module.scss"
import Image from 'next/image'
import Head from 'next/head'
import UltimasNoticias from '../../components/UltimasNoticias';
import ReactMarkdown from 'react-markdown'


const Noticia = ({ noticia, noticias }) => {

    return (
        <main className={noticiaStyles.noticia}>
            <Head>
                <title>{noticia.titulo} • Veo Teve</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* Noticia */}
            <article className={noticiaStyles.contenidoNoticia}>
                <div className={noticiaStyles.etiquetaFecha}>
                    <span className={noticiaStyles.etiqueta}>{noticia.etiqueta}</span>
                    <span className={noticiaStyles.fecha}>{noticia.fecha}</span>
                </div>
                <h1 className={noticiaStyles.titulo}>{noticia.titulo}</h1>
                <div className={noticiaStyles.portada}>
                    <Image src={noticia.portada.data.attributes.url} alt="Portada de una noticia de veoteve" layout={'fill'} objectFit={'cover'} quality="90" />
                </div>
                <section aria-label="Contenido de la noticia" className={noticiaStyles.contenido}>
                    <ReactMarkdown components={{
                        img: ({node, ...props}) => <div className={noticiaStyles.imagen}> <Image src={props.src} alt="Imagen de la noticia" layout={'fill'} objectFit={'cover'} quality="90" /> </div>
                    }}>
                        {noticia.contenido}
                    </ReactMarkdown>
                </section>
            </article>

            {/* Otras noticias */}
            <UltimasNoticias noticias={noticias.data}/>
        </main>
    );
}
 
export default Noticia;


export async function getStaticPaths(){
    
    const res = await fetch(`${process.env.SERVER_IP}/api/noticias`, {
        headers: {
        'Authorization': process.env.API_AUTH
        },
    })

    const noticias = await res.json()

    const paths = noticias.data.map((noticia)=>({
        params: {slug: noticia.attributes.slug}
    }))

    return{
        paths,
        fallback: 'blocking'
    }
}


export async function getStaticProps({params}){

    const {slug} = params;

    try{

        //Fetch noticia
        const res = await fetch(`${process.env.SERVER_IP}/api/noticias?filters[slug][$eq]=${slug}&populate=portada&populate=programa`, {
            headers: {
            'Authorization': process.env.API_AUTH
            },
        })

        //Fetch otras noticias
        const resNoticias = await fetch(`${process.env.SERVER_IP}/api/noticias?populate=portada&filters[slug][$ne]=${slug}&pagination[limit]=4&sort[0]=fecha:desc`, {
            headers: {
            'Authorization': process.env.API_AUTH
            },
        })
        
        //Info noticia
        const data = await res.json()
        let noticia = data.data[0].attributes

        //Otras noticias
        const noticias = await resNoticias.json()
    
        //=== Arreglar ruta de las imagenes 
        const regexSrc = /^\/uploads/g
        //Cambiar formato de la fecha
        const regexFormato = /(202\d)-(\d\d)-(\d\d)/
        
        // Imagen y fecha noticia
        noticia.portada.data.attributes.url = noticia.portada.data.attributes.url.replace(regexSrc, `${process.env.SERVER_IP}/uploads`)
        noticia.fecha = noticia.fecha.replace(regexFormato, '$3/$2/$1')
        // Imagenes otras noticias
        noticias.data.map((noticia)=>{
            noticia.attributes.portada.data.attributes.url = noticia.attributes.portada.data.attributes.url.replace(regexSrc, `${process.env.SERVER_IP}/uploads`)
        })

        return{
            props: { noticia, noticias },
            revalidate: 120,
        }

    }catch(error){
        return{
            notFound: true
        }
    }

}