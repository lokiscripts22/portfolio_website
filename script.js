// ================= FORCE OVERLAY HIDDEN =================
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("snake-overlay");
  overlay.style.display = "none";
});

// ================= GITHUB PROJECTS =================
async function loadProjects() {
  try {
    const res = await fetch("https://api.github.com/users/lokiscripts22/repos");
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
  } catch {
    document.getElementById("project-list").innerHTML =
      "<p>Failed to load projects.</p>";
  }
}
loadProjects();

// ================= SNAKE GAME =================
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start-snake");
const restartBtn = document.getElementById("restart-snake");
const overlay = document.getElementById("snake-overlay");

const size = 20;
const tiles = canvas.width / size;

let snake, dir, food, loop, running = false;

// Controls (WASD + Arrows)
document.addEventListener("keydown", e => {
  if (!running) return;
  const k = e.key.toLowerCase();

  if ((k === "arrowup" || k === "w") && dir.y === 0) dir = { x: 0, y: -1 };
  if ((k === "arrowdown" || k === "s") && dir.y === 0) dir = { x: 0, y: 1 };
  if ((k === "arrowleft" || k === "a") && dir.x === 0) dir = { x: -1, y: 0 };
  if ((k === "arrowright" || k === "d") && dir.x === 0) dir = { x: 1, y: 0 };
});

startBtn.onclick = startGame;
restartBtn.onclick = startGame;

function startGame() {
  clearInterval(loop);
  overlay.style.display = "none";

  snake = [{ x: 10, y: 10 }];
  dir = { x: 1, y: 0 };
  food = spawnFood();
  running = true;

  loop = setInterval(update, 140);
}

function update() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y
  };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= tiles || head.y >= tiles ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
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

function spawnFood() {
  return {
    x: Math.floor(Math.random() * tiles),
    y: Math.floor(Math.random() * tiles)
  };
}

function gameOver() {
  clearInterval(loop);
  running = false;
  overlay.style.display = "flex";
}

