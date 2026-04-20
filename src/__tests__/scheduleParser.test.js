import { parseSchedule } from '../utils/scheduleParser';

describe('parseSchedule', () => {
  test('handles empty array', () => {
    expect(parseSchedule([])).toEqual([]);
  });
  test('filters sessions with no title', () => {
    const input = [{ id: '1' }, { id: '2', title: 'Talk' }];
    expect(parseSchedule(input)).toHaveLength(1);
  });
  test('defaults missing startTime to TBD', () => {
    const result = parseSchedule([{ id: '1', title: 'Talk' }]);
    expect(result[0].startTime).toBe('TBD');
  });
  test('defaults missing room to Main Hall', () => {
    const result = parseSchedule([{ id: '1', title: 'Talk' }]);
    expect(result[0].room).toBe('Main Hall');
  });
  test('handles non-array input', () => {
    expect(parseSchedule(null)).toEqual([]);
  });
});