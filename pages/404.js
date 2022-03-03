import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import errorStyles from "./error404.module.scss"
import imagenError from "../assets/imagenes/404.svg"

export default function Custom404() {
    return (
        <section className={errorStyles.error404}>
            <Head>
                <title>Página no encontrada</title>
            </Head>

            <div className={errorStyles.imagen}>
                <Image src={imagenError} alt="" layout={'responsive'} width={500} height={500} quality="90" priority="true"/>   
            </div>

            <div className={errorStyles.info}>
                <h1>Error 404</h1>
                <p>Parece que la página que estabas buscando no existe</p>
                <Link href="/">
                    <a>Volver a la pagina principal</a>
                </Link>
            </div>
        </section>
    )
  }