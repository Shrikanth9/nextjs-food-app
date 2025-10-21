"use client";

import ImagePicker from '@/components/meals/image-picker';
import MealSubmit from '@/components/meals/meal-submit';
import { ShareMeal } from '@/lib/action';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import classes from './page.module.css';

type FormState = {
  success: boolean;
  message: string;
  shouldRedirect?: boolean;
};

export default function ShareMealPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, formAction] = useFormState<FormState, FormData>(ShareMeal, { 
    success: false, 
    message: '' 
  });

  // Handle successful form submission and redirects
  useEffect(() => {
    if (formState?.success && formState.shouldRedirect) {
      router.push('/meals');
    }
  }, [formState, router]);

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form 
          className={classes.form} 
          action={async (formData) => {
            setIsSubmitting(true);
            try {
              await formAction(formData);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required disabled={isSubmitting} />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required disabled={isSubmitting} />
            </p>
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required disabled={isSubmitting} />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required disabled={isSubmitting} />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows={10}
              required
              disabled={isSubmitting}
            ></textarea>
          </p>
          
          {/* Display error message if any */}
          {formState?.message && !formState.success && (
            <p className={classes.error}>{formState.message}</p>
          )}
          
          <ImagePicker label="Image" name="image" required disabled={isSubmitting} />
          
          <div className={classes.actions}>
            <MealSubmit />
          </div>
        </form>
      </main>
    </>
  );
}