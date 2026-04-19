export const formatQuestion = (text) => {
  if (!text) return "";
  let clean = text.trim();
  // Basic moderation / cleaning
  clean = clean.replace(/[<>]/g, ""); // strip basic html tags
  if (clean.length > 250) {
    clean = clean.substring(0, 247) + "...";
  }
  return clean;
};
