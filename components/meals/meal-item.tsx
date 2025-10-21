"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./meal-item.module.css";

const SUPABASE_STORAGE_URL = 'https://tqpmfridizpcasxblnni.supabase.co/storage/v1/object/public/meals/images';

function getSupabaseImageUrl(imageName: string) {
  if (!imageName) {
    console.error('No image name provided');
    return '';
  }

  // If it's already a full URL, return as is
  if (imageName.startsWith('http')) {
    return imageName;
  }
  
  // Remove any leading/trailing slashes and 'images/' prefix if present
  const cleanName = imageName
    .replace(/^\/+|\/+$/g, '')
    .replace(/^images\//, '');
  
  // Construct the full URL
  const imageUrl = `${SUPABASE_STORAGE_URL}/${cleanName}`;
  console.log('Image URL:', imageUrl);
  
  return imageUrl;
}

export default function MealItem({ title, slug, image, summary, creator }: any) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');
  
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
    
    if (!image) {
      console.log('No image provided, using fallback');
      setImageError(true);
      setIsLoading(false);
      return;
    }
    
    const url = getSupabaseImageUrl(image);
    console.log('Image processing:', { original: image, processed: url });
    
    if (!url) {
      console.error('Failed to generate image URL');
      setImageError(true);
      setIsLoading(false);
      return;
    }
    
    // For local development, use a simpler approach
    if (process.env.NODE_ENV === 'development') {
      setImgSrc(url);
      setIsLoading(false);
      return;
    }
    
    // For production, verify the image exists
    const img = new window.Image();
    img.onload = () => {
      console.log('Image loaded successfully:', url);
      setImgSrc(url);
      setIsLoading(false);
    };
    img.onerror = () => {
      console.error('Failed to load image, using fallback:', url);
      setImageError(true);
      setIsLoading(false);
    };
    img.src = url;
  }, [image]);
  
  if (!imgSrc && !imageError) {
    return (
      <article className={styles.meal}>
        <div className={styles.imagePlaceholder}>
          <span>Loading...</span>
        </div>
        <div className={styles.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.meal}>
      <header>
        <div className={styles.image}>
          {!imageError ? (
            <>
              {isLoading && (
                <div className={styles.imagePlaceholder}>
                  <span>Loading...</span>
                </div>
              )}
              <Image
                src={imgSrc}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`${styles.mealImage} ${isLoading ? styles.hidden : ''}`}
                priority={false}
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                  console.error('Failed to load image:', imgSrc, e);
                  setImageError(true);
                }}
              />
            </>
          ) : (
            <div className={styles.imagePlaceholder}>
              <span>No Image Available</span>
            </div>
          )}
        </div>
        <div className={styles.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={styles.content}>
        <p className={styles.summary}>{summary}</p>
        <div className={styles.actions}>
          <Link href={`/meals/${slug}`} className={styles.link}>
            View Recipe →
          </Link>
        </div>
      </div>
    </article>
  );
}