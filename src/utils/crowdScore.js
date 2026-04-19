export const crowdScoreToWeight = (density) => {
  // density is 0-100 or 0-1
  const norm = density > 1 ? density / 100 : density;
  return Math.min(Math.max(norm, 0), 1);
};

export const getCrowdColor = (density) => {
  const norm = density > 1 ? density / 100 : density;
  if (norm < 0.3) return 'teal';
  if (norm < 0.7) return 'amber';
  return 'red';
};
