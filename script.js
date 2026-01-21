// ========== GITHUB PROJECTS ==========
async function loadProjects() {
  const res = await fetch("https://api.github.com/users/lokiscripts22/repos");
  const repos = await res.json();

  const list = document.getElementById("project-list");
  list.innerHTML = "";

  repos.forEach(repo => {
    const div = document.createElement("div");
    div.className = "project-card";
    div.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description"}</p>
      <a href="${repo.html_url}" target="_blank">View</a>
    `;
    list.appendChild(div);
  });
}
loadProjects();

// ========== SNAKE GAME ==========
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start-snake");
const restartBtn = document.getElementById("restart-snake");
const overlay = document.getElementById("snake-overlay");

const size = 20;
const tiles = canvas.width / size;

let snake, dir, food, loop, running = false;

startBtn.onclick = start;
restartBtn.onclick = start;

document.addEventListener("keydown", e => {
  if (!running) return;
  if (e.key === "ArrowUp" && dir.y === 0) dir = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && dir.y === 0) dir = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && dir.x === 0) dir = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && dir.x === 0) dir = { x: 1, y: 0 };
});

function start() {
  clearInterval(loop);
  overlay.classList.add("hidden");

  snake = [{ x: 10, y: 10 }];
  dir = { x: 1, y: 0 };
  food = spawn();
  running = true;

  loop = setInterval(update, 150);
}

function update() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= tiles || head.y >= tiles ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    die();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = spawn();
  } else {
    snake.pop();
  }

  ctx.fillStyle = "#0f0";
  snake.forEach(s =>
    ctx.fillRect(s.x * size, s.y * size, size - 1, size - 1)
  );

  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x * size, food.y * size, size, size);
}

function spawn() {
  return {
    x: Math.floor(Math.random() * tiles),
    y: Math.floor(Math.random() * tiles)
  };
}

function die() {
  clearInterval(loop);
  running = false;
  overlay.classList.remove("hidden");
}

