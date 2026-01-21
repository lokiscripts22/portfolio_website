// ===== GitHub Projects Loader =====
async function loadProjects() {
  const username = "lokiscripts22";

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos = await response.json();

    const projectList = document.getElementById("project-list");
    projectList.innerHTML = "";

    repos.forEach(repo => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description provided."}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
      `;
      projectList.appendChild(card);
    });

  } catch (err) {
    console.error(err);
  }
}

loadProjects();

// ===== Snake Game =====
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start-snake");
const restartBtn = document.getElementById("restart-snake");
const overlay = document.getElementById("snake-overlay");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, direction, food, loop;

startBtn.onclick = startGame;
restartBtn.onclick = startGame;

function startGame() {
  overlay.classList.add("hidden");
  clearInterval(loop);

  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  food = randomFood();

  document.onkeydown = changeDirection;
  loop = setInterval(update, 150);
}

function update() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= tileCount || head.y >= tileCount ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    clearInterval(loop);
    overlay.classList.remove("hidden");
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
  } else {
    snake.pop();
  }

  ctx.fillStyle = "#22c55e";
  snake.forEach(s =>
    ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize, gridSize)
  );

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function changeDirection(e) {
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
}


