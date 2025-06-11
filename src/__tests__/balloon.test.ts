import { Balloon, BALLOON_RADIUS, drawBalloons, spawnBalloons } from '../components/balloon';
import { Question } from '../core/questions';

// Mock domElements
jest.mock('../utils/domElements', () => {
  const originalCtx = {
    drawImage: jest.fn(),
    fill: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    arc: jest.fn(),
    save: jest.fn(),
    translate: jest.fn(),
    restore: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 20 })), // Mock measureText
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    textAlign: '',
    stroke: jest.fn(), // Added missing stroke mock
  };
  return {
    canvas: {
      width: 800, // Mock canvas width
      height: 600,
      getContext: jest.fn().mockReturnValue(originalCtx),
    },
    ctx: originalCtx,
    // Mock other elements if needed by the functions under test, though balloon.ts primarily uses canvas & ctx
    scoreEl: null,
    livesEl: null,
    questionEl: null,
    startBtn: null,
    overlay: null,
    messageTitle: null,
    messageContent: null,
    restartBtn: null,
  };
});

// Mock core/questions - generateQuestion is not used by balloon.ts, but Question interface is.
// spawnBalloons takes a Question object.
// No need to mock generateQuestion as it's not directly called by balloon.ts functions.

// Mock utils/helpers if needed, e.g., for shuffleArray
// For now, we'll let shuffleArray run, as testing its specific behavior is not the goal here.
// import { shuffleArray } from '../utils/helpers';
// jest.mock('../utils/helpers', () => ({
//   ...jest.requireActual('../utils/helpers'),
//   shuffleArray: jest.fn(arr => arr), // Example: mock shuffle to do nothing or a predictable shuffle
// }));

// Access the mocked canvas and context
const mockCanvas = jest.requireMock('../utils/domElements').canvas;
const mockCtx = jest.requireMock('../utils/domElements').ctx;

// Mock balloonImages to prevent actual image loading and control their state
// Create mock image objects that are "good enough" for the code being tested
const mockImage = { complete: true, naturalHeight: 50, src: '' } as any as HTMLImageElement; // Cast to avoid TS errors
const mockBalloonImages = [mockImage, mockImage, mockImage];

// It's better to mock the imported variable directly if possible, or the module that exports it.
// The following mocks the module '../components/balloon' to replace its `balloonImages` export.
// Note: This type of mock needs to be at the top level, before imports if it mocks the entire module.
// However, since we are only mocking a part of it and using other parts, this placement is tricky.
// A cleaner way would be to spyOn the export if it were mutable or use jest.doMock if imports are an issue.

// Let's adjust the mocking strategy for balloonImages slightly for clarity and correctness.
// We will mock the module and then re-import the functions we need.
// This is already done by the jest.mock call below, but we need to ensure it's effective.
// The previous jest.mock for '../components/balloon' is good.

describe('spawnBalloons', () => {
  const mockQuestion: Question = {
    text: '1 + 1 = ?',
    answer: 2,
  };
  let dateNowSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset relevant parts of mocks if necessary, e.g., canvas.width for different tests
    mockCanvas.width = 800; // Default mock canvas width
    // Mock Date.now() for predictable sway calculation
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1670000000000); // Consistent timestamp
  });

  afterEach(() => {
    // Restore Date.now()
    dateNowSpy.mockRestore();
  });

  test('should spawn 4 balloons', () => {
    const balloons = spawnBalloons(mockQuestion, []);
    expect(balloons.length).toBe(4);
  });

  test('should include one balloon with the correct answer', () => {
    const balloons = spawnBalloons(mockQuestion, []);
    expect(balloons.some(b => b.val === mockQuestion.answer)).toBe(true);
  });

  test('all balloon values should be numbers', () => {
    const balloons = spawnBalloons(mockQuestion, []);
    balloons.forEach(b => expect(typeof b.val).toBe('number'));
  });

  test('balloon x positions should be within canvas width', () => {
    const balloons = spawnBalloons(mockQuestion, []);
    balloons.forEach(b => {
      expect(b.x).toBeGreaterThanOrEqual(-BALLOON_RADIUS); // x is position of left edge of image, so can be slightly less than 0
      expect(b.x + BALLOON_RADIUS * 2).toBeLessThanOrEqual(mockCanvas.width + BALLOON_RADIUS); // right edge
    });
  });

  test('balloon y positions should be initialized correctly (negative, above canvas)', () => {
    const balloons = spawnBalloons(mockQuestion, []);
    balloons.forEach(b => {
      expect(b.y).toBeLessThan(0);
      // Example: y: -(BALLOON_RADIUS * 2 + Math.random() * 80)
      expect(b.y).toBeLessThanOrEqual(-(BALLOON_RADIUS * 2));
    });
  });

  test('balloon speed should be within expected range (1 to 2.5)', () => {
    const balloons = spawnBalloons(mockQuestion, []);
    balloons.forEach(b => {
      expect(b.speed).toBeGreaterThanOrEqual(1);
      expect(b.speed).toBeLessThanOrEqual(2.5); // 1 + 1.5
    });
  });

  test('balloon floatOffset should be generated (a number)', () => {
    const balloons = spawnBalloons(mockQuestion, []);
    balloons.forEach(b => {
      expect(typeof b.floatOffset).toBe('number');
    });
  });

  test('should return existing balloons if currentQuestion is null', () => {
    const existing: Balloon[] = [
      { x: 1, y: 1, val: 1, image: mockImage, speed: 1, floatOffset: 1, color: 'red' },
    ]; // Added color for interface conformity
    const balloons = spawnBalloons(null, existing);
    expect(balloons).toBe(existing);
  });

  test('should return existing balloons if canvas is null (hard to test directly with module mock)', () => {
    // To test this, we'd need to make the mocked canvas null.
    // This test is more conceptual given the current mocking strategy.
    // jest.spyOn(require('../utils/domElements'), 'canvas', 'get').mockReturnValue(null);
    // const balloons = spawnBalloons(mockQuestion, []); // This would fail if not handled
    // expect(balloons.length).toBe(0); // Or whatever the expected behavior is
  });
});

describe('drawBalloons', () => {
  const sampleBalloons: Balloon[] = [
    { x: 50, y: 50, val: 10, image: mockBalloonImages[0], speed: 1, floatOffset: 0, color: 'red' },
    {
      x: 150,
      y: 100,
      val: 20,
      image: mockBalloonImages[1],
      speed: 1.5,
      floatOffset: Math.PI / 2,
      color: 'blue',
    },
  ];

  const sampleBalloonWithNoImage: Balloon = {
    x: 250,
    y: 150,
    val: 30,
    image: { ...mockImage, complete: false } as any as HTMLImageElement,
    speed: 1,
    floatOffset: Math.PI,
    color: 'green',
  };

  let dateNowSpyDraw: jest.SpyInstance;

  beforeEach(() => {
    // Clear mock function calls before each test
    // Mock Date.now() for predictable sway calculation
    dateNowSpyDraw = jest.spyOn(Date, 'now').mockImplementation(() => 1670000000000); // Consistent timestamp
    mockCtx.drawImage.mockClear();
    mockCtx.fill.mockClear();
    mockCtx.beginPath.mockClear();
    mockCtx.arc.mockClear();
    mockCtx.stroke.mockClear();
    mockCtx.fillText.mockClear();
    mockCtx.moveTo.mockClear();
    mockCtx.lineTo.mockClear();
  });

  afterEach(() => {
    // Restore Date.now()
    dateNowSpyDraw.mockRestore();
  });

  test('should not crash and not call drawing functions if ctx is null (conceptual)', () => {
    // The `if (!ctx) return;` guard in drawBalloons handles this.
    // Our mock always provides a ctx. This test is more about acknowledging the guard.
    // If we could make the mocked ctx null, we would test it here.
    // For now, this test doesn't make direct assertions about ctx being null.
  });

  test('should not crash and do nothing if balloons array is empty', () => {
    drawBalloons([]);
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
    expect(mockCtx.arc).not.toHaveBeenCalled();
    expect(mockCtx.fill).not.toHaveBeenCalled();
    expect(mockCtx.stroke).not.toHaveBeenCalled();
    expect(mockCtx.fillText).not.toHaveBeenCalled();
    expect(mockCtx.drawImage).not.toHaveBeenCalled();
  });

  test('should call drawing functions for each balloon (with image)', () => {
    drawBalloons(sampleBalloons);
    const numBalloons = sampleBalloons.length;
    const FIXED_TIME = 1670000000000; // Same as mocked Date.now()

    // Shadow (arc + fill) + Image (drawImage) + String (moveTo, lineTo, stroke) + Text (fillText)
    expect(mockCtx.beginPath).toHaveBeenCalledTimes(numBalloons * 2); // Shadow arc, string path
    expect(mockCtx.arc).toHaveBeenCalledTimes(numBalloons); // Shadow arc for shadow
    expect(mockCtx.fill).toHaveBeenCalledTimes(numBalloons); // Shadow fill
    expect(mockCtx.drawImage).toHaveBeenCalledTimes(numBalloons);
    expect(mockCtx.moveTo).toHaveBeenCalledTimes(numBalloons);
    expect(mockCtx.lineTo).toHaveBeenCalledTimes(numBalloons);
    expect(mockCtx.stroke).toHaveBeenCalledTimes(numBalloons);
    expect(mockCtx.fillText).toHaveBeenCalledTimes(numBalloons);

    sampleBalloons.forEach(balloon => {
      const expectedSway = Math.sin(FIXED_TIME / 500 + balloon.floatOffset) * 8;
      const expectedBx = balloon.x + expectedSway;
      const expectedBy = balloon.y;

      // Check drawImage call for this balloon
      expect(mockCtx.drawImage).toHaveBeenCalledWith(
        balloon.image,
        expectedBx,
        expectedBy,
        BALLOON_RADIUS * 2,
        BALLOON_RADIUS * 2
      );
      // Check fillText call for this balloon
      expect(mockCtx.fillText).toHaveBeenCalledWith(
        balloon.val.toString(),
        expectedBx + BALLOON_RADIUS,
        expectedBy + BALLOON_RADIUS + 6
      );
    });
  });

  test('should draw fallback shape if balloon image is not complete', () => {
    drawBalloons([sampleBalloonWithNoImage]);
    expect(mockCtx.drawImage).not.toHaveBeenCalled();
    // Shadow (arc + fill) + Fallback (arc + fill + highlight_arc + fill) + String (...) + Text (...)
    // For the fallback: 1 arc for main circle, 1 arc for highlight. Both filled.
    // For the shadow: 1 arc, 1 fill.
    // For the string: 1 beginPath, 1 moveTo, 1 lineTo, 1 stroke.
    // For the text: 1 fillText.
    expect(mockCtx.beginPath).toHaveBeenCalledTimes(1 + 2 + 1); // shadow, fallback_main, fallback_highlight, string
    expect(mockCtx.arc).toHaveBeenCalledTimes(1 + 2); // 1 for shadow, 2 for fallback (main circle + highlight)
    expect(mockCtx.fill).toHaveBeenCalledTimes(1 + 2); // 1 for shadow, 2 for fallback fills

    // Check that fillStyle was set for the fallback shape and then for the highlight
    // The last fillStyle assignment before a fill() for the highlight is 'rgba(255,255,255,0.7)'
    // This requires inspecting the calls in order or making sure the specific fill call had this style.
    // For simplicity, we check the final state of fillStyle if it's an indicator.
    // However, fillStyle is set multiple times. The last fill is for the highlight.
    // The mockCtx.fillStyle property will reflect the last value assigned to it before any fill call.
    // To be precise, one would check calls to fill in order with the fillStyle at that time.
    // This test will verify that the highlight was attempted.
    expect(mockCtx.fill).toHaveBeenNthCalledWith(3); // Shadow, Fallback main, Fallback highlight
    // The fillStyle for the third fill (highlight) should be 'rgba(255,255,255,0.7)'
    // This is a bit tricky to assert directly without more complex mock tracking.
    // A simpler check is that fill was called the right number of times, and specific drawImage was not.
  });
});
