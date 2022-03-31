import Layout from "../components/Layout";
import Head from "next/head";
import Script from "next/script";
import "../styles/globals.scss";
import "../node_modules/swiper/swiper-bundle.css";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
        `}
      </Script>

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Somos la nueva forma de informarte en General Rodríguez. Información con estilo moderno y fresco.
          Programas en vivo, actualidad, radio y muchísimo más"
        />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
