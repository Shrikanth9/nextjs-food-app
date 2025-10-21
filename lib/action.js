"use server"

import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { saveMeal } from "./meals";
import { supabase } from "./supabase";

function isInvalidText(text) {
   return !text || text.trim().length === 0;
}

// Helper function to add a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to handle file uploads to Supabase Storage
async function uploadImageToStorage(image) {
  if (!image || image.size === 0) {
    return '/images/placeholder.jpg';
  }

  const extension = image.name.split('.').pop();
  const fileName = `${Date.now()}.${extension}`;
  const filePath = `public/${fileName}`;
  
  const bytes = await image.arrayBuffer();
  
  // Upload the file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('meals')
    .upload(filePath, bytes, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return '/images/placeholder.jpg';
  }

  // Construct the full public URL
  const { data: { publicUrl } } = supabase.storage
    .from('meals')
    .getPublicUrl(filePath);

  // Ensure we have a proper URL (not a local path)
  if (publicUrl && !publicUrl.startsWith('http')) {
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.co', '');
    return `${projectUrl}.supabase.co/storage/v1/object/public/meals/${filePath}`;
  }

  return publicUrl || '/images/placeholder.jpg';
}

export async function ShareMeal(prevState, formData) {
  // Add a small delay to ensure loading state is visible
  await delay(1000);
  
  const imageFile = formData.get('image');
  let imagePath = '/images/placeholder.jpg';
  
  try {
    // Upload the image to Supabase Storage if provided
    if (imageFile && imageFile.size > 0) {
      imagePath = await uploadImageToStorage(imageFile);
    }
    
    const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      image: imagePath,
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

    const result = await saveMeal(meal);
    
    if (!result.success) {
      return result;
    }
    
    // Revalidate the meals page to show the new meal
    revalidatePath('/meals');
    
    return { 
      success: true, 
      message: 'Meal saved successfully!',
      shouldRedirect: true
    };
  } catch (error) {
    console.error('Failed to save meal:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to save meal. Please try again.' 
    };
  }
}