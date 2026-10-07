"""Genera las versiones en catalán e inglés de la web: /ca/ y /en/ (y /letsholidays/ca/ y /letsholidays/en/).
Se ejecuta solo al final de construir_espacios.py (que debe ejecutarse siempre después de cambiar algo de la raíz).

Fuente de las traducciones: i18n/traducciones.tsv (columnas es, ca, en; la clave es el texto en español tal cual
sale en la página) y, opcionalmente, i18n/patrones.tsv (regex en español → reemplazo, una por idioma: es, ca, en).
De ahí se escriben i18n/ca.js y i18n/en.js, que carga cada página traducida; el navegador sustituye los textos
(ver i18n.js). Aquí solo se tocan la cabecera de cada página (lang, título, descripción, canonical, hreflang)
y se enlazan los scripts.

Informe de lo que falta:   python construir_idiomas.py --faltan   (textos de las páginas sin traducir)"""
import os, re, json, sys, csv, html as H

AQUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(AQUI)
DOMINIO = "https://paradisblau.es/"
PAGINAS = ["index.html", "planes.html", "paseos.html", "pasatiempos.html", "servicios.html", "directorio.html", "calas.html", "webcams.html", "recomendacion.html", "patrimonio.html", "creditos.html"]
BASES = ["", "letsholidays"]          # raíz y espacios con las mismas páginas
IDIOMAS = {"ca": {"locale": "ca_ES", "col": 1}, "en": {"locale": "en_GB", "col": 2}}

def leer(f):
    return list(csv.reader(open(f, encoding="utf-8"), delimiter="\t", quoting=csv.QUOTE_NONE)) if os.path.exists(f) else []

filas = [r for r in leer("i18n/traducciones.tsv")[1:] if len(r) >= 3 and r[0].strip()]
pats = [r for r in leer("i18n/patrones.tsv")[1:] if len(r) >= 3]
pals = [r for r in leer("i18n/palabras.tsv")[1:] if len(r) >= 3]
DICT = {}
for cod, cfg in IDIOMAS.items():
    c = cfg["col"]
    x = {re.sub(r"\s+", " ", r[0]).strip(): r[c].strip() for r in filas if r[c].strip()}
    p = [[r[0], r[c]] for r in pats if r[c].strip()]
    w = {r[0].strip(): r[c].strip() for r in pals if r[c].strip()}
    DICT[cod] = {"x": x, "p": p, "w": w}
    open("i18n/%s.js" % cod, "w", encoding="utf-8").write("/* Generado por construir_idiomas.py: no editar. Fuente: i18n/traducciones.tsv */\nwindow.PB_I18N=" + json.dumps(DICT[cod], ensure_ascii=False, separators=(",", ":")) + ";\n")

LEGAL = {"ca": ("avis-legal.html", "privacitat.html", "galetes.html"), "en": ("legal-notice.html", "privacy-policy.html", "cookie-policy.html")}
def traduce(cod, s):
    k = re.sub(r"\s+", " ", H.unescape(s)).strip()
    return DICT[cod]["x"].get(k)

def ruta(base, cod, p):
    r = "/".join(x for x in (base, cod if cod != "es" else "", "" if p == "index.html" else p) if x)
    return r + "/" if p == "index.html" and r else r

if "--faltan" in sys.argv:
    falta = set()
    for p in PAGINAS:
        h = open(p, encoding="utf-8").read()
        h = re.sub(r"<(script|style|svg)\b.*?</\1>", "", h, flags=re.S)
        for t in re.findall(r">([^<>]+)<", h):
            k = re.sub(r"\s+", " ", H.unescape(t)).strip()
            if re.search(r"[A-Za-zÀ-ÿ]{3}", k) and k not in DICT["ca"]["x"]: falta.add((p, k))
    for p, k in sorted(falta): print(p, "|", k)
    print(len(falta), "textos sin traducir (solo texto estático de las páginas; los dinámicos salen en window.PB_FALTAN)")
    sys.exit()

# hreflang en las páginas en español de la raíz (idempotente)
for p in PAGINAS:
    h = open(p, encoding="utf-8").read()
    h = re.sub(r'<link rel="alternate" hreflang="[^>]*>\n?', "", h)
    alt = "".join('<link rel="alternate" hreflang="%s" href="%s">\n' % (c, DOMINIO + ruta("", c, p)) for c in ("es", "ca", "en"))
    alt += '<link rel="alternate" hreflang="x-default" href="%s">\n' % (DOMINIO + ruta("", "es", p))
    open(p, "w", encoding="utf-8").write(h.replace("</head>", alt + "</head>", 1))

total = 0
for base in BASES:
    for cod, cfg in IDIOMAS.items():
        carpeta = os.path.join(base, cod) if base else cod
        os.makedirs(carpeta, exist_ok=True)
        for p in PAGINAS:
            fuente = os.path.join(base, p) if base else p
            if not os.path.exists(fuente): continue
            h = open(fuente, encoding="utf-8").read()
            h = h.replace('<html lang="es">', '<html lang="%s">' % cod, 1)
            def titulo(m):
                t = traduce(cod, m.group(2)); return m.group(1) + (H.escape(t, quote=False) if t else m.group(2)) + m.group(3)
            h = re.sub(r"(<title>)(.*?)(</title>)", titulo, h, count=1, flags=re.S)
            def meta(m):
                t = traduce(cod, m.group(2)); return m.group(1) + (H.escape(t) if t else m.group(2)) + m.group(3)
            h = re.sub(r'(<meta (?:name="description"|property="og:(?:title|description)") content=")([^"]*)(")', meta, h)
            h = h.replace('content="es_ES"', 'content="%s"' % cfg["locale"])
            h = re.sub(r"<link rel=\"canonical\" href=\"[^\"]*\">", '<link rel="canonical" href="%s">' % (DOMINIO + ruta("", cod, p)), h)
            h = re.sub(r'(<script type="application/ld\+json">.*?"inLanguage":")es(")', r"\1%s\2" % cod, h, flags=re.S)
            if not base:   # hreflang solo en la raíz (indexable)
                h = re.sub(r'<link rel="alternate" hreflang="[^>]*>\n?', "", h)
                alt = "".join('<link rel="alternate" hreflang="%s" href="%s">\n' % (c, DOMINIO + ruta("", c, p)) for c in ("es", "ca", "en"))
                alt += '<link rel="alternate" hreflang="x-default" href="%s">\n' % (DOMINIO + ruta("", "es", p))
                h = h.replace("</head>", alt + "</head>", 1)
            a_, p_, k_ = LEGAL[cod]   # enlaces legales del pie en el idioma de la página
            h = h.replace('href="/aviso-legal.html"', 'href="/%s"' % a_).replace('href="/privacidad.html"', 'href="/%s"' % p_).replace('href="/cookies.html"', 'href="/%s"' % k_)
            # el diccionario se carga antes que i18n.js (que ya está enlazado en las páginas en español)
            h = h.replace('<script src="/i18n.js"></script>', '<script src="/i18n/%s.js"></script>\n<script src="/i18n.js"></script>' % cod, 1)
            open(os.path.join(carpeta, p), "w", encoding="utf-8").write(h); total += 1
print("idiomas ->", total, "páginas;", {c: len(DICT[c]["x"]) for c in DICT}, "textos traducidos")

# sitemap.xml con las tres lenguas y sus alternativas (idempotente: parte de las URL en español)
sm = open("sitemap.xml", encoding="utf-8").read()
base = [u for u in re.findall(r"<loc>([^<]+)</loc>", sm) if not re.match(re.escape(DOMINIO) + r"(ca|en)/", u)]
for extra in ["calas.html", "patrimonio.html", "webcams.html", "directorio.html?g=comer", "directorio.html?g=alojarse", "directorio.html?g=comprar", "directorio.html?g=ocio", "directorio.html?g=deporte", "directorio.html?g=moverse"]:
    if DOMINIO + extra not in base: base.append(DOMINIO + extra)
def alt_url(u, cod):
    resto = u[len(DOMINIO):]
    return DOMINIO + cod + "/" + resto if cod != "es" else u
bloques = []
for u in base:
    for cod in ("es", "ca", "en"):
        a = "".join('<xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % (c, alt_url(u, c).replace("&", "&amp;")) for c in ("es", "ca", "en"))
        bloques.append("  <url><loc>%s</loc>%s</url>" % (alt_url(u, cod).replace("&", "&amp;"), a))
open("sitemap.xml", "w", encoding="utf-8").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + "\n".join(bloques) + "\n</urlset>\n")
print("sitemap ->", len(bloques), "URL")
