import { formatQuestion } from '../utils/formatQuestion';

describe('formatQuestion', () => {
  test('capitalizes first letter', () => {
    expect(formatQuestion('what is AI?')[0]).toBe('W');
  });
  test('adds question mark if missing', () => {
    expect(formatQuestion('what is AI')).toMatch(/\?$/);
  });
  test('trims whitespace', () => {
    expect(formatQuestion('  hello  ')).toBe('Hello?');
  });
  test('returns empty string for empty input', () => {
    expect(formatQuestion('')).toBe('');
  });
  test('truncates at 200 chars', () => {
    const long = 'a'.repeat(250);
    expect(formatQuestion(long).length).toBeLessThanOrEqual(204);
  });
});