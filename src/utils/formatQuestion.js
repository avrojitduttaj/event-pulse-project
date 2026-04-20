export const formatQuestion = (text) => {
  if (!text || typeof text !== 'string') return '';
  let cleaned = text.trim();
  if (!cleaned) return '';
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  if (cleaned.length > 200) cleaned = cleaned.slice(0, 200) + '...';
  if (!/[.!?]$/.test(cleaned)) cleaned += '?';
  return cleaned;
};