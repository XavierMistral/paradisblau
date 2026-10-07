/* Pinta patrimonio.html a partir de patrimonio.js (textos propios, sin servicios externos). */
(function () {
  var P = window.PATRIMONIO || [], $c = document.getElementById("pt-cont"), $n = document.getElementById("pt-nav");
  if (!$c) return;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  P.forEach(function (s) {
    var a = el("a", "", s.titulo); a.href = "#" + s.id; a.className = "btn btn-line"; $n.appendChild(a);
    var sec = el("section", ""); sec.id = s.id;
    sec.appendChild(el("h2", "sv-t", s.titulo)); sec.appendChild(el("p", "", s.intro));
    var g = el("div", "sv-grid");
    s.items.forEach(function (it) {
      var c = el("article", "sv-card" + (it.foto ? "" : " sv-sinfoto"));
      if (it.foto) { var im = el("img"); im.src = it.foto; im.alt = it.t; im.loading = "lazy"; c.appendChild(im); }
      var b = el("div", "sv-body");
      if (it.tag) b.appendChild(el("span", "dr-tag", it.tag));
      b.appendChild(el("h3", "", it.t)); b.appendChild(el("p", "", it.r));
      if (it.credito) { var cp = el("small", "pl-cred", "Foto: " + it.credito.a + " · "), ca = el("a", "", it.credito.l); ca.href = it.credito.u; ca.target = "_blank"; ca.rel = "noopener"; cp.appendChild(ca); b.appendChild(cp); }
      (it.d || []).forEach(function (x) { b.appendChild(el("p", "sv-nota", x)); });
      var act = el("div", "sv-act");
      if (it.mapa) { var m = el("a", "btn btn-line", "Ver en el mapa"); m.href = "index.html?p=" + it.mapa + "#mapa-sec"; act.appendChild(m); }
      if (it.u) { var u = el("a", "btn btn-line", "Más información"); u.href = it.u; u.target = "_blank"; u.rel = "noopener"; act.appendChild(u); }
      if (act.children.length) b.appendChild(act);
      c.appendChild(b); g.appendChild(c);
    });
    sec.appendChild(g); $c.appendChild(sec);
  });
})();
