// ================= FORCE OVERLAY HIDDEN ON LOAD =================
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("snake-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
});

// ================= GITHUB PROJECTS =================
async function loadProjects() {
  try {
    const response = await fetch(
      "https://api.github.com/users/lokiscripts22/repos"
    );
    const repos = await response.json();

    const projectList = document.getElementById("project-list");
    projectList.innerHTML = "";

    repos.forEach(repo => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description"}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
      `;
      projectList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
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

let snake = [];
let dir = { x: 1, y: 0 };
let food = {};
let loop = null;
let running = false;

// ---------- Keyboard Controls ----------
document.addEventListener("keydown", e => {
  if (!running) return;

  if (e.key === "ArrowUp" && dir.y === 0) dir = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && dir.y === 0) dir = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && dir.x === 0) dir = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && dir.x === 0) dir = { x: 1, y: 0 };
});

// ---------- Start / Restart ----------
startBtn.onclick = startGame;
restartBtn.onclick = startGame;

function startGame() {
  clearInterval(loop);

  overlay.style.display = "none";

  snake = [{ x: 10, y: 10 }];
  dir = { x: 1, y: 0 };
  food = spawnFood();
  running = true;

  loop = setInterval(updateGame, 150);
}

// ---------- Game Loop ----------
function updateGame() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y
  };

  // Collision detection
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= tiles ||
    head.y >= tiles ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
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
  snake.forEach(seg => {
    ctx.fillRect(
      seg.x * size,
      seg.y * size,
      size - 1,
      size - 1
    );
  });

  // Draw food
  ctx.fillStyle = "#f00";
  ctx.fillRect(
    food.x * size,
    food.y * size,
    size,
    size
  );
}

// ---------- Helpers ----------
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

