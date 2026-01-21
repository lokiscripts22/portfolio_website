/* ===============================
   PROJECTS (UNCHANGED)
================================ */
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

/* ===============================
   SNAKE (WORKING, SIMPLE)
================================ */
const snakeCanvas = document.getElementById("snake-canvas");
const sctx = snakeCanvas.getContext("2d");
const startSnakeBtn = document.getElementById("start-snake");

const grid = 20;
let snake, food, dir, snakeLoop;

function startSnake() {
  snake = [{ x: 10, y: 10 }];
  dir = { x: 1, y: 0 };
  food = randomFood();

  clearInterval(snakeLoop);
  snakeLoop = setInterval(updateSnake, 120);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * (snakeCanvas.width / grid)),
    y: Math.floor(Math.random() * (snakeCanvas.height / grid))
  };
}

function updateSnake() {
  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y
  };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= snakeCanvas.width / grid ||
    head.y >= snakeCanvas.height / grid ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    clearInterval(snakeLoop);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
  } else {
    snake.pop();
  }

  sctx.fillStyle = "#111";
  sctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

  sctx.fillStyle = "#0f0";
  snake.forEach(s =>
    sctx.fillRect(s.x * grid, s.y * grid, grid, grid)
  );

  sctx.fillStyle = "#f00";
  sctx.fillRect(food.x * grid, food.y * grid, grid, grid);
}

document.addEventListener("keydown", e => {
  if (e.key === "w" || e.key === "ArrowUp") dir = { x: 0, y: -1 };
  if (e.key === "s" || e.key === "ArrowDown") dir = { x: 0, y: 1 };
  if (e.key === "a" || e.key === "ArrowLeft") dir = { x: -1, y: 0 };
  if (e.key === "d" || e.key === "ArrowRight") dir = { x: 1, y: 0 };
});

startSnakeBtn.onclick = startSnake;

/* ===============================
   PONG (SIMPLE + SOLID)
================================ */
const pongCanvas = document.getElementById("pong-canvas");
const pctx = pongCanvas.getContext("2d");
const startPongBtn = document.getElementById("start-pong");

let paddleY = 120;
let ball = { x: 150, y: 150, vx: 3, vy: 3 };
let pongLoop;

function startPong() {
  paddleY = 120;
  ball = { x: 150, y: 150, vx: 3, vy: 3 };

  clearInterval(pongLoop);
  pongLoop = setInterval(updatePong, 16);
}

function updatePong() {
  pctx.fillStyle = "#000";
  pctx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

  // Paddle
  pctx.fillStyle = "#fff";
  pctx.fillRect(10, paddleY, 10, 60);

  // Ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y <= 0 || ball.y >= pongCanvas.height) ball.vy *= -1;
  if (ball.x <= 20 && ball.y > paddleY && ball.y < paddleY + 60) ball.vx *= -1;
  if (ball.x > pongCanvas.width) ball = { x: 150, y: 150, vx: 3, vy: 3 };

  pctx.beginPath();
  pctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
  pctx.fill();
}

document.addEventListener("keydown", e => {
  if (e.key === "w" || e.key === "ArrowUp") paddleY -= 15;
  if (e.key === "s" || e.key === "ArrowDown") paddleY += 15;
});

startPongBtn.onclick = startPong;

/* ===============================
   SPACE INVADERS (SIMPLE)
================================ */
const invCanvas = document.getElementById("invaders-canvas");
const ictx = invCanvas.getContext("2d");
const startInvBtn = document.getElementById("start-invaders");

let player, bullets, invaders, invLoop;

function startInvaders() {
  player = { x: 140, y: 260 };
  bullets = [];
  invaders = [];

  for (let x = 40; x <= 240; x += 40) {
    invaders.push({ x, y: 40 });
  }

  clearInterval(invLoop);
  invLoop = setInterval(updateInvaders, 30);
}

function updateInvaders() {
  ictx.fillStyle = "#000";
  ictx.fillRect(0, 0, invCanvas.width, invCanvas.height);

  // Player
  ictx.fillStyle = "#0f0";
  ictx.fillRect(player.x, player.y, 20, 10);

  // Bullets
  bullets.forEach(b => b.y -= 5);
  bullets = bullets.filter(b => b.y > 0);

  // Invaders
  invaders.forEach(i => {
    ictx.fillStyle = "purple";
    ictx.fillRect(i.x, i.y, 20, 15);
  });

  bullets.forEach(b => {
    invaders = invaders.filter(i =>
      !(b.x > i.x && b.x < i.x + 20 && b.y > i.y && b.y < i.y + 15)
    );
  });

  bullets.forEach(b => {
    ictx.fillStyle = "#fff";
    ictx.fillRect(b.x, b.y, 2, 6);
  });
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") player.x -= 10;
  if (e.key === "ArrowRight") player.x += 10;
  if (e.key === " ") bullets.push({ x: player.x + 9, y: player.y });
});

startInvBtn.onclick = startInvaders;

