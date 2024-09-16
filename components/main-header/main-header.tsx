import logoImg from "@/assets/logo.png";
import styles from "@/components/main-header/main-header.module.css";
import Image from "next/image";
import Link from "next/link";
import MainHeaderBackground from "./bg/main-header-bg";
import NavLink from "./nav-link/nav-link";

export default function MainHeader() {
    return (
        <>
        <MainHeaderBackground />
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
               <Image className={styles.logo} src={logoImg} alt="A plate with food on it" priority/>
                  Food app
            </Link>

           <nav className={styles.nav}>
            <ul>
                <li>
                    <NavLink href="/meals"> Meals </NavLink>
                </li>
                <li>
                    <NavLink href="/community"> Community </NavLink>
                </li>
            </ul>
        </nav>
        </header>
        </>

    );
}