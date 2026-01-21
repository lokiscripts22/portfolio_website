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

const keys = {};

document.addEventListener("keydown", e => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

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

  if (head.x < 0 || head.y < 0 || head.x >= snakeCanvas.width / grid || head.y >= snakeCanvas.height / grid || snake.some(s => s.x === head.x && s.y === head.y)) {
    stopAllGames();
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) food = spawnFood();
  else snake.pop();

  sctx.fillStyle = "#111";
  sctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

  sctx.fillStyle = "#00ff88";
  snake.forEach((s, i) => {
    sctx.beginPath();
    const radius = i === 0 ? 6 : 4;
    sctx.roundRect(s.x * grid + 1, s.y * grid + 1, grid - 2, grid - 2, radius);
    sctx.fill();
  });

  sctx.fillStyle = "#ff4444";
  sctx.beginPath();
  sctx.arc(food.x * grid + grid / 2, food.y * grid + grid / 2, grid / 2 - 2, 0, Math.PI * 2);
  sctx.fill();
  sctx.fillStyle = "#0a0";
  sctx.fillRect(food.x * grid + grid / 2 - 2, food.y * grid - 2, 4, 4);
}

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

const invCanvas = document.getElementById("invaders-canvas");
const ictx = invCanvas.getContext("2d");
document.getElementById("start-invaders").onclick = startInvaders;

let level, playerX, bullets, invaders;
let invFallSpeed, landed;

function startInvaders() {
  stopAllGames();
  activeGame = "invaders";
  level = 1;
  setupLevel();
  invLoop = setInterval(updateInvaders, 30);
}

function setupLevel() {
  bullets = [];
  invaders = [];
  landed = false;
  playerX = invCanvas.width / 2;
  const rows = Math.min(2 + level, 6);
  const cols = 8;
  invFallSpeed = 0.4 + level * 0.15;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      invaders.push({
        x: 40 + c * 40,
        y: -r * 35 - 30,
        landed: false
      });
    }
  }
}

function updateInvaders() {
  if (activeGame !== "invaders") return;

  if (keys["a"] || keys["arrowleft"]) playerX -= 5;
  if (keys["d"] || keys["arrowright"]) playerX += 5;
  playerX = Math.max(15, Math.min(invCanvas.width - 15, playerX));

  if (keys[" "] && bullets.length < 3) {
    bullets.push({ x: playerX, y: invCanvas.height - 30 });
    keys[" "] = false;
  }

  invaders.forEach(inv => inv.y += invFallSpeed);

  bullets.forEach(b => b.y -= 6);
  bullets = bullets.filter(b => b.y > 0);

  invaders = invaders.filter(inv => {
    const hit = bullets.some(b => b.x > inv.x && b.x < inv.x + 20 && b.y > inv.y && b.y < inv.y + 20);
    return !hit;
  });

  // Remove aliens that reach bottom
  invaders = invaders.filter(inv => inv.y < invCanvas.height);

  // Next level if all aliens gone
  if (invaders.length === 0) {
    level++;
    setupLevel();
  }

  ictx.fillStyle = "#111";
  ictx.fillRect(0, 0, invCanvas.width, invCanvas.height);

  // Ship
  ictx.fillStyle = "#00ffff";
  ictx.fillRect(playerX - 12, invCanvas.height - 30, 24, 10);
  ictx.fillStyle = "#0ff";
  ictx.fillRect(playerX - 5, invCanvas.height - 40, 10, 10);

  // Bullets
  ictx.fillStyle = "#fff";
  bullets.forEach(b => ictx.fillRect(b.x - 2, b.y, 4, 8));

  // Aliens
  invaders.forEach(inv => drawAlien(inv.x, inv.y));

  ictx.fillStyle = "#aaa";
  ictx.font = "14px Arial";
  ictx.fillText(`Level ${level}`, 10, 20);
}

function drawAlien(x, y) {
  ictx.fillStyle = "#a020f0";
  ictx.fillRect(x+2, y, 16, 8);
  ictx.fillRect(x, y+8, 20, 8);
  ictx.fillRect(x, y+16, 4, 4);
  ictx.fillRect(x+16, y+16, 4, 4);
  ictx.fillStyle = "#fff";
  ictx.fillRect(x+4, y+2, 3, 3);
  ictx.fillRect(x+13, y+2, 3, 3);
}

