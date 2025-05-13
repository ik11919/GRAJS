export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 80;
    this.h = 80;
    this.speedY = 0;
    this.speedX = 0;
    this.jumping = false;

    this.image = new Image();
    this.image.src = "./zdjecia/kaczka.png"; 
  }

  update(gravity, canvas, floorHeight) {
    this.speedY += gravity;
    this.y += this.speedY;
    this.x += this.speedX;

    if (this.x < 0) this.x = 0;
    if (this.x + this.w > canvas.width) this.x = canvas.width - this.w;

    if (this.y > canvas.height - floorHeight - this.h) {
      this.y = canvas.height - floorHeight - this.h;
      this.speedY = 0;
      this.jumping = false;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }
}
