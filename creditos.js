/* Lista de créditos de fotos: lee los dos archivos de atribuciones (Wikimedia Commons). */
(function () {
  var $ = document.getElementById("cr-lista"); if (!$) return;
  function el(t, x) { var e = document.createElement(t); if (x != null) e.textContent = x; return e; }
  Promise.all(["/assets/planes/creditos_fotos_costa.json", "/assets/creditos_fotos_wikimedia.json", "/assets/creditos_fotos_genericas.json"].map(function (u) { return fetch(u).then(function (r) { return r.json(); }); })).then(function (A) {
    var todo = Object.assign({}, A[0], A[1], A[2]);
    Object.keys(todo).forEach(function (k) {
      var c = todo[k], li = el("li"), a = el("a", (c.archivo || k).replace(/^File:/, "")); a.href = c.origen; a.target = "_blank"; a.rel = "noopener";
      li.appendChild(a); li.appendChild(document.createTextNode(" · " + c.autor + " · "));
      var l = el("a", c.licencia); l.href = c.licencia_url || c.origen; l.target = "_blank"; l.rel = "noopener"; li.appendChild(l);
      $.appendChild(li);
    });
  }).catch(function () { $.appendChild(el("li", "No se pudo cargar la lista.")); });
})();
