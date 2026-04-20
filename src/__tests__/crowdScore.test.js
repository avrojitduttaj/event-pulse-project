import { crowdToWeight } from '../utils/crowdScore';

describe('crowdToWeight', () => {
  test('returns 0 when count is 0', () => {
    expect(crowdToWeight(0, 100)).toBe(0);
  });
  test('returns 1 when count equals max', () => {
    expect(crowdToWeight(100, 100)).toBe(1);
  });
  test('returns 0.5 for half capacity', () => {
    expect(crowdToWeight(50, 100)).toBe(0.5);
  });
  test('clamps above max to 1', () => {
    expect(crowdToWeight(150, 100)).toBe(1);
  });
  test('throws on negative count', () => {
    expect(() => crowdToWeight(-1, 100)).toThrow();
  });
});