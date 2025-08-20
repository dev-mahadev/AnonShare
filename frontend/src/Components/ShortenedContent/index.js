import { useNotify } from "@/lib/notifications/notificationClient";
import { MESSAGES } from "@/lib/notifications/messages";
import { GENERIC_ERRORS } from "@/lib/notifications/errors";
import QRCode from "@/Components/QrCode/index";
import styles from "./index.module.css";

export default function ShortenedContent({ shortenedUrl }) {
  /* Reusable component for any shortened content */

  const notify = useNotify();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      notify(MESSAGES.SHORT.COPIED);
    } catch (err) {
      notify(GENERIC_ERRORS.GENERIC);
    }
  };
  return (
    <div className={styles.shortenedContent}>
      <div className={styles.urlContainer}>
        <h3>🔗 Your Generated Link</h3>

        <div className={styles.urlDisplayBox}>
          <span className={styles.urlText} id="generated-url">
            {shortenedUrl}
          </span>
          <button
            className={styles.copyBtn}
            onClick={handleCopyUrl}
            type="button"
          >
            {"Copy"}
          </button>
        </div>

        <p className={styles.statusText}>
          Link is ready! Share it or scan the QR below.
        </p>
      </div>
      <QRCode data={shortenedUrl} />
    </div>
  );
}
