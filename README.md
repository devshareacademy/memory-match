# memory-match

A NPM package that contains the core game logic for the game Memory Match

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

const memoryMatch = new MemoryMatch();

// first player adds their checker to the 1st column
connectFour.makeMove(0);
```

For more details on the library and the available methods, please see the documentation and examples below.

## API Documentation

The game of Connect Four is represented by a 1D Array that has 42 spaces. This 1D Array represents a 2D Array that is made up of 7 columns and 6 rows. Each cell in the Array will have one of the following values:

* `0` - Represents an empty space
* `1` - Represents the space is occupied by the first player
* `2` - Represents the space is occupied by the second player

At this time, the constructor of the `ConnectFour` class does not take any configuration options.

### Methods

#### .makeMove(column)

Allows the current player to drop a checker into one of the columns in the game board. This method will return the coordinate of where the checker was placed on the game board. This method will throw an error in the following scenarios:

* A column index that is not within boundary of the game board, example `20`
* The column is already full
* The game is over

##### Parameters

| Name | Type | Description |
|---|---|---|
| column | number | The index of the column the player game piece should be added to. Valid values are `0 - 6` |

##### Returns

| Name | Type | Description |
|---|---|---|
| coordinate | object | The coordinate of where the checker was placed. Each object has two properties, `col` and `row` which are numbers representing the indexes of the cell row and column. Example: `[{"row":0,"col":0}]`. |

#### .resetGame()

Allows the player to reset the game, and start a brand new game. Once this method is called, it will be the first players turn again.

### Properties

| Property | Description | Type |
|---|---|---|
| board | A 1D array that represents the current board state. | number[] |
| playersTurn | A string that represents the current players turn. Possible values are: `ONE` and `TWO`. | string |
| isGameOver | A boolean flag that represents if the current game instance is finished. The game is considered finished when a player has won the game by getting a Connect Four, or when the game ends in a `DRAW` if no more spaces are left on the board. | boolean |
| gameWinner | A string that represents the player that one the game. Possible values are `ONE` and `TWO`. If the game is not over, or if the game ends in a `DRAW`, then this property will return `undefined`. | string \| undefined |
| winningCells | An array of objects that represent the coordinates of the winning cells that make up the winning combination. Each object has two properties, `col` and `row` which are numbers representing the indexes of the cell row and column. Example: `[{"row":0,"col":0}]`. If the game is not over, or if the game ends in a `DRAW`, then this property will return an empty array. | {   col: number;   row: number; }[] |
| moveHistory | An array of moves that have been made in the existing game so far to create the current game board state. | number[] |

## Examples

### Simple Game

```typescript
import { MemoryMatch } from '@devshareacademy/memory match';

// Example array of card pairs (2 sets of matching cards)
const cards = [1, 2, 3, 1, 2, 3];
const game = new MemoryMatch(
    cards,
    (cardIndex) => { console.log(`Card flipped: ${cardIndex}`); },
    (firstIndex, secondIndex) => { console.log(`Match found: ${firstIndex}, ${secondIndex}`); },
    (firstIndex, secondIndex) => { console.log(`Mismatch: ${firstIndex}, ${secondIndex}`); },
    () => { console.log('Game Over! All cards matched!'); }
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
