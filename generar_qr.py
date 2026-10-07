"""QR para las mesas de un negocio:   python generar_qr.py <id> <número de mesas> [dominio]
Crea _qr/<id>/mesa-N.png y una hoja imprimible _qr/<id>/hoja.html (carpeta fuera del despliegue).
Cada QR abre  <dominio>/<id>/?mesa=N  (la mesa queda visible en la carta y sirve más adelante para medir escaneos)."""
import os, sys, qrcode
nid = sys.argv[1]
n = int(sys.argv[2])
dominio = (sys.argv[3] if len(sys.argv) > 3 else "https://paradisblau.es").rstrip("/")
base = os.path.dirname(os.path.abspath(__file__))
salida = os.path.join(base, "_qr", nid)
os.makedirs(salida, exist_ok=True)
celdas = []
for m in range(1, n + 1):
    url = "%s/%s/?mesa=%d" % (dominio, nid, m)
    img = qrcode.make(url, box_size=12, border=3)
    img.save(os.path.join(salida, "mesa-%d.png" % m))
    celdas.append('<figure><img src="mesa-%d.png" alt="QR mesa %d"><figcaption>Mesa %d<small>%s</small></figcaption></figure>' % (m, m, m, url))
hoja = ('<!DOCTYPE html><html lang="es"><meta charset="utf-8"><title>QR mesas · %s</title><style>'
        'body{font-family:system-ui,sans-serif;margin:16px}.g{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}'
        'figure{margin:0;text-align:center;break-inside:avoid;border:1px dashed #999;padding:12px}img{width:100%%;max-width:220px}'
        'figcaption{font-weight:700;font-size:1.2rem}small{display:block;font-weight:400;font-size:.62rem;color:#555;word-break:break-all}'
        '</style><div class="g">%s</div>') % (nid, "".join(celdas))
open(os.path.join(salida, "hoja.html"), "w", encoding="utf-8").write(hoja)
print("QR creados:", n, "en", salida)
