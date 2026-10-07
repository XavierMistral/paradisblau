/* Espacio de negocio. Lee /negocios/<id>.json y pinta sus vistas (carta, vinos, el local, promociones…).
   El QR apunta siempre a /<id>/?mesa=N y abre la primera vista (la carta); el contenido se cambia en el JSON, sin reimprimir nada.
   Vistas con enlace directo: /<id>/#vinos, /<id>/#local, /<id>/#promos. */
(function () {
  var id = window.PB_NEGOCIO || (/[?&]n=([\w-]+)/.exec(location.search) || [])[1];
  var cont = document.getElementById("nb");
  if (!cont) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hoy() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function vigente(e) { var h = hoy(); return (!e.desde || e.desde <= h) && (!e.hasta || e.hasta >= h); }
  var mesa = (/[?&]mesa=(\d{1,3})/.exec(location.search) || [])[1];
  var N = null;

  function cartaVista(v) {
    if (!v.secciones || !v.secciones.length) return '<p class="nb-intro">Estamos preparando la carta. Muy pronto estará aquí.</p>';
    var nota = v.nota ? '<p class="nb-nota">' + esc(v.nota) + "</p>" : "";
    var chips = v.secciones.map(function (s, i) { return '<a href="#" data-ir="' + v.id + "-" + i + '">' + esc(s.t) + "</a>"; }).join("");
    var secs = v.secciones.map(function (s, i) {
      return '<section class="nb-cat" id="' + v.id + "-" + i + '"><h2>' + esc(s.t) + "</h2>" + (s.nota ? '<p class="nb-nota">' + esc(s.nota) + "</p>" : "") + s.items.map(function (it) {
        return '<article class="nb-it"><div class="nb-it-t"><b>' + (it.ref ? '<i class="nb-ref">' + esc(it.ref) + "</i>" : "") + esc(it.n) + "</b><span>" + esc(it.p) + "</span></div>" +
          (it.tapa ? '<small class="nb-tapa">Tapa: ' + esc(it.tapa) + "</small>" : "") + (it.d ? "<p>" + esc(it.d) + "</p>" : "") +
          (it.a && it.a.length ? "<small>Alérgenos: " + it.a.map(esc).join(", ") + "</small>" : "") + "</article>";
      }).join("") + "</section>";
    }).join("");
    return nota + '<nav class="nb-chips" aria-label="Categorías">' + chips + "</nav>" + secs;
  }
  function localVista(v) {
    var h = "";
    if (v.fotos && v.fotos.length) h += '<div class="nb-gal">' + v.fotos.map(function (f) { return '<img src="' + esc(f.src) + '" alt="' + esc(f.alt || "") + '" loading="lazy">'; }).join("") + "</div>";
    if (v.texto) h += '<p class="nb-intro">' + esc(v.texto) + "</p>";
    if (v.precio) h += '<p class="nb-nota">Gasto medio orientativo: ' + esc(v.precio) + "</p>";
    if (v.servicios && v.servicios.length) h += '<section class="nb-blq"><h2>Servicios</h2><ul class="nb-serv">' + v.servicios.map(function (s) { return "<li><b>" + esc(s.t) + "</b><span>" + esc(s.d) + "</span></li>"; }).join("") + "</ul></section>";
    var hs = v.horarios && v.horarios.length ? v.horarios : (v.horario && v.horario.length ? [{ filas: v.horario }] : []);
    var mes = new Date().getMonth() + 1;
    hs.forEach(function (q) {
      var ahora = q.meses && q.meses.indexOf(mes) >= 0;
      h += '<section class="nb-blq"><h2>Horario' + (q.t ? " · " + esc(q.t) : "") + (ahora ? " (ahora)" : "") + "</h2><dl>" + q.filas.map(function (r) { return "<div><dt>" + esc(r.d) + "</dt><dd>" + esc(r.h) + "</dd></div>"; }).join("") + "</dl>" + (q.nota ? '<p class="nb-nota">' + esc(q.nota) + "</p>" : "") + "</section>";
    });
    var c = v.contacto;
    if (c) {
      var b = "";
      if (c.tel_reservas) b += '<a class="btn btn-dark" href="tel:' + esc(String(c.tel_reservas).replace(/\s/g, "")) + '">Reservar</a>';
      if (c.tel) b += '<a class="btn btn-dark" href="tel:' + esc(String(c.tel).replace(/\s/g, "")) + '">Llamar</a>';
      if (c.web) b += '<a class="btn btn-line" href="' + esc(c.web) + '" target="_blank" rel="noopener">Web</a>';
      h += '<section class="nb-blq"><h2>Contacto</h2>' + (c.direccion ? "<p>" + esc(c.direccion) + "</p>" : "") + (b ? '<div class="nb-act">' + b + "</div>" : "") + "</section>";
    }
    return h;
  }
  function promosVista(v) {
    var it = (v.items || []).filter(vigente);
    if (!it.length) return '<p class="nb-intro">Ahora mismo no hay promociones.</p>';
    return it.map(function (p) {
      return '<article class="nb-promo-c">' + (p.img ? '<img src="' + esc(p.img) + '" alt="" loading="lazy">' : "") + "<div><b>" + esc(p.t) + "</b><span>" + esc(p.d) + "</span>" +
        (p.u ? '<a class="hoy-mas" href="' + esc(p.u) + '">Más información</a>' : "") + "</div></article>";
    }).join("");
  }
  var VISTAS = { carta: cartaVista, local: localVista, promos: promosVista };

  function dibuja() {
    var vistas = N.vistas.filter(function (v) { return v.tipo !== "promos" || (v.items || []).some(vigente); });
    var hash = (location.hash || "").replace("#", "");
    var v = vistas.filter(function (x) { return x.id === hash; })[0] || vistas[0];
    var h = '<header class="nb-cab"><div><h1>' + esc(N.nombre) + "</h1></div>" + (mesa ? '<span class="nb-mesa">Mesa ' + esc(mesa) + "</span>" : "") + "</header>";
    if (N.demo) h += '<p class="nb-demo">Demostración: datos de ejemplo.</p>';
    if (N.borrador) h += '<p class="nb-demo">Espacio en preparación: precios y horarios orientativos, tomados de fuentes públicas. Confirma siempre en el local.</p>';
    if (N.intro && v === vistas[0]) h += '<p class="nb-intro">' + esc(N.intro) + "</p>";
    if (N.destacada && vigente(N.destacada)) h += '<section class="nb-promo"><b>' + esc(N.destacada.t) + "</b><span>" + esc(N.destacada.d) + "</span></section>";
    if (vistas.length > 1) h += '<nav class="nb-tabs" aria-label="Secciones">' + vistas.map(function (x) { return '<a href="#' + x.id + '"' + (x === v ? ' class="on" aria-current="page"' : "") + ">" + esc(x.t) + "</a>"; }).join("") + "</nav>";
    h += '<div class="nb-vista">' + (VISTAS[v.tipo] ? VISTAS[v.tipo](v) : "") + "</div>";
    if (N.app) h += '<a class="nb-app" href="' + esc(N.app.u) + '">' + esc(N.app.t) + " &rarr;</a>";
    h += '<footer class="nb-pie">Guía de Tossa de Mar · <a href="/">Paradis Blau</a></footer>';
    cont.innerHTML = h;
    document.title = N.nombre + " · " + v.t;
  }

  cont.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-ir]");
    if (!a) return;
    e.preventDefault();
    var t = document.getElementById(a.getAttribute("data-ir"));
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  window.addEventListener("hashchange", function () { if (N) { dibuja(); window.scrollTo(0, 0); } });

  fetch("/negocios/" + id + ".json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) { N = d; dibuja(); })
    .catch(function () { cont.innerHTML = '<p class="nb-intro">No se ha podido cargar este espacio. Comprueba tu conexión e inténtalo de nuevo.</p>'; });
})();
