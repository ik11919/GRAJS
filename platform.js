export class Platform {
  constructor(x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  collidesWith(player) {
    return (
      player.x + player.w > this.x &&
      player.x < this.x + this.w &&
      player.y + player.h <= this.y + 5 &&
      player.y + player.h >= this.y - 10 &&
      player.speedY >= 0
    );
  }
}