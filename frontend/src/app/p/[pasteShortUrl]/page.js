import { notFound } from "next/navigation";
import styles from "./page.module.css";
import serverApiClient from "@/lib/api/serverApiClient";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function PasteData({ params }) {
  const { pasteShortUrl } = await params;
  let heading = null,
    content = null;

  // Not found UI for invalid pastes
  try {
    const data = await serverApiClient.get(
      ENDPOINTS.PASTE.DETAIL(pasteShortUrl)
    );
    heading = data.heading || "Untitled";
    content = data.content || "";
  } catch (error) {
    return notFound();
  }

  return (
    <div className="main">
      <div className={styles.container}>
        {/* Info Section */}
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>AnonText</h1>
          <p className={styles.subtitle}>Share text anonymously</p>
        </div>

        {/* Read-only Heading */}
        <div className={styles.field} id="heading-container">
          <label className={styles.label} htmlFor="heading">
            Heading
          </label>
          <div className={styles.input}>{heading}</div>
        </div>

        {/* Read-only Content */}
        <div className={styles.field} id="content-container">
          <label className={styles.label} htmlFor="content">
            Content
          </label>
          <pre className={styles.textarea}>{content}</pre>
        </div>
      </div>
    </div>
  );
}
