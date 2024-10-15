import * as uvu from 'uvu';
import * as assert from 'uvu/assert';
import seedrandom from 'seedrandom';
import { MemoryMatch, MemoryMatchConfig } from '../src/memory-match';

const seed = 'f96d18a4-ebca-4241-8109-f543cafba0ed';
const testSuite = uvu.suite('Memory Match Tests');

testSuite.before.each(() => {
  seedrandom(seed, { global: true });
});

// Test Suite for MemoryMatch class
testSuite('MemoryMatch - card flipping and matching behavior', () => {
  // Setup a card array with two pairs of matching cards
  const cards = ['A', 'B', 'A', 'B'];
  // after shuffle, cards will be [ 'B', 'A', 'A', 'B' ]

  const flippedCardIndices: number[] = [];
  const matchedCardIndices: number[] = [];
  const mismatchedCardIndices: number[] = [];
  let gameOverCalled = false;

  const gameConfig: MemoryMatchConfig<string> = {
    cards,
    onCardFlipCallback: (index) => {
      flippedCardIndices.push(index);
    },
    onMatchCallback: (firstIndex, secondIndex) => {
      matchedCardIndices.push(firstIndex, secondIndex);
    },
    onMismatchCallback: (firstIndex, secondIndex) => {
      mismatchedCardIndices.push(firstIndex, secondIndex);
    },
    onGameOverCallback: () => {
      gameOverCalled = true;
    },
  };
  const game = new MemoryMatch(gameConfig);

  // Flip first two cards (match expected)
  game.flipCard(1); // A
  game.flipCard(2); // A (Match)

  assert.equal(flippedCardIndices, [1, 2], 'Cards 0 and 2 should be flipped');
  assert.equal(matchedCardIndices, [1, 2], 'Cards 0 and 2 should match');
  assert.equal(game.flippedCards.length, 0, 'After checking for match, no cards should be flipped');
  assert.equal(game.matchedCards.size, 2, 'Two cards should be matched');
  assert.equal(game.isGameOver, false, 'Game should not be over when all cards do not match');

  // Flip next two cards (match expected)
  game.flipCard(0); // B
  game.flipCard(3); // B (Match)

  assert.equal(flippedCardIndices, [1, 2, 0, 3], 'Cards 1 and 3 should be flipped');
  assert.equal(matchedCardIndices, [1, 2, 0, 3], 'Cards 1 and 3 should match');
  assert.ok(gameOverCalled, 'Game should be over when all cards match');
  assert.equal(game.flippedCards.length, 0, 'After checking for match, no cards should be flipped');
  assert.equal(game.matchedCards.size, 4, 'Four cards should be matched');
  assert.equal(game.isGameOver, true, 'Game should be over when all cards do match');
});

testSuite('MemoryMatch - mismatching behavior', () => {
  // Setup a card array with no matching pair in initial flips
  const cards = ['A', 'B', 'A', 'B'];
  // after shuffle, cards will be [ 'B', 'A', 'A', 'B' ]

  const flippedCardIndices: number[] = [];
  const matchedCardIndices: number[] = [];
  const mismatchedCardIndices: number[] = [];
  let gameOverCalled = false;

  const gameConfig: MemoryMatchConfig<string> = {
    cards,
    onCardFlipCallback: (index) => {
      flippedCardIndices.push(index);
    },
    onMatchCallback: (firstIndex, secondIndex) => {
      matchedCardIndices.push(firstIndex, secondIndex);
    },
    onMismatchCallback: (firstIndex, secondIndex) => {
      mismatchedCardIndices.push(firstIndex, secondIndex);
    },
    onGameOverCallback: () => {
      gameOverCalled = true;
    },
  };
  const game = new MemoryMatch(gameConfig);

  // Flip two non-matching cards (mismatch expected)
  game.flipCard(0); // B
  game.flipCard(1); // A (Mismatch)

  assert.equal(flippedCardIndices, [0, 1], 'Cards 0 and 1 should be flipped');
  assert.equal(mismatchedCardIndices, [0, 1], 'Cards 0 and 1 should mismatch');
  assert.equal(gameOverCalled, false, 'Game should not be over when all cards do match');
  assert.equal(game.flippedCards.length, 0, 'After checking for match, no cards should be flipped');
  assert.equal(game.matchedCards.size, 0, 'No cards should be matched');
  assert.equal(game.isGameOver, false, 'Game should not be over when all cards do not match');
});

testSuite('MemoryMatch - reset game behavior', () => {
  const cards = ['A', 'B', 'A', 'B'];
  // after shuffle, cards will be [ 'B', 'A', 'A', 'B' ]
  const flippedCardIndices: number[] = [];

  const gameConfig: MemoryMatchConfig<string> = {
    cards,
    onCardFlipCallback: (index) => {
      flippedCardIndices.push(index);
    },
  };
  const game = new MemoryMatch(gameConfig);

  // Flip two cards
  game.flipCard(0);
  game.flipCard(3);

  assert.equal(flippedCardIndices.length, 2, 'Two cards should be flipped before reset');
  assert.equal(game.isGameOver, false, 'Game should not be over when all cards do match');
  assert.equal(game.flippedCards.length, 0, 'Flipped cards should be empty before reset');
  assert.equal(game.matchedCards.size, 2, 'Matched cards should not empty before reset');

  // Reset the game
  game.resetGame();
  assert.equal(game.isGameOver, false, 'Game should not be over when all cards do match');
  assert.equal(game.flippedCards.length, 0, 'Flipped cards should be cleared after reset');
  assert.equal(game.matchedCards.size, 0, 'Matched cards should be cleared after reset');
});

testSuite.run();
