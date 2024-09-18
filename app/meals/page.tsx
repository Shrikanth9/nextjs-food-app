import MealsGrid from '@/components/meals/meals-grid';
import { getMeals } from '@/lib/meals';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './page.module.css';


async function Meals() {
   const meals = await getMeals();
   return (
      <MealsGrid meals={meals}/>
   )
}

export default function MealsPage() {
   
    return (
       <>
         <header className={styles.header}>
            <h1> Delicious meals created{' '} <span className={styles.highlight}>by you</span></h1>
            <p> Choose your favorite recipe and cook it yourself. Its easy and fun </p>

            <p className={styles.cta}>
               <Link href="/meals/share"> Share recipe </Link>
            </p>
         </header>
         <main className={styles.main}> 
            <Suspense fallback={<p className={styles.loading}> Fetching recipes... </p>}>
               <Meals />
            </Suspense>
         </main>
       </>
    );
}