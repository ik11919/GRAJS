import { Player } from './player.js';
import { Obstacle } from './obstacle.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const floorHeight = 16;

const obstacles = [];
let spawnTimer = 0;
let score = 0;
let highscore = 0;
let gameOver = false;
let gameStarted = false;

const gravity = 0.9;
const jumpForce = -20;

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const player = new Player(100, canvas.height - floorHeight - 80);

const background = new Image();
background.src = "./zdjecia/tlo.png";

let backgroundX = 0;
const backgroundSpeed = 2;

const obstacleImages = [
  './zdjecia/przeszkoda1.png',
  './zdjecia/przeszkoda2.png',
  './zdjecia/przeszkoda3.png'
].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

startBtn.addEventListener("click", () => {
  gameStarted = true;
  startBtn.style.display = "none";
});

restartBtn.addEventListener("click", () => {
  obstacles.length = 0;
  spawnTimer = 0;
  player.x = 100;
  player.y = canvas.height - floorHeight - 80;
  player.speedY = 0;
  player.speedX = 0;
  player.jumping = false;
  gameOver = false;
  score = 0;
  restartBtn.style.display = "none";
});

document.addEventListener("keydown", (e) => {
  if (!gameOver && gameStarted) {
    if (e.code === "Space" && !player.jumping) {
      player.speedY = jumpForce;
      player.jumping = true;
    }
    if (e.code === "KeyA") {
      player.speedX = -5;
    }
    if (e.code === "KeyD") {
      player.speedX = 5;
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "KeyA" || e.code === "KeyD") {
    player.speedX = 0;
  }
});

function drawBackground() {
  ctx.drawImage(background, backgroundX, 0, canvas.width, canvas.height);
  ctx.drawImage(background, backgroundX + canvas.width, 0, canvas.width, canvas.height);

  if (gameStarted && !gameOver) {
    backgroundX -= backgroundSpeed;
    if (backgroundX <= -canvas.width) {
      backgroundX = 0;
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  player.draw(ctx);

  obstacles.forEach((obs) => {
    if (!gameOver) {
      obs.update();
    }
    obs.draw(ctx);

    if (!obs.passed && obs.x + obs.w < player.x) {
      obs.passed = true;
      score++;
    }

    if (obs.collidesWith(player)) {
      gameOver = true;
      restartBtn.style.display = "block";
      if (score > highscore) {
        highscore = score;
      }
    }
  });

  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Wynik: " + score, 10, 30);
  ctx.fillText("Rekord: " + highscore, 10, 60);

  if (!gameStarted) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Naciśnij GRAJ, aby zacząć", canvas.width / 2, canvas.height / 2);
  } else if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  if (gameStarted && !gameOver) {
    player.update(gravity, canvas, floorHeight);

    spawnTimer++;
    if (spawnTimer > 100) {
      const randomWidth = Math.floor(Math.random() * 60) + 30;
      const randomHeight = Math.floor(Math.random() * 60) + 30;
      const randomSpeed = 5;

      const randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];

      const obstacle = new Obstacle(
        canvas.width,
        canvas.height - floorHeight - randomHeight,
        randomWidth,
        randomHeight,
        randomSpeed
      );
      obstacle.image = randomImage;
      obstacles.push(obstacle);
      spawnTimer = 0;
    }
  }

  requestAnimationFrame(loop);
}

loop();
