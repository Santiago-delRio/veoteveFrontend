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
                    <ReactMarkdown 
                    linkTarget={'_blank'}
                    components={{
                        img: ({node, ...props}) => <div className={noticiaStyles.imagen}> <Image src={props.src} alt="Imagen de la noticia" layout={'fill'} objectFit={'cover'} quality="90" /> </div>,
                        a: ({ node, children, ...props}) => {
                            const linkProps = props;
                            if (props.target === '_blank') {
                                linkProps['rel'] = 'noopener noreferrer';
                            }
                            return <a {...linkProps}>{children}</a>
                        }
                    }}
                    >
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
    
        //Cambiar formato de la fecha
        const regexFormato = /(202\d)-(\d\d)-(\d\d)/
        
        // Fecha noticia
        noticia.fecha = noticia.fecha.replace(regexFormato, '$3/$2/$1')

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