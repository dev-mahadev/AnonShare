"use client";

import {
  HEADING_CHARACTER_LIMIT,
  CONTENT_CHARACTER_LIMIT,
} from "@/constants/features";
import { useState } from "react";
import styles from "./page.module.css";
import { isValueWithinLimit } from "@/utils/general";
import apiClient from "@/lib/api/apiClient";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useNotify } from "@/lib/notifications/notificationClient";
import { MESSAGES } from "@/lib/notifications/messages";
import { GENERIC_ERRORS } from "@/lib/notifications/errors";
import ShortenedContent from "@/Components/ShortenedContent";

export default function CreateContentForm() {
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const notify = useNotify();

  const handleSave = async (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Custom content as dictionary/object
    const payload = {
      heading,
      content,
    };

    apiClient
      .post(ENDPOINTS.PASTE.BASE, payload)
      .then((response) => {
        if (response?.full_length_short_url) {
          setShortenedUrl(response.full_length_short_url);
        }

        notify(MESSAGES.PASTE.CREATED);
      })
      .catch((error) => {
        notify(GENERIC_ERRORS.GENERIC);
      });
  };

  // Helper functions
  const handleInput = (e, targetState) => {
    // Block if already saved

    e.preventDefault();
    if (shortenedUrl) {
      return;
    }
    const inputValue = e.target.value;
    switch (targetState) {
      case "heading":
        setHeading(inputValue);
        break;
      case "content":
        setContent(inputValue);
        break;
    }
  };

  const isPasteDataValid = () => {
    return (
      isValueWithinLimit(heading.length, [1, HEADING_CHARACTER_LIMIT]) &&
      isValueWithinLimit(content.length, [1, CONTENT_CHARACTER_LIMIT])
    );
  };

  // Derived values
  const isSaveDisabled = !isPasteDataValid() || shortenedUrl;

  return (
    <div className="main">
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>AnonText</h1>
          <p className={styles.subtitle}>Share text anonymously </p>
        </div>
        {shortenedUrl ? (
          <ShortenedContent shortenedUrl={shortenedUrl} />
        ) : (
          <>
            <div className={styles.field} id="heading-container">
              <label className={styles.label} htmlFor="heading">
                Heading (max {HEADING_CHARACTER_LIMIT} characters)
              </label>
              <input
                id="heading"
                type="text"
                value={heading}
                onChange={(e) => handleInput(e, "heading")}
                placeholder="Enter a short heading"
                maxLength={HEADING_CHARACTER_LIMIT}
                className={styles.input}
              />
              <div className={styles.counter}>
                {heading.length}/{HEADING_CHARACTER_LIMIT}
              </div>
            </div>

            <div className={styles.field} id="content-container">
              <label className={styles.label} htmlFor="content">
                Content (max {CONTENT_CHARACTER_LIMIT} characters)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => handleInput(e, "content")}
                placeholder="Write your content here..."
                maxLength={CONTENT_CHARACTER_LIMIT}
                rows="6"
                className={styles.textarea}
              />
              <div className={styles.counter}>
                {content.length}/{CONTENT_CHARACTER_LIMIT}
              </div>
            </div>

            <button
              onClick={handleSave}
              className={styles.saveButton}
              disabled={isSaveDisabled}
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}
