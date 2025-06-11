// Mocked dependencies
import { Player } from '../core/player'; // Only Player type might be needed
import { Balloon, Question } from '../components/balloon'; // Types

// --- MOCKS CONFIGURATION ---
// This object will hold all mocked DOM elements.
// We can change its properties in tests before loading gameController.
const mockDomElementsState = {
  canvas: {
    width: 800,
    height: 600,
    getContext: jest.fn().mockReturnThis(),
    getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 })),
    addEventListener: jest.fn() as jest.Mock,
    removeEventListener: jest.fn(),
  } as unknown as HTMLCanvasElement,
  ctx: {
    clearRect: jest.fn(),
    drawImage: jest.fn(), fill: jest.fn(), beginPath: jest.fn(), moveTo: jest.fn(), lineTo: jest.fn(),
    closePath: jest.fn(), arc: jest.fn(), save: jest.fn(), translate: jest.fn(), restore: jest.fn(),
    fillText: jest.fn(), measureText: jest.fn(() => ({ width: 20 })), fillRect: jest.fn(),
    stroke: jest.fn(),
    fillStyle: '', strokeStyle: '', lineWidth: 0, font: '', textAlign: '',
  } as unknown as CanvasRenderingContext2D,
  scoreEl: { textContent: '' } as HTMLElement,
  livesEl: { textContent: '' } as HTMLElement,
  questionEl: { textContent: '' } as HTMLElement,
  startBtn: { style: { display: '' }, addEventListener: jest.fn() as jest.Mock } as unknown as HTMLButtonElement,
  overlay: { style: { visibility: '' }, addEventListener: jest.fn() as jest.Mock } as unknown as HTMLElement,
  messageTitle: { textContent: '' } as HTMLElement,
  messageContent: { textContent: '' } as HTMLElement,
  restartBtn: { style: { display: '' }, addEventListener: jest.fn() as jest.Mock } as unknown as HTMLButtonElement,
  // Mock document.addEventListener separately if possible, or rely on global spies.
  // For now, this is tricky without a direct reference to 'document'.
};

jest.mock('../utils/domElements', () => mockDomElementsState);
jest.mock('../core/player', () => ({ drawPlayer: jest.fn() }));
const mockSpawnedBalloonsList: Balloon[] = [{ x: 100, y: 50, val: 123, image: {} as HTMLImageElement, speed: 1, floatOffset: 0, color: 'red' }];
jest.mock('../components/balloon', () => ({
  drawBalloons: jest.fn(),
  spawnBalloons: jest.fn(() => mockSpawnedBalloonsList),
  BALLOON_RADIUS: 28,
}));
const mockGeneratedQuestion: Question = { text: '2+2=?', answer: 4 };
jest.mock('../core/questions', () => ({
  generateQuestion: jest.fn(() => mockGeneratedQuestion),
}));
const audioResumeMock = jest.fn().mockResolvedValue(undefined);
jest.mock('../core/audio', () => ({
  audioCtx: { resume: audioResumeMock },
  startBackgroundMusic: jest.fn(),
  playPopSound: jest.fn(),
  playFailSound: jest.fn(),
}));

// Helper to get the latest mock for generateQuestion
const getGenerateQuestionMock = () => require('../core/questions').generateQuestion;
const getAudioCtxResumeMock = () => require('../core/audio').audioCtx.resume;


describe('GameController', () => {
  let gameControllerModule: any;
  let documentAddEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules(); // Ensure a fresh module for each test
    jest.clearAllMocks();
    jest.useFakeTimers(); // Use fake timers for this test suite

    // Reset DOM element mock states
    mockDomElementsState.scoreEl.textContent = '0';
    mockDomElementsState.livesEl.textContent = '3';
    mockDomElementsState.overlay.style.visibility = 'hidden';
    mockDomElementsState.startBtn.style.display = 'block';
    mockDomElementsState.messageTitle.textContent = '';
    mockDomElementsState.messageContent.textContent = '';

    // Spy on document.addEventListener
    documentAddEventListenerSpy = jest.spyOn(document, 'addEventListener');

    // Load the game controller module. This will execute its top-level code,
    // including attaching event listeners.
    gameControllerModule = require('../gameController');
  });

  afterEach(() => {
    jest.useRealTimers();
    documentAddEventListenerSpy.mockRestore(); // Restore document spy
  });

  describe('Initialization and Event Listener Attachment', () => {
    test('should attach event listeners on load', () => {
      expect(mockDomElementsState.startBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      expect(mockDomElementsState.restartBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      expect(mockDomElementsState.canvas.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('startBtn Click - Initial Interaction', () => {
    test('should update UI, call generateQuestion, and audioCtx.resume on first click', () => {
      // The module is loaded in beforeEach, isRunning should be false.
      // Canvas is mocked and available.
      const startBtnMock = mockDomElementsState.startBtn.addEventListener as jest.Mock;
      const clickCallback = startBtnMock.mock.calls.find((call: any) => call[0] === 'click')?.[1];

      expect(clickCallback).toBeDefined();
      if (!clickCallback) return; // Guard for TypeScript

      clickCallback(); // Simulate click

      expect(mockDomElementsState.startBtn.style.display).toBe('none');

      const generateQuestionMock = getGenerateQuestionMock();
      expect(generateQuestionMock).toHaveBeenCalledTimes(1);

      const audioResume = getAudioCtxResumeMock();
      expect(audioResume).toHaveBeenCalledTimes(1);
    });
  });

  describe('restartBtn Click - Initial Interaction', () => {
    test('should update UI and call generateQuestion on first click', () => {
      // Simulate game over state for restart button to be relevant
      mockDomElementsState.overlay.style.visibility = 'visible';

      const restartBtnMock = mockDomElementsState.restartBtn.addEventListener as jest.Mock;
      const clickCallback = restartBtnMock.mock.calls.find((call: any) => call[0] === 'click')?.[1];

      expect(clickCallback).toBeDefined();
      if (!clickCallback) return; // Guard for TypeScript

      clickCallback(); // Simulate click

      expect(mockDomElementsState.overlay.style.visibility).toBe('hidden');

      const generateQuestionMock = getGenerateQuestionMock();
      expect(generateQuestionMock).toHaveBeenCalledTimes(1);
    });
  });
});
