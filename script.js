import Link from "./Link.js";
import Star from "./Star.js";
import { colors, white } from "./colors.js";
import { getRndNumberBtwn } from "./getRndNumberBtwn.js";
import setTimeProgression from "./setTimeProgression.js";
import animate from "./useAnimation.js";
import { useWindowDimensions } from "./useWindowDimensions.js";
import vLerp from "./vLerp.js";

const $allCanvases = document.querySelectorAll(".canvas");
let ctxs = [];
let stars = [];
let timeOutFunctionId;
// let onResize = false;

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
    color: colors[Math.floor(getRndNumberBtwn(0, colors.length - 1))],
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

//This code is responsible for pushing a n number of stars`
function getNStars(nStars) {
  let chosenStars = [];
  for (let i = 0; i < nStars; i++) {
    let star = Math.floor(getRndNumberBtwn(0, stars.length));
    chosenStars.push(stars[star]);
  }

  return chosenStars;
}

//~---------------------------------------

function link(a, b, context, color) {
  const link = new Link(a, b, context, color);

  link.moveToPoint();

  link.lineToPoint();
  link.closePath();
}

//this part of the code is responsible for drawing the function animations
function drawProgressively(progress, points, i, ctx) {
  let { width, height } = useWindowDimensions();
  ctx.clearRect(0, 0, width, height);
  let { r, g, b, a } = white[0];

  let inBtwnPoint = vLerp(points[i], points[i + 1], progress);

  link(points[i], inBtwnPoint, ctx, `rgba(${r}, ${g}, ${b}, ${a})`);
  for (let j = 0; j < i; j++) {
    link(points[j], points[j + 1], ctx, `rgba(${r}, ${g}, ${b}, ${a})`);
  }
}

function vanishProgressively(progress, points, ctx) {
  let { width, height } = useWindowDimensions();
  ctx.clearRect(0, 0, width, height);

  let inBtwnOpacity = vLerp(white[0], white[1], progress);
  let { r, g, b, a } = inBtwnOpacity;

  for (let j = 0; j < points.length - 1; j++) {
    link(points[j], points[j + 1], ctx, `rgba(${r}, ${g}, ${b}, ${a})`);
  }
}

function animateLoop(
  timing,
  draw,
  loop,
  duration,
  points,
  i,
  times,
  timeType,
  ctx
) {
  animate({
    timing: timing,
    draw: draw,
    loop: loop,
    duration: duration,
    points: points,
    i: i,
    times: times,
    timeType: timeType,
    ctx: ctx,
  });
}

//Configuration params for the animation function
function animationConfig(ctx) {
  let rndNumOfStars = getRndNumberBtwn(3, 7);
  let chosenStars = getNStars(rndNumOfStars);
  animateLoop(
    setTimeProgression,
    [drawProgressively, vanishProgressively],
    animateLoop,
    800,
    chosenStars,
    0,
    chosenStars.length - 2,
    "linear",
    ctx
  );
}

//Delay
function delay(delay, callback, ctx) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(callback(ctx));
    }, delay)
  );
}

//InfiniteLoop
async function InfiniteLoop(ctxsToBeUsed) {
  // if (onResize) return;

  for (const ctx of ctxsToBeUsed) {
    let rndDelay = getRndNumberBtwn(1500, 5000);
    await delay(rndDelay, animationConfig, ctx);
  }

  return await delay(1200, InfiniteLoop, ctxsToBeUsed);
}

//~This section initizlizes and listens if there's a change on window size

//This function inizializes the canvases and sets the dimensions
function init() {
  setCanvasesDimensions();
  let ctxsLink = ctxs.slice(1);
  createStars();
  renderStars();
  InfiniteLoop(ctxsLink);
}

//These two function handle the resize event
function debounceResize(callback, time) {
  clearTimeout(timeOutFunctionId);
  timeOutFunctionId = setTimeout(callback, time);
}

//This function is responsible for handling the resize event
function handleResize() {
  // onResize = true;
  let { width, height } = useWindowDimensions();
  stars = [];
  ctxs.forEach((ctx) => {
    ctx.clearRect(0, 0, width, height);
  });
  ctxs = [];

  debounceResize(() => {
    setCanvasesDimensions();
    createStars();
    renderStars();
    // onResize = false;
    console.clear();
  }, 1200);
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", handleResize);
