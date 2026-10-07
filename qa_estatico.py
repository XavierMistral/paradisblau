"""Control de calidad estático de Paradis Blau (no necesita navegador).
Uso:  python qa_estatico.py
Revisa: archivos que faltan (imagenes, scripts, estilos, enlaces entre paginas), ids de punto del mapa y de recomendaciones
enlazados que no existen, precache del service worker y enlaces con parametros no validos. Devuelve codigo 1 si hay errores."""
import os, re, sys, json
from urllib.parse import urlsplit, parse_qs, unquote

AQUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(AQUI)
PAGINAS = ["index", "planes", "paseos", "pasatiempos", "servicios", "directorio", "calas", "webcams", "recomendacion", "patrimonio", "creditos"]
DIRS = ["", "ca", "en", "letsholidays", "letsholidays/ca", "letsholidays/en"]
HTMLS = [os.path.join(d, p + ".html") for d in DIRS for p in PAGINAS] + [os.path.join(n, "index.html") for n in ("minerva", "ruedo", "bolera", "ejemplo")]
LEGALES = ["aviso-legal.html","avis-legal.html","legal-notice.html","privacidad.html","privacitat.html","privacy-policy.html","cookies.html","galetes.html","cookie-policy.html"]
HTMLS += LEGALES
SIN_I18N = {os.path.join(n, "index.html") for n in ("minerva", "ruedo", "bolera", "ejemplo")}   # espacios de negocio: solo en español
errores, avisos = [], []

def existe(ruta_url, origen):
    """ruta_url puede ser absoluta (/assets/x) o relativa al archivo de origen."""
    u = urlsplit(ruta_url); p = unquote(u.path)
    if not p: return True
    base = AQUI if p.startswith("/") else os.path.dirname(os.path.join(AQUI, origen))
    f = os.path.normpath(os.path.join(base, p.lstrip("/"))) if p.startswith("/") else os.path.normpath(os.path.join(base, p))
    if f.endswith(os.sep) or os.path.isdir(f): f = os.path.join(f, "index.html")
    return os.path.exists(f)

def omite(v):
    return (not v or v.startswith(("http:", "https:", "mailto:", "tel:", "#", "javascript:", "data:", "blob:", "//", "{{")) or "'+" in v or '"+' in v or "+ " in v or v.strip() != v)

# --- ids de referencia
mapa = open("mapa-datos.js", encoding="utf-8").read()
ids_mapa = set(re.findall(r'"id":"([^"]+)"', mapa))
rec = open("recomendaciones.js", encoding="utf-8").read()
ids_rec = set(re.findall(r'^\s*"?([a-z0-9-]+)"?\s*:\s*\{', rec, re.M))
dd = open("directorio-datos.js", encoding="utf-8").read()
ids_dir = set(re.findall(r'"id":"([^"]+)"', dd))
SECC = {"sol", "lluvia", "shopping", "costa", "girona", "deportes"}
GRUPOS = {"comer", "alojarse", "comprar", "ocio", "deporte", "moverse"}

def revisa_enlace(v, origen):
    if omite(v): return
    u = urlsplit(v)
    if not existe(v, origen): errores.append("%s -> falta %s" % (origen, v)); return
    q = parse_qs(u.query); pag = os.path.basename(u.path)
    if pag == "index.html" and "p" in q and q["p"][0] not in ids_mapa and q["p"][0] not in ids_dir: errores.append("%s -> punto del mapa inexistente: %s" % (origen, v))
    if pag == "planes.html" and "s" in q and q["s"][0] not in SECC: errores.append("%s -> seccion de planes inexistente: %s" % (origen, v))
    if pag == "directorio.html" and "g" in q and q["g"][0] not in GRUPOS: errores.append("%s -> grupo de directorio inexistente: %s" % (origen, v))
    if pag == "recomendacion.html" and "r" in q and q["r"][0] not in ids_rec: errores.append("%s -> recomendacion inexistente: %s" % (origen, v))

# --- HTML
for h in HTMLS:
    if not os.path.exists(h): errores.append("falta la pagina %s" % h); continue
    t = open(h, encoding="utf-8").read()
    for m in re.finditer(r'(?:src|href|poster)="([^"]*)"', t): revisa_enlace(m.group(1), h)
    for m in re.finditer(r"url\(['\"]?([^'\")]+)['\"]?\)", t): revisa_enlace(m.group(1), h)
    if "i18n.js" not in t and h not in SIN_I18N: errores.append("%s -> no enlaza i18n.js" % h)
    if h.split(os.sep)[0] in ("ca", "en") or "/ca/" in h.replace(os.sep, "/") or "/en/" in h.replace(os.sep, "/"):
        lang = "ca" if "ca" in h.replace(os.sep, "/").split("/")[:-1] else "en"
        if 'lang="%s"' % lang not in t: errores.append("%s -> html lang incorrecto" % h)

# --- CSS
for f in ("style.css", "hoy.css", "mapa.css", "servicios.css", "directorio.css", "negocio.css", os.path.join("css", "pasatiempos.css")):
    if not os.path.exists(f): continue
    t = open(f, encoding="utf-8").read()
    for m in re.finditer(r"url\(['\"]?([^'\")]+)['\"]?\)", t):
        if not omite(m.group(1)) and not existe(m.group(1), f): errores.append("%s -> falta %s" % (f, m.group(1)))

# --- JS / JSON: rutas /assets/... y paginas citadas
RUTA = re.compile(r"""["'](/assets/[^"'\s?#]+|/[a-z0-9_-]+\.(?:js|css|json|html|webmanifest))["']""")
for f in [x for x in os.listdir(".") if x.endswith(".js")] + [os.path.join("js", x) for x in os.listdir("js")] + [os.path.join("negocios", x) for x in os.listdir("negocios")]:
    if f in ("sw.js", "mapa-datos.js") and False: continue
    t = open(f, encoding="utf-8").read()
    for r in set(RUTA.findall(t)):
        if r.endswith("/"): continue   # prefijo que el codigo completa (p. ej. /assets/genericas/ + nombre)
        if not existe(r, f): errores.append("%s -> falta %s" % (f, r))
    for m in re.finditer(r'(?:u|mapa|url)\s*:\s*["\']([a-z0-9_-]+\.html[^"\']*)["\']', t):
        revisa_enlace(m.group(1), "index.html")
# fotos del mapa y del directorio
for r in set(re.findall(r'"i":"(/[^"]+)"', mapa)):
    if not existe(r, "mapa-datos.js"): errores.append("mapa-datos.js -> falta %s" % r)
for r in set(re.findall(r'"f":"(/[^"]+)"', dd)):
    if not existe(r, "directorio-datos.js"): errores.append("directorio-datos.js -> falta %s" % r)

# --- service worker
sw = open("sw.js", encoding="utf-8").read()
core = re.search(r"var CORE = \[(.*?)\];", sw, re.S).group(1)
for r in re.findall(r'"([^"]+)"', core):
    if not os.path.exists(r): errores.append("sw.js CORE -> falta %s" % r)

# --- traducciones: claves duplicadas o columnas vacías
filas = [l.split("\t") for l in open("i18n/traducciones.tsv", encoding="utf-8").read().split("\n")[1:] if l.strip()]
vistas = {}
for f in filas:
    if len(f) < 3 or not f[1].strip() or not f[2].strip(): errores.append("traducciones.tsv -> fila incompleta: %s" % f[0][:60])
    k = re.sub(r"\s+", " ", f[0]).strip()
    if k in vistas: avisos.append("traducciones.tsv -> clave repetida: %s" % k[:60])
    vistas[k] = 1

print("=== ERRORES (%d) ===" % len(errores)); print("\n".join(sorted(set(errores))))
print("=== AVISOS (%d) ===" % len(avisos)); print("\n".join(sorted(set(avisos))))
print("páginas revisadas:", len(HTMLS), "| puntos de mapa:", len(ids_mapa), "| recomendaciones:", len(ids_rec))
sys.exit(1 if errores else 0)
