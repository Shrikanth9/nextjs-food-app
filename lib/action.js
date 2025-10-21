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
    throw new Error('No image file provided');
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(image.type)) {
    throw new Error('Invalid file type. Please upload a valid image (JPEG, PNG, WebP, or GIF)');
  }

  // Generate unique filename with original extension and store in images folder
  const fileExt = image.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}.${fileExt}`;
  const filePath = `images/${fileName}`;
  
  try {
    // Convert file to ArrayBuffer
    const bytes = await image.arrayBuffer();
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('meals')
      .upload(filePath, bytes, {
        cacheControl: '31536000', // 1 year cache
        upsert: false,
        contentType: image.type
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error('Failed to upload image to storage');
    }

    // Construct the public URL directly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('Missing Supabase URL configuration');
    }
    
    // Format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[file-path]
    return `${supabaseUrl}/storage/v1/object/public/meals/${filePath}`;
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
    throw error; // Re-throw to be handled by the caller
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
    // Upload the image to Supabase Storage
    const imageUrl = await uploadImageToStorage(imageFile);
    
    const meal = {
      title,
      summary,
      image: imageUrl, // This will be the full URL from Supabase
      instructions,
      creator,
      creator_email,
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
    console.error('Failed to save meal:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to save meal. Please try again.' 
    };
  }
}