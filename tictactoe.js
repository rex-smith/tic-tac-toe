// Store HTML Elements as variables

let messageBar = document.querySelector('.message-bar');
let gameContainer = document.querySelector('.game-container');
let boardContainer = document.querySelector('.board-container');
let formContainer = document.querySelector('.form-container');

// Gameboard Object (Module)

const gameBoard = (() => {
  let boardArray = [[null, null, null],   // Row 1 (Col 1, 2, 3)
                    [null, null, null],   // Row 2 (Col 1, 2, 3)
                    [null, null, null]];  // Row 3 (Col 1, 2, 3)

  function setPiece(player, cell) {
    console.log(`Active symbol is: ${player.getSymbol()}`)
    boardArray[cell[0]][cell[1]] = player.getSymbol();
  }

  function getBoard() {
    return boardArray;
  }

  // Check if current board has been won or tied
  function winnerCheck() {
    // Three in a row
    for (let i = 0; i < boardArray.length; i++) {
      if (boardArray[i][0] === boardArray [i][1] && boardArray[i][1] === boardArray[i][2] && boardArray[i][0] != null) {
        return true;
      }
    }
    // Three diagonal
    if (boardArray[0][0] === boardArray[1][1] && boardArray[1][1] === boardArray [2][2] && boardArray[0][0] != null) {
      return true;
    }
    if (boardArray[2][0] === boardArray[1][1] && boardArray[1][1] === boardArray [0][2] && boardArray[2][0] != null) {
      return true;
    }
    // Three vertical
    for (let j = 0; j < 3; j++) {
      if (boardArray[0][j] === boardArray[1][j] && boardArray[1][j] === boardArray[2][j] && boardArray[0][j] != null) {
        return true;
      }
    }
  }

  // Tie Check
  function tieCheck() {
    // Check if all cells are full
    for (let i = 0; i < boardArray.length; i++) {
      for (let j = 0; j < boardArray[i].length; j++) {
        if (boardArray[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  }

  // Clear board for a new game
  function clearBoard() {
    for (let i =0; i < boardArray.length; i++) {
      for (let j = 0; j < boardArray[i].length; j++) {
        boardArray[i][j] = null;
      }
    }
  }

  // Check if valid move
  function validMoveCheck(cell) {
    console.log(`Checking cell (${cell[0]},${cell[1]})`)
    if (boardArray[cell[0]][cell[1]] === null) {
      return true;
    } else {
      return false;
    }
  }

  return {
    setPiece,
    getBoard,
    winnerCheck,
    tieCheck,
    clearBoard,
    validMoveCheck
  }
})();

// Display Controller (Module)
// Display board from gameBoard

const displayController = (() => {
  function updateBoard() {
    boardArray = gameBoard.getBoard();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = document.getElementById(`${i}x${j}`);
        if (boardArray[i][j] != null) {
          cell.innerHTML = boardArray[i][j];
          cell.classList.remove('empty');
        } else {
          cell.innerHTML = '';
          cell.classList.add('empty');
        }
      }
    }
  }

  return {updateBoard}
})();

// Game Object

const gameFactory = (player1, player2) => {
  // Start with Player 1 as current player
  let currentPlayer = player1;
  
  // HTML ID for cell to coordinates
  function idToCoordinates(id) {
    stringCoordinates = id.split('x');
    return [parseInt(stringCoordinates[0]), parseInt(stringCoordinates[1])];
  }

  function processClickedCell(coordinates) {
    if (gameBoard.validMoveCheck(coordinates)) {
      gameBoard.setPiece(getCurrentPlayer(), coordinates);
      endTurn();
    } else {
      console.log(coordinates);
      console.log(gameBoard.getBoard())
      messageBar.innerHTML = 'Please select an empty cell';    
    }
  }

  function startGame() {
    console.log(`Starting game with ${currentPlayer.getName()} as active player`);
    displayController.updateBoard();
    promptPlayerToChoose();
  }

  function promptPlayerToChoose() {
    messageBar.innerHTML = `${getCurrentPlayer().getName()}, please pick a cell`;
  }

  function winner() {
    messageBar.classList.add('winner');
    messageBar.innerHTML = `${currentPlayer.getName()} has won the game!`;
  }

  function tie() {
    messageBar.classList.add('tie');
    messageBar.innerHTML = 'You have tied the game!'
  }

  function endTurn() {
    displayController.updateBoard();
    if (gameBoard.winnerCheck()) {
      winner();
      console.log('----------------TURN ENDED-----------------')
    } else if (gameBoard.tieCheck()) {
      console.log('----------------TURN ENDED-----------------')
      tie();
    } else {
      console.log('----------------TURN ENDED-----------------')
      changeActivePlayer();
      promptPlayerToChoose();
    }
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function changeActivePlayer() {
    console.log(`Changing active player from ${currentPlayer.getName()}`)
    currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
    console.log(`to ${currentPlayer.getName()}`)
  }

  // Create event listeners for clicks on cells
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.getElementById(`${i}x${j}`);
      cell.addEventListener('click', (event) => {
        clickedCell = event.target;
        cellCoordinates = idToCoordinates(clickedCell.id);
        processClickedCell(cellCoordinates);
      })
    }
  }

  return {
    startGame,
    getCurrentPlayer,
    endTurn
  }
}


// Player Object

const playerFactory = (name, symbol) => {
  function getSymbol() {
    return symbol;
  }

  function getName() {
    return name;
  }
  return {getName, getSymbol}
}

// New Game Start

const newGameForm = document.getElementById('new-game-form');
newGameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formContainer.classList.toggle('hidden');
  const player1Name = newGameForm.elements['player-1-name'].value;
  const player1Symbol = newGameForm.elements['player-1-symbol'].value;
  const player2Name = newGameForm.elements['player-2-name'].value;
  const player2Symbol = newGameForm.elements['player-2-symbol'].value;
  let player1 = playerFactory(player1Name, player1Symbol);
  let player2 = playerFactory(player2Name, player2Symbol);
  let game = gameFactory(player1, player2);
  messageBar.classList.toggle('hidden');
  gameContainer.classList.toggle('hidden');
  newGameButton.classList.toggle('hidden');
  game.startGame();
  newGameForm.reset();
});

const newGameButton = document.getElementById('new-game');
newGameButton.addEventListener('click', () => {
  gameBoard.clearBoard();
  formContainer.classList.toggle('hidden');
  newGameButton.classList.toggle('hidden');
  gameContainer.classList.toggle('hidden');
  messageBar.classList.toggle('hidden');
});