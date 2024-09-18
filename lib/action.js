"use server"

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

function isInvalidText(text) {
   return text && text.trim().length === 0;
}

export async function ShareMeal(prevState, formData) {
   await new Promise(resolve => setTimeout(resolve, 10000));
   const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      image: formData.get('image'),
      instructions: formData.get('instructions'),
      creator: formData.get('name'),
      creator_email: formData.get('email'),
   }

   if(
      isInvalidText(meal.title) ||
      isInvalidText(meal.summary) ||
      !meal.image || meal.image.size == 0 ||
      isInvalidText(meal.instructions) ||
      isInvalidText(meal.creator) ||
      isInvalidText(meal.creator_email) || meal.creator_email.indexOf('@') == -1
   ) {
      return  "Invalid input"
   }

   await saveMeal(meal);
   redirect('/meals');
}