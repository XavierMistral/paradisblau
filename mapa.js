/* Mapa interactivo de Tossa: filtros, zoom, arrastre y ficha. Usa window.MAPA (mapa-datos.js). Sin servicios externos. */
(function () {
  var M = window.MAPA;
  var cont = document.getElementById("mapa-vista");
  if (!M || !cont) return;
  var root = document.getElementById("mapa");
  var NS = "http://www.w3.org/2000/svg";
  var OCULTAS = ["comer", "comprar", "ocio", "deporte", "moverse", "alojarse", "apt"];
  var CATS = { hist: "Historia y patrimonio", mar: "Playas y calas", comer: "Dónde comer", alojarse: "Dónde dormir", comprar: "Shopping", ocio: "Ocio", deporte: "Deporte", moverse: "Transportes", serv: "Salud y servicios", wifi: "Wifi gratuito", apt: "Apartamentos Lets Holidays" };
  if (window.APARTAMENTOS) M.poi = M.poi.concat(window.APARTAMENTOS);
  var vb = M.vb.slice(), lim = M.lim, MINW = 260;
  var PX = { m: 9, lab: 13 };

  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", "Mapa de Tossa de Mar");
  svg.innerHTML = M.svg + '<g class="lab" id="m-lab"></g><g id="m-mk"></g>';
  cont.insertBefore(svg, cont.firstChild);
  var gLab = svg.querySelector("#m-lab"), gMk = svg.querySelector("#m-mk");

  function setVB() {
    svg.setAttribute("viewBox", vb.join(" ")); escala();
    root.classList.toggle("zc1", vb[2] < 760); root.classList.toggle("zc2", vb[2] < 480);
  }
  function unit() { return vb[2] / (svg.clientWidth || 800); }

  /* etiquetas */
  M.lab.forEach(function (l) {
    var t = document.createElementNS(NS, "text");
    t.setAttribute("x", l.x); t.setAttribute("y", l.y); t.setAttribute("class", l.k); t.setAttribute("text-anchor", "middle");
    t.textContent = l.t; t.dataset.k = l.k; gLab.appendChild(t);
  });

  /* marcadores */
  var marks = {};
  M.poi.forEach(function (p) {
    var g = document.createElementNS(NS, "g");
    g.setAttribute("class", "m c-" + p.c); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button");
    g.setAttribute("aria-label", p.n + ". " + CATS[p.c]); g.dataset.id = p.id;
    g.setAttribute("transform", "translate(" + p.x + " " + p.y + ")");
    g.innerHTML = '<g class="ms"><circle class="ring" r="1.9"/><circle class="bg" r="1.25"/><circle class="dot" r="1"/></g>';
    gMk.appendChild(g); marks[p.id] = g;
  });

  function escala() {
    var u = unit(), s = u * PX.m;
    Array.prototype.forEach.call(gMk.querySelectorAll(".ms"), function (g) { g.setAttribute("transform", "scale(" + s.toFixed(3) + ")"); });
    svg.style.setProperty("--k", (u * 10.5).toFixed(2));
    var fs = u * PX.lab;
    Array.prototype.forEach.call(gLab.children, function (t) {
      t.setAttribute("font-size", (t.dataset.k === "ciud" ? fs * 1.15 : fs).toFixed(2));
      t.style.strokeWidth = (u * 3.4).toFixed(2);
    });
  }

  /* zoom y arrastre */
  function clamp() {
    vb[2] = Math.max(MINW, Math.min(vb[2], lim[2])); vb[3] = vb[2] * (svg.clientHeight / svg.clientWidth || 1);
    vb[0] = Math.max(lim[0], Math.min(vb[0], lim[0] + lim[2] - vb[2]));
    vb[1] = Math.max(lim[1], Math.min(vb[1], lim[1] + lim[3] - vb[3]));
  }
  function ajusta() { vb[3] = vb[2] * (svg.clientHeight / svg.clientWidth || 1); clamp(); setVB(); }
  function zoom(f, cx, cy) {
    var r = svg.getBoundingClientRect();
    var fx = cx == null ? 0.5 : (cx - r.left) / r.width, fy = cy == null ? 0.5 : (cy - r.top) / r.height;
    var px = vb[0] + vb[2] * fx, py = vb[1] + vb[3] * fy;
    vb[2] = Math.max(MINW, Math.min(vb[2] * f, lim[2]));
    vb[3] = vb[2] * (r.height / r.width);
    vb[0] = px - vb[2] * fx; vb[1] = py - vb[3] * fy;
    clamp(); setVB();
  }
  svg.addEventListener("wheel", function (e) { e.preventDefault(); zoom(e.deltaY > 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY); }, { passive: false });
  var ptrs = {}, last = null, moved = 0, downTarget = null, pinch0 = null;
  svg.addEventListener("pointerdown", function (e) {
    ptrs[e.pointerId] = { x: e.clientX, y: e.clientY }; moved = 0; downTarget = e.target.closest ? e.target.closest(".m") : null;
    svg.classList.add("arrastra");
    var ks = Object.keys(ptrs);
    if (ks.length === 2) { var a = ptrs[ks[0]], b = ptrs[ks[1]]; pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), w: vb[2] }; }
    last = { x: e.clientX, y: e.clientY };
    try { svg.setPointerCapture(e.pointerId); } catch (x) {}
  });
  svg.addEventListener("pointermove", function (e) {
    if (!ptrs[e.pointerId]) return;
    ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ks = Object.keys(ptrs);
    if (ks.length === 2 && pinch0) {
      var a = ptrs[ks[0]], b = ptrs[ks[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
      var f = pinch0.w / (pinch0.w * d / pinch0.d); moved = 99;
      var target = pinch0.w * pinch0.d / d, cur = vb[2];
      zoom(target / cur, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    var u = unit(), dx = e.clientX - last.x, dy = e.clientY - last.y;
    moved += Math.abs(dx) + Math.abs(dy);
    vb[0] -= dx * u; vb[1] -= dy * u; last = { x: e.clientX, y: e.clientY };
    clamp(); setVB();
  });
  function fin(e) {
    if (!ptrs[e.pointerId]) return;
    delete ptrs[e.pointerId]; pinch0 = null;
    if (!Object.keys(ptrs).length) {
      svg.classList.remove("arrastra");
      if (moved < 6 && downTarget) selecciona(downTarget.dataset.id, false);
    }
  }
  svg.addEventListener("pointerup", fin); svg.addEventListener("pointercancel", fin);
  svg.addEventListener("keydown", function (e) {
    var m = e.target.closest && e.target.closest(".m");
    if (m && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); selecciona(m.dataset.id, false); }
  });
  document.getElementById("mapa-mas").addEventListener("click", function () { zoom(1 / 1.4); });
  document.getElementById("mapa-menos").addEventListener("click", function () { zoom(1.4); });
  document.getElementById("mapa-inicio").addEventListener("click", encuadra);
  document.getElementById("mapa-zona").addEventListener("click", function () {
    /* toda la zona, de Cala Morisca a Vallpresona */
    var r = (svg.clientHeight / svg.clientWidth) || 1, z = M.zona, w = z[2], h = z[3];
    if (h / w > r) w = h / r; else h = w * r;
    vb = [z[0] + (z[2] - w) / 2, z[1] + (z[3] - h) / 2, w, h]; clamp(); setVB();
  });

  /* ficha y lista */
  var ficha = document.getElementById("mapa-ficha");
  var sel = null;
  function selecciona(id, centra) {
    var p = M.poi.filter(function (q) { return q.id === id; })[0]; if (!p) return;
    if (root.classList.contains("sin-" + p.c)) {
      root.classList.remove("sin-" + p.c);
      var bs = document.querySelector('[data-filtro="' + p.c + '"]'); if (bs) bs.setAttribute("aria-pressed", "true");
    }
    if (sel && marks[sel]) marks[sel].classList.remove("sel");
    sel = id; marks[id].classList.add("sel"); gMk.appendChild(marks[id]);
    ficha.className = "mapa-ficha";
    ficha.innerHTML = "<small>" + CATS[p.c] + "</small><b></b><span></span>";
    ficha.querySelector("b").textContent = p.n; ficha.querySelector("span").textContent = p.t;
    if (p.i) { var im = document.createElement("img"); im.src = p.i; im.alt = p.n; im.className = "mapa-foto"; im.loading = "lazy"; ficha.insertBefore(im, ficha.firstChild); }
    if (p.u) { var a = document.createElement("a"); a.href = p.u; a.target = "_blank"; a.rel = "noopener"; a.className = "hoy-mas"; a.textContent = p.e ? "Ver carta y local" : "Más información"; ficha.appendChild(a); }
    if (centra) {
      vb[2] = Math.min(vb[2], 520); vb[3] = vb[2] * (svg.clientHeight / svg.clientWidth || 1);
      vb[0] = p.x - vb[2] / 2; vb[1] = p.y - vb[3] / 2; clamp(); setVB();
      svg.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
  var ul = document.getElementById("mapa-ul");
  Object.keys(CATS).filter(function (c) { return c !== "apt"; }).forEach(function (c) {
    M.poi.filter(function (p) { return p.c === c && !p.d; }).forEach(function (p) {
      var li = document.createElement("li"), b = document.createElement("button");
      b.type = "button"; b.textContent = p.n + " · " + CATS[c];
      b.addEventListener("click", function () { selecciona(p.id, true); });
      li.appendChild(b); ul.appendChild(li);
    });
  });

  /* filtros: los negocios del directorio empiezan ocultos */
  OCULTAS.forEach(function (c) { root.classList.add("sin-" + c); });
  var qs = /[?&]s=([\w,-]+)/.exec(location.search);        /* ?s=comer,ocio abre el mapa con esos segmentos */
  if (qs) qs[1].split(",").forEach(function (c) {
    root.classList.remove("sin-" + c);
    var bc = document.querySelector('[data-filtro="' + c + '"]'); if (bc) bc.setAttribute("aria-pressed", "true");
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-filtro]"), function (b) {
    b.addEventListener("click", function () {
      var on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      root.classList.toggle("sin-" + b.dataset.filtro, !on);
    });
  });

  function encuadra() {
    var r = (svg.clientHeight / svg.clientWidth) || 1, w = M.vb[2], h = M.vb[3];
    if (h / w > r) w = h / r; else h = w * r;
    vb = [M.vb[0] + (M.vb[2] - w) / 2, M.vb[1] + (M.vb[3] - h) / 2, w, h];
    clamp(); setVB();
  }
  window.addEventListener("resize", ajusta);
  encuadra();
  var qp = /[?&]p=([\w-]+)/.exec(location.search);
  if (qp && marks[qp[1]]) { selecciona(qp[1], true); setTimeout(function () { var s = document.getElementById("mapa-sec"); if (s) { document.documentElement.style.scrollBehavior = "auto"; s.scrollIntoView(); document.documentElement.style.scrollBehavior = ""; } }, 60); }
})();
