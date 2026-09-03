"""Prepara las fotos que se abren desde las etiquetas de Maquillaje.

La tarjeta de Maquillaje del sitio lista sus tipos de trabajo (Social,
Quinceañeras, Novia, Grados…). Las etiquetas que aparecen aquí se vuelven
un botón: al pulsarlas se despliegan sus fotos. Las demás siguen siendo
texto, porque todavía no hay material propio de esas.

Lee los originales de FOCUS/fotos-originales/, escribe en
public/images/maquillaje/ una versión JPG y otra WebP con el lado largo a
1400 px, y regenera src/data/maquillajes.js.

Para añadir un tipo nuevo (por ejemplo Novia):
  1. Guarda las fotos en FOCUS/fotos-originales/maquillaje-novia/.
  2. Añade sus líneas a MAPA con la clave 'novia' — la clave es la
     etiqueta de site.js en minúsculas y sin tildes.
  3. Ejecuta:  python scripts/procesar-maquillajes.py

Requiere Pillow:  pip install Pillow
"""

import base64
import io
import os

from PIL import Image, ImageOps

AQUI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(AQUI)                       # focus-web/
ROOT = os.path.dirname(SRC)                       # FOCUS/
ORIG = os.path.join(ROOT, 'fotos-originales')
WEB = os.path.join(SRC, 'public', 'images', 'maquillaje')

# (clave del tipo, ruta dentro de fotos-originales, slug de salida, alt)
# El orden manda: es el que se ve al desplegar.
MAPA = [
    # ── Social ──────────────────────────────────────────────
    ('social', 'maquillaje-social/social-delineado-alado.jpeg',
     'social-delineado-alado', 'Maquillaje social con delineado alado negro y labio nude'),
    ('social', 'maquillaje-social/social-bronce-labio-marron.jpeg',
     'social-bronce-labio-marron', 'Maquillaje social en tonos bronce con labio marrón glossy'),
    ('social', 'maquillaje-social/social-glam-rubia.jpeg',
     'social-glam-rubia', 'Maquillaje social glam con sombra neutra y labio vino'),
    ('social', 'maquillaje-social/social-dorado-sonrisa.jpeg',
     'social-dorado-sonrisa', 'Maquillaje social con sombra dorada y piel luminosa'),
    ('social', 'maquillaje-social/social-alado-camisa.jpeg',
     'social-alado-camisa', 'Maquillaje social con delineado alado y labio vino'),

    # ── Grados ──────────────────────────────────────────────
    ('grados', 'social-labio-rojo.jpg',
     'grados-labio-rojo', 'Maquillaje de grado con delineado alado y labio rojo'),
    ('grados', 'social-natural-rizos.jpg',
     'grados-natural-rizos', 'Maquillaje de grado natural luminoso con ondas'),
    ('grados', 'social-glam-collar.jpg',
     'grados-glam-collar', 'Maquillaje de grado glam suave con piel luminosa'),
    ('grados', 'social-coral-luminoso.jpg',
     'grados-coral-luminoso', 'Maquillaje de grado en coral luminoso con labio nude'),
    ('grados', 'social-marron-suave.jpg',
     'grados-marron-suave', 'Maquillaje de grado en ahumado marrón con piel satinada'),
]

LADO = 1400
os.makedirs(WEB, exist_ok=True)

tipos = {}
for tipo, archivo, slug, alt in MAPA:
    ruta = os.path.join(ORIG, archivo)
    if not os.path.exists(ruta):
        print('FALTA', ruta)
        continue

    # exif_transpose respeta la orientación con que se tomó la foto
    im = ImageOps.exif_transpose(Image.open(ruta)).convert('RGB')
    w, h = im.size
    escala = LADO / max(w, h)
    if escala < 1:
        im = im.resize((round(w * escala), round(h * escala)), Image.LANCZOS)

    im.save(os.path.join(WEB, slug + '.jpg'), 'JPEG', quality=82, optimize=True, progressive=True)
    im.save(os.path.join(WEB, slug + '.webp'), 'WEBP', quality=78, method=6)

    # LQIP: miniatura de 16 px embebida en el JS, desenfocada mientras
    # baja la foto real, para que nunca haya un hueco negro.
    mini = im.copy()
    mini.thumbnail((16, 16), Image.LANCZOS)
    buf = io.BytesIO()
    mini.save(buf, 'JPEG', quality=40)
    b64 = base64.b64encode(buf.getvalue()).decode()

    tipos.setdefault(tipo, []).append({
        'slug': slug,
        'alt': alt,
        'ratio': round(im.size[0] / im.size[1], 4),
        'lqip': 'data:image/jpeg;base64,' + b64,
    })

    kb = lambda ext: os.path.getsize(os.path.join(WEB, slug + ext)) // 1024
    print(f'{slug:28} {im.size[0]}x{im.size[1]}  jpg {kb(".jpg")}KB  webp {kb(".webp")}KB')

RAYA = '─' * 61
cabecera = '\n'.join([
    f'// {RAYA}',
    '//  ARCHIVO GENERADO — no editar a mano.',
    '//  Lo produce scripts/procesar-maquillajes.py a partir de',
    '//  FOCUS/fotos-originales/. Ver README ("Fotos").',
    '//',
    '//  Cada clave es una etiqueta de la tarjeta de Maquillaje en',
    '//  minúsculas y sin tildes. Las etiquetas sin clave aquí se quedan',
    '//  como texto: no se pueden abrir porque no hay fotos suyas.',
    f'// {RAYA}',
    '',
    '',
])

bloques = []
for tipo, fotos in tipos.items():
    lineas = []
    for f in fotos:
        lineas.append('\n'.join([
            '    {',
            f"      src: '/images/maquillaje/{f['slug']}',",
            f"      alt: '{f['alt']}',",
            f"      ratio: {f['ratio']},",
            f"      lqip: '{f['lqip']}',",
            '    },',
        ]))
    bloques.append(f'  {tipo}: [\n' + '\n'.join(lineas) + '\n  ],')

destino = os.path.join(SRC, 'src', 'data', 'maquillajes.js')
with io.open(destino, 'w', encoding='utf-8') as f:
    f.write(cabecera + 'export const maquillajes = {\n' + '\n'.join(bloques) + '\n}\n')

total = sum(len(v) for v in tipos.values())
print(f'\n{total} fotos en {len(tipos)} tipos -> {destino}')
