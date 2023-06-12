export default function (timeFraction, type) {
  return {
    linear: timeFraction,
    quad: Math.pow(timeFraction, 2),
    circ: 1 - Math.sin(Math.acos(timeFraction)),
  }[type];
}
