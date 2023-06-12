export default function vLerp(A, B, t) {
  const res = {};
  for (const attr in A) {
    res[attr] = lerp(A[attr], B[attr], t);
  }

  return res;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
