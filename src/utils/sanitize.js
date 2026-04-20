export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .slice(0, 500)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"']/g, '');
};