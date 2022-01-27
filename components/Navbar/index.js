import navbarStyles from "./navbar.module.scss"
import Image from 'next/image'
import Link from "next/link"

import logo from "../../assets/imagenes/logo.jpg"
import { useState } from "react"

const Navbar = () => {

    //==== States
    const [menuAbierto, setMenuAbierto] = useState(false)

    return (
        <nav className={navbarStyles.navbar}>
            <div className={navbarStyles.innerNav}>
                <div className={navbarStyles.logo}>
                    <Link href="/">
                            <a>
                                <Image src={logo} alt="Logo veoteve" layout="responsive" width="300" height="300" quality="90"/> 
                            </a>
                    </Link> 
                </div>

                <div className={navbarStyles.btnMenu}>
                    <input type="checkbox" className={navbarStyles.menuCheckbox} onClick={()=>{setMenuAbierto(!menuAbierto)}}/>

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

                {/* Links escritorio */}
                <ul className={navbarStyles.linksEscritorio}>
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