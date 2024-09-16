"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./nav-link.module.css";

export default function NavLink({ href, children }: { href: string, children: any }) {
    const pathname = usePathname();
    return (
        <Link href={href} className={pathname === href ? `${styles.link} ${styles.active}` : styles.link}>{ children }</Link>
    )
}