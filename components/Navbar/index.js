import navbarStyles from "./navbar.module.scss"
import Image from 'next/image'
import Link from "next/link"
import logo from "../../assets/imagenes/logo.jpg"
import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/router'
import { route } from "next/dist/server/router"

const Navbar = () => {

    //==== States
    const [menuAbierto, setMenuAbierto] = useState(false)
    const [navbarScroll, setNavbarScroll] = useState() // Cambiar el color del navbar despues de scrollear

    //==== Refs
    const botonMenu = useRef(); //Boton del menu

    const router = useRouter();

    useEffect(() => {
        //Cerrar el menu si estaba abierto al cambiar de ruta 
        if (menuAbierto) {
            setMenuAbierto(!menuAbierto);
            botonMenu.current.checked = false;
        }

        //Poner el navbar siempre blanco si no se está en la pestaña de inicio
        if(router.asPath != "/"){
            setNavbarScroll(true)
        }

        //Listener para cambiar el color del navbar despues de scrollear
        window.addEventListener("scroll", ()=>{
            if (router.asPath == "/") {
                (window.scrollY > 70 ? setNavbarScroll(true) : setNavbarScroll(false));   
            }
        })

    }, [router.asPath]);

    return (
        // Cambiar el color del navbar despues de scrollear
        <nav className={navbarScroll ? [navbarStyles.navbar, navbarStyles.navbarScroll].join(" ") : navbarStyles.navbar}>
            <div className={navbarStyles.innerNav}>
                <div className={navbarStyles.logo}>
                    <Link href="/">
                            <a>
                                <Image src={logo} alt="Logo veoteve" layout="responsive" width="300" height="300" quality="90"/> 
                            </a>
                    </Link> 
                </div>

                <div className={navbarStyles.btnMenu}>
                    <input type="checkbox" className={navbarStyles.menuCheckbox} onClick={()=>{setMenuAbierto(!menuAbierto)}} ref={botonMenu}/>

                    <span className={ navbarScroll ? navbarStyles.span_navbarScroll : ""}></span>
                    <span className={ navbarScroll ? navbarStyles.span_navbarScroll : ""}></span>
                    <span className={ navbarScroll ? navbarStyles.span_navbarScroll : ""}></span>
                </div>

                {/* Links escritorio */}
                <ul className={navbarScroll ? [navbarStyles.linksEscritorio, navbarStyles.links_navbarScroll].join(" ") : navbarStyles.linksEscritorio}>
                    <li>
                        <Link href="/">
                            <a> Inicio </a>
                        </Link> 
                    </li>
                    <li>
                        <Link href="/horarios">
                            <a> Horarios </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/programas">
                            <a> Programas </a>
                        </Link> 
                    </li>
                    <li>
                        <Link href="/noticias">
                            <a> Noticias </a>
                        </Link> 
                    </li>
                </ul>

                {/* Links celular */}
                <ul className={menuAbierto ? [navbarStyles.linksCelular, navbarStyles.menuAbierto].join(" ") : navbarStyles.linksCelular}>
                    <li>
                        <Link href="/">
                            <a> Inicio </a>
                        </Link> 
                    </li>
                    <li>
                        <Link href="/horarios">
                            <a> Horarios </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/programas">
                            <a> Programas </a>
                        </Link> 
                    </li>
                    <li>
                        <Link href="/noticias">
                            <a> Noticias </a>
                        </Link> 
                    </li>
                </ul>
                
            </div>
        </nav>
    );
}
 
export default Navbar;