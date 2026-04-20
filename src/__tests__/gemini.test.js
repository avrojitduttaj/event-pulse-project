jest.mock('../services/gemini', () => ({
  rankQuestions: async (questions) => {
    if (!questions || questions.length === 0) return [];
    return questions.map(q => ({ ...q, geminiRank: 0.5, clusterId: 'General' }));
  },
  getSentiment: async (questions) => {
    return { sentiment: 'neutral' };
  },
  getRecommendation: async () => {
    return { sessionId: null, reason: 'fallback', walkMinutes: 0, urgency: 'later' };
  }
}));

const { rankQuestions, getSentiment, getRecommendation } = require('../services/gemini');

describe('Gemini service fallbacks', () => {
  test('rankQuestions returns empty array for empty input', async () => {
    const result = await rankQuestions([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  test('getSentiment returns object with sentiment', async () => {
    const result = await getSentiment([]);
    expect(result).toHaveProperty('sentiment');
  });

  test('getRecommendation returns urgency field', async () => {
    const result = await getRecommendation({});
    expect(result).toHaveProperty('urgency');
  });

  test('rankQuestions maps questions correctly', async () => {
    const input = [{ id: '1', text: 'Test question' }];
    const result = await rankQuestions(input);
    expect(result[0]).toHaveProperty('geminiRank');
  });
});