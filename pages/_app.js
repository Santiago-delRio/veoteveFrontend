import Layout from "../components/Layout"
import Head from 'next/head'
import '../styles/globals.scss'
import '../node_modules/swiper/swiper-bundle.css';


function MyApp({ Component, pageProps }) {
  return (
      <Layout>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta name="description" content="Somos la nueva forma de informarte en General Rodríguez. Información con estilo moderno y fresco.
          Programas en vivo, actualidad, radio y muchísimo más"/>
        </Head>
        <Component {...pageProps} />
      </Layout>
  )
}

export default MyApp
