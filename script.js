import Link from "./Link.js";
import Star from "./Star.js";
import { colors } from "./colors.js";
import { getRndNumberBtwn } from "./getRndNumberBtwn.js";
import setTimeProgression from "./setTimeProgression.js";
import animate from "./useAnimation.js";
import { useWindowDimensions } from "./useWindowDimensions.js";
import vLerp from "./vLerp.js";
let { width, height } = useWindowDimensions();

const $allCanvases = document.querySelectorAll(".canvas");
const ctxs = [];
let stars = [];
let timeOutFunctionId;

//This piece of code is responsible for setting the dimensions of the canvases
function setCanvasesDimensions() {
  $allCanvases.forEach((canvas) => {
    const { width, height } = useWindowDimensions();
    canvas.width = width;
    canvas.height = height;
    ctxs.push(canvas.getContext("2d", { willReadFRequently: true }));
  });
}

//~This part of the code is responsible for everything realted to the stars

//This function is responsible for getting the number of stars to be rendered
function numberOfStars() {
  let { width, height } = useWindowDimensions();
  return Math.floor(Math.min(width, height) / 6);
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

function getNStars(nStars) {
  let chosenStars = [];
  for (let i = 0; i < nStars; i++) {
    let star = Math.floor(getRndNumberBtwn(0, stars.length));
    chosenStars.push(stars[star]);
  }

  return chosenStars;
}

//~---------------------------------------

function link(a, b, context, color, times) {
  const link = new Link(a, b, context, color);

  link.moveToPoint();
  for (let i = 0; i < times; i++) {
    link.lineToPoint();
  }
  link.closePath();
}

//this part of the code is responsible for drawing the link between the stars
function drawProgressively(progress, points, i) {
  ctxs[1].clearRect(0, 0, width, height);

  let inBtwnPoint = vLerp(points[i], points[i + 1], progress);

  link(points[i], inBtwnPoint, ctxs[1], "white", 1);
  for (let j = 0; j < i; j++) {
    link(points[j], points[j + 1], ctxs[1], "white", 3);
  }
}

function vanishProgressively(progress, points) {}

function animateLoop(
  timing,
  draw,
  vanish,
  loop,
  duration,
  points,
  index,
  times
) {
  animate({
    timing: timing,
    draw: draw,
    vanish: vanish,
    loop: loop,
    duration: duration,
    points: points,
    i: index,
    times: times,
  });
}

//~This section initizlizes and listens if there's a change on window size

//This function inizializes the canvases and sets the dimensions
function init() {
  setCanvasesDimensions();
  createStars();
  // renderStars();
  let chosenStars = getNStars(5);
  console.log(chosenStars);
  animateLoop(
    setTimeProgression,
    drawProgressively,
    vanishProgressively,
    animateLoop,
    800,
    chosenStars,
    0,
    chosenStars.length - 2
  );
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
