import MealsGrid from '@/components/meals/meals-grid';
import { getMeals } from '@/lib/meals';
import Link from 'next/link';
import styles from './page.module.css';

export default async function MealsPage() {
   const meals = await getMeals();
   
    return (
       <>
         <header className={styles.header}>
            <h1> Delicious meals created{' '} <span className={styles.highlight}>by you</span></h1>
            <p> Choose your favorite recipe and cook it yourself. It's easy and fun </p>

            <p className={styles.cta}>
               <Link href="/meals/share"> Share recipe </Link>
            </p>
         </header>
         <main className={styles.main}> 
            <MealsGrid meals={meals}/>
         </main>
       </>
    );
}