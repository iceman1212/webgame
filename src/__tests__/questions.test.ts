import { generateQuestion, Question } from '../core/questions';

describe('Question Module', () => {
  describe('generateQuestion', () => {
    it('should return a valid Question object', () => {
      const question = generateQuestion();
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('answer');
      expect(typeof question.text).toBe('string');
      expect(typeof question.answer).toBe('number');
    });

    it('should generate a question text ending with " = ?" an arithmetic expression', () => {
      const question = generateQuestion();
      expect(question.text).toMatch(/\d+ [+\-*] \d+ = \?/);
    });

    // More specific tests, e.g. calculate answer based on text
    it('should generate a question where the answer matches the text', () => {
      for (let i = 0; i < 10; i++) { // Run a few times due to randomness
        const question = generateQuestion();
        const match = question.text.match(/(\d+) ([+\-*]) (\d+) = \?/);
        expect(match).not.toBeNull();
        if (match) {
          const a = parseInt(match[1]);
          const op = match[2];
          const b = parseInt(match[3]);
          let expectedAnswer;
          if (op === '+') expectedAnswer = a + b;
          else if (op === '-') expectedAnswer = a - b;
          else expectedAnswer = a * b;
          expect(question.answer).toBe(expectedAnswer);
        }
      }
    });
  });
});
