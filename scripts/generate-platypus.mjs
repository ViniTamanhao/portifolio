import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
import { model } from './platypus-model.mjs';

const columns = 104;
const rows = 28;
const fps = 12;
const count = 144;
const ramp = '.,:;irsXA253hMHGS#9B&@';
const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
const normalize = v => v.map(x => x / Math.hypot(...v));
const light = normalize([-0.6, 0.9, 1]);

export function render(phase) {
  // A three-quarter view that slowly turns; the camera never loses the bill or tail.
  const yaw = 0.29 + Math.sin(phase) * 0.16;
  const pitch = 0.4;
  const right = [Math.cos(yaw), 0, -Math.sin(yaw)];
  // Rays travel from the viewer into the object. Use an elevated camera.
  const camera = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)];
  const vertical = [-Math.sin(yaw) * Math.sin(pitch), Math.cos(pitch), -Math.cos(yaw) * Math.sin(pitch)];
  const direction = camera.map(x => -x);
  const parts = model(phase);
  const lines = [];
  for (let row = 0; row < rows; row++) {
    let line = '';
    for (let col = 0; col < columns; col++) {
      const sx = ((col + 0.5) / columns - 0.5) * 6.2 + 0.1;
      const sy = (0.5 - (row + 0.5) / rows) * 2.65;
      const origin = camera.map((v, i) => v * 8 + right[i] * sx + vertical[i] * sy);
      let nearest = Infinity;
      let surface;
      for (const part of parts) {
        const local = origin.map((x, i) => (x - part.center[i]) / part.radius[i]);
        const ray = direction.map((x, i) => x / part.radius[i]);
        const a = dot(ray, ray);
        const b = dot(local, ray);
        const discriminant = b * b - a * (dot(local, local) - 1);
        if (discriminant < 0) continue;
        const t = (-b - Math.sqrt(discriminant)) / a;
        if (t < 0 || t >= nearest) continue;
        nearest = t;
        const point = origin.map((x, i) => x + direction[i] * t);
        const normal = normalize(point.map((x, i) => (x - part.center[i]) / part.radius[i] ** 2));
        const illumination = (0.22 + 0.78 * Math.max(0, dot(normal, light))) * part.tone;
        // Darker surfaces use denser ink; highlights remain visibly dotted.
        surface = part.glyph ?? ramp[Math.min(ramp.length - 1, Math.floor((1 - illumination) * ramp.length))];
      }
      line += surface ?? ' ';
    }
    lines.push(line);
  }
  return lines.join('\n');
}

const frames = Array.from({ length: count }, (_, i) => render(i / count * Math.PI * 2));
for (const frame of frames) {
  assert.equal(frame.split('\n').length, rows);
  assert.ok(frame.split('\n').every(line => line.length === columns));
  assert.match(frame, /^[\x20-\x7e\n]+$/);
  assert.ok(frame.split('\n')[0].trim() === '' && frame.split('\n').at(-1).trim() === '');
}
assert.equal(render(0), render(Math.PI * 2), 'The loop must be continuous');
assert.ok(new Set(frames).size > count * 0.8, 'The animation must contain real geometry changes');
const directory = fileURLToPath(new URL('../src/generated/', import.meta.url));
mkdirSync(directory, { recursive: true });
// Run-length encode whitespace to avoid shipping hundreds of kilobytes of padding.
const packed = frames.map(frame => frame.replace(/ {3,}/g, spaces => `~${spaces.length}~`));
assert.deepEqual(packed.map(frame => frame.replace(/~(\d+)~/g, (_, n) => ' '.repeat(Number(n)))), frames);
const data = JSON.stringify({ columns, rows, fps, encoding: 'space-rle', frames: packed });
writeFileSync(`${directory}platypus.json`, data + '\n');
console.log(`Generated ${count} frames, ${columns} × ${rows}; ${(gzipSync(data).length / 1024).toFixed(1)} KiB gzip.`);
