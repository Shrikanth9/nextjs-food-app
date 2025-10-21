import { getMeal } from '@/lib/meals';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

export default async function MealDetailsPage({ params }: { params: { mealSlug: string } }) {
    const meal = await getMeal(params.mealSlug);

    if (!meal) {
        notFound();
    }
    
    // Create a new object with the processed instructions
    const mealWithHTML = {
        ...meal,
        instructions: meal.instructions.replace(/\n/g, '<br/>')
    };

    return (
        <>
        <header className={styles.header}>
            <div className={styles.image}> 
                <Image src={mealWithHTML.image} alt={mealWithHTML.title} fill sizes='100vw 100vh'/>
            </div>
            <div className={styles.headerText}>
                <h1>{meal.title}</h1>
                <p className={styles.creator}>
                    by <a className={styles.name} href={`mailto:${meal.creator_email}`}>{ meal.creator }</a>
                </p>
                <p className={styles.summary}>
                    {meal.summary}
                </p>
            </div>
        </header>
        
        <main>
            <p className={styles.instructions} dangerouslySetInnerHTML={{__html: meal.instructions}}></p>
        </main>
        </>
    );
}