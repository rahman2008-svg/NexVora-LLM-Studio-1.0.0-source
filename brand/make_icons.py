"""Generates the NexVora LLM Studio launcher icons and logo PNGs (original artwork, Pillow only).
Run from repo root:  python3 brand/make_icons.py
"""
from PIL import Image, ImageDraw, ImageChops, ImageFilter
import math, os

M = 1024
CYAN = (45, 226, 230)
VIOLET = (139, 92, 246)
NAVY_TOP = (10, 16, 40)
NAVY_BOT = (5, 8, 22)

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def gradient(size, c1, c2, diagonal=True):
    w, h = size
    g = Image.new("RGB", size)
    px = g.load()
    for y in range(h):
        for x in range(w):
            t = ((x / w) + (y / h)) / 2 if diagonal else y / h
            px[x, y] = lerp(c1, c2, t)
    return g

def background():
    bg = gradient((M, M), NAVY_TOP, NAVY_BOT, diagonal=False).convert("RGBA")
    glow = Image.new("RGBA", (M, M), (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse((M * 0.15, M * 0.55, M * 0.85, M * 1.25), fill=(139, 92, 246, 90))
    d.ellipse((M * 0.30, -M * 0.30, M * 1.00, M * 0.40), fill=(45, 226, 230, 55))
    glow = glow.filter(ImageFilter.GaussianBlur(M * 0.12))
    return Image.alpha_composite(bg, glow)

def mark_mask(scale=1.0):
    """Hexagon ring + stylised N + spark node, as an 'L' mask at M x M, centred."""
    S = 4
    big = M * S
    mask = Image.new("L", (big, big), 0)
    d = ImageDraw.Draw(mask)
    cx = cy = big / 2
    r = big * 0.30 * scale
    pts = [(cx + r * math.cos(math.radians(60 * i - 90)), cy + r * math.sin(math.radians(60 * i - 90))) for i in range(6)]
    d.line(pts + [pts[0]], fill=255, width=int(big * 0.034 * scale), joint="curve")
    for p in pts:
        rr = big * 0.017 * scale
        d.ellipse((p[0] - rr, p[1] - rr, p[0] + rr, p[1] + rr), fill=255)
    # N glyph
    w = r * 0.78
    h = r * 0.86
    t = big * 0.050 * scale
    L, R, T, B = cx - w / 2, cx + w / 2, cy - h / 2, cy + h / 2
    d.line([(L, B), (L, T)], fill=255, width=int(t))
    d.line([(R, B), (R, T)], fill=255, width=int(t))
    d.line([(L, T), (R, B)], fill=255, width=int(t * 1.05))
    # spark node at top-right of the N
    sr = big * 0.026 * scale
    sx, sy = R + t * 0.1, T - t * 0.1
    d.ellipse((sx - sr, sy - sr, sx + sr, sy + sr), fill=255)
    return mask.resize((M, M), Image.LANCZOS)

def mark_layer(scale=1.0):
    grad = gradient((M, M), CYAN, VIOLET).convert("RGBA")
    layer = Image.new("RGBA", (M, M), (0, 0, 0, 0))
    layer.paste(grad, (0, 0), mark_mask(scale))
    return layer

def save_sizes(img, name, sizes):
    for folder, px in sizes.items():
        out = f"android/app/src/main/res/mipmap-{folder}/{name}.png"
        img.resize((px, px), Image.LANCZOS).save(out)

ADAPTIVE = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}
LEGACY = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}

bg = background()
fg = mark_layer(scale=0.95)
mono_alpha = fg.split()[3]
mono = Image.new("RGBA", (M, M), (255, 255, 255, 0))
mono.putalpha(mono_alpha)
mono_rgb = Image.new("RGBA", (M, M), (255, 255, 255, 255))
mono_rgb.putalpha(mono_alpha)

save_sizes(bg, "ic_launcher_background", ADAPTIVE)
save_sizes(fg, "ic_launcher_foreground", ADAPTIVE)
save_sizes(mono_rgb, "ic_launcher_monochrome", ADAPTIVE)

# legacy composite: rounded square
full = Image.alpha_composite(bg, mark_layer(scale=1.25))
rm = Image.new("L", (M, M), 0)
ImageDraw.Draw(rm).rounded_rectangle((0, 0, M - 1, M - 1), radius=int(M * 0.22), fill=255)
legacy = Image.new("RGBA", (M, M), (0, 0, 0, 0))
legacy.paste(full, (0, 0), rm)
save_sizes(legacy, "ic_launcher", LEGACY)

os.makedirs("src/assets/logo", exist_ok=True)
legacy.save("brand/nexvora-icon-1024.png")
mark_layer(scale=1.45).save("src/assets/logo/nexvora-mark.png")
print("icons written")


# ---------------------------------------------------------------------------
# Onboarding artwork (original NexVora art). Same file names/sizes as the slots in the app.
# ---------------------------------------------------------------------------
import random

def make_blobs(path="src/assets/onboarding/bg-blobs.png", size=(360, 800)):
    w, h = size
    base = Image.new("RGBA", size, (10, 16, 32, 255))
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse((-120, -80, 260, 300), fill=(45, 226, 230, 120))
    d.ellipse((140, 260, 520, 640), fill=(139, 92, 246, 130))
    d.ellipse((-160, 560, 240, 940), fill=(45, 226, 230, 70))
    layer = layer.filter(ImageFilter.GaussianBlur(70))
    Image.alpha_composite(base, layer).save(path)

def make_welcome(path="src/assets/onboarding/welcome.png", size=(1242, 1530)):
    random.seed(7)
    S = 2
    w, h = size[0] * S, size[1] * S
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = w // 2, h // 2
    gd.ellipse((cx - 520 * S, cy - 520 * S, cx + 520 * S, cy + 520 * S), fill=(139, 92, 246, 70))
    gd.ellipse((cx - 330 * S, cy - 330 * S, cx + 330 * S, cy + 330 * S), fill=(45, 226, 230, 60))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)
    # orbit rings
    for i, r in enumerate((250, 380, 510)):
        col = lerp(CYAN, VIOLET, i / 2) + (150 - i * 30,)
        d.ellipse((cx - r * S, cy - r * S, cx + r * S, cy + r * S), outline=col, width=3 * S)
    # nodes on the rings, joined to the centre
    nodes = []
    for i, r in enumerate((250, 380, 510)):
        for k in range(4 + i):
            a = random.uniform(0, 2 * math.pi)
            nodes.append((cx + r * S * math.cos(a), cy + r * S * math.sin(a), i))
    for x, y, i in nodes:
        d.line((cx, cy, x, y), fill=lerp(CYAN, VIOLET, i / 2) + (55,), width=2 * S)
    for x, y, i in nodes:
        rr = (10 + i * 3) * S
        d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=lerp(CYAN, VIOLET, i / 2) + (255,))
    # chip card in the centre with the mark
    card = 300 * S
    d.rounded_rectangle((cx - card // 2, cy - card // 2, cx + card // 2, cy + card // 2), radius=70 * S, fill=(13, 20, 38, 255), outline=(45, 226, 230, 255), width=4 * S)
    mk = mark_layer(scale=1.3).resize((card, card), Image.LANCZOS)
    img.alpha_composite(mk, (cx - card // 2, cy - card // 2))
    img.resize(size, Image.LANCZOS).save(path)

make_blobs()
make_welcome()
print("onboarding art written")
