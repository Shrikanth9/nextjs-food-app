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
  const supabase = createClient();
  
  if (!image || image.size === 0) {
    throw new Error('No image file provided');
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(image.type)) {
    throw new Error('Invalid file type. Please upload a valid image (JPEG, PNG, WebP, or GIF)');
  }

  // Generate filename from meal title
  const slug = meal.title
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text

  const fileExt = image.name.split('.').pop();
  const fileName = `${slug}.${fileExt}`;
  const filePath = `images/${fileName}`;
  
  try {
    // Convert file to ArrayBuffer
    const bytes = await image.arrayBuffer();
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('meal-images')
      .upload(filePath, bytes, {
        contentType: image.type,
        upsert: true  // This will overwrite if file exists
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image to storage');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('meal-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
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