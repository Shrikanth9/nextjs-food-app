"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./meal-item.module.css";

const SUPABASE_STORAGE_URL = 'https://tqpmfridizpcasxblnni.supabase.co/storage/v1/object/public/meals/';

function getSupabaseImageUrl(imageName: string) {
  if (!imageName) return '';

  if (imageName.startsWith('http')) {
    return imageName;
  }

  const cleanName = imageName.replace(/^\/+|\/+$/g, '');
  const path = cleanName.startsWith('images/') ? cleanName : `images/${cleanName}`;
  
  return `${SUPABASE_STORAGE_URL}${path}`;
}

export default function MealItem({ title, slug, image, summary, creator }: any) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');
  
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
    
    if (!image) {
      setImageError(true);
      setIsLoading(false);
      return;
    }
    
    const url = getSupabaseImageUrl(image);
    
    if (!url) {
      setImageError(true);
      setIsLoading(false);
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      setImgSrc(url);
      setIsLoading(false);
      return;
    }
    
    const img = new window.Image();
    img.onload = () => {
      setImgSrc(url);
      setIsLoading(false);
    };
    img.onerror = () => {
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
                onError={() => setImageError(true)}
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