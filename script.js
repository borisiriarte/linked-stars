import { useWindowDimensions } from "./useWindowDimensions.js";

const $allCanvases = document.querySelectorAll(".canvas");
const ctxs = [];

function setCanvasesDimensions() {
  $allCanvases.forEach((canvas) => {
    const { width, height } = useWindowDimensions();
    canvas.width = width;
    canvas.height = height;
    ctxs.push(canvas.getContext("2d", { willReadFRequently: true }));
  });
}

function init() {
  setCanvasesDimensions();
}

document.addEventListener("DOMContentLoaded", init);
