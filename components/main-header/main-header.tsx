import logoImg from "@/assets/logo.png";
import styles from "@/components/main-header/main-header.module.css";
import Image from "next/image";
import Link from "next/link";
import MainHeaderBackground from "./main-header-bg";

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
                    <Link href="/meals">Meals</Link>
                </li>
                <li>
                    <Link href="/community">Community</Link>
                </li>
                <li>
                    <Link href="/meals/share">Share</Link>
                </li>
            </ul>
        </nav>
        </header>
        </>

    );
}