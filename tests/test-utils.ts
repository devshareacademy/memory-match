import { MemoryMatch } from '../src/memory-match';

export class Card {
  #val: number;

  constructor(val: number) {
    this.#val = val;
  }

  get val(): number {
    return this.#val;
  }
}

export class Game {
  #memoryMatch: MemoryMatch<Card>;
  #cards: Card[];
  #gameOverCalled: boolean;
  #flippedCardIndices: number[];
  #matchedCardIndices: number[];
  #mismatchedCardIndices: number[];

  constructor() {
    const card1 = new Card(1);
    const card2 = new Card(2);
    const card3 = new Card(1);
    const card4 = new Card(2);
    this.#cards = [card1, card2, card3, card4];
    this.#gameOverCalled = false;
    this.#flippedCardIndices = [];
    this.#matchedCardIndices = [];
    this.#mismatchedCardIndices = [];
    this.#memoryMatch = new MemoryMatch({
      cards: this.#cards,
      onCardFlipCallback: (index) => {
        this.#onCardFlipCallback(index);
      },
      onMatchCallback: (firstIndex, secondIndex) => {
        this.#onMatchCallback(firstIndex, secondIndex);
      },
      onMismatchCallback: (firstIndex, secondIndex) => {
        this.#onMismatchCallback(firstIndex, secondIndex);
      },
      onGameOverCallback: () => {
        this.#onGameOverCallback();
      },
      howToCheckForMatch: (firstCard, secondCard) => {
        return this.#howToCheckForMatch(firstCard, secondCard);
      },
    });
  }

  get flippedCardIndices() {
    return this.#flippedCardIndices;
  }

  get matchedCardIndices() {
    return this.#matchedCardIndices;
  }

  get mismatchedCardIndices() {
    return this.#mismatchedCardIndices;
  }

  get gameOverCalled() {
    return this.#gameOverCalled;
  }

  get memoryMatch() {
    return this.#memoryMatch;
  }

  #onCardFlipCallback(index: number) {
    this.#flippedCardIndices.push(index);
  }

  #onMatchCallback(firstIndex: number, secondIndex: number) {
    this.#matchedCardIndices.push(firstIndex, secondIndex);
  }

  #onMismatchCallback(firstIndex: number, secondIndex: number) {
    this.#mismatchedCardIndices.push(firstIndex, secondIndex);
  }

  #onGameOverCallback() {
    this.#gameOverCalled = true;
  }

  #howToCheckForMatch(firstCard: Card, secondCard: Card) {
    return firstCard.val === secondCard.val;
  }

  flipCard(cardIndex: number) {
    this.#memoryMatch.flipCard(cardIndex);
  }
}
