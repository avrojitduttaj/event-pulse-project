export const crowdToWeight = (count, maxCount) => {
  if (count < 0) throw new Error('Count cannot be negative');
  if (maxCount <= 0) throw new Error('Max count must be positive');
  return Math.min(count / maxCount, 1);
};

export const weightToColor = (weight) => {
  if (weight > 0.75) return 'var(--red)';
  if (weight > 0.5) return 'var(--amber)';
  return 'var(--green)';
};