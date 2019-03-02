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

document.querySelector('.show_example_btn').addEventListener('click', function() {
  document.querySelector('.example_background').style.display = 'flex';
});

document.querySelector('.ten_cell_row').addEventListener('click', function() {
  clearGrid();
  drawExample([0, -5], [0, -4], [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]);
});

document.querySelector('.pulsar').addEventListener('click', function() {
  clearGrid();
  drawExample([
    [-2, -2],
    [-2, 0],
    [-2, 2],
    [-1, -2],
    [-1, 2],
    [0, -2],
    [0, 2],
    [1, -2],
    [1, 2],
    [2, -2],
    [2, 0],
    [2, 2],
  ]);
});

document.querySelector('.tumbler').addEventListener('click', function() {
  clearGrid();
  drawExample([
    [-2, -2],
    [-2, -1],
    [-2, 1],
    [-2, 2],
    [-1, -2],
    [-1, -1],
    [-1, 1],
    [-1, 2],
    [0, -1],
    [0, 1],
    [1, -3],
    [1, -1],
    [1, 1],
    [1, 3],
    [2, -3],
    [2, -1],
    [2, 1],
    [2, 3],
    [3, -3],
    [3, -2],
    [3, 2],
    [3, 3],
  ]);
});

document.querySelector('.glider').addEventListener('click', function() {
  clearGrid();
  drawExample([[1, 1], [1, 0], [1, -1], [0, 1], [-1, 0]]);
});

document.querySelector('.lightweight_spaceship').addEventListener('click', function() {
  clearGrid();
  drawExample([[-2, -1], [-2, 0], [-2, 1], [-2, 2], [-1, -2], [-1, 2], [0, 2], [1, -2], [1, 1]]);
});

document.querySelector('.heavyweight_spaceship').addEventListener('click', function() {
  clearGrid();
  drawExample([
    [-2, -3],
    [-2, -2],
    [-2, -1],
    [-2, 0],
    [-2, 1],
    [-2, 2],
    [-1, -3],
    [-1, 3],
    [0, -3],
    [1, -2],
    [1, 3],
    [2, 0],
    [2, 1],
  ]);
});

document.querySelector('.gosper_glider_gun').addEventListener('click', function() {
  clearGrid();
  drawExample([
    [5 - 10, 1 - 22],
    [5 - 10, 2 - 22],
    [6 - 10, 1 - 22],
    [6 - 10, 2 - 22],
    [5 - 10, 11 - 22],
    [6 - 10, 11 - 22],
    [7 - 10, 11 - 22],
    [4 - 10, 12 - 22],
    [3 - 10, 13 - 22],
    [3 - 10, 14 - 22],
    [8 - 10, 12 - 22],
    [9 - 10, 13 - 22],
    [9 - 10, 14 - 22],
    [6 - 10, 15 - 22],
    [4 - 10, 16 - 22],
    [5 - 10, 17 - 22],
    [6 - 10, 17 - 22],
    [7 - 10, 17 - 22],
    [6 - 10, 18 - 22],
    [8 - 10, 16 - 22],
    [3 - 10, 21 - 22],
    [4 - 10, 21 - 22],
    [5 - 10, 21 - 22],
    [3 - 10, 22 - 22],
    [4 - 10, 22 - 22],
    [5 - 10, 22 - 22],
    [2 - 10, 23 - 22],
    [6 - 10, 23 - 22],
    [1 - 10, 25 - 22],
    [2 - 10, 25 - 22],
    [6 - 10, 25 - 22],
    [7 - 10, 25 - 22],
    [3 - 10, 35 - 22],
    [4 - 10, 35 - 22],
    [3 - 10, 36 - 22],
    [4 - 10, 36 - 22],
  ]);
});

document.querySelector('.exploder').addEventListener('click', function() {
  clearGrid();
  drawExample([[-1, -1], [-1, 0], [0, -2], [0, -1], [0, 1], [1, -1], [1, 0]]);
});

document.querySelector('.diehard').addEventListener('click', function() {
  clearGrid();
  drawExample([[-1, 2], [0, -3], [0, -4], [1, -3], [1, 1], [1, 2], [1, 3]]);
});

function clearGrid() {
  document.querySelector('.example_background').style.display = 'none';
  isStart = false;
  document.querySelector('.start_btn').innerHTML = 'start';
  startOver();
}

function drawExample(coordinates) {
  let [centerX, centerY] = [Math.floor(board.length / 2), Math.floor(board[0].length / 2)];
  for (let [x, y] of coordinates) {
    board[centerX + x][centerY + y].classList.remove('box-dead');
    board[centerX + x][centerY + y].dataset.state = 1;
  }
}

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
