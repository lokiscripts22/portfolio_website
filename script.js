// ======= DOM Elements =======
const playBtn = document.getElementById('play-btn');
const closeBtn = document.getElementById('close-btn');
const gameContainer = document.getElementById('game-container');
const canvas = document.getElementById('snake-canvas');
let ctx = canvas.getContext('2d');
const projectList = document.getElementById('project-list');

// ======= Snake Game Variables =======
let gameInterval;
let snake;
let direction;
let food;
let cellSize = 20;
let rows = 20;
let cols = 20;
let gameRunning = false;

// ======= Drag Variables =======
let isDragging = false;
let dragOffsetX, dragOffsetY;

gameContainer.addEventListener('mousedown', e => {
    isDragging = true;
    dragOffsetX = e.clientX - gameContainer.offsetLeft;
    dragOffsetY = e.clientY - gameContainer.offsetTop;
});
document.addEventListener('mouseup', () => { isDragging = false; });
document.addEventListener('mousemove', e => {
    if(isDragging){
        gameContainer.style.left = (e.clientX - dragOffsetX) + 'px';
        gameContainer.style.top = (e.clientY - dragOffsetY) + 'px';
    }
});

// ======= Snake Game Functions =======
playBtn.addEventListener('click', () => {
    gameContainer.classList.remove('hidden');
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    startGame();
});

closeBtn.addEventListener('click', () => {
    stopGame();
    gameContainer.classList.add('hidden');
});

function startGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: 0};
    placeFood();
    gameRunning = true;
    document.addEventListener('keydown', changeDirection);
    gameInterval = setInterval(gameLoop, 150);
}

function stopGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    document.removeEventListener('keydown', changeDirection);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    if(!gameRunning) return;

    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    if(head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows ||
       snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        stopGame();
        alert('Game Over!');
        return;
    }

    snake.unshift(head);

    if(head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function drawGame() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    snake.forEach(seg => ctx.fillRect(seg.x*cellSize, seg.y*cellSize, cellSize, cellSize));

    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x*cellSize, food.y*cellSize, cellSize, cellSize);
}

function placeFood() {
    food = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
}

function changeDirection(event) {
    const key = event.key.toLowerCase();
    switch(key){
        case 'w':
        case 'arrowup':
            if(direction.y===0) direction={x:0, y:-1};
            break;
        case 's':
        case 'arrowdown':
            if(direction.y===0) direction={x:0, y:1};
            break;
        case 'a':
        case 'arrowleft':
            if(direction.x===0) direction={x:-1, y:0};
            break;
        case 'd':
        case 'arrowright':
            if(direction.x===0) direction={x:1, y:0};
            break;
    }
}

// ======= GitHub Projects Loader =======
async function loadProjects() {
    const username = "lokiscripts22"; // your GitHub username
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();
        projectList.innerHTML = '';
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description ? repo.description : 'No description'}</p>
                <a href="${repo.html_url}" target="_blank">View on GitHub</a>
            `;
            projectList.appendChild(card);
        });
    } catch (err) {
        projectList.innerHTML = `<p>Failed to load projects.</p>`;
        console.error(err);
    }
}

loadProjects();

