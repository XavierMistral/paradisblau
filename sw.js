/* Service worker de Paradis Blau.
   Objetivo: que la guía (sobre todo Servicios y contacto, el mapa y los planes) funcione sin cobertura.
   Estrategia: red primero con copia de respaldo para páginas, código y datos; copia primero para imágenes.
   Solo guarda archivos propios: no hay peticiones a terceros ni se guarda ningún dato personal. */
var VERSION = "pb-v94";
var CORE = [
  "index.html", "servicios.html", "servicios-vistas.js", "planes.html", "paseos.html", "pasatiempos.html", "directorio.html", "calas.html", "webcams.html", "webcams.js", "recomendacion.html", "recomendacion.js", "patrimonio.html", "patrimonio.js", "creditos.html", "creditos.js", "patrimonio-vista.js", "recomendaciones.js",
  "style.css", "hoy.css", "mapa.css", "servicios.css", "css/pasatiempos.css",
  "directorio.css", "directorio.js", "directorio-datos.js", "calas.js", "agenda.js", "hoy.js", "mapa.js", "mapa-datos.js", "planes.js", "app.js", "i18n.js", "i18n/ca.js", "i18n/en.js",
  "js/pasatiempos.js", "js/oca.js", "js/pasatiempos-data.js", "js/pasatiempos-edades.js",
  "tiempo.json", "manifest.webmanifest", "favicon.svg", "favicon.ico", "assets/icons/favicon-32.png", "assets/icons/icon-192.png",
  "assets/servicios/policia-local.jpg", "assets/servicios/cap-urgencies.jpg", "assets/servicios/bombers.jpg", "assets/servicios/farmacia-capell.jpg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET") return;
  var u = new URL(r.url);
  if (u.origin !== location.origin) return;
  var esImagen = /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(u.pathname);
  if (esImagen) {
    e.respondWith(caches.match(r).then(function (hit) {
      return hit || fetch(r).then(function (res) {
        var copia = res.clone(); caches.open(VERSION).then(function (c) { c.put(r, copia); }); return res;
      });
    }));
    return;
  }
  e.respondWith(fetch(r).then(function (res) {
    if (res && res.ok) { var copia = res.clone(); caches.open(VERSION).then(function (c) { c.put(r, copia); }); }
    return res;
  }).catch(function () {
    return caches.match(r, { ignoreSearch: true }).then(function (hit) { return hit || caches.match("index.html"); });
  }));
});
