// Extract CSRF token from cookie
export const getCsrfToken = () => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
  return cookieValue;
};

export const getParams = (data) => {
  const params = new URLSearchParams();

  if (data === null || data === undefined) {
    return params;
  }

  if (Array.isArray(data)) {
    // Handle: Array of arrays → [['k', 'v'], ['k2', 'v2']]
    data.forEach(([key, value]) => {
      if (key !== null && key !== undefined) {
        params.append(key, value ?? "");
      }
    });
  } else if (typeof data === "object") {
    // Handle: Plain object → { key: value }
    Object.entries(data).forEach(([key, value]) => {
      params.append(key, value ?? "");
    });
  } else {
    console.warn("Unsupported data type for getParams:", typeof data);
  }

  return params;
};
