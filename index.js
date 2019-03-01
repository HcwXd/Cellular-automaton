const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
let boxSize = 15;
let speed = 100;
let isStart = false;
let board;
let gameInterval;

const grid = document.querySelector('.grid');

document.querySelector('.next_btn').addEventListener('click', () => {
  gameOfLife(board);
});
document.querySelector('.start_btn').addEventListener('click', function() {
  if (this.innerHTML === 'start') {
    this.innerHTML = 'pause';
    isStart = true;
  } else {
    this.innerHTML = 'start';
    isStart = false;
  }
});

document.querySelector('.restart_btn').addEventListener('click', () => {
  startOver();
});

document.querySelector('.size_btn').addEventListener('click', function() {
  if (this.innerHTML === 'normal grid') {
    this.innerHTML = 'big grid';
    boxSize = 20;
  } else if (this.innerHTML === 'big grid') {
    this.innerHTML = 'small grid';
    boxSize = 10;
  } else {
    this.innerHTML = 'normal grid';
    boxSize = 15;
  }
  startOver();
});

document.querySelector('.speed_btn').addEventListener('click', function() {
  if (this.innerHTML === 'normal speed') {
    this.innerHTML = 'fast speed';
    speed = 50;
  } else if (this.innerHTML === 'fast speed') {
    this.innerHTML = 'slow speed';
    speed = 200;
  } else {
    this.innerHTML = 'normal speed';
    speed = 100;
  }
  runInterval();
});

function startOver() {
  grid.innerHTML = '';
  let gridHeight = Math.floor(windowHeight - 250) - (Math.floor(windowHeight - 250) % boxSize);
  let gridWidth = Math.floor(windowWidth - 50) - (Math.floor(windowWidth - 50) % boxSize);
  grid.style.height = `${gridHeight}px`;
  grid.style.width = `${gridWidth}px`;
  board = [...Array(gridHeight / boxSize)].map(() => Array(gridWidth / boxSize));
  for (let row = 0; row < gridWidth / boxSize; row++) {
    let rowHtml = `<div class="row_wrap" data-row=${row}>`;
    for (let col = 0; col < gridHeight / boxSize; col++) {
      rowHtml += `<div class="box box-dead" style="width:${boxSize}px;height:${boxSize}px;" data-x=${col} data-y=${row} data-state=0> </div>`;
    }
    rowHtml += `</div>`;
    grid.innerHTML += rowHtml;
  }

  const boxes = document.querySelectorAll('.box');
  boxes.forEach((el) => {
    el.addEventListener('click', die);
    console.log(parseInt(el.dataset.x));

    board[parseInt(el.dataset.x)][parseInt(el.dataset.y)] = el;
  });
  runInterval();
}

startOver();

function runInterval() {
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    isStart && gameOfLife(board);
  }, speed);
}

function die() {
  console.log(this);
  this.classList.toggle('box-dead');
  this.dataset.state ^= 1;
}

const gameOfLife = function(board) {
  /**
   * 0: D to D
   * 1: L to L
   * 2: L to D
   * 3: D to L
   */
  const wasAlive = (node) => {
    return parseInt(node.dataset.state) === 1 || parseInt(node.dataset.state) === 2 ? true : false;
  };
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      let liveCnt = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (
            row + i < 0 ||
            col + j < 0 ||
            row + i === board.length ||
            col + j === board[0].length ||
            (i === 0 && j === 0)
          ) {
            continue;
          }
          if (wasAlive(board[row + i][col + j])) {
            liveCnt += 1;
          }
        }
      }
      if (wasAlive(board[row][col])) {
        if (liveCnt < 2 || liveCnt > 3) {
          board[row][col].dataset.state = 2;
        }
      } else {
        if (liveCnt === 3) {
          board[row][col].dataset.state = 3;
        }
      }
    }
  }
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (board[row][col].dataset.state % 2 === 0) {
        board[row][col].dataset.state = 0;
        board[row][col].classList.add('box-dead');
      } else {
        board[row][col].dataset.state = 1;
        board[row][col].classList.remove('box-dead');
      }
    }
  }
};
