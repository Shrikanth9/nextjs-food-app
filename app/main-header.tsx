import logoImg from "@/assets/logo.png";
import Link from "next/link";

export default function MainHeader() {
    return (
        <header>
            <Link href="/">
               <img src={logoImg.src} alt="A plate with food on it" />
                  NextLevel food
            </Link>

           <nav>
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

    );
}