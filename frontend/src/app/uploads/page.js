"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { MAX_FILE_SIZE } from "@/constants/features";
import FileUploader from "@/Components/FileUploader";
import { useNotify } from "@/lib/notifications/notificationClient";
import ShortenedContent from "@/Components/ShortenedContent";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState(null);

  const notify = useNotify();

  // Handle file selection
  const handleFileSelect = (e) => {
    if (isUploading) return;

    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  // Validate file size
  const validateAndSetFile = (file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File size (${formatFileSize(file.size)}) exceeds the 100MB limit.`
      );
      setFile(null);
      return;
    }

    setError("");
    setFile(file);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      await uploadWithPresignedPost(file);
      // Handle success (show success message, etc.)
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    if (isUploading) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (isUploading) return;
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    if (isUploading) return;
    e.preventDefault();
  };

  const handleDrop = (e) => {
    if (isUploading) return;
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  // ===== Helper functions =====
  const handleUploadCompletion = async (
    uploadExecutionMessage,
    shortenedUrl
  ) => {
    notify(uploadExecutionMessage);
    setShortenedUrl(shortenedUrl);
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <h1 className={styles.title}>AnonFile</h1>
        <p className={styles.subtitle}>Share files anonymously</p>
      </div>
      {shortenedUrl ? (
        <ShortenedContent shortenedUrl={shortenedUrl} />
      ) : (
        <>
          <div
            className={`${styles.dropZone} 
          ${isDragging ? styles.dragging : ""} 
          ${error ? styles.error : ""} 
          ${isUploading ? styles.disabled : ""}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={styles.dropZoneContent}>
              <svg
                className={styles.uploadIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>

              <p className={styles.dropText}>
                {isUploading
                  ? "Uploading..."
                  : isDragging
                  ? "Drop the file here"
                  : "Drag & drop a file here, or click to select"}
              </p>

              <p className={styles.smallText}>Maximum file size: 100MB</p>

              <input
                type="file"
                className={styles.fileInput}
                onChange={handleFileSelect}
                disabled={isUploading}
                onClick={(e) => (e.target.value = null)}
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          {file && (
            <FileUploader
              file={file}
              startUpload={isUploading}
              handleUploadCompletion={handleUploadCompletion}
            />
          )}

          {file && !error && !shortenedUrl && (
            <button
              className={`${styles.uploadBtn} ${
                isUploading ? styles.loading : ""
              }`}
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FileUpload;
