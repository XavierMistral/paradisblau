"""Añade un lote de traducciones a traducciones.tsv.
Uso:  python i18n/añadir_lote.py i18n/lote_xxx.txt
Formato del lote: una línea por texto, 'español|catalán|inglés'. Si una clave ya existe en la tabla, se ignora la repetida."""
import sys, os, re
AQUI = os.path.dirname(os.path.abspath(__file__))
tsv = os.path.join(AQUI, "traducciones.tsv")
tabla = open(tsv, encoding="utf-8").read()
if not tabla.endswith("\n"): tabla += "\n"
claves = {re.sub(r"\s+", " ", l.split("\t")[0]).strip() for l in tabla.split("\n")[1:] if l}
nuevas, repetidas, mal = [], 0, []
for n, l in enumerate(open(sys.argv[1], encoding="utf-8").read().split("\n"), 1):
    if not l.strip(): continue
    c = l.split("|")
    if len(c) != 3: mal.append(n); continue
    k = re.sub(r"\s+", " ", c[0]).strip()
    if k in claves: repetidas += 1; continue
    claves.add(k); nuevas.append("\t".join(x.strip() for x in c))
if mal: print("líneas mal formadas (no se añade nada):", mal); sys.exit(1)
open(tsv, "w", encoding="utf-8").write(tabla + "\n".join(nuevas) + ("\n" if nuevas else ""))
print(len(nuevas), "nuevas,", repetidas, "repetidas ignoradas")
