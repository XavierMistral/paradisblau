/* Playas y calas: tarjetas con foto, distintivos, servicios y cómo llegar. Origen: directorio-datos.js (datos de Tossa Turisme). */
(function () {
  var D = window.DIRECTORIO; if (!D) return;
  var MAPA = { "platja-gran": "platja-gran", "platja-de-la-mar-menuda": "mar-menuda", "platja-des-codolar": "codolar", "cala-salions": "cala-salions", "cala-futadera": "cala-futadera",
    "cala-giverola": "cala-giverola", "cala-pola": "cala-pola", "cala-bona": "cala-bona", "cala-llevado": "cala-llevado", "cala-den-carlos": "cala-den-carlos", "cala-figuera": "cala-figuera",
    "platges-de-llorell": "platges-de-llorell", "platja-de-porto-pi": "platja-de-porto-pi", "cala-morisca": "cala-morisca", "platja-de-vallpresona": "platja-de-vallpresona" };
  var $l = document.getElementById("pl-lista"), $o = document.getElementById("pl-orden");
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function km(p) { var m = /([\d.,]+)\s*km/i.exec((p.d || {}).distancia || ""); return m ? parseFloat(m[1].replace(",", ".")) : 0; }
  function mayus(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function pinta() {
    var L = D.playas.slice();
    L.sort(function (a, b) { return $o.value === "az" ? a.n.localeCompare(b.n, "es") : km(a) - km(b) || a.n.localeCompare(b.n, "es"); });
    $l.innerHTML = "";
    L.forEach(function (p) {
      var d = p.d || {}, a = el("article", "sv-card"); a.id = p.id;
      if (p.foto) { var im = el("img"); im.src = p.foto; im.alt = p.n; im.loading = "lazy"; im.addEventListener("error", function () { im.remove(); }); a.appendChild(im); }
      var b = el("div", "sv-body"); b.appendChild(el("h3", "", p.n));
      var dist = d.distancia ? (km(p) ? km(p) + " km de Tossa" : mayus(d.distancia)) : "";
      var res = [dist, d.longitud ? d.longitud + " de largo" : "", d.anchura ? d.anchura + " de ancho" : "", d.arena ? "arena " + d.arena : "", d.entorno ? "entorno " + d.entorno : ""].filter(Boolean).join(" · ");
      if (res) b.appendChild(el("span", "dr-tag", res));
      if ((p.di || []).length) { var dv = el("p", "cl-dist"); p.di.forEach(function (x) { dv.appendChild(el("span", "dr-tag" + (x === "Bandera Azul" ? " cl-azul" : x.indexOf("desaconsejado") >= 0 ? " cl-peligro" : ""), x)); }); b.appendChild(dv); }
      if (p.t) b.appendChild(el("p", "", p.t));
      if (d.acceso) b.appendChild(el("p", "sv-nota", "Cómo llegar: " + mayus(d.acceso)));
      if (d.aparcamiento) b.appendChild(el("p", "sv-nota", "Aparcamiento: " + d.aparcamiento + "."));
      (p.nt || []).forEach(function (x) { b.appendChild(el("p", "sv-nota", x)); });
      if (d.barcos) b.appendChild(el("p", "sv-nota", "Barcos turísticos: " + d.barcos + "."));
      if ((p.sv || []).length) { b.appendChild(el("p", "cl-serv", "Servicios: " + p.sv.join(" · "))); }
      else if (p.sin) b.appendChild(el("p", "cl-serv", "Sin servicios."));
      var s = el("div", "sv-act");
      if (MAPA[p.id]) { var m = el("a", "btn btn-line", "Ver en el mapa"); m.href = "index.html?p=" + MAPA[p.id] + "#mapa-sec"; s.appendChild(m); }
      if (p.u) { var u = el("a", "btn btn-line", "Más información"); u.href = p.u; u.target = "_blank"; u.rel = "noopener"; s.appendChild(u); }
      if (s.children.length) b.appendChild(s);
      a.appendChild(b); $l.appendChild(a);
    });
  }
  $o.addEventListener("change", pinta); pinta();
})();
