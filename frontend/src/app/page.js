"use client";
import styles from "./page.module.css";
import { useState } from "react";
import apiClient from "@/lib/api/apiClient";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useNotify } from "@/lib/notifications/notificationClient";
import { MESSAGES } from "@/lib/notifications/messages";
import { GENERIC_ERRORS } from "@/lib/notifications/errors";

export default function Home() {
  const [userInputUrl, setUserInputUrl] = useState(null);
  const [shortenedUrlList, setShortenedUrlList] = useState([]);

  // Notification hooks
  const notify = useNotify();

  const handleSubmit = async (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Custom content as dictionary/object
    const content = {
      long_url: userInputUrl,
    };

    apiClient
      .post(ENDPOINTS.SHORT.BASE, content)
      .then((response) => {
        if (response?.full_length_short_url) {
          setShortenedUrlList([
            ...shortenedUrlList,
            [response.long_url, response.full_length_short_url],
          ]);
        }

        notify(MESSAGES.SHORT.CREATED);
      })
      .catch((error) => {
        notify(GENERIC_ERRORS.GENERIC);
      });
  };
  return (
    <main className={styles.main}>
      {/* Header with translucent effect */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <img
              src="/shortner.webp"
              alt="ShortURL Logo"
              className={styles.logoIcon}
            />
            <span className={styles.logoText}>ShortURL</span>
          </div>
          {/* TODO: Implement login and signup functionalities */}
          {/* <nav className={styles.nav}>
            <button className={styles.navButton}>Login</button>
            <button className={styles.navButtonPrimary}>Sign Up</button>
          </nav> */}
        </div>
      </header>

      {/* Main content centered */}
      <section className={styles.hero}>
        <div className={styles.content}>
          <h1 className={styles.title}>Shorten Your Links</h1>
          <p className={styles.subtitle}>Make long URLs short and shareable</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <input
                type="url"
                required
                onChange={(e) => setUserInputUrl(e.target.value)}
                placeholder="https://www.mywebsite.com/..."
                className={styles.input}
              />
              <button type="submit" className={styles.submitButton}>
                <span className={styles.buttonText}>Shorten</span>
                <svg
                  className={styles.buttonIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </button>
            </div>
          </form>
          {/* TODO-:  */}
          {shortenedUrlList.length != 0 && (
            <div className={styles.shortenedUrlTable}>
              {shortenedUrlList.map((currUrlMapping, index) => {
                return (
                  <div
                    key={currUrlMapping?.key ?? index}
                    className={styles.shortenedUrlRow}
                  >
                    <p>{currUrlMapping[0]}</p>
                    <a
                      href={currUrlMapping[1]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {currUrlMapping[1]}
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
