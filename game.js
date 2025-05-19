
import { Player } from './player.js';
import { Obstacle } from './obstacle.js';
import { Platform } from './platform.js';
import { PowerUp } from './powerup.js';


function playJumpSound() {
  const sound = new Audio("./sounds/duck.mp3");
  sound.play();
}

const hitSound = new Audio("./sounds/gameover.mp3");
hitSound.loop = false;

const powerUpSound = new Audio("./sounds/powerup.mp3");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const floorHeight = 13;

const obstacles = [];
const platforms = [];
const powerUps = [];
let powerUpTimer = 0;
let powerUpInterval = getRandomPowerUpInterval();
let doubleJumpAvailable = false;
let doubleJumpTimer = 0; 
let invincible = false;
let invincibleTimer = 0;
let activePowerUpImage = null;
let spawnTimer = 0;
let spawnInterval = getRandomSpawnInterval();
let platformTimer = 0;
let platformInterval = 300;
let score = 0;
let highscore = 0;

if (localStorage.getItem("highscore")) {
  highscore = parseInt(localStorage.getItem("highscore"));
}

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
  './zdjecia/przeszkoda3.png',
  './zdjecia/przeszkoda4.png',
  './zdjecia/przeszkoda5.png'
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
  platforms.length = 0;
  powerUps.length = 0;
  spawnTimer = 0;
  platformTimer = 0;
  powerUpTimer = 0;
  spawnInterval = getRandomSpawnInterval();
  platformInterval = 300;
  powerUpInterval = getRandomPowerUpInterval();
  player.x = 100;
  player.y = canvas.height - floorHeight - 80;
  player.speedY = 0;
  player.speedX = 0;
  player.jumping = false;
  gameOver = false;
  score = 0;
  restartBtn.style.display = "none";
  activePowerUpImage = null;
  doubleJumpAvailable = false;
  invincible = false;
});

document.addEventListener("keydown", (e) => {
  if (!gameOver && gameStarted) {
    if (e.code === "Space") {
      if (!player.jumping) {
        player.speedY = jumpForce;
        player.jumping = true;
        playJumpSound();
      } else if (doubleJumpAvailable) {
        player.speedY = jumpForce;
        playJumpSound();
      }
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

function getRandomSpawnInterval() {
  return Math.floor(Math.random() * 60) + 60;
}

function getRandomPowerUpInterval() {
  return Math.floor(Math.random() * 600) + 600;
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  player.draw(ctx);

  platforms.forEach((plat) => {
    if (!gameOver) plat.update();
    plat.draw(ctx);
  });

  powerUps.forEach((pwr, index) => {
    if (!gameOver) pwr.update();
    pwr.draw(ctx);

    if (pwr.collidesWith(player)) {
      powerUpSound.play();
      if (pwr.type === "score") {
        score += 5;
        activePowerUpImage = pwr.image;
      }
      if (pwr.type === "doubleJump") {
        doubleJumpAvailable = true;
        doubleJumpTimer = 600;
        activePowerUpImage = pwr.image;
      }
      if (pwr.type === "invincible") {
        invincible = true;
        invincibleTimer = 600;
        activePowerUpImage = pwr.image;
      }
      powerUps.splice(index, 1);
    }
  });

  obstacles.forEach((obs) => {
    if (!gameOver) obs.update();
    obs.draw(ctx);

    if (!obs.passed && obs.x + obs.w < player.x) {
      obs.passed = true;
      score++;
    }

    if (obs.collidesWith(player) && !invincible) {
      if (!gameOver) {
        gameOver = true;
        hitSound.play(); 
        restartBtn.style.display = "block";
        if (score > highscore) {
          highscore = score;
        }
      }
    }
  });

  let onPlatform = false;

  platforms.forEach((plat) => {
    if (plat.collidesWith(player)) {
      player.y = plat.y - player.h;
      player.speedY = 0;
      player.jumping = false;
      onPlatform = true;
    }
  });

  if (!onPlatform && player.y + player.h < canvas.height - floorHeight) {
    player.jumping = true;
  }

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "left";

  ctx.fillRect(8, 8, 160, 35);
  ctx.strokeRect(8, 8, 160, 35);
  ctx.fillStyle = "black";
  ctx.fillText("Wynik: " + score, 20, 34);

  ctx.fillStyle = "white";
  ctx.fillRect(8, 50, 160, 35);
  ctx.strokeRect(8, 50, 160, 35);
  ctx.fillStyle = "black";
  ctx.fillText("Rekord: " + highscore, 20, 76);

  if (activePowerUpImage) {
    ctx.drawImage(activePowerUpImage, 20, 100, 40, 40);
  }

  if (!gameStarted) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;
    ctx.fillText("Naciśnij GRAJ, aby zacząć", canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;
  } else if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "bold 64px Arial";
    ctx.textAlign = "center";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 20;
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;
  }

  if (gameStarted && !gameOver) {
    player.update(gravity, canvas, floorHeight);

    spawnTimer++;
    if (spawnTimer > spawnInterval) {
      const randomWidth = Math.floor(Math.random() * 60) + 30;
      const randomHeight = Math.floor(Math.random() * 60) + 30;
      const randomSpeed = Math.random() * 3 + 3;
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
      spawnInterval = getRandomSpawnInterval();
    }

    platformTimer++;
    if (platformTimer > platformInterval) {
      const platformWidth = Math.floor(Math.random() * 100) + 100;
      const platformHeight = 20;
      const platformY = Math.floor(Math.random() * 150) + 100;
      const platformSpeed = Math.random() * 2 + 3;

      const platform = new Platform(
        canvas.width,
        platformY,
        platformWidth,
        platformHeight,
        platformSpeed
      );
      platforms.push(platform);

      platformTimer = 0;
      platformInterval = Math.floor(Math.random() * 200) + 200;
    }

    powerUpTimer++;
    if (powerUpTimer > powerUpInterval) {
      const randomY = Math.floor(Math.random() * 200) + 100;
      const speed = Math.random() * 2 + 3;
      const randomTypeIndex = Math.floor(Math.random() * 3);
      let type, imageSrc;

      if (randomTypeIndex === 0) {
        type = "score";
        imageSrc = './zdjecia/powerup3.png';
      } else if (randomTypeIndex === 1) {
        type = "doubleJump";
        imageSrc = './zdjecia/powerup2.png';
      } else {
        type = "invincible";
        imageSrc = './zdjecia/powerup1.png';
      }

      const image = new Image();
      image.src = imageSrc;

      const powerUp = new PowerUp(
        canvas.width,
        randomY,
        40,
        40,
        type,
        speed,
        image
      );
      powerUps.push(powerUp);

      powerUpTimer = 0;
      powerUpInterval = getRandomPowerUpInterval();
    }
  }

  if (invincible) {
    invincibleTimer--;
    if (invincibleTimer <= 0) {
      invincible = false;
      activePowerUpImage = null;
    }
  }

  if (doubleJumpAvailable) {
    doubleJumpTimer--;
    if (doubleJumpTimer <= 0) {
      doubleJumpAvailable = false;
      activePowerUpImage = null;
    }
  }

  requestAnimationFrame(loop);
}

loop();
