const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlay-text");
const startBtn = document.getElementById("start-btn");
const gameMenu = document.getElementById("game-menu");

let currentGame = null;
let interval = null;

// ===== BUTTONS =====
document.querySelectorAll("[data-game]").forEach(btn => {
  btn.onclick = () => loadGame(btn.dataset.game);
});

startBtn.onclick = () => startGame();

// ===== LOAD GAME =====
function loadGame(game) {
  clearInterval(interval);
  currentGame = game;
  gameMenu.style.display = "none";
  canvas.style.display = "block";
  overlay.classList.remove("hidden");
  overlayText.textContent = "Press Start";
}

// ===== START GAME =====
function startGame() {
  overlay.classList.add("hidden");

  if (currentGame === "snake") snakeGame();
  if (currentGame === "pong") pongGame();
  if (currentGame === "invaders") invadersGame();
}

// ===== GAME OVER =====
function gameOver() {
  clearInterval(interval);
  overlayText.textContent = "You Died";
  overlay.classList.remove("hidden");
}

// ================= SNAKE =================
function snakeGame() {
  let snake = [{x:10,y:10}], dir={x:1,y:0}, food={x:5,y:5};
  interval = setInterval(() => {
    ctx.fillStyle="#111"; ctx.fillRect(0,0,420,420);
    const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
    if(head.x<0||head.y<0||head.x>20||head.y>20) return gameOver();
    snake.unshift(head);
    if(head.x===food.x&&head.y===food.y) food={x:Math.random()*20|0,y:Math.random()*20|0};
    else snake.pop();
    ctx.fillStyle="#22c55e";
    snake.forEach(s=>ctx.fillRect(s.x*20,s.y*20,20,20));
    ctx.fillStyle="#ef4444";
    ctx.fillRect(food.x*20,food.y*20,20,20);
  },150);

  document.onkeydown=e=>{
    if(e.key==="ArrowUp")dir={x:0,y:-1};
    if(e.key==="ArrowDown")dir={x:0,y:1};
    if(e.key==="ArrowLeft")dir={x:-1,y:0};
    if(e.key==="ArrowRight")dir={x:1,y:0};
  };
}

// ================= PONG =================
function pongGame() {
  let y=180, by=200, bx=200, vy=3, vx=3;
  interval=setInterval(()=>{
    ctx.fillStyle="#000"; ctx.fillRect(0,0,420,420);
    by+=vy; bx+=vx;
    if(by<0||by>410) vy*=-1;
    if(bx<10&&by>y&&by<y+80) vx*=-1;
    if(bx>420) return gameOver();
    ctx.fillStyle="#fff";
    ctx.fillRect(5,y,10,80);
    ctx.beginPath(); ctx.arc(bx,by,6,0,Math.PI*2); ctx.fill();
  },16);

  document.onmousemove=e=> y=e.clientY-canvas.getBoundingClientRect().top-40;
}

// ================= INVADERS =================
function invadersGame() {
  let level=1, player=200, bullets=[], enemies=[];
  function spawn() {
    enemies=[];
    for(let i=0;i<level*5;i++) enemies.push({x:(i%5)*60+50,y:Math.floor(i/5)*40});
  }
  spawn();

  interval=setInterval(()=>{
    ctx.fillStyle="#000"; ctx.fillRect(0,0,420,420);
    ctx.fillStyle="#0f0"; ctx.fillRect(player,390,30,10);

    bullets.forEach(b=>b.y-=5);
    bullets.forEach(b=>ctx.fillRect(b.x,b.y,4,8));

    enemies.forEach(e=>e.y+=0.1*level);
    enemies.forEach(e=>ctx.fillRect(e.x,e.y,30,20));

    enemies=enemies.filter(e=>{
      bullets.forEach(b=>{
        if(b.x>e.x&&b.x<e.x+30&&b.y>e.y&&b.y<e.y+20){e.hit=true;}
      });
      return !e.hit;
    });

    if(enemies.some(e=>e.y>380)) return gameOver();
    if(enemies.length===0){ level++; spawn(); }
  },30);

  document.onkeydown=e=>{
    if(e.key==="ArrowLeft")player-=10;
    if(e.key==="ArrowRight")player+=10;
    if(e.key===" ")bullets.push({x:player+14,y:380});
  };
}


