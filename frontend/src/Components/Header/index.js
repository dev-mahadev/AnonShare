import styles from "./index.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <img
            src="/shortner.webp"
            alt="ShortURL Logo"
            className={styles.logoIcon}
          />
          <span className={styles.logoText}>AnonShare</span>
        </div>
      </div>
    </header>
  );
}
