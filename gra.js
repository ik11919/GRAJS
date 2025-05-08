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

const player = new Box(100, canvas.height - 40, "blue");
const gravity = 0.9;
const jumpForce = -14;
const stars = 50
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
  requestAnimationFrame(loop);
}

loop();
