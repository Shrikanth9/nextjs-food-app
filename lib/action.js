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

   // Input validation
   if (isInvalidText(meal.title)) {
      return { success: false, message: 'Please enter a valid title' };
   }
   if (isInvalidText(meal.summary)) {
      return { success: false, message: 'Please enter a valid summary' };
   }
   if (!meal.image || meal.image.size === 0) {
      return { success: false, message: 'Please select an image' };
   }
   if (isInvalidText(meal.instructions)) {
      return { success: false, message: 'Please enter valid instructions' };
   }
   if (isInvalidText(meal.creator)) {
      return { success: false, message: 'Please enter your name' };
   }
   if (isInvalidText(meal.creator_email) || !meal.creator_email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address' };
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
      return { 
         success: false, 
         message: error.message || 'Failed to save meal. Please try again.' 
      };
   }
}