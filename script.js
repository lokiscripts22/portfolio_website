// ===== Dark/Light Mode Toggle =====
const toggleBtn = document.getElementById("toggle-btn");
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// ===== Load GitHub projects =====
const username = "lokiscripts22";
const projectList = document.getElementById("project-list");
fetch(`https://api.github.com/users/${username}/repos`)
.then(res=>res.json())
.then(repos=>{
    repos.forEach(repo=>{
        if(!repo.fork){
            const card = document.createElement("div");
            card.className="project-card";
            card.innerHTML=`<h3>${repo.name}</h3><p>${repo.description||"No description yet."}</p>
            <p><a href="${repo.html_url}" target="_blank">View on GitHub</a></p>`;
            projectList.appendChild(card);
        }
    });
})
.catch(err=>{
    projectList.innerHTML="<p>Unable to load projects.</p>";
    console.error(err);
});

// ===== Snake Game =====
const snakeContainer = document.getElementById("snake-container");
const canvas = document.getElementById("snake-game");
const ctx = canvas.getContext("2d");
const closeBtn = document.getElementById("close-snake");
const resizeBtn = document.getElementById("resize-snake");

let box = 20, snake=[{x:4*box,y:4*box}], food={x:Math.floor(Math.random()*10)*box, y:Math.floor(Math.random()*10)*box};
let direction="RIGHT", gameInterval=setInterval(draw,200);

// Toggle snake display
document.getElementById("toggle-snake").addEventListener("click", e=>{
    e.preventDefault();
    if(snakeContainer.classList.contains("minimized")){
        snakeContainer.classList.remove("minimized");
    } else {
        snakeContainer.style.display = snakeContainer.style.display==="none"?"block":"none";
    }
});

// Close button
closeBtn.addEventListener("click", ()=>snakeContainer.style.display="none");

// Resize/minimize button
resizeBtn.addEventListener("click", ()=>{
    snakeContainer.classList.toggle("minimized");
});

// Drag snake
let isDragging=false, offsetX, offsetY;
document.getElementById("snake-header").addEventListener("mousedown", e=>{
    isDragging=true;
    offsetX=e.clientX - snakeContainer.getBoundingClientRect().left;
    offsetY=e.clientY - snakeContainer.getBoundingClientRect().top;
});
document.addEventListener("mousemove", e=>{
    if(isDragging){
        snakeContainer.style.left = e.clientX - offsetX + "px";
        snakeContainer.style.top = e.clientY - offsetY + "px";
    }
});
document.addEventListener("mouseup", ()=>{isDragging=false;});

// Snake logic
document.addEventListener("keydown", e=>{
    if(e.key==="ArrowUp" && direction!=="DOWN") direction="UP";
    if(e.key==="ArrowDown" && direction!=="UP") direction="DOWN";
    if(e.key==="ArrowLeft" && direction!=="RIGHT") direction="LEFT";
    if(e.key==="ArrowRight" && direction!=="LEFT") direction="RIGHT";
});

function draw(){
    ctx.fillStyle="#111"; ctx.fillRect(0,0,canvas.width,canvas.height);
    snake.forEach((s,i)=>{ ctx.fillStyle=i===0?"lime":"green"; ctx.fillRect(s.x,s.y,box,box); });
    ctx.fillStyle="red"; ctx.fillRect(food.x,food.y,box,box);

    let head={...snake[0]};
    if(direction==="LEFT") head.x-=box;
    if(direction==="UP") head.y-=box;
    if(direction==="RIGHT") head.x+=box;
    if(direction==="DOWN") head.y+=box;

    // Eat food
    if(head.x===food.x && head.y===food.y){
        snake.unshift(head);
        food={x:Math.floor(Math.random()*10)*box, y:Math.floor(Math.random()*10)*box};
    } else {
        snake.pop(); snake.unshift(head);
    }

    // Collision walls
    if(head.x<0||head.x>=canvas.width||head.y<0||head.y>=canvas.height||snake.slice(1).some(s=>s.x===head.x && s.y===head.y)){
        alert("Game Over!"); snake=[{x:4*box,y:4*box}]; direction="RIGHT";
    }
}

