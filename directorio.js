/* Directorio de Tossa: una página por tipo (?g=comer|alojarse|comprar|ocio|deporte|moverse), con filtros solo de ese tipo.
   Sin ?g= muestra el menú de los seis tipos. Datos en directorio-datos.js (sin servicios externos). */
(function () {
  var D = window.DIRECTORIO; if (!D) return;
  var G = {
    comer: { t: "Dónde comer", i: "Restaurantes, bares y cafeterías de Tossa.", img: "/assets/genericas/plato-paella.jpg" },
    alojarse: { t: "Dónde dormir", i: "Hoteles, apartamentos, campings y alquiler vacacional.", img: "/assets/genericas/hotel.jpg" },
    comprar: { t: "Shopping", i: "Tiendas y comercios de Tossa.", icon: "bolsa" },
    ocio: { t: "Ocio", i: "Excursiones, actividades y diversión.", img: "/assets/planes/barcas.jpg" },
    deporte: { t: "Deporte", i: "Mar, bici, gimnasios y deportes.", img: "/assets/genericas/buceo.jpg" },
    moverse: { t: "Transportes", i: "Taxis, autobuses, alquiler y aparcamientos.", icon: "bus" }
  };
  /* Foto ilustrativa para las fichas sin foto propia: por tipo concreto y, si no hay, por grupo. */
  /* Foto ilustrativa solo cuando representa bien el tipo; en los demás casos, pictograma. */
  var GEN = {
    "Restaurantes": "plato-paella", "Platos combinados": "plato-paella", "Cocina mediterránea": "plato-paella", "Cocina internacional": "plato-paella", "Cocina de autor": "plato-paella",
    "Brasería": "plato-langostinos", "Cocina marinera": "plato-langostinos-cazuela", "Cocina catalana": "plato-cimitomba", "Cocina tradicional tossense": "plato-cimitomba", "Moda": "moda-boutique", "Estanco": "estanco", "Apartamentos": "apartamento-terraza", "Alquiler vacacional": "apartamento-terraza", "Abierto todo el año": "apartamento-terraza", "Pastelería y cafetería": "pasteleria-catalana", "Artículos de playa y pesca": "playa-y-pesca", "Bolsos y complementos": "bolsos-complementos", "Bisutería y joyería": "bisuteria-artesanal", "Souvenirs": "souvenirs-ceramica", "Cerámica": "souvenirs-ceramica", "Alimentación": "bodegon-mediterraneo", "Carnicería y charcutería": "bodegon-mediterraneo", "Pescadería": "bodegon-mediterraneo", "Productor local": "bodegon-mediterraneo", "Bares": "pinchos", "Italiana y pizzería": "pizza",
    "Hoteles": "hotel", "Pensiones y albergues": "hotel",
    "Parques infantiles": "parque", "Con niños": "parque", "Bolos": "bolos",
    "Submarinismo": "buceo", "Snorkel": "buceo", "BTT": "btt", "Pádel": "padel", "Tenis": "padel", "Gimnasio": "gimnasio",
    "Alquiler de bicicletas": "bici", "Alquiler de coches": "coche", "Aparcamientos": "aparcamiento", "Transporte local": "autobus", "Transporte público": "autobus", "Excursiones": "/assets/planes/barcas.jpg",
    "Actividades en el mar": "/assets/planes/barcas.jpg", "Excursiones en barca": "/assets/planes/barcas.jpg", "Transporte marítimo": "/assets/planes/barcas.jpg"
  };
  var ICONOS = {"cubiertos": "<path d=\"M7 3v7a2 2 0 0 1-4 0V3M5 3v18M16 3c-2.5 2-3.5 4.5-3.5 8H16v10\"/>", "cama": "<path d=\"M3 19V6M3 14h18v5M21 14v-2a3 3 0 0 0-3-3h-8v5\"/><circle cx=\"7\" cy=\"11\" r=\"2\"/>", "bolsa": "<path d=\"M6 8h12l1 12H5L6 8zM9 8V6a3 3 0 0 1 6 0v2\"/>", "entrada": "<path d=\"M3 8v3a2 2 0 0 1 0 4v3h18v-3a2 2 0 0 1 0-4V8z\"/><path d=\"M10 8v10\" stroke-dasharray=\"2 2\"/>", "pelota": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c3.5 3.5 3.5 14.5 0 18M12 3c-3.5 3.5-3.5 14.5 0 18\"/>", "bus": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"12\" rx=\"2\"/><path d=\"M4 11h16\"/><circle cx=\"8\" cy=\"18.5\" r=\"1.5\"/><circle cx=\"16\" cy=\"18.5\" r=\"1.5\"/>", "tienda": "<path d=\"M3 20 12 4l9 16zM12 20v-6\"/>", "llave": "<circle cx=\"8\" cy=\"12\" r=\"4\"/><path d=\"M12 12h9M18 12v3M21 12v2\"/>", "yoga": "<circle cx=\"12\" cy=\"5\" r=\"2\"/><path d=\"M12 8v5M5 12l7 1 7-1M6 20c0-3 2.5-5 6-5s6 2 6 5\"/>", "remo": "<path d=\"M5 19 17 7M14.5 4.5l5 5M3 21l2-2\"/>", "joya": "<path d=\"M6 4h12l4 5-10 12L2 9zM2 9h20M9 4l-2 5 5 12M15 4l2 5-5 12\"/>", "cesta": "<path d=\"M4 10h16l-2 10H6zM9 10l3-6 3 6\"/>", "pastel": "<path d=\"M6 12h12l-1 8H7zM6 12c0-3 3-5 6-5s6 2 6 5\"/>", "postal": "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"1\"/><path d=\"M3 9l9 5 9-5\"/>", "taza": "<path d=\"M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2\"/>", "tren": "<rect x=\"5\" y=\"4\" width=\"14\" height=\"12\" rx=\"3\"/><path d=\"M5 11h14\"/><circle cx=\"9\" cy=\"14\" r=\".6\"/><circle cx=\"15\" cy=\"14\" r=\".6\"/><path d=\"M8 19l-2 2M16 19l2 2\"/>"};
  var PICTO = {
    "Pastelería y cafetería": "pastel", "Cocina india": "cubiertos", "Cocina china": "cubiertos", "Cocina gallega": "cubiertos", "Sushi": "cubiertos", "Kebab": "cubiertos",
    "Campings": "tienda", "Alquiler vacacional": "llave", "Apartamentos": "llave", "Abierto todo el año": "cama",
    "Moda": "bolsa", "Bolsos y complementos": "bolsa", "Bisutería y joyería": "joya", "Souvenirs": "postal", "Cerámica": "postal", "Alimentación": "cesta", "Carnicería y charcutería": "cesta",
    "Pescadería": "cesta", "Productor local": "cesta", "Yoga": "yoga", "Pilates": "yoga", "Canoa y kayak": "remo", "Paddle surf": "remo", "Patines acuáticos": "remo",
    "Ocio nocturno": "entrada", "Cine": "entrada", "Excursiones": "entrada", "Visitas guiadas": "entrada"
  };
  var PICTO_G = { comer: "cubiertos", alojarse: "cama", comprar: "bolsa", ocio: "entrada", deporte: "pelota", moverse: "bus" };
  function foto(n) {
    if (n.f) return { src: n.f };
    var ss = n.ss || [n.s], i;
    for (i = 0; i < ss.length; i++) if (GEN[ss[i]]) return GEN[ss[i]].charAt(0) === "/" ? { src: GEN[ss[i]] } : { src: "/assets/genericas/" + GEN[ss[i]] + ".jpg", gen: GEN[ss[i]] };
    for (i = 0; i < ss.length; i++) if (PICTO[ss[i]]) return { picto: PICTO[ss[i]] };
    return { picto: PICTO_G[n.g] };
  }
  function picto(k) {
    var d = el("div", "dr-picto"); d.setAttribute("aria-hidden", "true");
    d.innerHTML = '<svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + (ICONOS[k] || "") + "</svg>";
    return d;
  }
  var CRED = {};   /* autoría de las fotos de Wikimedia */
  var N = D.negocios.slice().sort(function (a, b) { return a.n.localeCompare(b.n, "es"); });
  var qs = new URLSearchParams(location.search), grupo = G[qs.get("g")] ? qs.get("g") : "", tipo = qs.get("t") || "", PAGINA = 36, mostrados = PAGINA;
  var $ = function (id) { return document.getElementById(id); };
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function tel(t) { return "tel:" + t.split("/")[0].replace(/[^\d+]/g, ""); }

  /* ---- menú sin ?g= ---- */
  if (!grupo) {
    var mn = $("dr-menu"); mn.hidden = false; $("dr-volver").href = "index.html#explora";
    Object.keys(G).forEach(function (k) {
      var li = el("li"), a = el("a", "pt-t" + (G[k].icon ? " pt-t-ico" : "")); a.href = "directorio.html?g=" + k;
      if (G[k].icon) { var sv = el("span"); sv.innerHTML = '<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' + ICONOS[G[k].icon] + "</svg>"; a.appendChild(sv.firstChild); }
      else a.style.setProperty("--bg", "url('" + G[k].img + "')");
      a.appendChild(el("b", "", G[k].t)); a.appendChild(el("span", "", G[k].i)); li.appendChild(a); mn.appendChild(li);
    });
    return;
  }

  /* ---- una página por tipo ---- */
  $("dr-titulo").textContent = G[grupo].t; $("dr-intro").textContent = G[grupo].i; document.title = G[grupo].t + " · Paradis Blau";
  $("dr-filtros").hidden = false;
  var $t = $("dr-tipos"), $q = $("dr-q"), $m = $("dr-mapa"), $l = $("dr-lista"), $c = $("dr-cuenta"), $mas = $("dr-mas");
  function tiene(n, t) { return !t || (n.ss || [n.s]).indexOf(t) >= 0; }
  function chips() {
    var c = {}; N.forEach(function (n) { if (n.g === grupo) (n.ss || [n.s]).forEach(function (s) { c[s] = (c[s] || 0) + 1; }); });
    var total = N.filter(function (n) { return n.g === grupo; }).length;
    $t.innerHTML = "";
    function boton(v, txt) {
      var b = el("button", "", txt); b.type = "button"; b.dataset.v = v; b.addEventListener("click", function () { tipo = v; mostrados = PAGINA; pinta(); }); $t.appendChild(b);
    }
    boton("", "Todos (" + total + ")");
    Object.keys(c).sort(function (a, b) { return a === "Sin clasificar" ? 1 : b === "Sin clasificar" ? -1 : c[b] - c[a] || a.localeCompare(b, "es"); }).forEach(function (k) { boton(k, k + " (" + c[k] + ")"); });
    if (tipo && !c[tipo]) tipo = "";
  }
  function lista() {
    var q = norm($q.value.trim());
    /* Orden: alfabético; si algún negocio lleva `o` (orden de promoción, definido en la base maestra como orden_web), va antes, de menor a mayor. */
    return N.slice().sort(function (a, b) { return (a.o || 9999) - (b.o || 9999); }).filter(function (n) {
      return n.g === grupo && tiene(n, tipo) && (!$m.checked || n.lat || n.m) && (!q || norm(n.n + " " + n.d).indexOf(q) >= 0);
    });
  }
  function pinta() {
    Array.prototype.forEach.call($t.children, function (b) { b.setAttribute("aria-pressed", b.dataset.v === tipo ? "true" : "false"); });
    var L = lista(); $l.innerHTML = ""; var usadas = {};
    $("dr-vermapa").href = "index.html?s=" + grupo + "#mapa-sec";
    L.slice(0, mostrados).forEach(function (n) {
      var f = foto(n), a = el("article", "sv-card"), b = el("div", "sv-body");
      if (f.picto) a.appendChild(picto(f.picto));
      else { var im = el("img"); im.src = f.src; im.alt = n.f ? n.n : ""; im.loading = "lazy"; im.addEventListener("error", function () { im.remove(); }); a.appendChild(im); }
      if (f.gen) usadas[f.gen] = 1;
      if (n.s && n.s !== "Sin clasificar") b.appendChild(el("span", "dr-tag", n.s));
      b.appendChild(el("h3", "", n.n));
      if (n.d) b.appendChild(el("p", "", n.d));
      if (n.p) b.appendChild(el("p", "sv-nota", "Gasto medio orientativo: " + n.p));
      if (n.h && n.h.length) {
        var mes = new Date().getMonth() + 1;
        var q = n.h.filter(function (z) { return z.m && z.m.indexOf(mes) >= 0; })[0] || n.h.filter(function (z) { return !z.m; })[0] || n.h[0];
        b.appendChild(el("p", "sv-nota", "Horario" + (q.t ? " (" + q.t + ")" : "") + ": " + q.x));
      }
      var act = el("div", "sv-act");
      if (n.x) { var c = el("a", "btn btn-dark", "Ver carta y local"); c.href = "/" + n.x + "/"; act.appendChild(c); }
      if (n.r) { var rs = el("a", "btn btn-dark", "Reservar"); rs.href = tel(n.r); act.appendChild(rs); }
      if (n.t && n.t !== n.r) { var t = el("a", "btn" + (n.x ? " btn-line" : " btn-dark"), "Llamar"); t.href = tel(n.t); act.appendChild(t); }
      if (n.w) { var w = el("a", "btn btn-line", "Web"); w.href = /^https?:/.test(n.w.split(",")[0]) ? n.w.split(",")[0] : "https://" + n.w.split(",")[0]; w.target = "_blank"; w.rel = "noopener"; act.appendChild(w); }
      if (n.lat || n.m) { var m = el("a", "btn btn-line", "Ver en el mapa"); m.href = "index.html?p=" + (n.m || n.id); act.appendChild(m); }
      if (act.children.length) b.appendChild(act);
      a.appendChild(b); $l.appendChild(a);
    });
    $c.textContent = L.length + (L.length === 1 ? " resultado" : " resultados");
    $mas.hidden = L.length <= mostrados;
    creditos(usadas);
  }
  function creditos(usadas) {
    var cr = $("dr-cred"), k = Object.keys(usadas); cr.innerHTML = "";
    if (!k.length || !Object.keys(CRED).length) return;
    cr.appendChild(document.createTextNode("Fotos ilustrativas: "));
    var vistos = {};
    k.forEach(function (x) {
      var c = CRED["genericas/" + x]; if (!c) return;
      var t = c.autor + " (" + c.licencia + ")"; if (vistos[t]) return; vistos[t] = 1;
      if (Object.keys(vistos).length > 1) cr.appendChild(document.createTextNode(" · "));
      var a = el("a", "", t); a.href = c.origen; a.target = "_blank"; a.rel = "noopener"; cr.appendChild(a);
    });
  }
  $mas.addEventListener("click", function () { mostrados += PAGINA; pinta(); });
  $m.addEventListener("change", function () { mostrados = PAGINA; pinta(); });
  $q.addEventListener("input", function () { mostrados = PAGINA; pinta(); });
  chips(); pinta();
  fetch("/assets/creditos_fotos_genericas.json").then(function (r) { return r.json(); }).then(function (j) { CRED = j; pinta(); }).catch(function () {});
})();
