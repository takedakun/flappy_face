export default class Face {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.x = 70;
    this.y = 100;
    this.gravity = 0.7;
    this.velocity = 0;
    this.happy_face = new Image();
    this.sad_face = new Image();
    this.happy_face.src = "assets/image/nikori.png";
    this.sad_face.src = "assets/image/turai.png";
  }

  draw(context, happy_or_sad) {
    if (happy_or_sad == 1) {
      context.drawImage(this.happy_face, this.x - 10, this.y - 10, 20, 20);
    } else {
      context.drawImage(this.sad_face, this.x - 10, this.y - 10, 20, 20);
    }
  }
  update() {
    if (this.y < this.height - 10 && this.y > 10) {
      this.y += this.velocity;
      this.velocity += this.gravity;
    } else if (this.y >= this.height - 10) {
      this.y = this.height - 10;
      this.velocity = 0;
    } else if (this.y <= 10) {
      this.velocity = 0.5 * Math.abs(this.velocity);
      this.y += this.velocity;
      this.velocity += this.gravity;
    }
  }
  jump() {
    this.velocity = -8;
    if (this.y >= this.height - 10) {
      this.y += this.velocity;
      this.velocity += this.gravity
    }
  }
}
