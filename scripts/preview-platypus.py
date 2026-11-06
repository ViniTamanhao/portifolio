"""Optional offline QA: render the generated text, never an asset for the site."""
import json
import re
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
data = json.loads((root / 'src/generated/platypus.json').read_text())
data['frames'] = [re.sub(r'~(\d+)~', lambda match: ' ' * int(match[1]), frame) for frame in data['frames']]
font_path = subprocess.check_output(['fc-match', '-f', '%{file}', 'monospace']).decode()
dark = '--dark' in sys.argv
paper, ink, muted = ('#191918', '#c7b7a0', '#a49e93') if dark else ('#f8f7f3', '#706251', '#716c63')
scale = 2
image = Image.new('RGB', (820 * scale, 1170 * scale), paper)
draw = ImageDraw.Draw(image)
label = ImageFont.truetype(font_path, 11 * scale)

def frame(index, width, top):
    size = min(11.6, width * 0.0159) * scale
    font = ImageFont.truetype(font_path, round(size))
    left = (820 * scale - font.getlength(' ' * data['columns'])) / 2
    for row, line in enumerate(data['frames'][index].splitlines()):
        draw.text((left, top * scale + row * size * 1.05), line, font=font, fill=ink)

for index, top in [(0, 35), (36, 380), (108, 725)]:
    draw.text((30 * scale, (top - 20) * scale), f'Desktop / frame {index}', font=label, fill=muted)
    frame(index, 728, top)
draw.text((30 * scale, 1060 * scale), 'Mobile / 338px panel', font=label, fill=muted)
frame(0, 338, 1000)
image.save(sys.argv[1] if len(sys.argv) > 1 else '/tmp/platypus-review.png')
