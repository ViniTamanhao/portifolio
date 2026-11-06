// A small anatomical model assembled from overlapping ellipsoids.
// Coordinates: x = nose to tail, y = up, z = left to right.
// Every part has a real surface normal; no hand-drawn frame overlays.
export function model(phase) {
  const breath = Math.cos(phase) * 0.018;
  const nod = Math.sin(phase + 0.7) * 0.035;
  const parts = [];
  const part = (center, radius, tone = 1, glyph) => parts.push({ center, radius, tone, glyph });
  part([0, 0.05, 0], [1.38, 0.65 + breath, 0.66]); // long, low torso
  part([-1.04, 0.16 + nod, 0], [0.68, 0.49, 0.48]); // rounded head, no external ears
  part([-1.8, -0.015 + nod, 0], [0.68, 0.115, 0.39], 0.84); // broad duck bill
  part([-1.75, -0.095 + nod, 0], [0.64, 0.06, 0.36], 0.7); // lower bill
  part([1.48, -0.13, 0], [0.52, 0.21, 0.36]); // tail root
  part([2.04, -0.19, 0], [0.78, 0.115, 0.48], 0.88); // flattened paddle tail
  for (const side of [-1, 1]) {
    part([-1.29, 0.32 + nod, side * 0.43], [0.055, 0.05, 0.065], 0.23, '@'); // exposed, legible eyes
    part([-2.13, 0.09 + nod, side * 0.19], [0.035, 0.019, 0.026], 0.35); // nostrils
    for (const x of [-0.82, 0.87]) {
      part([x, -0.36, side * 0.47], [0.3, 0.29, 0.31]); // short limbs
      part([x - 0.16, -0.56, side * 0.73], [0.34, 0.08, 0.3], 0.84); // webbed feet
      for (let toe = 0; toe < 4; toe++) {
        part([x - 0.36, -0.56, side * (0.55 + toe * 0.115)], [0.16, 0.045, 0.06], 0.8);
      }
    }
  }
  return parts;
}
