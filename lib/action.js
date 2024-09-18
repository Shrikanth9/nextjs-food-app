"use server"

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

export async function ShareMeal(formData) {
   const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      image: formData.get('image'),
      instructions: formData.get('instructions'),
      creator: formData.get('name'),
      creator_email: formData.get('email'),
   }

   await saveMeal(meal);

   redirect('/meals');
}