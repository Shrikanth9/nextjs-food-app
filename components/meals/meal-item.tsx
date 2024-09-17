import Image from "next/image";
import Link from "next/link";
import styles from "./meal-item.module.css";

export default function MealItem({ title, slug, image, summary, creator }: any) {
    return (
        <article className={styles.meal}>
            <header>
                <div className={styles.image}>
                  <Image src={image} alt={title} fill sizes="100vw 100vh" priority/>
                </div>
                <div className={styles.headerText}>
                    <h2>{title}</h2>
                    <p>{creator}</p>
                </div>
            </header>
            <div className={styles.content}>
                <p className={styles.summary}>{summary}</p>
                <div className={styles.actions}>
                    <Link href={`/meals/${slug}`}>View Recipe</Link>
                </div>
            </div>
        </article>
    );
}