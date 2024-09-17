"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./image-picker.module.css";

export default function ImagePicker({ label, name }: any) {


    const [pickedImage, setPickedImage] = useState<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddImageClick = () => {
        if (inputRef.current)
            inputRef.current.click();
    }

    const handlePickedImage = (event: any) => {
        const file = event.target.files[0];

        if (!file) return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            setPickedImage(fileReader.result);
        }
    }

    return (
      <div className={styles.picker}>
        <label htmlFor={name}>{label}</label>
        <div className={styles.controls}>
          {pickedImage ? (
            <div className={styles.preview}>
              <Image
                src={pickedImage}
                fill
                sizes="10rem"
                alt="Image selected by user"
              />
            </div>
          ) : (
            <div className={styles.preview}> No images are selected </div>
          )}
          <input
            className={styles.input}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            name={name}
            ref={inputRef}
            required
            onChange={handlePickedImage}
          />
        </div>
        <button
          className={styles.button}
          type="button"
          onClick={handleAddImageClick}
        >
          {" "}
          Add Image{" "}
        </button>
      </div>
    );
}
