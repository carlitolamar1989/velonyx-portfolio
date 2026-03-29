"""
Process Velonyx VS logos for perfect transparency.
- vs-logo.png (standalone monogram) → vs-logo-monogram.png
- vs-logo-shield.png (shield version) → vs-logo-shield-clean.png

Cleans up any residual dark background pixels while preserving
the metallic gold finish and glow effects.
"""

from PIL import Image

ASSETS = "/Users/apple/Cursor-Claude/velonyx-website/.claude/worktrees/upbeat-khayyam/assets"


def clean_logo(input_path, output_path, trim=True):
    """
    Clean a logo PNG:
    1. Ensure any very dark pixels with low alpha are fully transparent
    2. Smooth the alpha edges
    3. Optionally trim empty space
    """
    img = Image.open(input_path).convert("RGBA")
    px = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue

            # Brightness of the pixel
            brightness = 0.299 * r + 0.587 * g + 0.114 * b

            # Very dark pixels with low alpha → make transparent
            # This removes dark halo remnants
            if brightness < 8 and a < 30:
                px[x, y] = (0, 0, 0, 0)
            # Dark pixels with moderate alpha — reduce alpha to soften edges
            elif brightness < 15 and a < 60:
                px[x, y] = (r, g, b, max(0, a - 15))

    if trim:
        # Crop to content bounding box with some padding
        bbox = img.getbbox()
        if bbox:
            pad = 10
            left = max(0, bbox[0] - pad)
            top = max(0, bbox[1] - pad)
            right = min(w, bbox[2] + pad)
            bottom = min(h, bbox[3] + pad)
            img = img.crop((left, top, right, bottom))

    img.save(output_path, "PNG", optimize=True)
    print(f"Saved: {output_path} ({img.size[0]}x{img.size[1]})")
    return img


# Process standalone monogram
print("Processing standalone VS monogram...")
clean_logo(
    f"{ASSETS}/vs-logo.png",
    f"{ASSETS}/vs-logo-monogram.png",
    trim=True
)

# Process shield version
print("Processing shield VS logo...")
clean_logo(
    f"{ASSETS}/vs-logo-shield.png",
    f"{ASSETS}/vs-logo-shield-clean.png",
    trim=True
)

print("\nDone! New files:")
print("  assets/vs-logo-monogram.png  — standalone VS mark")
print("  assets/vs-logo-shield-clean.png — shield version")
