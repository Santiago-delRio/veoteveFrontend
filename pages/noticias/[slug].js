import noticiaStyles from "./noticia.module.scss";
import Image from "next/image";
import Head from "next/head";
import UltimasNoticias from "../../components/UltimasNoticias";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Noticia = ({ noticia, noticias }) => {
  const router = useRouter();

  //Contar visita de la noticia
  useEffect(() => {
    fetch("/api/contarVisitas", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      //Mando la id de la noticia abierta para saber cual hay que modificar
      body: JSON.stringify({ id: noticia.id }),
    });
  }, [router.asPath]);
  
  return (
    <main className={noticiaStyles.noticia}>
      <Head>
        <title>{noticia.attributes.titulo} • Veo Teve</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Noticia */}
      <article className={noticiaStyles.contenidoNoticia}>
        {/* Fecha y etiqueta de la noticia */}
        <div className={noticiaStyles.etiquetaFecha}>
          <span className={noticiaStyles.etiqueta}>
            {noticia.attributes.etiqueta}
          </span>
          <span className={noticiaStyles.fecha}>
            {noticia.attributes.fecha}
          </span>
        </div>
        {/* titulo */}
        <h1 className={noticiaStyles.titulo}>{noticia.attributes.titulo}</h1>
        {/* Portada */}
        <div className={noticiaStyles.portada}>
          <Image src={noticia.attributes.portada.data.attributes.url} alt="Portada de una noticia de veoteve" layout={"fill"} objectFit={"cover"} quality="90" />
        </div>
        {/* Contenido de la noticia */}
        <section aria-label="Contenido de la noticia" className={noticiaStyles.contenido}>
          {/* Convertir de markdown */}
          <ReactMarkdown
            linkTarget={"_blank"}
            components={{
              // Remplazar el tag de imagen normal por el de next
              img: ({ node, ...props }) => (
                <div className={noticiaStyles.imagen}>
                  {" "}
                  <Image
                    src={props.src}
                    alt="Imagen de la noticia"
                    layout={"fill"}
                    objectFit={"cover"}
                    quality="90"
                  />{" "}
                </div>
              ),
              // Hacer que los links se abran en otra pestaña
              a: ({ node, children, ...props }) => {
                const linkProps = props;
                if (props.target === "_blank") {
                  linkProps["rel"] = "noopener noreferrer";
                }
                return <a {...linkProps}>{children}</a>;
              },
            }}
          >
            {noticia.attributes.contenido}
          </ReactMarkdown>
        </section>
      </article>

      {/* Otras noticias */}
      <UltimasNoticias noticias={noticias.data} />
    </main>
  );
};

export default Noticia;

export async function getStaticPaths() {
  const res = await fetch(`${process.env.SERVER_IP}/api/noticias`, {
    headers: {
      Authorization: process.env.API_AUTH,
    },
  });

  const noticias = await res.json();

  const paths = noticias.data.map((noticia) => ({
    params: { slug: noticia.attributes.slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  try {
    //Fetch noticia
    const res = await fetch(
      `${process.env.SERVER_IP}/api/noticias?filters[slug][$eq]=${slug}&populate=portada&populate=programa`,
      {
        headers: {
          Authorization: process.env.API_AUTH,
        },
      }
    );

    //Fetch otras noticias
    const resNoticias = await fetch(
      `${process.env.SERVER_IP}/api/noticias?populate=portada&filters[slug][$ne]=${slug}&pagination[limit]=4&sort[0]=fecha:desc`,
      {
        headers: {
          Authorization: process.env.API_AUTH,
        },
      }
    );

    //Info noticia
    const data = await res.json();
    let noticia = data.data[0];

    //Otras noticias
    const noticias = await resNoticias.json();

    //Cambiar formato de la fecha
    const regexFormato = /(202\d)-(\d\d)-(\d\d)/;

    // Fecha noticia
    noticia.attributes.fecha = noticia.attributes.fecha.replace(
      regexFormato,
      "$3/$2/$1"
    );

    return {
      props: { noticia, noticias },
      revalidate: 120,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
