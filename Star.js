export default class Star {
  #x;
  #y;
  #shadowColor;
  #size;
  #ctx;
  #shadowBlur;

  constructor(x, y, shadowColor, shadowBlur, size, ctx) {
    this.#x = x;
    this.#y = y;
    this.#shadowColor = shadowColor;
    this.#shadowBlur = shadowBlur;
    this.#size = size + 0.5;
    this.#ctx = ctx;
  }

  #drawStar() {
    let { r, g, b } = this.#shadowColor;
    this.#ctx.beginPath();
    this.#ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
    this.#ctx.shadowBlur = this.#shadowBlur;

    this.#ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.03)`;
    this.#ctx.arc(this.#x, this.#y, this.#size + 2, 0, Math.PI * 2, false);

    this.#ctx.fill();
    this.#ctx.closePath();

    this.#ctx.beginPath();
    this.#ctx.fillStyle = "rgba(255, 255, 255, 1)";
    this.#ctx.arc(this.#x, this.#y, this.#size, 0, Math.PI * 2, false);
    this.#ctx.fill();
    this.#ctx.closePath();
  }

  render() {
    this.#drawStar();
  }
}
