let gameStarted = false;
let score = 0;
let highscore = 0;
const obstacles = [];
let spawnTimer = 0;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

class Box {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 40;
    this.color = color;
    this.speedY = 0;
    this.jumping = false;
  }

  update(gravity) {
    this.speedY += gravity;
    this.y += this.speedY;

    if (this.y > canvas.height - this.h) {
      this.y = canvas.height - this.h;
      this.speedY = 0;
      this.jumping = false;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Obstacle {
  constructor(x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.color = "red";
    this.passed = false; // DODANE od razu przy tworzeniu
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  collidesWith(box) {
    return (
      this.x < box.x + box.w &&
      this.x + this.w > box.x &&
      this.y < box.y + box.h &&
      this.y + this.h > box.y
    );
  }
}

const player = new Box(100, canvas.height - 40, "blue");
const gravity = 0.9;
const jumpForce = -20;
let gameOver = false;

const restartBtn = document.getElementById("restartBtn");

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping && !gameOver) {
    player.speedY = jumpForce;
    player.jumping = true;
  }
});

restartBtn.addEventListener("click", () => {
  obstacles.length = 0;
  spawnTimer = 0;
  player.x = 100;
  player.y = canvas.height - 40;
  player.speedY = 0;
  player.jumping = false;
  gameOver = false;
  score = 0;
  restartBtn.style.display = "none";
});

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Wynik: " + score, 10, 30);

  player.draw(ctx);

  if (!gameOver) {
    player.update(gravity);

    spawnTimer++;
    if (spawnTimer > 120) {
      const obstacle = new Obstacle(canvas.width, canvas.height - 40, 40, 40, 4);
      obstacles.push(obstacle);
      spawnTimer = 0;
    }

    obstacles.forEach((obs) => {
      obs.update();
      obs.draw(ctx);

      if (!obs.passed && obs.x + obs.w < player.x) {
        obs.passed = true;
        score++;
      }

      if (obs.collidesWith(player)) {
        gameOver = true;
        restartBtn.style.display = "block";
      }
    });
  } else {
    ctx.fillStyle = "black";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(loop);
}
  startBtn.addEventListener("click", () => {
    gameStarted
  })
loop();
