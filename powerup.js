export class PowerUp {
  constructor(x, y, w, h, type, speed, image) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.speed = speed;
    this.image = image;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }

  collidesWith(player) {
    return (
      this.x < player.x + player.w &&
      this.x + this.w > player.x &&
      this.y < player.y + player.h &&
      this.y + this.h > player.y
    );
  }
}

