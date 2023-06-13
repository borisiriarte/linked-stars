export default class Link {
  #a;
  #b;
  #context;
  #color;
  constructor(a, b, context, color) {
    this.#a = a;
    this.#b = b;
    this.#context = context;
    this.#color = color;
  }

  moveToPoint() {
    this.#context.beginPath();
    this.#context.lineWidth = 0.1;
    this.#context.strokeStyle = this.#color;

    this.#context.moveTo(this.#a.x, this.#a.y);
  }

  lineToPoint() {
    this.#context.lineTo(this.#b.x, this.#b.y);
  }

  closePath() {
    this.#context.stroke();
    this.#context.closePath();
  }
}
