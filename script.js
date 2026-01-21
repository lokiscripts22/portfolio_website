// ================== DOM ELEMENTS ==================
const playBtn = document.getElementById("play-btn");
const closeBtn = document.getElementById("close-btn");
const gameContainer = document.getElementById("game-container");
const canvas = document.getElementById("snake-canvas");
const projectList = document.getElementById("project-list");

let ctx = canvas.getContext("2d");

// ================== GAME SETTINGS ==================
const cellSize = 20;
const rows = 20;
const cols = 20;
const speed = 150;

let snake = [];
let direction = { x: 0, y: 0 };
let food = {};
let gameInterval = null;
let gameRunning = false;

// ================== DRAGGING ==================
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

gameContainer.addEventListener("mousedown", e => {
    isDragging = true;
    dragOffsetX = e.clientX - gameContainer.offsetLeft;
    dragOffsetY = e.clientY - gameContainer.offsetTop;
});

document.addEventListener("mouseup", () => isDragging = false);

document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    gameContainer.style.left = `${e.clientX - dragOffsetX}px`;
    gameContainer.style.top = `${e.clientY - dragOffsetY}px`;
});

// ================== GAME CONTROLS ==================
playBtn.addEventListener("click", () => {
    openGame();
});

closeBtn.addEventListener("click", () => {
    closeGame();
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeGame();
});

// ================== GAME FUNCTIONS ==================
function openGame() {
    gameContainer.classList.remove("hidden");

    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    // center game window if first open
    gameContainer.style.left = "320px";
    gameContainer.style.top = "120px";

    startGame();
}

function closeGame() {
    stopGame();
    gameContainer.classList.add("hidden");
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    placeFood();

    gameRunning = true;
    document.addEventListener("keydown", changeDirection);
    gameInterval = setInterval(gameLoop, speed);
}

function stopGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    document.removeEventListener("keydown", changeDirection);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    if (!gameRunning) return;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // collision
    if (
        head.x < 0 || head.x >= cols ||
        head.y < 0 || head.y >= rows ||
        snake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
        stopGame();
        alert("Game Over!");
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function drawGame() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#22c55e";
    snake.forEach(seg =>
        ctx.fillRect(
            seg.x * cellSize,
            seg.y * cellSize,
            cellSize,
            cellSize
        )
    );

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(
        food.x * cellSize,
        food.y * cellSize,
        cellSize,
        cellSize
    );
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
    };
}

function changeDirection(e) {
    const key = e.key.toLowerCase();

    if ((key === "w" || key === "arrowup") && direction.y === 0)
        direction = { x: 0, y: -1 };
    if ((key === "s" || key === "arrowdown") && direction.y === 0)
        direction = { x: 0, y: 1 };
    if ((key === "a" || key === "arrowleft") && direction.x === 0)
        direction = { x: -1, y: 0 };
    if ((key === "d" || key === "arrowright") && direction.x === 0)
        direction = { x: 1, y: 0 };
}

// ================== GITHUB PROJECT LOADER ==================
async function loadProjects() {
    const username = "lokiscripts22";

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await res.json();

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
        projectList.innerHTML = "<p>Failed to load projects.</p>";
        console.error(err);
    }
}

loadProjects();


