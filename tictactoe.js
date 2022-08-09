// Gameboard Object (Module)
//    Array to store state of board

const gameBoard = (() => {
  let boardArray = [];

  function setPiece() {

  }

  function getPiece() {

  }

  function gameOverCheck() {

  }

  function clearBoard() {

  }

  // Check for valid moves


  return {
    setPiece(),
    getPiece(),
    gameOverCheck(),
    clearBoard()
  }
})();

// Player Object

const playerFactory = (name, symbol) => {
  function chooseSpace(space) {

  }

  return {name, symbol, chooseSpace()}
}

// Game Object
//    Ask player for move until they choose a valid one
//    Switch to other player for their turn
//    End game when winner (through gameboard)
//    Ask players for names and symbols


// Display Controller (Module)
//    Show Board