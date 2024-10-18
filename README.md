# Memory Match

A NPM package that contains the core game logic for the game Memory Match.

## Installation

```bash
# npm
npm install -E @devshareacademy/memory-match

# yarn
yarn add -E @devshareacademy/memory-match
```

## Usage

```typescript
import { MemoryMatch } from '@devshareacademy/memory-match';

// Example array of card pairs (2 sets of matching cards)
const cards = [1, 2, 3, 1, 2, 3];
const game = new MemoryMatch({
        cards,
        onCardFlipCallback: (cardIndex) => { console.log(`Card flipped: ${cardIndex}`); },
        onMatchCallback: (firstIndex, secondIndex) => { console.log(`Match found: ${firstIndex}, ${secondIndex}`); },
        onMismatchCallback: (firstIndex, secondIndex) => { console.log(`Mismatch: ${firstIndex}, ${secondIndex}`); },
        onGameOverCallback: () => { console.log('Game Over! All cards matched!'); }
    }
);

// Simulate flipping cards
game.flipCard(0);
game.flipCard(3); // Match
```

For more details on the library and the available methods, please see the documentation and examples below.

## API Documentation

The game of Memory Match is represented by a 1D Array that matches the number of "Card" objects that are passed to the game configuration. To play the game, the player flips over cards one at a time looking to find a match. When a match is found, the card can no longer be flipped back over, and the game continues until all matches have been found. The library is constructed in a way that the core logic for the game is contained in the `MemoryMatch` class, and you can pass callback functions that will be invoked when key events happen in the game:

- a card is flipped over
- when a match is made
- when two cards do not match
- when the game is over

This structure should allow the library to work with any JavaScript framework, library, or even plain JavaScript games. The callbacks allow you to listen for these events, and then update the Game UI to reflect that state/action.

The `MemoryMatch` class expects one argument, which is the game configuration object.

### Game Config

| Name | Type | Description |
|---|---|---|
| cards | any[] | An array of strings, numbers, or objects that represent the cards in the game. This is required argument. |
| onCardFlipCallback | (cardIndex: number) => void | (Optional) A callback function that will be called when a card is flipped over. The callback will receive one argument: `cardIndex`, which is the index of the card that was flipped over. |
| onMatchCallback | (firstIndex: number, secondIndex: number) => void | (Optional) A callback function that will be called after two cards have been flipped over and they do match. The callback will receive two arguments: `firstIndex` and `secondIndex`, which are the indexes of the two cards that were previously flipped over.. |
| onMismatchCallback | (firstIndex: number, secondIndex: number) => void | (Optional) A callback function that will be called after two cards have been flipped over and they do not match. The callback will receive two arguments: `firstIndex` and `secondIndex`, which are the indexes of the two cards that were previously flipped over. |
| onGameOverCallback | () => void | (Optional) A callback function that will be called when the game is over (all matches have been found). No arguments will be provided. |
| howToCheckForMatch | (firstCard: T, secondCard: T) => boolean | (Optional) A callback function that will be used for checking if two "Cards" match. This allows the client to provide a custom `match` function. If not provided, the game will use a simple check of `firstCard === secondCard`. The callback will receive two arguments: `firstCard` and `secondCard`, which are the cards from the `cards` array that is provided in the game configuration. |
| howToShuffle | (cards: T[]) => void | (Optional) A callback function that will be called when the game is doing an in place shuffle of the provided `cards` array. This allows the client to provide a custom shuffle algorithm. If not provided, the game will use an in place Fisher Yates shuffle algorithm. The callback will receive one argument: `cards`, which is the `cards` array that was provided in the game configuration. |

### Methods

#### .flipCard(cardIndex)

Allows the player to flip over the card that is positioned at the provided index. This method will not return anything.

##### Parameters

| Name | Type | Description |
|---|---|---|
| cardIndex | number | The index of the card that the player wants to flip over.

#### .resetGame()

Allows the player to reset the game, and start a brand new game.

### Properties

| Property | Description | Type |
|---|---|---|
| cards | A 1D array of the cards in the current game. | any[] |
| flippedCards | An array of the current card indexes that are flipped over for the current match check. This will be reset after two cards have been checked. | number[] |
| matchedCards | A `Set` of the card indexes that have been matched in the current game. | Set<number> |
| isGameOver | A boolean flag that represents if the current game instance is finished. The game is considered finished when a player has matched all of the cards in the game. | boolean |

## Examples

### Simple Game

```typescript
import { MemoryMatch } from '@devshareacademy/memory-match';

// Example array of card pairs (2 sets of matching cards)
const cards = [1, 2, 3, 1, 2, 3];
const game = new MemoryMatch({
        cards,
        onCardFlipCallback: (cardIndex) => { console.log(`Card flipped: ${cardIndex}`); },
        onMatchCallback: (firstIndex, secondIndex) => { console.log(`Match found: ${firstIndex}, ${secondIndex}`); },
        onMismatchCallback: (firstIndex, secondIndex) => { console.log(`Mismatch: ${firstIndex}, ${secondIndex}`); },
        onGameOverCallback: () => { console.log('Game Over! All cards matched!'); }
    }
);

// Simulate flipping cards
game.flipCard(0);
game.flipCard(3); // Match
game.flipCard(1);
game.flipCard(2); // Match
game.flipCard(4);
game.flipCard(5); // Match -> Game Over
```

## Local Development

This project uses [Yarn](https://yarnpkg.com/) as a package manager, however you can use `NPM` to run this project locally.

### Install Project Dependencies

```bash
yarn install --frozen-lockfile
```

If you are using `npm`, run the following command:

```bash
npm install
```

### Run Tests

```bash
yarn test
```

If you are using `npm`, run the following command:

```bash
npm run test
```

### Run Linting

```bash
yarn lint
```

If you are using `npm`, run the following command:

```bash
npm run lint
```

### Testing Changes Locally

#### NPM Link

In order to test changes locally, you can can create a symlink to this npm package folder and then reference this folder in another project locally.

To create a symlink:

```bash
# run the following command from this projects directory
npm link
# change to the directory of the project you want to use this package in
cd ../../../some-other-project
# link-install the package
npm link @devshareacademy/memory-match
```

Please see the official documentation on [npm link](https://docs.npmjs.com/cli/v8/commands/npm-link) for more information.

#### Verdaccio

Another option for testing changes locally is to use [Verdaccio](https://verdaccio.org/), which is a lightweight private proxy registry. With Verdaccio, you can publish this npm package to a local registry and then in another project you can install this package by pointing to the local registry.

There are a variety of ways to run Verdaccio, but in the following example we will be using [Docker](https://www.docker.com/).

##### Instructions

To setup and run Verdaccio:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

To create a user and login:

```bash
npm adduser --registry http://localhost:4873
```

To publish a package:

```bash
npm publish --registry http://localhost:4873
```

To install the local package in another project:

```bash
NPM_CONFIG_REGISTRY=http://localhost:4873 npm install @devshareacademy/memory-match
```

## Project Structure

In the project folder, there is a variety of files and folders. At a high level, here is a quick summary of what each folder and file is used for:

```
.
├── .vscode          this folder contains configuration files for the VSCode editor, which will add auto linting and custom launch configurations for running tests (if you are not using VSCode, you can remove this folder from your project)
├── config           this folder contains configuration files for ESLint and TSC (the TypeScript Compiler)
├── dist             a dynamically generated folder which will contain the compiled source code of the finished library (generated when you run the build script)
├── node_modules     a dynamically generated folder which contains the project developer dependencies when working on the library (generated when you run the install script)
├── src              this folder will contain the core code for our library (currently contains a placeholder Class for the Connect Four library)
├── tests            this folder will contain the custom tests for our library
├── .gitignore       this file is used for telling git to ignore certain files in our project (mainly used for our project dependencies and dynamically generated files)
├── package.json     a configuration file for npm that contains metadata about your project
├── tsconfig.json    a configuration file for TSC
├── yarn.lock        a configuration file that contains the exact tree structure of the project dependencies and their versions (helps with repeatable project builds)

## Changelog

### 0.0.1

Initial release of npm package. Contains the core functionality of the game Memory Match.
