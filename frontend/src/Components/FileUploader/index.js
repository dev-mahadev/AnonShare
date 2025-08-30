"use client";
import { useEffect, useState, useCallback } from "react";
import { formatFileSize } from "@/utils/general";
import { ENDPOINTS } from "@/lib/api/endpoints";
import apiClient from "@/lib/api/apiClient";
import styles from "./index.module.css";
import { MESSAGES } from "@/lib/notifications/messages";
import { GENERIC_ERRORS } from "@/lib/notifications/errors";

export default function FileUploader({
  file,
  startUpload,
  handleUploadCompletion,
}) {
  const [uploaded, setUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Reset state when file changes
  useEffect(() => {
    setUploaded(false);
    setUploadProgress(0);
    setIsUploading(false);
  }, [file]);

  // Wrap your existing upload logic in useCallback
  const uploadWithPresignedPost = useCallback(async () => {
    /*
	1. Obtains presigned post url
	2. Uploads to s3
	3. Obtains shortenedUrl (validated in backend)
	4. Calls the parent callback
	*/

    if (!file || uploaded || isUploading) return;

    setIsUploading(true);
    try {
      let { s3FileKey } = await uploadToPresignedUrl(file);
      setUploaded(true);
      //   Once upload is complete obtain the shortened url
      let { full_length_short_url } = await apiClient.post(
        ENDPOINTS.UPLOADS.BASE,
        { file_s3_key: s3FileKey }
      );
      handleUploadCompletion(
        MESSAGES.UPLOADS.UPLOADED(file.name),
        full_length_short_url
      );
    } catch (error) {
      handleUploadCompletion(GENERIC_ERRORS.GENERIC);
    } finally {
      setIsUploading(false);
    }
  }, [file, uploaded, isUploading, handleUploadCompletion]);

  // Trigger upload when startUpload is true
  useEffect(() => {
    if (startUpload && !uploaded && !isUploading && file) {
      uploadWithPresignedPost();
    }
  }, [startUpload, uploaded, isUploading, file, uploadWithPresignedPost]);

  // =========== Helper functions ===========
  const uploadToPresignedUrl = async (file) => {
    /*
	1. Fetches a presigned post url
	2. Uploads the file
	*/

    const endpoint = ENDPOINTS.UPLOADS.GET_PRESIGNED_POST_URL({
      filename: file.name,
    });

    try {
      const { url, fields } = await apiClient.get(endpoint, {
        "Content-Type": "application/json",
      });

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Progress tracking
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };

        // Success
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Get public URL of uploaded file
            const fileUrl =
              xhr.getResponseHeader("Location") ||
              `${url}/${encodeURIComponent(fields.key)}`;
            resolve({ success: true, s3FileKey: fields["key"] });
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        // Network error
        xhr.onerror = () => reject(new Error("Network error"));

        // Build FormData and Add pre-signed fields
        const formData = new FormData();
        Object.keys(fields).forEach((key) => {
          formData.append(key, fields[key]);
        });
        formData.append("file", file);
        xhr.open("POST", url);
        xhr.send(formData);
      });
    } catch (err) {
      // CTODO-11
      console.error("Upload error:", err);
      throw err;
    }
  };

  return (
    <div className={styles.fileInfo}>
      <div className={styles.fileDetails}>
        <span className={styles.fileName}>{file.name}</span>
        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
      </div>

      {startUpload && (
        <>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className={styles.progressText}>
            <span>{uploadProgress}%</span>
            <span>
              {formatFileSize((uploadProgress / 100) * file.size)} /{" "}
              {formatFileSize(file.size)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
