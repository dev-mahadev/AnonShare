"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import styles from "./index.module.css";

export default function ClientQR({ data = null, addtionalOptions = {} }) {
  const options = {
    width: 300,
    height: 300,
    type: "svg",
    data: data,
    image: "/shortner.webp",
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 20,
      crossOrigin: "anonymous",
      saveAsBlob: true,
    },
    dotsOptions: {
      color: "#0d1547",
      type: "rounded",
    },
    ...addtionalOptions,
  };

  const [qrCode, setQrCode] = useState();
  const ref = useRef(null);

  useEffect(() => {
    setQrCode(new QRCodeStyling(options));
  }, []);

  useEffect(() => {
    if (ref.current) {
      qrCode?.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: "png",
    });
  };

  return !data ? (
    <></>
  ) : (
    <>
      <div className={styles.qrWrapper} ref={ref} />
      <button
        className={styles.downloadButton}
        type="button"
        onClick={onDownloadClick}
      >
        Download
      </button>
    </>
  );
}
