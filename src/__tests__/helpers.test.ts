import { shuffleArray } from '../utils/helpers';

describe('Helpers Module', () => {
  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const originalArray = [1, 2, 3, 4, 5];
      // Pass a copy to shuffleArray, as it shuffles in-place
      const arrayCopy = [...originalArray];
      shuffleArray(arrayCopy);
      expect(arrayCopy).toHaveLength(originalArray.length);
    });

    it('should contain the same elements as the original array', () => {
      const originalArray = [1, 2, 3, 4, 5];
      const arrayCopy = [...originalArray];
      shuffleArray(arrayCopy);
      originalArray.forEach(item => {
        expect(arrayCopy).toContain(item);
      });
      // Also check the other way to ensure no extra elements
      arrayCopy.forEach(item => {
        expect(originalArray).toContain(item);
      });
    });

    it('should handle an empty array', () => {
      const originalArray: number[] = [];
      const arrayCopy = [...originalArray];
      shuffleArray(arrayCopy);
      expect(arrayCopy).toEqual([]);
    });

    it('should handle an array with one element', () => {
      const originalArray = [42];
      const arrayCopy = [...originalArray];
      shuffleArray(arrayCopy);
      expect(arrayCopy).toEqual([42]);
    });

    it('should generally change the order of elements for a larger array', () => {
      const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const arrayCopy = [...originalArray];
      shuffleArray(arrayCopy);
      // It's statistically improbable for a shuffle of 10 items to be the same
      // unless the shuffle algorithm is broken or very unlucky.
      // To make this test more robust, we could run it multiple times or check against
      // a few known shuffles, but for this purpose, a direct inequality is often sufficient.
      if (originalArray.length > 1) {
        // Only makes sense if array has more than one element
        expect(arrayCopy).not.toEqual(originalArray);
      } else {
        expect(arrayCopy).toEqual(originalArray); // Should be equal if 0 or 1 element
      }
    });
  });
});
