"""Genera las carpetas de los espacios (p. ej. /letsholidays/) a partir de las páginas de la raíz.
EJECUTAR SIEMPRE después de cambiar cualquier página de la raíz:   python construir_espacios.py
Las páginas de los espacios se sobrescriben: no editarlas a mano.
- Cada espacio lleva <meta robots noindex> (el que se indexa es la raíz) y un canonical a la página equivalente de la raíz.
- Las rutas de recursos son absolutas (/assets/...), así que las páginas funcionan desde cualquier carpeta.
- Los enlaces entre páginas son relativos, así que dentro de un espacio se queda en el espacio."""
import os, re, json, subprocess, sys
subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), "construir_legales.py")], check=True)   # paginas legales y enlaces del pie

AQUI = os.path.dirname(os.path.abspath(__file__))
os.chdir(AQUI)
PAGINAS = ["index.html", "planes.html", "paseos.html", "pasatiempos.html", "servicios.html", "directorio.html", "calas.html", "webcams.html", "recomendacion.html", "patrimonio.html", "creditos.html"]
ESPACIOS = ["letsholidays"]   # añadir aquí los nuevos espacios (y su entrada en espacios.js)
DOMINIO = "https://paradisblau.es/"
NEGOCIOS = {"ejemplo": {"indexar": False}, "bolera": {"indexar": False}, "minerva": {"indexar": False}, "ruedo": {"indexar": False}}   # añadir aquí los negocios (y crear negocios/<id>.json con sus datos)

for esp in ESPACIOS:
    os.makedirs(esp, exist_ok=True)
    for p in PAGINAS:
        h = open(p, encoding="utf-8").read()
        h = re.sub(r'<link rel="canonical"[^>]*>\n?', "", h)
        h = re.sub(r'<script type="application/ld\+json">.*?</script>\n?', "", h, flags=re.S)
        h = re.sub(r'<meta property="og:[^>]*>\n?', "", h)
        h = re.sub(r'<link rel="alternate" hreflang="[^>]*>\n?', "", h)   # hreflang solo en la raíz
        canon = DOMINIO + ("" if p == "index.html" else p)
        extra = ('<meta name="robots" content="noindex, follow">\n<link rel="canonical" href="%s">\n'
                 '<script>window.PB_ESPACIO="%s";</script>\n' % (canon, esp))
        h = h.replace("</head>", extra + "</head>", 1)
        if p == "index.html" and esp == "letsholidays" and os.path.exists("apartamentos-datos.js"):
            h = h.replace('<script src="/mapa-datos.js"></script>', '<script src="/mapa-datos.js"></script>\n<script src="/apartamentos-datos.js"></script>', 1)
        h = h.replace('href="/manifest.webmanifest"', 'href="/%s/manifest.webmanifest"' % esp, 1)
        open(os.path.join(esp, p), "w", encoding="utf-8").write(h)
    m = json.load(open("manifest.webmanifest", encoding="utf-8"))
    m["start_url"] = "/%s/index.html" % esp
    m["scope"] = "/%s/" % esp
    m["id"] = "/%s/" % esp
    json.dump(m, open(os.path.join(esp, "manifest.webmanifest"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("espacio", esp, "->", len(PAGINAS), "páginas")

for nid, cfg in NEGOCIOS.items():
    t = open("negocio.html", encoding="utf-8").read()
    robots = "" if cfg.get("indexar") else '<meta name="robots" content="noindex, follow">\n'
    extra = robots + '<link rel="canonical" href="%s%s/">\n<script>window.PB_NEGOCIO="%s";</script>\n' % (DOMINIO, nid, nid)
    t = t.replace("</head>", extra + "</head>", 1)
    os.makedirs(nid, exist_ok=True)
    open(os.path.join(nid, "index.html"), "w", encoding="utf-8").write(t)
    print("negocio", nid)

# Idiomas (catalán e inglés): siempre después de generar los espacios
import subprocess, sys
subprocess.run([sys.executable, "construir_idiomas.py"], check=True)
