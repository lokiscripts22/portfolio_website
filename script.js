// ================= SNAKE GAME =================
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start-snake");
const restartBtn = document.getElementById("restart-snake");
const overlay = document.getElementById("snake-overlay");

const box = 20;
const rows = canvas.width / box;

let snake = [];
let dir = { x: 0, y: 0 };
let food = {};
let game = null;
let started = false;

// ---------------- Controls ----------------
document.addEventListener("keydown", e => {
  if (!started) return;

  if (e.key === "ArrowUp" && dir.y === 0) dir = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && dir.y === 0) dir = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && dir.x === 0) dir = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && dir.x === 0) dir = { x: 1, y: 0 };
});

// ---------------- Game Start ----------------
startBtn.onclick = startGame;
restartBtn.onclick = startGame;

function startGame() {
  clearInterval(game);
  overlay.classList.add("hidden");

  snake = [{ x: 9, y: 9 }];
  dir = { x: 1, y: 0 };
  food = spawnFood();
  started = true;

  game = setInterval(draw, 140);
}

// ---------------- Draw Loop ----------------
function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y
  };

  // Wall collision
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= rows ||
    head.y >= rows ||
    collision(head, snake)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
  } else {
    snake.pop();
  }

  // Draw snake
  ctx.fillStyle = "#0f0";
  snake.forEach(s =>
    ctx.fillRect(s.x * box, s.y * box, box - 1, box - 1)
  );

  // Draw food
  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x * box, food.y * box, box, box);
}

// ---------------- Helpers ----------------
function spawnFood() {
  return {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * rows)
  };
}

function collision(head, body) {
  return body.some(seg => seg.x === head.x && seg.y === head.y);
}

function gameOver() {
  clearInterval(game);
  started = false;
  overlay.classList.remove("hidden");
}

