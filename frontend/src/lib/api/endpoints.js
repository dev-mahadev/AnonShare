import { getParams } from "./util";

const SHORT_BASE_URL = "/short";
const PASTE_BASE_URL = "/paste";
const AUTH_BASE_URL = "/auth";
const UPLOADS_BASE_URL = "/uploads";

export const ENDPOINTS = {
  SHORT: {
    BASE: `${SHORT_BASE_URL}/`,
  },

  PASTE: {
    BASE: `${PASTE_BASE_URL}/`,
    DETAIL: (shortUrl) => `${PASTE_BASE_URL}/${shortUrl}`,
  },

  UPLOADS: {
    BASE: `${UPLOADS_BASE_URL}/`,

    // Data can be key-value or array of array
    GET_PRESIGNED_POST_URL: (data) =>
      `${UPLOADS_BASE_URL}/get_presigned_post_url/?${getParams(data)}`,
  },

  // TODO: IMPLEMENT in next phase
  AUTH: {
    BASE: `${AUTH_BASE_URL}/`,
  },
};
