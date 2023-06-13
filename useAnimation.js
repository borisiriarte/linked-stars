export default function animate({
  timing,
  draw,
  vanish,
  loop,
  duration,
  points,
  i,
  times,
}) {
  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction goes from 0 to 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // calculate the current animation state
    let progress = timing(timeFraction, "linear");

    draw(progress, points, i);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    } else {
      if (i < times) {
        i++;
        loop(timing, draw, vanish, loop, duration * (2 / 3), points, i, times);
      } else {
      }
    }
  });
}
