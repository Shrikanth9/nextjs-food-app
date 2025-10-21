"use server"

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

function isInvalidText(text) {
   return !text || text.trim().length === 0;
}

export async function ShareMeal(prevState, formData) {
   const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      image: formData.get('image'),
      instructions: formData.get('instructions'),
      creator: formData.get('name'),
      creator_email: formData.get('email'),
   };

   if (
      isInvalidText(meal.title) ||
      isInvalidText(meal.summary) ||
      !meal.image || meal.image.size === 0 ||
      isInvalidText(meal.instructions) ||
      isInvalidText(meal.creator) ||
      isInvalidText(meal.creator_email) || 
      !meal.creator_email.includes('@')
   ) {
      return "Invalid input";
   }

   try {
      const result = await saveMeal(meal);
      
      // If we're on the server, redirect after successful save
      if (typeof window === 'undefined') {
         redirect('/meals');
      }
      
      return { success: true, message: 'Meal saved successfully!' };
   } catch (error) {
      console.error('Failed to save meal:', error);
      return { success: false, message: 'Failed to save meal. Please try again.' };
   }
}