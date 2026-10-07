/* Ficha de recomendación: foto, qué es, datos de contacto (del directorio), ubicación y, si la hay, nuestra valoración. */
(function () {
  var R = window.RECOMENDACIONES || {}, D = (window.DIRECTORIO && window.DIRECTORIO.negocios) || [];
  var id = (new URLSearchParams(location.search)).get("r"), r = R[id], $ = document.getElementById("rc");
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function tel(t) { return "tel:" + t.split("/")[0].replace(/[^\d+]/g, ""); }
  function url(w) {
    w = (w || "").split(",").map(function (s) { return s.trim(); }).filter(function (s) { return /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(s) && !/^https?:\/\/\+/.test(s); })[0] || "";
    return w && !/^https?:/.test(w) ? "https://" + w : w;
  }
  if (!r) {
    $.appendChild(el("p", "", "No encontramos esta recomendación."));
    var a = el("a", "btn btn-line", "Ver todas"); a.href = "index.html#recomendaciones"; $.appendChild(a); return;
  }
  document.title = r.t + " · Paradis Blau";
  var cab = el("div", "hoy-head"); cab.appendChild(el("h1", "", r.t)); cab.appendChild(el("p", "", r.sub)); $.appendChild(cab);
  var card = el("article", "sv-card rc-card");
  var fotos = el("div", "rc-fotos");
  if (r.foto) { var im = el("img"); im.src = r.foto; im.alt = r.t; if (r.pos) im.style.objectPosition = r.pos; fotos.appendChild(im); }
  if (r.foto2) { var i2 = el("img"); i2.src = r.foto2; i2.alt = r.t; fotos.appendChild(i2); }
  if (fotos.children.length) card.appendChild(fotos);
  var b = el("div", "sv-body");
  if (r.nivel) b.appendChild(el("span", "dr-tag " + (r.nivel === "colaborador" ? "dr-colab" : ""), r.nivel === "colaborador" ? "Colaborador" : "Recomendado por nosotros"));
  b.appendChild(el("p", "", r.que));
  if (r.porque) { b.appendChild(el("h3", "", "Nuestra valoración")); b.appendChild(el("p", "", r.porque)); }
  var n = r.dir ? D.filter(function (z) { return z.id === r.dir; })[0] : null;
  var act = el("div", "sv-act");
  if (n) {
    if (n.d) b.appendChild(el("p", "sv-nota", "Dónde: " + n.d));
    if (n.t) { var t = el("a", "btn btn-dark", "Llamar"); t.href = tel(n.t); act.appendChild(t); }
    var w = url(n.w); if (w) { var wl = el("a", "btn btn-line", "Su web"); wl.href = w; wl.target = "_blank"; wl.rel = "noopener"; act.appendChild(wl); }
  }
  if (r.mapa) { var m = el("a", "btn btn-line", "Ver en el mapa"); m.href = "index.html?p=" + r.mapa; act.appendChild(m); }
  if (act.children.length) b.appendChild(act);
  if (r.pie) b.appendChild(el("small", "pl-cred", r.pie));
  card.appendChild(b); $.appendChild(card);
  if (r.opciones) {
    var L = D.filter(function (z) { return z.s === r.opciones; });
    if (L.length) {
      $.appendChild(el("h2", "sv-t", "Dónde hacerlo"));
      var g = el("div", "sv-grid");
      L.forEach(function (z) {
        var c = el("article", "sv-card sv-sinfoto"), bb = el("div", "sv-body"); bb.appendChild(el("h3", "", z.n)); if (z.d) bb.appendChild(el("p", "", z.d));
        var ac = el("div", "sv-act");
        if (z.t) { var tt = el("a", "btn btn-dark", "Llamar"); tt.href = tel(z.t); ac.appendChild(tt); }
        var ww = url(z.w); if (ww) { var wa = el("a", "btn btn-line", "Web"); wa.href = ww; wa.target = "_blank"; wa.rel = "noopener"; ac.appendChild(wa); }
        if (z.lat) { var mm = el("a", "btn btn-line", "Ver en el mapa"); mm.href = "index.html?p=" + z.id; ac.appendChild(mm); }
        if (ac.children.length) bb.appendChild(ac);
        c.appendChild(bb); g.appendChild(c);
      });
      $.appendChild(g);
    }
  }
  $.appendChild(el("p", "sv-nota dr-fuente", "Datos de contacto: Tossa Turisme (visittossa.com). Si algo ha cambiado, escríbenos y lo actualizamos."));
})();
