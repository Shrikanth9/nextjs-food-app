import ImageSlideshow from "@/components/images/image-slideshow";
import Link from "next/link";
import styles from "./page.module.css";
export default function Home() {
   return (
      <>
         <header className={styles.header}>
            <div className="slideshow">
            <ImageSlideshow />
            </div>
            <div>
               <div className={styles.hero}>
                  <h1>Food for foodies</h1>
                  <p>Find the best recipes</p>
               </div>
               <div className={styles.cta}>
                  <Link href="/community"> Join the community </Link>
                  <Link href="/meals"> Explore the meals </Link>
               </div>
            </div>
         </header>
         <main>
            <section className={styles.section}>
               <h2>How it works</h2>
               <p>
                  NextLevel Food is a platform for foodies to share their favorite
                  recipes with the world. It&apos;s a place to discover new dishes, and to
                  connect with other food lovers.
               </p>
               <p>
                  NextLevel Food is a place to discover new dishes, and to connect
                  with other food lovers.
               </p>
            </section>

            <section className={styles.section}>
               <h2>Why NextLevel Food?</h2>
               <p>
                  NextLevel Food is a platform for foodies to share their favorite
                  recipes with the world. It&apos;s a place to discover new dishes, and to
                  connect with other food lovers.
               </p>
               <p>
                  NextLevel Food is a place to discover new dishes, and to connect
                  with other food lovers.
               </p>
            </section>
         </main>
      </>
   );
}
