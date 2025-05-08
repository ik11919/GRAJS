const obstacles = [];
let spawnTimer = 0;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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
const jumpForce = -14;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.speedY = jumpForce;
    player.jumping = true;
  }
});

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.update(gravity);
  player.draw(ctx);

  spawnTimer++;
  if (spawnTimer > 120) {
    const obstacle = new Obstacle(canvas.width, canvas.height - 40, 40, 40, 4);
    obstacles.push(obstacle);
    spawnTimer = 0;
  }

  obstacles.forEach((obs) => {
    obs.update();
    obs.draw(ctx);

    if (obs.collidesWith(player)) {
      alert("GAME OVER");
      window.location.reload();
    }
  });

  requestAnimationFrame(loop);
}

loop();
