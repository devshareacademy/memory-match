import { shuffleArray } from './utils';

export type MemoryMatchConfig<T> = {
  cards: T[];
  onCardFlipCallback?: (cardIndex: number) => void;
  onMatchCallback?: (firstIndex: number, secondIndex: number) => void;
  onMismatchCallback?: (firstIndex: number, secondIndex: number) => void;
  onGameOverCallback?: () => void;
  howToCheckForMatch?: (firstCard: T, secondCard: T) => boolean;
};

export class MemoryMatch<T> {
  /** Array containing card identifiers (e.g., numbers, strings). */
  #cards: T[];
  /** Holds indices of currently flipped cards. */
  #flippedCards: number[];
  /** Stores indices of matched cards. */
  #matchedCards: Set<number>;
  /** Callback function triggered when a card is flipped. */
  #onCardFlipCallback: ((cardIndex: number) => void) | undefined;
  /** Callback function triggered when two cards match. */
  #onMatchCallback: ((firstIndex: number, secondIndex: number) => void) | undefined;
  /** Callback function triggered when two cards don't match. */
  #onMismatchCallback: ((firstIndex: number, secondIndex: number) => void) | undefined;
  /** Callback function triggered when all cards are matched. */
  #onGameOverCallback: (() => void) | undefined;
  /** Tracks if the game has ended (when all matches are found). */
  #isGameOver: boolean;
  /** Function that is used for checking for equality between two cards. If not provided, a default check of
   * `firstCard === secondCard` will be used. This is useful for objects and we might want to compare the fields
   * on the two objects for equality.
   */
  #howToCheckForMatch: ((firstCard: T, secondCard: T) => boolean) | undefined;

  constructor(config: MemoryMatchConfig<T>) {
    this.#cards = config.cards;
    this.#flippedCards = [];
    this.#matchedCards = new Set<number>(); // Stores indices of matched cards
    this.#onCardFlipCallback = config.onCardFlipCallback;
    this.#onMatchCallback = config.onMatchCallback;
    this.#onMismatchCallback = config.onMismatchCallback;
    this.#onGameOverCallback = config.onGameOverCallback;
    this.#howToCheckForMatch = config.howToCheckForMatch;
    this.#isGameOver = false;

    // shuffle the provided cards
    shuffleArray(this.#cards);
  }

  get isGameOver(): boolean {
    return this.#isGameOver;
  }

  get flippedCards(): number[] {
    return this.#flippedCards.slice();
  }

  get matchedCards(): Set<number> {
    return new Set([...this.#matchedCards]);
  }

  get cards(): T[] {
    return this.#cards.slice();
  }

  /**
   * Handles the logic of flipping a card by its index.
   * Calls the onCardFlip callback when a card is flipped.
   * Prevents flipping more than two cards or already matched cards.
   * @param {number} cardIndex - Index of the card being flipped.
   */
  public flipCard(cardIndex: number): void {
    // if game is already over, prevent flipping cards
    if (this.#isGameOver) {
      return;
    }

    // Prevent flipping more than 2 cards, flipping already matched cards, or the same card twice
    if (
      this.#flippedCards.length === 2 ||
      this.#matchedCards.has(cardIndex) ||
      this.#flippedCards.includes(cardIndex)
    ) {
      return;
    }

    // Add the card index to the flipped cards array
    this.#flippedCards.push(cardIndex);

    // trigger the card flip callback if provided
    if (this.#onCardFlipCallback !== undefined) {
      this.#onCardFlipCallback(cardIndex);
    }

    // If two cards are flipped, check if they match
    if (this.#flippedCards.length === 2) {
      this.#checkForMatch();
    }
  }

  /**
   * Compares the two flipped cards to determine if they match.
   * Calls onMatch if the cards match, or onMismatch if they don't.
   * Resets the flippedCards array after checking.
   */
  #checkForMatch(): void {
    const [firstIndex, secondIndex] = this.#flippedCards;
    const firstCard = this.#cards[firstIndex];
    const secondCard = this.#cards[secondIndex];

    let isMatch = firstCard === secondCard;
    if (this.#howToCheckForMatch !== undefined) {
      isMatch = this.#howToCheckForMatch(firstCard, secondCard);
    }

    if (isMatch) {
      // Cards match
      this.#matchedCards.add(firstIndex);
      this.#matchedCards.add(secondIndex);
      // trigger the on card match callback if provided
      if (this.#onMatchCallback !== undefined) {
        this.#onMatchCallback(firstIndex, secondIndex);
      }

      // If all cards are matched, trigger the game over callback if provided
      if (this.#matchedCards.size === this.#cards.length) {
        this.#isGameOver = true;
        if (this.#onGameOverCallback !== undefined) {
          this.#onGameOverCallback();
        }
      }
    } else {
      // Cards don't match, trigger callback if provided
      if (this.#onMismatchCallback !== undefined) {
        this.#onMismatchCallback(firstIndex, secondIndex);
      }
    }

    // Reset the flipped cards array for the next turn
    this.#flippedCards = [];
  }

  /**
   * Resets the game by shuffling the cards and clearing any flipped or matched cards.
   * Keeps the same card set but reshuffles them.
   */
  public resetGame(): void {
    // Reshuffle the cards
    shuffleArray(this.#cards);
    // clear existing flipped and matched cards
    this.#flippedCards = [];
    this.#matchedCards.clear();
  }
}
