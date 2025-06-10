export function shuffleArray<T>(arr: T[]): void {
  for (let i: number = arr.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
