/* ===============================
   GLOBAL GAME CONTROL
================================ */
let activeGame = null;
let snakeLoop = null;
let pongLoop = null;
let invLoop = null;

function stopAllGames() {
  activeGame = null;
  clearInterval(snakeLoop);
  clearInterval(pongLoop);
  clearInterval(invLoop);
}

/* ===============================
   KEY HANDLING (ARROWS + WASD)
================================ */
const keys = {};

document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();

  if (key === " " && activeGame) {
    e.preventDefault(); // prevent button activation
  }

  keys[key] = true;
});

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

/* ===============================
   PROJECTS
================================ */
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
        <p>${repo.description || "No description provided"}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
      `;
      list.appendChild(card);
    });
  } catch {
    console.warn("GitHub API blocked");
  }
}
loadProjects();

/* ===============================
   SNAKE
================================ */
const snakeCanvas = document.getElementById("snake-canvas");
const sctx = snakeCanvas.getContext("2d");
document.getElementById("start-snake").onclick = startSnake;

const grid = 20;
let snake, food, snakeDir;

function startSnake() {
  stopAllGames();
  activeGame = "snake";
  document.getElementById("start-snake").blur();

  snake = [{ x: 10, y: 10 }];
  snakeDir = { x: 1, y: 0 };
  food = spawnFood();

  snakeLoop = setInterval(updateSnake, 120);
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (snakeCanvas.width / grid)),
    y: Math.floor(Math.random() * (snakeCanvas.height / grid))
  };
}

function updateSnake() {
  if (activeGame !== "snake") return;

  if ((keys["w"] || keys["arrowup"]) && snakeDir.y !== 1) snakeDir = { x: 0, y: -1 };
  if ((keys["s"] || keys["arrowdown"]) && snakeDir.y !== -1) snakeDir = { x: 0, y: 1 };
  if ((keys["a"] || keys["arrowleft"]) && snakeDir.x !== 1) snakeDir = { x: -1, y: 0 };
  if ((keys["d"] || keys["arrowright"]) && snakeDir.x !== -1) snakeDir = { x: 1, y: 0 };

  const head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= snakeCanvas.width / grid ||
    head.y >= snakeCanvas.height / grid ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    stopAllGames();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) food = spawnFood();
  else snake.pop();

  sctx.fillStyle = "#111";
  sctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

  sctx.fillStyle = "#00ff88";
  snake.forEach(s => sctx.fillRect(s.x * grid, s.y * grid, grid - 2, grid - 2));

  sctx.fillStyle = "#ff4444";
  sctx.fillRect(food.x * grid, food.y * grid, grid - 2, grid - 2);
}

/* ===============================
   PONG (WITH AI)
================================ */
const pongCanvas = document.getElementById("pong-canvas");
const pctx = pongCanvas.getContext("2d");
document.getElementById("start-pong").onclick = startPong;

let pY, aiY, ball;

function startPong() {
  stopAllGames();
  activeGame = "pong";
  document.getElementById("start-pong").blur();

  pY = aiY = pongCanvas.height / 2 - 40;
  ball = { x: 200, y: 150, vx: 4, vy: 3 };

  pongLoop = setInterval(updatePong, 16);
}

function updatePong() {
  if (activeGame !== "pong") return;

  if ((keys["w"] || keys["arrowup"]) && pY > 0) pY -= 6;
  if ((keys["s"] || keys["arrowdown"]) && pY < pongCanvas.height - 80) pY += 6;

  if (ball.y > aiY + 40) aiY += 4;
  if (ball.y < aiY + 40) aiY -= 4;

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y <= 0 || ball.y >= pongCanvas.height) ball.vy *= -1;

  if (ball.x < 20 && ball.y > pY && ball.y < pY + 80) ball.vx *= -1;
  if (ball.x > pongCanvas.width - 20 && ball.y > aiY && ball.y < aiY + 80) ball.vx *= -1;

  if (ball.x < 0 || ball.x > pongCanvas.width) {
    stopAllGames();
    return;
  }

  pctx.fillStyle = "#111";
  pctx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

  pctx.fillStyle = "#fff";
  pctx.fillRect(10, pY, 10, 80);
  pctx.fillRect(pongCanvas.width - 20, aiY, 10, 80);
  pctx.beginPath();
  pctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
  pctx.fill();
}

/* ===============================
   SPACE INVADERS (BALANCED)
================================ */
const invCanvas = document.getElementById("invaders-canvas");
const ictx = invCanvas.getContext("2d");
document.getElementById("start-invaders").onclick = startInvaders;

let level, playerX, bullets, invaders, invSpeed;

function startInvaders() {
  stopAllGames();
  activeGame = "invaders";
  document.getElementById("start-invaders").blur();

  level = 1;
  initLevel();
  invLoop = setInterval(updateInvaders, 30);
}

function initLevel() {
  playerX = invCanvas.width / 2;
  bullets = [];

  invSpeed = 0.6 + level * 0.3;
  invaders = [];

  const rows = Math.min(2 + level, 5);
  const cols = 7;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      invaders.push({ x: 50 + c * 45, y: 40 + r * 35 });
    }
  }
}

function updateInvaders() {
  if (activeGame !== "invaders") return;

  if (keys["a"] || keys["arrowleft"]) playerX -= 5;
  if (keys["d"] || keys["arrowright"]) playerX += 5;

  if ((keys[" "] || keys["space"]) && bullets.length < 3) {
    bullets.push({ x: playerX, y: invCanvas.height - 45 });
    keys[" "] = false;
    keys["space"] = false;
  }

  invaders.forEach(i => i.x += invSpeed);
  if (invaders.some(i => i.x > invCanvas.width - 30 || i.x < 10)) {
    invSpeed *= -1;
    invaders.forEach(i => i.y += 10);
  }

  bullets.forEach(b => b.y -= 6);
  bullets = bullets.filter(b => b.y > 0);

  invaders = invaders.filter(i => {
    const hit = bullets.some(b =>
      b.x > i.x && b.x < i.x + 20 &&
      b.y > i.y && b.y < i.y + 20
    );
    return !hit;
  });

  if (invaders.length === 0) {
    level++;
    if (level > 10) {
      stopAllGames();
      return;
    }
    initLevel();
  }

  if (invaders.some(i => i.y > invCanvas.height - 60)) {
    stopAllGames();
    return;
  }

  ictx.fillStyle = "#111";
  ictx.fillRect(0, 0, invCanvas.width, invCanvas.height);

  // ship
  ictx.fillStyle = "#00ff88";
  ictx.beginPath();
  ictx.moveTo(playerX, invCanvas.height - 35);
  ictx.lineTo(playerX - 15, invCanvas.height - 15);
  ictx.lineTo(playerX + 15, invCanvas.height - 15);
  ictx.closePath();
  ictx.fill();

  // bullets
  ictx.fillStyle = "#0ff";
  bullets.forEach(b => ictx.fillRect(b.x - 2, b.y, 4, 10));

  // invaders
  ictx.fillStyle = "#a020f0";
  invaders.forEach(i => ictx.fillRect(i.x, i.y, 20, 20));
}
