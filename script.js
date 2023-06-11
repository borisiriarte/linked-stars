import Star from "./Star.js";
import { colors } from "./colors.js";
import { getRndNumberBtwn } from "./getRndNumberBtwn.js";
import { useWindowDimensions } from "./useWindowDimensions.js";

const $allCanvases = document.querySelectorAll(".canvas");
const ctxs = [];
let stars = [];
let timeOutFunctionId;

function setCanvasesDimensions() {
  $allCanvases.forEach((canvas) => {
    const { width, height } = useWindowDimensions();
    canvas.width = width;
    canvas.height = height;
    ctxs.push(canvas.getContext("2d", { willReadFRequently: true }));
  });
}

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

function createStars() {
  for (let i = 0; i < 200; i++) {
    let { x, y, size, color, shadowBlur, context } = getStarProperties();
    let star = new Star(x, y, color, shadowBlur, size, context);

    stars.push(star);
  }
}

function renderStars() {
  stars.forEach((star) => star.render());
}

//This function inizializes the canvases and sets the dimensions
function init() {
  setCanvasesDimensions();
  createStars();
  renderStars();
}

//These two function handle the resize event
function debounceResize(callback, time) {
  clearTimeout(timeOutFunctionId);
  timeOutFunctionId = setTimeout(callback, time);
}

function handleResize() {
  let { width, height } = useWindowDimensions();
  ctxs[0].clearRect(0, 0, width, height);
  stars = [];

  debounceResize(init, 800);
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", handleResize);
