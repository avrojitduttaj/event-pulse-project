/**
 * EventPulse crowd density utilities
 * Used by CrowdHeatmap and AttendeeDashboard
 */

export const crowdToWeight = (count, maxCount) => {
  if (typeof count !== 'number' || typeof maxCount !== 'number') {
    throw new TypeError('count and maxCount must be numbers');
  }
  if (count < 0) throw new Error('Count cannot be negative');
  if (maxCount <= 0) throw new Error('Max count must be positive');
  return Math.min(count / maxCount, 1);
};

// Alias for backward compatibility with VenueMap
export const crowdScoreToWeight = (density) => {
  if (typeof density !== 'number') return 0;
  if (density < 0) return 0;
  if (density > 1) return 1;
  return density;
};

export const weightToColor = (weight) => {
  if (weight > 0.75) return 'var(--red)';
  if (weight > 0.5) return 'var(--amber)';
  return 'var(--green)';
};

export const getCrowdLabel = (count) => {
  if (count > 75) return 'packed';
  if (count > 50) return 'busy';
  return 'comfortable';
};