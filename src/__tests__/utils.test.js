import { crowdToWeight, weightToColor } from '../utils/crowdScore';
import { formatQuestion } from '../utils/formatQuestion';
import { parseSchedule } from '../utils/scheduleParser';

describe('crowdScore.js', () => {
  it('normalizes density values to 0-1', () => {
    expect(crowdToWeight(50, 100)).toBe(0.5);
    expect(crowdToWeight(150, 100)).toBe(1);
    expect(crowdToWeight(0, 100)).toBe(0);
  });

  it('returns correct color string', () => {
    expect(weightToColor(0.2)).toBe('var(--green)');
    expect(weightToColor(0.6)).toBe('var(--amber)');
    expect(weightToColor(0.9)).toBe('var(--red)');
  });
});

describe('formatQuestion.js', () => {
  it('strips html and formats correctly', () => {
    expect(formatQuestion('hello')).toBe('Hello?');
    const long = 'a'.repeat(250);
    expect(formatQuestion(long).length).toBeLessThanOrEqual(204);
  });
});

describe('scheduleParser.js', () => {
  it('parses schedule arrays correctly', () => {
    const raw = [{ id: '1', title: 'Opening', startTime: '2026-04-14T10:00:00Z' }];
    const parsed = parseSchedule(raw);
    expect(parsed[0].title).toBe('Opening');
    expect(parsed[0].startTime).toBe('2026-04-14T10:00:00Z');
  });
});