const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start-snake");
const restartBtn = document.getElementById("restart-snake");
const overlay = document.getElementById("snake-overlay");

const cellSize = 20;
const cols = canvas.width / cellSize;
const rows = canvas.height / cellSize;

let snake = [];
let direction = { x: 1, y: 0 }; // START MOVING
let food = {};
let loop = null;
let running = false;

/* -------- SNAKE GAME -------- */

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  placeFood();
  overlay.classList.add("hidden");
  running = true;

  clearInterval(loop);
  loop = setInterval(update, 120);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  };
}

function update() {
  if (!running) return;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (
    head.x < 0 || head.x >= cols ||
    head.y < 0 || head.y >= rows ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0f0";
  snake.forEach(s =>
    ctx.fillRect(s.x * cellSize, s.y * cellSize, cellSize, cellSize)
  );

  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

function endGame() {
  running = false;
  clearInterval(loop);
  overlay.classList.remove("hidden");
}

/* -------- CONTROLS (FIXED) -------- */

document.addEventListener("keydown", e => {
  e.preventDefault();

  const key = e.key.toLowerCase();

  if ((key === "w" || key === "arrowup") && direction.y === 0)
    direction = { x: 0, y: -1 };

  if ((key === "s" || key === "arrowdown") && direction.y === 0)
    direction = { x: 0, y: 1 };

  if ((key === "a" || key === "arrowleft") && direction.x === 0)
    direction = { x: -1, y: 0 };

  if ((key === "d" || key === "arrowright") && direction.x === 0)
    direction = { x: 1, y: 0 };
});

startBtn.onclick = startGame;
restartBtn.onclick = startGame;

/* -------- PROJECTS -------- */

async function loadProjects() {
  const username = "lokiscripts22";
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  const repos = await res.json();

  const list = document.getElementById("project-list");
  list.innerHTML = "";

  repos.forEach(repo => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description"}</p>
      <a href="${repo.html_url}" target="_blank">View on GitHub</a>
    `;
    list.appendChild(card);
  });
}

loadProjects();


