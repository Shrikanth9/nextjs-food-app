import styles from "./loading-out.module.css";

export default function MealsLoadingPage() {
    return <p className={styles.loading}> Fetching recipes... </p>;
}