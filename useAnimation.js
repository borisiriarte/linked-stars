export default function animate({
  timing,
  draw,
  loop,
  duration,
  points,
  i,
  times,
  timeType,
}) {
  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction goes from 0 to 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // calculate the current animation state
    let progress = timing(timeFraction, timeType);

    // draw it!
    if (timeType === "linear") {
      draw[0](progress, points, i);
    } else {
      draw[1](progress, points);
    }

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    } else {
      if (i < times) {
        i++;
        loop(
          timing,
          draw,
          loop,
          duration * (5 / 6),
          points,
          i,
          times,
          timeType
        );
      } else {
        loop(timing, draw, () => {}, 1200, points, null, null, "quad");
      }
    }
  });
}
