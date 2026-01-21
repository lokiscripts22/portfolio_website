/* ---------------- PROJECTS ---------------- */
function loadProjects() {
  const projectList = document.getElementById("project-list");
  projectList.innerHTML = `
    <div class="project-card">
      <h3>Portfolio Website</h3>
      <p>Personal developer portfolio.</p>
      <a href="https://github.com/lokiscripts22" target="_blank">View GitHub</a>
    </div>
  `;
}
loadProjects();

/* ---------------- SNAKE ---------------- */
const snakeCanvas = document.getElementById("snake-canvas");
const sctx = snakeCanvas.getContext("2d");
let snakeLoop, snakeRunning = false;

document.getElementById("start-snake").onclick = () => {
  if (snakeRunning) return;
  snakeRunning = true;
  let snake = [{x: 10, y: 10}];
  let dir = {x: 1, y: 0};
  let food = {x: 5, y: 5};

  snakeLoop = setInterval(() => {
    sctx.clearRect(0,0,300,300);
    const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      food = {x: Math.random()*20|0, y: Math.random()*20|0};
    } else snake.pop();

    snake.forEach(p => {
      sctx.fillStyle = "#0f0";
      sctx.fillRect(p.x*15,p.y*15,15,15);
    });
    sctx.fillStyle="#f00";
    sctx.fillRect(food.x*15,food.y*15,15,15);
  },120);

  document.onkeydown = e => {
    if (e.key==="ArrowUp") dir={x:0,y:-1};
    if (e.key==="ArrowDown") dir={x:0,y:1};
    if (e.key==="ArrowLeft") dir={x:-1,y:0};
    if (e.key==="ArrowRight") dir={x:1,y:0};
  };
};

/* ---------------- PONG ---------------- */
const pong = document.getElementById("pong-canvas").getContext("2d");
document.getElementById("start-pong").onclick = () => {
  let y=120, by=150, bx=150, dx=2, dy=2;
  setInterval(()=>{
    pong.clearRect(0,0,300,300);
    pong.fillRect(10,y,10,60);
    pong.beginPath(); pong.arc(bx,by,6,0,Math.PI*2); pong.fill();
    bx+=dx; by+=dy;
    if(by<0||by>300)dy*=-1;
    if(bx<20)dx*=-1;
    if(bx>300)bx=150;
  },16);
};

/* ---------------- SPACE INVADERS ---------------- */
const inv = document.getElementById("invaders-canvas").getContext("2d");
document.getElementById("start-invaders").onclick = () => {
  let x=140;
  document.onkeydown=e=>{
    if(e.key==="ArrowLeft")x-=10;
    if(e.key==="ArrowRight")x+=10;
  };
  setInterval(()=>{
    inv.clearRect(0,0,300,300);
    inv.fillRect(x,260,20,20);
  },30);
};

