# Maqueta de Paradis Blau: cómo está montada

**Ver en local:** `http://localhost:8090/` (servidor `paradisblau-maqueta` de `.claude/launch.json`). La portada nueva es `index.html`. La maqueta original del 01/10 está en `_ref/index_original_2026-10-01.html`.

## Tres tipos de espacio
| Tipo | Dónde | Qué es | Buscadores |
|---|---|---|---|
| Raíz | `/` | La guía general (tiempo, planes, mapa, servicios, pasatiempos) | **Se indexa** (sitemap, datos estructurados, canonical) |
| Alojador | `/letsholidays/` | La misma guía con su logo, bienvenida y wifi de la vivienda; se llega con el QR | `noindex` (en Google debe salir la raíz) |
| Negocio | `/ejemplo/` (y `/bolera/`, `/cine/`…) | Un mini-espacio con solo lo que el negocio quiere potenciar (carta, promo, horario, contacto) | `noindex` por defecto; se puede indexar |

## Regla de oro
Las páginas de `/letsholidays/` y `/ejemplo/` **se generan**. Después de cambiar cualquier página de la raíz:

    python construir_espacios.py

No editar a mano las carpetas generadas.

## Dónde se cambia cada cosa
- Datos de planes, recomendaciones, agenda, paseos: `agenda.js`
- Espacios de alojador (logo, viviendas): `espacios.js`; nuevo espacio → añadir allí y en `construir_espacios.py` (`ESPACIOS`)
- Negocios: cada uno tiene su archivo `negocios/<id>.json` (vistas: carta, vinos, el local con fotos y servicios, promociones con fechas; plato destacado; enlace a la guía completa). **Actualizar una carta = cambiar ese JSON y subirlo; el QR no cambia nunca.** Nuevo negocio → crear su JSON y añadirlo en `construir_espacios.py` (`NEGOCIOS`)
- QR de mesas de un negocio: `python generar_qr.py <id> <mesas>` → `_qr/<id>/` (fuera del despliegue). Cada QR abre `/<id>/?mesa=N`.
- Patrocinador en «Nuestras recomendaciones»: añadir `colab: true` a su entrada en `recomendados` (`agenda.js`) → insignia «Colaborador».
- Mapa: `python _mapa/generar_mapa.py` (datos de OpenStreetMap, ODbL; atribución en el mapa).
- Tiempo: `tiempo.json` es una copia local; en producción lo sirve `tiempo.php` (sin probar en el hosting).

## Web app
`manifest.webmanifest` + `sw.js` (red primero con copia de respaldo; sube la versión `pb-vN` al cambiar archivos) + `app.js` (barra inferior en móvil, aviso sin conexión). El service worker solo funciona en HTTPS o en localhost.

## Antes de publicar
Subir al hosting (ZIP): todo menos `_ref/`, `_mapa/`, `_qr/`, `fotos_propias*`, `LEEME.md` y los `*.py`. Ver `FOTOS_ESTADO_LICENCIA.md` para el estado de las fotos.
