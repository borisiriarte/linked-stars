import Star from "./Star.js";
import { colors } from "./colors.js";
import { getRndNumberBtwn } from "./getRndNumberBtwn.js";
import { useWindowDimensions } from "./useWindowDimensions.js";

const $allCanvases = document.querySelectorAll(".canvas");
const ctxs = [];
let stars = [];
let timeOutFunctionId;

function link(a, b, context) {
  context.beginPath();
  context.lineWidth = 1;
  context.strokeStyle = "white";

  context.moveTo(a.x, a.y);

  context.lineTo(b.x, b.y);

  context.stroke();
  context.closePath();
}

//This function is responsible for getting the mouse position

//This function is responsible for getting the number of stars to be rendered
function numberOfStars() {
  let { width, height } = useWindowDimensions();
  return Math.floor(Math.min(width, height) / 6);
}

//This piece of code is responsible for setting the dimensions of the canvases
function setCanvasesDimensions() {
  $allCanvases.forEach((canvas) => {
    const { width, height } = useWindowDimensions();
    canvas.width = width;
    canvas.height = height;
    ctxs.push(canvas.getContext("2d", { willReadFRequently: true }));
  });
}

//This part of the code is responsible for getting the properties of the star
function getStarProperties() {
  let { width: w, height: h } = useWindowDimensions();
  let context = ctxs[0];
  return {
    x: getRndNumberBtwn(0, w),
    y: getRndNumberBtwn(0, h),
    size: getRndNumberBtwn(0, 1),
    color: colors[Math.floor(getRndNumberBtwn(0, colors.length))],
    shadowBlur: getRndNumberBtwn(2, 15),
    context,
  };
}

//this part of the code is responsible for creating the stars
function createStars() {
  let number = numberOfStars();
  for (let i = 0; i < number; i++) {
    let { x, y, size, color, shadowBlur, context } = getStarProperties();
    let star = new Star(x, y, color, shadowBlur, size, context);

    stars.push(star);
  }
}

//This part of the code is responsible for rendering the stars
function renderStars() {
  stars.forEach((star) => star.render());
}

//This function inizializes the canvases and sets the dimensions
function init() {
  setCanvasesDimensions();
  link({ x: 100, y: 100 }, { x: 200, y: 200 }, ctxs[0]);
  // createStars();
  // renderStars();
}

//These two function handle the resize event
function debounceResize(callback, time) {
  clearTimeout(timeOutFunctionId);
  timeOutFunctionId = setTimeout(callback, time);
}

//This function is responsible for handling the resize event
function handleResize() {
  let { width, height } = useWindowDimensions();
  ctxs.forEach((ctx) => {
    ctx.clearRect(0, 0, width, height);
  });
  stars = [];

  debounceResize(init, 800);
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", handleResize);
