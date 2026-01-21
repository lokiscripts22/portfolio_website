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
   KEY HANDLING (SAFE)
================================ */
const keys = {};

document.addEventListener("keydown", e => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
    e.preventDefault();
  }
  keys[e.key.toLowerCase()] = true;
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
  } catch {}
}
loadProjects();

/* ===============================
   SNAKE (UNCHANGED & STABLE)
================================ */
const snakeCanvas = document.getElementById("snake-canvas");
const sctx = snakeCanvas.getContext("2d");
document.getElementById("start-snake").onclick = startSnake;

const grid = 20;
let snake, food, snakeDir;

function startSnake() {
  stopAllGames();
  activeGame = "snake";

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

  if ((keys["arrowup"] || keys["w"]) && snakeDir.y !== 1) snakeDir = { x: 0, y: -1 };
  if ((keys["arrowdown"] || keys["s"]) && snakeDir.y !== -1) snakeDir = { x: 0, y: 1 };
  if ((keys["arrowleft"] || keys["a"]) && snakeDir.x !== 1) snakeDir = { x: -1, y: 0 };
  if ((keys["arrowright"] || keys["d"]) && snakeDir.x !== -1) snakeDir = { x: 1, y: 0 };

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
   PONG (UNCHANGED & STABLE)
================================ */
const pongCanvas = document.getElementById("pong-canvas");
const pctx = pongCanvas.getContext("2d");
document.getElementById("start-pong").onclick = startPong;

let pY, aiY, ball;

function startPong() {
  stopAllGames();
  activeGame = "pong";

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

  if (ball.x < 20 && ball.y > pY && ball.y < pY + 80) ball.vx = Math.abs(ball.vx);
  if (ball.x > pongCanvas.width - 20 && ball.y > aiY && ball.y < aiY + 80) ball.vx = -Math.abs(ball.vx);

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
   SPACE INVADERS (FIXED)
================================ */
const invCanvas = document.getElementById("invaders-canvas");
const ictx = invCanvas.getContext("2d");
document.getElementById("start-invaders").onclick = startInvaders;

let level, playerX, bullets, invaders;
let invDir, invSpeed;

function startInvaders() {
  stopAllGames();
  activeGame = "invaders";
  level = 1;
  setupInvaders();
  invLoop = setInterval(updateInvaders, 30);
}

function setupInvaders() {
  bullets = [];
  invaders = [];
  playerX = invCanvas.width / 2;

  invDir = 1;
  invSpeed = 0.4 + level * 0.2;

  const rows = Math.min(2 + level, 5);
  const cols = 6;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      invaders.push({
        x: 60 + c * 50,
        y: -100 - r * 40
      });
    }
  }
}

function updateInvaders() {
  if (activeGame !== "invaders") return;

  if (keys["a"] || keys["arrowleft"]) playerX -= 5;
  if (keys["d"] || keys["arrowright"]) playerX += 5;
  playerX = Math.max(20, Math.min(invCanvas.width - 20, playerX));

  if ((keys[" "] || keys["space"]) && bullets.length < 3) {
    bullets.push({ x: playerX, y: invCanvas.height - 45 });
    keys[" "] = false;
  }

  bullets.forEach(b => b.y -= 6);
  bullets = bullets.filter(b => b.y > 0);

  invaders.forEach(i => {
    if (i.y < 60) {
      i.y += 1.2;
    } else {
      i.x += invSpeed * invDir;
    }
  });

  if (invaders.some(i => i.x < 20 || i.x > invCanvas.width - 40)) {
    invDir *= -1;
    invaders.forEach(i => i.y += 10);
  }

  bullets.forEach(b => {
    invaders = invaders.filter(i => !(
      b.x > i.x && b.x < i.x + 24 &&
      b.y > i.y && b.y < i.y + 24
    ));
  });

  const shipY = invCanvas.height - 40;
  if (invaders.some(i =>
    i.y + 24 >= shipY &&
    i.x < playerX + 15 &&
    i.x + 24 > playerX - 15
  )) {
    stopAllGames();
    return;
  }

  if (invaders.length === 0) {
    level++;
    setupInvaders();
  }

  ictx.fillStyle = "#111";
  ictx.fillRect(0, 0, invCanvas.width, invCanvas.height);

  ictx.fillStyle = "#00ff88";
  ictx.beginPath();
  ictx.moveTo(playerX, invCanvas.height - 55);
  ictx.lineTo(playerX - 15, invCanvas.height - 25);
  ictx.lineTo(playerX + 15, invCanvas.height - 25);
  ictx.closePath();
  ictx.fill();

  ictx.fillStyle = "#0ff";
  bullets.forEach(b => ictx.fillRect(b.x - 2, b.y, 4, 8));

  ictx.fillStyle = "#a020f0";
  invaders.forEach(i => ictx.fillRect(i.x, i.y, 24, 24));
}

