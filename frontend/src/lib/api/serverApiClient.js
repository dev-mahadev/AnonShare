// Apiclient for internal requests

const INTERNAL_API_BASE_URL = process.env.INTERNAL_API_BASE_URL + "/api";

const serverApiClient = {
  async get(endpoint, options = {}) {
    return this.request("GET", endpoint, null, options);
  },

  //Core request handler for internal API calls
  async request(method, endpoint, data, options = {}) {
    const url = `${INTERNAL_API_BASE_URL}${endpoint}`;

    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...(data !== null && { body: JSON.stringify(data) }),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // 204 No Content
      if (response.status === 204) {
        return {};
      }

      return await response.json();
    } catch (error) {
      console.error("Internal API Request failed:", {
        method,
        url,
        error: error.message,
      });
      throw error;
    }
  },
};

export default serverApiClient;
