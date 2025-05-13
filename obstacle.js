export class Obstacle {
  constructor(x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.color = "red";
    this.passed = false;
    this.image = null;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
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


