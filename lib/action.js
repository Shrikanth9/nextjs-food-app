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

export async function uploadImageToStorage(meal, image) {
  try {
    if (!image || image.size === 0) {
      throw new Error('No image file provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(image.type)) {
      throw new Error('Invalid file type. Please upload a valid image (JPEG, PNG, WebP, or GIF)');
    }

    if (!meal || !meal.title) {
      throw new Error('Meal title is required');
    }

    // Generate filename from meal title
    const slug = meal.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    const fileExt = image.name.split('.').pop();
    const fileName = `${slug}.${fileExt}`;
    const filePath = `images/${fileName}`;

    // Convert file to ArrayBuffer
    const bytes = await image.arrayBuffer();
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('meals')
      .upload(filePath, bytes, {
        contentType: image.type,
        upsert: true,
        cacheControl: 'no-cache'
      });

    if (uploadError) {
      throw new Error('Failed to upload image to storage');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('meals')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    throw new Error(error.message || 'Failed to upload image');
  }
}

export async function ShareMeal(prevState, formData) {
  // Add a small delay to ensure loading state is visible
  await delay(1000);
  
  const imageFile = formData.get('image');
  
  // Validate required fields first
  const title = formData.get('title');
  const summary = formData.get('summary');
  const instructions = formData.get('instructions');
  const creator = formData.get('name');
  const creator_email = formData.get('email');

  // Input validation
  if (isInvalidText(title)) {
    return { success: false, message: 'Please enter a valid title' };
  }
  if (isInvalidText(summary)) {
    return { success: false, message: 'Please enter a valid summary' };
  }
  if (!imageFile || imageFile.size === 0) {
    return { success: false, message: 'Please select an image' };
  }
  if (isInvalidText(instructions)) {
    return { success: false, message: 'Please enter valid instructions' };
  }
  if (isInvalidText(creator)) {
    return { success: false, message: 'Please enter your name' };
  }
  if (isInvalidText(creator_email) || !creator_email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address' };
  }
  
  try {
    const mealData = {
      title,
      summary,
      instructions,
      creator,
      creator_email,
    };
    // Upload the image to Supabase Storage
    const imageUrl = await uploadImageToStorage(mealData, imageFile);
    
    const meal = {
      ...mealData,
      image: imageUrl,
    };
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
    return { 
      success: false, 
      message: error.message || 'Failed to save meal. Please try again.' 
    };
  }
}