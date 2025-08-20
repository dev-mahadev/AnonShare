export const isValueWithinLimit = (value, [minValue = 1, maxValue = 50]) => {
  try {
    return value >= minValue && value <= maxValue;
  } catch (e) {
    // CTODO-5
    // console.error("Error while checking value", e);
    return false;
  }
};
