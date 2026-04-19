import { crowdScoreToWeight, getCrowdColor } from '../utils/crowdScore';
import { formatQuestion } from '../utils/formatQuestion';
import { parseSchedule } from '../utils/scheduleParser';

describe("crowdScore.js", () => {
  it("normalizes density values to 0-1", () => {
    expect(crowdScoreToWeight(0.5)).toBe(0.5);
    expect(crowdScoreToWeight(50)).toBe(0.5);
    expect(crowdScoreToWeight(150)).toBe(1);
    expect(crowdScoreToWeight(-10)).toBe(0);
  });
  
  it("returns correct color string", () => {
    expect(getCrowdColor(0.2)).toBe("teal");
    expect(getCrowdColor(0.6)).toBe("amber");
    expect(getCrowdColor(0.9)).toBe("red");
  });
});

describe("formatQuestion.js", () => {
  it("cleans html tags and truncates", () => {
    expect(formatQuestion("Hello <script>")).toBe("Hello script");
    const longString = "a".repeat(300);
    expect(formatQuestion(longString)).toHaveLength(250);
  });
});

describe("scheduleParser.js", () => {
  it("parses schedule arrays correctly", () => {
    const raw = [{ title: "Opening", startTime: "2026-04-14T10:00:00Z" }];
    const parsed = parseSchedule(raw);
    expect(parsed[0].title).toBe("Opening");
    expect(parsed[0].startTime).toBeInstanceOf(Date);
  });
});
