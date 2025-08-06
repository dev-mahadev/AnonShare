// src/lib/api/apiClient.js

// Base URL from environment variables. Eg: http://localhost:3000
// Note: Contains url **wihout** suffix '/'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * apiClient - A simple wrapper around fetch for API calls
 */
const apiClient = {
  async get(endpoint, options = {}) {
    return this.request("GET", endpoint, null, options);
  },

  async post(endpoint, data, options = {}) {
    return this.request("POST", endpoint, data, options);
  },

  async patch(endpoint, data, options = {}) {
    return this.request("PATCH", endpoint, data, options);
  },

  async delete(endpoint, options = {}) {
    return this.request("DELETE", endpoint, null, options);
  },

  async request(method, endpoint, data, { token, headers } = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      ...(data && { body: JSON.stringify(data) }),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      if (response.status === 204) {
        return {};
      }

      return await response.json();
    } catch (error) {
      console.error("API Request failed:", { method, url, error: error.message });
      throw error;
    }
  },
};
	
export default apiClient;
