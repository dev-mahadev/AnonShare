export const isValueWithinLimit = (value, [minValue = 1, maxValue = 50]) => {
  try {
    return value >= minValue && value <= maxValue;
  } catch (e) {
    // CTODO-5
    // console.error("Error while checking value", e);
    return false;
  }
};

export const formatFileSize = (bytes) => {
  // Format file size for display
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const trimWord = (word, maxLength = 15) => {
  if (word.length <= maxLength) {
    return word;
  }
  return word.slice(0, maxLength - 3) + "...";
};
