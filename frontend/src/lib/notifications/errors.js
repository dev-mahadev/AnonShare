// Possible improvement: Could have created a notificationCreator function

export const NETWORK_ERRORS = {
  NETWORK_ERROR: {
    message: "Unable to reach the server.",
    kind: "error"
  },
  NOT_FOUND: {
    message: "Item not found.",
    kind: "error"
  }
};

export const INPUT_ERRORS = {
  INVALID_INPUT: {
    message: "Please check your input and try again.",
    kind: "error"
  }
};

export const GENERIC_ERRORS = {
  GENERIC: {
    message: "Something went wrong. Please try again.",
    kind: "error"
  }
};