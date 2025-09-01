import React from "react";
import styles from "./page.module.css";

const HomePage = () => {
  const features = [
    {
      id: "url-shortener",
      title: "URL Shortener",
      description: "Shorten long URLs",
      iconSrc: "/svg/linker.svg",
      href: "/short",
      color: "blue",
    },
    {
      id: "paste-service",
      title: "Text Paste",
      description: "Share text snippets anonymously",
      iconSrc: "/svg/paste.svg",
      href: "/paste",
      color: "green",
    },
    {
      id: "file-upload",
      title: "File Upload",
      description: "Upload and share files securely",
      iconSrc: "/svg/upload.svg",
      href: "/uploads",
      color: "purple",
    },
  ];

  return (
    <div className={styles.homePage}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Anonymous Sharing Platform</h1>
        <p className={styles.subtitle}>
          Shorten URLs, create pastes, and upload files - all anonymously
        </p>
      </div>

      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <a
            key={feature.id}
            href={feature.href}
            className={`${styles.featureBox} ${styles[feature.color]} ${
              styles[`delay-${index}`]
            }`}
          >
            <div className={styles.featureIcon}>
              <img
                src={feature.iconSrc}
                alt={feature.title}
                className={styles.icon}
              />
            </div>
            <h2 className={styles.featureTitle}>{feature.title}</h2>
            <p className={styles.featureDescription}>{feature.description}</p>
            <div className={styles.featureCta}>
              <span>Get Started</span>
              <svg
                className={styles.arrow}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </a>
        ))}
      </div>
      <div className={styles.neonDivider}>
        <span className={styles.neonDividerText}>~</span>
      </div>
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3>Anonymous & Secure</h3>
          <p>No registration required. Your data is private by default.</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Auto Delete</h3>
          <p>Automatically deleted after *24hrs</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Clean & Clutter-Free</h3>
          <p>Share short links. No clutter, no distractions.</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return <HomePage />;
}
