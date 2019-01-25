export default class Pipe {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.x = this.width;
    this.top_y = Math.random() * (this.height / 2 - 15);
    this.bottom_y = Math.random() * (this.height / 2 - 15);
    this.xv = 5;
    this.pillar = new Image();
    this.out_pillar = new Image();
    this.pillar.src = "assets/image/pillar.png";
    this.out_pillar.src = "assets/image/out_pillar.png";
  }

  draw(context, out_or_not, top_or_bottom) {
    if (out_or_not == 1) {
      context.drawImage(this.pillar, this.x, 0, 15, this.top_y);
      context.drawImage(this.pillar, this.x, this.height - this.bottom_y, 15, this.bottom_y);
    } else {
      if (top_or_bottom == 1) {
        context.drawImage(this.out_pillar, this.x, 0, 15, this.top_y);
      } else {
        context.drawImage(this.out_pillar, this.x, this.height - this.bottom_y, 15, this.bottom_y);
      }
    }
  }
  update() {
    this.x -= this.xv
  }
}
