"""Genera las 9 páginas legales de paradisblau.es (aviso legal, privacidad y cookies en es/ca/en) con el diseño de la web nueva
y pone los tres enlaces legales en el pie de todas las páginas.
Los textos salen de D:\\ISP_Manager\\legal_web\\generar.py (fuente única de los textos legales de Fibra Pages).
Se ejecuta solo al principio de construir_espacios.py.  Archivos: aviso-legal.html, avis-legal.html, legal-notice.html,
privacidad.html, privacitat.html, privacy-policy.html, cookies.html, galetes.html, cookie-policy.html"""
import os, re, importlib.util

AQUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(AQUI)
spec = importlib.util.spec_from_file_location("gen", r"D:\ISP_Manager\legal_web\generar.py")
gen = importlib.util.module_from_spec(spec); spec.loader.exec_module(gen)
gen.DATA = {"ca": "6 d'octubre de 2026", "es": "6 de octubre de 2026", "en": "6 October 2026"}
PB = gen.PB_FILES                      # (tipo, idioma) -> archivo
PAGINAS = ["index", "planes", "paseos", "pasatiempos", "servicios", "directorio", "calas", "webcams", "recomendacion", "patrimonio", "creditos"]

EXTRA = {
 ("privacidad", "es"): "<p>Las cámaras en directo (ipcamlive.com, YouTube, Windy) solo se conectan cuando pulsas el botón de cada cámara o mapa: en ese momento ese servicio recibe tu dirección IP y los datos habituales de navegación, y es responsable independiente. El tiempo lo obtiene nuestro servidor, sin que tu navegador se conecte a terceros.</p>",
 ("privacidad", "ca"): "<p>Les càmeres en directe (ipcamlive.com, YouTube, Windy) només es connecten quan prems el botó de cada càmera o mapa: en aquest moment aquest servei rep la teva adreça IP i les dades habituals de navegació, i és responsable independent. El temps l'obté el nostre servidor, sense que el teu navegador es connecti a tercers.</p>",
 ("privacidad", "en"): "<p>The live cameras (ipcamlive.com, YouTube, Windy) only connect when you press the button of each camera or map: at that moment that service receives your IP address and the usual browsing data, and is an independent controller. The weather is fetched by our server, without your browser connecting to third parties.</p>",
 ("cookies", "es"): "<p>Las cámaras en directo (ipcamlive.com, YouTube, Windy) se cargan solo cuando pulsas su botón, y esos servicios pueden usar sus propias cookies.</p>",
 ("cookies", "ca"): "<p>Les càmeres en directe (ipcamlive.com, YouTube, Windy) es carreguen només quan prems el seu botó, i aquests serveis poden utilitzar les seves pròpies galetes.</p>",
 ("cookies", "en"): "<p>The live cameras (ipcamlive.com, YouTube, Windy) load only when you press their button, and those services may use their own cookies.</p>",
}
ANCLA = {"privacidad": r"<h2>6\.", "cookies": r"<h2>4\.", "aviso": None}
DESC = {"es": "Texto legal de Paradis Blau, guía de Tossa de Mar para huéspedes (Fibra Pagès).", "ca": "Text legal de Paradis Blau, guia de Tossa de Mar per a hostes (Fibra Pagès).", "en": "Legal text of Paradis Blau, a guest guide to Tossa de Mar (Fibra Pagès)."}
LEGAL_ES = '<p class="legal"><a href="/aviso-legal.html">Aviso legal</a> · <a href="/privacidad.html">Política de privacidad</a> · <a href="/cookies.html">Política de cookies</a></p>'

forma = open("creditos.html", encoding="utf-8").read()   # plantilla con el diseño de la web
for kind in ("aviso", "privacidad", "cookies"):
    for lang in ("es", "ca", "en"):
        frag = gen.render_doc("pb", kind, lang, lambda k, l: PB[(k, l)])
        if EXTRA.get((kind, lang)) and ANCLA[kind]:
            frag = re.sub(ANCLA[kind], lambda m: EXTRA[(kind, lang)] + m.group(0), frag, count=1)
        titulo = gen.TITLES[kind][gen.L.index(lang)]
        h = forma
        h = h.replace('<html lang="es">', '<html lang="%s">' % lang, 1)
        h = re.sub(r"<title>.*?</title>", "<title>%s · Paradis Blau</title>" % titulo, h, count=1, flags=re.S)
        h = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % DESC[lang], h, count=1)
        h = h.replace('<meta name="robots" content="noindex">\n', "")
        h = re.sub(r'<link rel="alternate" hreflang="[^>]*>\n?', "", h)
        h = re.sub(r"<main class=\"sv\">.*?</main>", lambda m: '<main class="sv legal-doc">\n%s\n</main>' % frag, h, count=1, flags=re.S)
        h = h.replace('<script src="/creditos.js"></script>\n', "")
        if lang != "es":
            h = h.replace('<script src="/i18n.js"></script>', '<script src="/i18n/%s.js"></script>\n<script src="/i18n.js"></script>' % lang, 1)
        h = h.replace("</footer>", "  " + LEGAL_ES.replace("/aviso-legal.html", "/" + PB[("aviso", lang)]).replace("/privacidad.html", "/" + PB[("privacidad", lang)]).replace("/cookies.html", "/" + PB[("cookies", lang)]) + "\n</footer>", 1) if 'class="legal"' not in h else h
        open(PB[(kind, lang)], "w", encoding="utf-8").write(h)
print("legales ->", len(PB), "páginas")

# pie con enlaces legales en las páginas de la web (idempotente)
for p in PAGINAS:
    f = p + ".html"; t = open(f, encoding="utf-8").read(); o = t
    t = re.sub(r'<p class="legal"><a href="[^"]*">Aviso legal</a> · <a href="[^"]*">Política de privacidad</a> · <a href="[^"]*">Política de cookies</a></p>', LEGAL_ES, t)
    if 'class="legal"' not in t:
        t = t.replace("</footer>", "  " + LEGAL_ES + "\n</footer>", 1)
    if t != o: open(f, "w", encoding="utf-8").write(t)
print("pies con enlaces legales en", len(PAGINAS), "páginas")
