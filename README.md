# Vinícius Silva

A small, text-first personal portfolio. React, TypeScript, Vite, and plain CSS. System fonts, no external assets, no backend.

## Development

Install [mise](https://mise.jdx.dev/), then from this directory:

```sh
mise trust
mise install
pnpm install
pnpm dev
```

The runtime and package manager are pinned in `mise.toml`. Enable mise in your shell, or prefix commands with `mise exec --`.

```sh
pnpm check     # TypeScript checks
pnpm build     # TypeScript checks + production output in dist/
pnpm preview   # Serve the production build locally
```

Content lives in `src/App.tsx`, styles in `src/styles.css`, and metadata in `index.html`. The ASCII sculpture after Elsewhere has a keyboard-accessible pause control. It pauses offscreen and in hidden tabs, and shows a still frame when reduced motion is preferred.

## ASCII sculpture

The platypus is a real 3D surface rendered offline into 144 monochrome text frames, played at 12 fps (a 12-second loop). No canvas, WebGL, video, fonts, or rendering libraries are loaded by the page.

- `scripts/platypus-model.mjs`: anatomical ellipsoids for the body, bill, eyes, paddle tail, limbs, and webbed feet, plus breathing and head movement.
- `scripts/generate-platypus.mjs`: orthographic ray/surface intersections, surface-normal lighting, character-density shading, and a slow camera turn.
- `src/generated/platypus.json`: checked-in frames with whitespace run-length encoding; normal builds do not regenerate them.
- `src/components/AsciiPlatypus.tsx`: text-only playback, visibility and motion-preference handling, and pause control.

Regenerate with `pnpm generate:platypus`. The generator checks ASCII-only output, fixed frame dimensions, empty framing margins, distinct frames, and loop continuity. Adjust the model or lighting in the source scripts, then regenerate and build. The animation is about 20 KB gzipped; playback updates one text node without rerendering the page.

For an offline visual contact sheet, run `python3 scripts/preview-platypus.py /tmp/platypus-review.png` (optional: Python, Pillow, and a local monospace font). This previews the actual text frames at desktop and mobile scales; it does not replace browser layout and interaction checks.

## Appearance

Dark mode is the default. The header switch remembers a light/dark preference locally and restores it before the first paint. If browser storage is unavailable, switching still works for the current page. Both palettes share the same layout and ASCII animation. To review the dark sculpture offline, append `--dark` to the preview command.

On wider screens, the outer margins contain decorative ASCII dots. Pointer movement leaves expanding, overlapping water-like ripples; clicking launches a larger wave that lasts about three seconds. The effect uses two text nodes, caps wave counts and updates at 30 fps, stops once waves settle, and stays static with reduced motion. It is hidden on smaller screens and excluded from screen readers.
