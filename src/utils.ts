/**
 * Shuffles the array in place using the Fisher-Yates algorithm.
 * @param {Array} array - Array to shuffle.
 * @returns {void}
 */
export function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
