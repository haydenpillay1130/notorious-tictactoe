document.getElementById('playButton').addEventListener('click', startGame);
document.getElementById('retryButton').addEventListener('click', resetGame);
document.getElementById('popupCloseButton').addEventListener('click', closePopup);

const boardElement = document.getElementById('board');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');

const board = Array.from(Array(3), () => Array(3).fill(null));

function startGame() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    createBoard();
}

function createBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handlePlayerMove);
            boardElement.appendChild(cell);
        }
    }
}

function handlePlayerMove(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    if (board[row][col] || checkWinner()) return;
    board[row][col] = 'X';
    event.target.textContent = 'X';
    event.target.classList.add('x');
    
    if (checkWinner()) {
        showPopup('Congratulations! You win!');
        return;
    }
    if (checkTie()) {
        showPopup("It's a tie!");
        return;
    }
    systemMove();
}

function systemMove() {
    let move = findBestMove('O');
    if (!move) {
        move = findBestMove('X');
    }
    if (!move) {
        move = getRandomMove();
    }
    if (move) {
        const { row, col } = move;
        board[row][col] = 'O';
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.textContent = 'O';
        cell.classList.add('o');

        if (checkWinner()) {
            showPopup('Sorry, the system wins!');
        } else if (checkTie()) {
            showPopup("It's a tie!");
        }
    }
}

function findBestMove(player) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (!board[row][col]) {
                board[row][col] = player;
                if (checkWinner()) {
                    board[row][col] = null;
                    return { row, col };
                }
                board[row][col] = null;
            }
        }
    }
    return null;
}

function getRandomMove() {
    const emptyCells = [];
    board.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
        if (!cell) emptyCells.push({ row: rowIndex, col: colIndex });
    }));
    return emptyCells.length ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
}

function checkWinner() {
    const winningCombos = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a[0]][a[1]] && 
            board[a[0]][a[1]] === board[b[0]][b[1]] && 
            board[a[0]][a[1]] === board[c[0]][c[1]]) {
            drawWinningLine(combo);
            return true;
        }
    }
    return false;
}

function checkTie() {
    return board.flat().every(cell => cell);
}

function drawWinningLine(combo) {
    const [a, b, c] = combo;
    const cells = [
        document.querySelector(`.cell[data-row="${a[0]}"][data-col="${a[1]}"]`),
        document.querySelector(`.cell[data-row="${b[0]}"][data-col="${b[1]}"]`),
        document.querySelector(`.cell[data-row="${c[0]}"][data-col="${c[1]}"]`)
    ];

    if (cells.every(cell => cell && cell.textContent === cells[0].textContent)) {
        const line = document.createElement('div');
        line.className = 'winning-line';

        const rectA = cells[0].getBoundingClientRect();
        const rectB = cells[1].getBoundingClientRect();
        const rectC = cells[2].getBoundingClientRect();
        const boardRect = boardElement.getBoundingClientRect();

        if (a[0] === b[0] && b[0] === c[0]) {
            // Horizontal win
            line.style.top = `${rectA.top - boardRect.top + (rectA.height / 2)}px`;
            line.style.left = `${rectA.left - boardRect.left}px`;
            line.style.width = `${rectC.right - rectA.left}px`;
            line.style.height = '2px';
        } else if (a[1] === b[1] && b[1] === c[1]) {
            // Vertical win
            line.style.left = `${rectA.left - boardRect.left + (rectA.width / 2)}px`;
            line.style.top = `${rectA.top - boardRect.top}px`;
            line.style.width = '2px';
            line.style.height = `${rectC.bottom - rectA.top}px`;
        } else {
            // Diagonal win
            line.style.top = `${rectA.top - boardRect.top + (rectA.height / 2)}px`;
            line.style.left = `${rectA.left - boardRect.left}px`;
            line.style.width = `${Math.sqrt(Math.pow(rectC.right - rectA.left, 2) + Math.pow(rectC.bottom - rectA.top, 2))}px`;
            line.style.height = '2px';
            line.style.transform = `rotate(${Math.atan2(rectC.bottom - rectA.top, rectC.right - rectA.left) * 180 / Math.PI}deg)`;
        }

        boardElement.appendChild(line);
    }
}

function resetGame() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            board[row][col] = null;
        }
    }
    createBoard();
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'flex';
}

function closePopup() {
    popup.style.display = 'none';
}
