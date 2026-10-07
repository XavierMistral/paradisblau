"""Control de calidad con Chrome sin ventana: abre cada página en cada idioma y anota los errores de consola
(recursos que dan 404, excepciones de JavaScript) y las páginas que salen casi vacías.
Requisitos: servidor local en http://localhost:8090 (preview 'paradisblau-maqueta') y Chrome instalado.
Uso:  python qa_navegador.py            (todas)      |   python qa_navegador.py ca   (solo un prefijo: '', 'ca', 'en', 'letsholidays', ...)"""
import subprocess, sys, re, concurrent.futures as cf, os

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE = "http://localhost:8090"
PREFIJOS = ["", "ca", "en", "letsholidays", "letsholidays/ca", "letsholidays/en"]
if len(sys.argv) > 1: PREFIJOS = [p for p in PREFIJOS if p == sys.argv[1]] or PREFIJOS
PAGS = ["", "planes.html?s=sol", "planes.html?s=lluvia", "planes.html?s=shopping", "planes.html?s=costa", "planes.html?s=girona", "planes.html?s=deportes",
        "paseos.html", "pasatiempos.html", "servicios.html", "calas.html", "webcams.html", "patrimonio.html", "creditos.html",
        "directorio.html", "directorio.html?g=comer", "directorio.html?g=alojarse", "directorio.html?g=comprar", "directorio.html?g=ocio", "directorio.html?g=deporte", "directorio.html?g=moverse",
        "recomendacion.html?r=kayaks-nicolau", "recomendacion.html?r=fondo-cristal", "recomendacion.html?r=trenecito", "recomendacion.html?r=submarinismo", "recomendacion.html?r=cami-de-ronda"]
URLS = [BASE + "/" + "/".join(x for x in (p, "") if x) + pag if not pag else BASE + "/" + (p + "/" if p else "") + pag for p in PREFIJOS for pag in PAGS]
URLS = [BASE + "/" + (p + "/" if p else "") + pag for p in PREFIJOS for pag in PAGS]
URLS += [BASE + "/minerva/", BASE + "/ruedo/", BASE + "/bolera/", BASE + "/letsholidays/?v=demo"] if len(sys.argv) == 1 else []

def abre(u):
    try:
        r = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-sandbox", "--enable-logging=stderr", "--v=0", "--virtual-time-budget=7000",
                            "--user-data-dir=" + os.path.join(os.environ.get("TEMP", "."), "qa_chrome_%d" % (abs(hash(u)) % 100000)), "--dump-dom", u],
                           capture_output=True, text=True, timeout=90, encoding="utf-8", errors="replace")
    except subprocess.TimeoutExpired:
        return u, ["TIMEOUT"], 0
    msgs = []
    for l in r.stderr.splitlines():
        if "CONSOLE" in l or "Uncaught" in l:
            m = re.sub(r"^\[[^\]]*\]\s*", "", l)
            if "favicon" in m: continue
            msgs.append(m[:230])
    return u, msgs, len(r.stdout)

malos = 0
with cf.ThreadPoolExecutor(max_workers=4) as ex:
    for u, msgs, n in ex.map(abre, URLS):
        if msgs:
            malos += 1; print("•", u.replace(BASE, ""), "| DOM %d bytes" % n); [print("    ", m) for m in msgs[:6]]
print("\nrevisadas %d URL, con problemas %d" % (len(URLS), malos))
