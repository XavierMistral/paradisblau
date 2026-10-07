/* Juego de la Oca: 63 casillas, de 2 a 4 jugadores en un mismo móvil o contra el móvil.
   Dos tableros: «Pintores de Tossa» (ilustración con los números superpuestos) y un espiral sencillo dibujado en SVG.
   Sin servicios externos. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  if (!$("oca-tablero")) return;
  var NS = "http://www.w3.org/2000/svg";

  var OCAS = [5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 50, 54, 59];
  var ESP = { 6: "puente", 12: "puente", 26: "dados", 53: "dados", 19: "posada", 31: "pozo", 42: "laberinto", 52: "carcel", 58: "muerte", 63: "jardin" };
  OCAS.forEach(function (n) { ESP[n] = "oca"; });
  var COLOR = { oca: "#2f8f6b", puente: "#2a7fb8", dados: "#6b4fa3", posada: "#d9a441", pozo: "#1f434c", laberinto: "#8c5e3c", carcel: "#586273", muerte: "#8c2f12", jardin: "#c9a227" };
  var COLORES = ["#f2b632", "#d9533f", "#2f8f6b", "#6b4fa3"];
  var ICO = {
    oca: '<ellipse cx="10.5" cy="15.5" rx="6.5" ry="4"/><path d="M15 13c2-1 3-3 3-6"/><circle cx="18" cy="5.5" r="1.8"/><path d="M19.6 5.8 23 7M5 14l-3-2M8 20l-1 2M13 20l1 2"/>',
    puente: '<path d="M2 17h20M3 17c0-6 4-9 9-9s9 3 9 9M7 17v-3M12 17v-6M17 17v-3"/>',
    dados: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r="1" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1" fill="currentColor"/>',
    posada: '<path d="M3 11 12 4l9 7v9H3zM10 20v-5h4v5"/>',
    pozo: '<path d="M5 21V12c0-2 3-3 7-3s7 1 7 3v9M5 12c0 2 3 3 7 3s7-1 7-3M8 9V4h8v5"/>',
    laberinto: '<path d="M4 20V4h16v16H8V8h8v8h-4"/>',
    carcel: '<rect x="5" y="4" width="14" height="16" rx="1"/><path d="M9 4v16M12 4v16M15 4v16"/>',
    muerte: '<path d="M12 3a7 7 0 0 1 4 12.7V19H8v-3.3A7 7 0 0 1 12 3z"/><circle cx="9.5" cy="11" r="1.4"/><circle cx="14.5" cy="11" r="1.4"/><path d="M11 15h2"/>',
    jardin: '<path d="M12 21v-7M12 14c-4.5 0-6.5-3-5.5-6 1-2.8 4-4 5.5-4s4.5 1.2 5.5 4c1 3-1 6-5.5 6z"/><path d="M8 21h8"/>'
  };

  /* ---------- tablero 1: pintores de Tossa (centro de cada casilla y posición de su número en la ilustración de 1014 x 1024) ---------- */
  var PIN_CEN = [[120, 895], [245, 895], [380, 915], [462, 915], [545, 915], [628, 925], [712, 920], [785, 915], [872, 905], [915, 870], [905, 776], [905, 700], [905, 614], [905, 545], [905, 455], [905, 375], [905, 295], [910, 215], [930, 120], [870, 65], [775, 95], [700, 95], [625, 95], [545, 100], [462, 110], [380, 105], [310, 100], [225, 100], [135, 95], [95, 145], [95, 225], [95, 300], [95, 385], [90, 460], [85, 540], [90, 610], [65, 705], [130, 745], [230, 760], [305, 760], [385, 765], [460, 755], [545, 750], [620, 750], [700, 760], [765, 705], [755, 600], [745, 540], [740, 455], [745, 380], [760, 295], [725, 235], [620, 250], [545, 260], [470, 245], [385, 255], [295, 235], [240, 290], [255, 380], [235, 460], [230, 550], [290, 600], [385, 590], [505, 495]];
  var PIN_NUM = [null, [50, 865], [403, 966], [484, 966], [567, 967], [652, 968], [735, 968], [816, 968], [938, 957], [970, 848], [967, 772], [967, 680], [965, 596], [967, 516], [965, 432], [962, 352], [960, 272], [957, 197], [845, 185], [842, 47], [762, 45], [682, 45], [600, 45], [518, 47], [440, 47], [385, 140], [280, 52], [203, 52], [88, 62], [48, 165], [45, 243], [45, 320], [43, 403], [43, 485], [42, 565], [40, 645], [48, 768], [160, 800], [237, 800], [315, 800], [402, 803], [482, 800], [572, 800], [648, 800], [770, 795], [805, 683], [805, 600], [800, 517], [800, 432], [800, 355], [790, 235], [680, 200], [598, 305], [520, 205], [440, 203], [365, 205], [240, 215], [205, 315], [202, 402], [203, 488], [210, 603], [315, 637], [400, 640], null];

  /* ---------- tablero 2: espiral sencillo ---------- */
  var ESP_PUNTOS = (function () {
    var CX = 320, CY = 320, ROUT = 275, RIN = 74, VUELTAS = 3.1, A0 = -1.75;
    var PH = VUELTAS * 2 * Math.PI, pts = [], n = 62, i, fi, total = 0, ds = 0.002, tab = [];
    function r(f) { return ROUT - (ROUT - RIN) * f / PH; }
    for (fi = 0; fi < PH; fi += ds) { total += Math.sqrt(Math.pow(r(fi), 2) + Math.pow((ROUT - RIN) / PH, 2)) * ds; tab.push([fi, total]); }
    var obj, k = 0;
    for (i = 0; i <= n; i++) {
      obj = total * i / n;
      while (k < tab.length - 1 && tab[k][1] < obj) k++;
      fi = tab[k][0]; var rr = r(fi), a = A0 + fi;
      pts.push([CX + rr * Math.cos(a), CY + rr * Math.sin(a)]);
    }
    pts.push([CX, CY]);
    return pts;
  })();

  var T = null;        /* tablero en uso: { pintores: bool, puntos: [...] } */
  var pos, perder, turno, fin, ocupado, nJug, modoIA, timer = null, fichas = [], aro = null;


  /* ---- Textos del juego en cada idioma. Cada mensaje: [tercera persona, segunda persona]; {n} = nombre, {x} = número. ---- */
  var LG = (document.documentElement.lang || "es");
  var M = {
    es: {
      tu: "Tú", movil: "Móvil ", jug: "Jugador ", salida: "Salida", casilla: "casilla ", fin: "Partida terminada", juega: "{n} juega…", tira: "Tirar el dado · {n}",
      ini: ["Empieza el jugador 1. Tira el dado.", "Empiezas tú. Tira el dado."],
      saca: ["{n} saca un {x}.", "{n} sacas un {x}."],
      pasa: ["{n} se pasa de la meta y rebota hasta la casilla {x}.", "{n} te pasas de la meta y rebotas hasta la casilla {x}."],
      avanza: ["{n} avanza a la casilla {x}.", "{n} avanzas a la casilla {x}."],
      gana: ["¡{n} llega al Jardín de la Oca y gana!", "¡{n} llegas al Jardín de la Oca y ganas!"],
      oca: ["De oca en oca y tiro porque me toca: salta a la casilla {x}.", "De oca en oca y tiro porque me toca: saltas a la casilla {x}."],
      puente: ["De puente en puente y tiro porque me lleva la corriente: pasa a la casilla {x}.", "De puente en puente y tiro porque me lleva la corriente: pasas a la casilla {x}."],
      dados: ["De dado a dado y tiro porque me ha tocado: pasa a la casilla {x}.", "De dado a dado y tiro porque me ha tocado: pasas a la casilla {x}."],
      posada: ["Posada: {n} descansa y pierde un turno.", "Posada: {n} descansas y pierdes un turno."],
      pozo: ["Pozo: {n} cae y pierde dos turnos.", "Pozo: {n} caes y pierdes dos turnos."],
      carcel: ["Cárcel: {n} pierde dos turnos.", "Cárcel: {n} pierdes dos turnos."],
      laberinto: ["Laberinto: {n} se pierde y vuelve a la casilla 30.", "Laberinto: {n} te pierdes y vuelves a la casilla 30."],
      muerte: ["La calavera: {n} vuelve a la salida.", "La calavera: {n} vuelves a la salida."],
      otra: ["{n} vuelve a tirar.", "{n} vuelves a tirar."],
      turno: ["{n} pierde este turno.", "{n} pierdes este turno."]
    },
    ca: {
      tu: "Tu", movil: "Mòbil ", jug: "Jugador ", salida: "Sortida", casilla: "casella ", fin: "Partida acabada", juega: "{n} juga…", tira: "Tira el dau · {n}",
      ini: ["Comença el jugador 1. Tira el dau.", "Comences tu. Tira el dau."],
      saca: ["{n} treu un {x}.", "{n} treus un {x}."],
      pasa: ["{n} se'n passa de la meta i rebota fins a la casella {x}.", "{n} te'n passes de la meta i rebotes fins a la casella {x}."],
      avanza: ["{n} avança a la casella {x}.", "{n} avances a la casella {x}."],
      gana: ["{n} arriba al Jardí de l'Oca i guanya!", "{n} arribes al Jardí de l'Oca i guanyes!"],
      oca: ["D'oca en oca i tiro perquè em toca: salta a la casella {x}.", "D'oca en oca i tiro perquè em toca: saltes a la casella {x}."],
      puente: ["De pont en pont i tiro perquè em porta el corrent: passa a la casella {x}.", "De pont en pont i tiro perquè em porta el corrent: passes a la casella {x}."],
      dados: ["De dau en dau i tiro perquè m'ha tocat: passa a la casella {x}.", "De dau en dau i tiro perquè m'ha tocat: passes a la casella {x}."],
      posada: ["Fonda: {n} descansa i perd un torn.", "Fonda: {n} descanses i perds un torn."],
      pozo: ["Pou: {n} cau i perd dos torns.", "Pou: {n} caus i perds dos torns."],
      carcel: ["Presó: {n} perd dos torns.", "Presó: {n} perds dos torns."],
      laberinto: ["Laberint: {n} es perd i torna a la casella 30.", "Laberint: {n} et perds i tornes a la casella 30."],
      muerte: ["La calavera: {n} torna a la sortida.", "La calavera: {n} tornes a la sortida."],
      otra: ["{n} torna a tirar.", "{n} tornes a tirar."],
      turno: ["{n} perd aquest torn.", "{n} perds aquest torn."]
    },
    en: {
      tu: "You", movil: "Phone ", jug: "Player ", salida: "Start", casilla: "square ", fin: "Game over", juega: "{n} plays…", tira: "Roll the die · {n}",
      ini: ["Player 1 starts. Roll the die.", "You start. Roll the die."],
      saca: ["{n} rolls a {x}.", "{n} roll a {x}."],
      pasa: ["{n} overshoots the end and bounces back to square {x}.", "{n} overshoot the end and bounce back to square {x}."],
      avanza: ["{n} moves to square {x}.", "{n} move to square {x}."],
      gana: ["{n} reaches the Goose Garden and wins!", "{n} reach the Goose Garden and win!"],
      oca: ["From goose to goose, and I roll again because it's my turn: jumps to square {x}.", "From goose to goose, and I roll again because it's my turn: you jump to square {x}."],
      puente: ["From bridge to bridge, and I roll again because the current takes me: moves to square {x}.", "From bridge to bridge, and I roll again because the current takes me: you move to square {x}."],
      dados: ["From die to die, and I roll again because luck is mine: moves to square {x}.", "From die to die, and I roll again because luck is mine: you move to square {x}."],
      posada: ["Inn: {n} rests and misses a turn.", "Inn: {n} rest and miss a turn."],
      pozo: ["Well: {n} falls in and misses two turns.", "Well: {n} fall in and miss two turns."],
      carcel: ["Prison: {n} misses two turns.", "Prison: {n} miss two turns."],
      laberinto: ["Maze: {n} gets lost and goes back to square 30.", "Maze: {n} get lost and go back to square 30."],
      muerte: ["The skull: {n} goes back to the start.", "The skull: {n} go back to the start."],
      otra: ["{n} rolls again.", "{n} roll again."],
      turno: ["{n} misses this turn.", "{n} miss this turn."]
    }
  };
  var TX = M[LG] || M.es;
  function msg(k, j, x) { var par = (modoIA && j === 0) ? 1 : 0; return TX[k][par].replace("{n}", nombre(j)).replace(/\{x\}/g, x); }
  function nombre(j) { return modoIA ? (j === 0 ? TX.tu : TX.movil + j) : TX.jug + (j + 1); }
  function esBot(j) { return modoIA && j > 0; }
  function v(j, tercera, segunda) { return modoIA && j === 0 ? segunda : tercera; }
  function el(t, a, par) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); if (par) par.appendChild(e); return e; }
  function icono(tipo, x, y, s, par, color) {
    var g = el("g", { transform: "translate(" + x + " " + y + ") scale(" + s + ")", fill: "none", stroke: color || "#fff", "stroke-width": 1.8, "stroke-linecap": "round", "stroke-linejoin": "round", color: color || "#fff" }, par);
    g.innerHTML = ICO[tipo]; return g;
  }

  function construye() {
    var cont = $("oca-tablero"); cont.innerHTML = "";
    var pintores = $("oca-tab").value === "pintores";
    T = { pintores: pintores, puntos: pintores ? PIN_CEN : ESP_PUNTOS };
    var svg = el("svg", { viewBox: pintores ? "0 0 1014 1024" : "0 0 640 640", role: "group", "aria-label": "Tablero de la oca con 63 casillas, hasta el Jardín de la Oca", class: "oca-svg" }, cont);
    if (pintores) construyePintores(svg); else construyeEspiral(svg);
    aro = el("circle", { r: pintores ? 40 : 26, fill: "none", stroke: "#1b2233", "stroke-width": pintores ? 5 : 3.5, class: "oca-aro" }, svg);
    fichas = [];
    for (var j = 0; j < 4; j++) {
      var f = el("g", { class: "oca-ficha", style: "transform:translate(0px,0px)" }, svg);
      el("circle", { r: pintores ? 13 : 8, fill: COLORES[j], stroke: "#fff", "stroke-width": pintores ? 3 : 2.2 }, f);
      var ft = el("text", { y: pintores ? 4.5 : 3.2, "text-anchor": "middle", "font-size": pintores ? 14 : 9.5, "font-weight": 800, fill: "#1b2233" }, f); ft.textContent = j + 1;
      fichas.push(f);
    }
  }

  function construyePintores(svg) {
    el("image", { href: "/assets/juegos/oca/tablero-pintores.jpg", x: 0, y: 0, width: 1014, height: 1024 }, svg);
    for (var n = 1; n < 63; n++) {
      var c = PIN_NUM[n], tipo = ESP[n];
      var g = el("g", { transform: "translate(" + c[0] + " " + c[1] + ")" }, svg);
      el("circle", { r: 16, fill: "#fff", stroke: tipo ? COLOR[tipo] : "#2b2b2b", "stroke-width": tipo ? 5 : 2 }, g);
      var t = el("text", { y: 5.5, "text-anchor": "middle", "font-size": 15, "font-weight": 800, fill: "#1b2233" }, g); t.textContent = n;
      if (tipo) {
        el("circle", { cx: 15, cy: -15, r: 12, fill: COLOR[tipo], stroke: "#fff", "stroke-width": 2 }, g);
        icono(tipo, 15 - 7.5, -15 - 7.5, 0.62, g);
      }
    }
    /* meta: Jardín de la Oca */
    var m = el("g", { transform: "translate(505 585)" }, svg);
    el("circle", { r: 20, fill: COLOR.jardin, stroke: "#fff", "stroke-width": 3 }, m);
    icono("jardin", -11, -11, 0.92, m);
    var tm = el("text", { y: 36, "text-anchor": "middle", "font-size": 13, "font-weight": 800, fill: "#fff", stroke: "#1b2233", "stroke-width": 3, "paint-order": "stroke" }, m); tm.textContent = "63";
    var ts = el("text", { x: 120, y: 870, "text-anchor": "middle", "font-size": 18, "font-weight": 800, fill: "#fff", stroke: "#1b2233", "stroke-width": 4, "paint-order": "stroke" }, svg); ts.textContent = TX.salida;
  }

  function construyeEspiral(svg) {
    var P = ESP_PUNTOS;
    el("rect", { x: 4, y: 4, width: 632, height: 632, rx: 28, fill: "#efe0b8", stroke: "#c9a96a", "stroke-width": 5 }, svg);
    var d = "M" + P.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L");
    el("path", { d: d, fill: "none", stroke: "#d9bd7a", "stroke-width": 16, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
    el("path", { d: d, fill: "none", stroke: "#f6ecd0", "stroke-width": 5, "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-dasharray": "2 9" }, svg);
    P.forEach(function (p, n) {
      var tipo = ESP[n], g = el("g", { transform: "translate(" + p[0].toFixed(1) + " " + p[1].toFixed(1) + ")" }, svg), rad = n === 63 ? 40 : 21;
      el("circle", { r: rad, fill: tipo ? COLOR[tipo] : "#fbf4e2", stroke: tipo ? "rgba(0,0,0,.25)" : "#b99a58", "stroke-width": 2 }, g);
      if (tipo) {
        var s = n === 63 ? 1.9 : 0.78;
        icono(tipo, -12 * s, -12 * s - (n === 63 ? 4 : 3), s, g);
        var t = el("text", { y: n === 63 ? 30 : 16, "text-anchor": "middle", "font-size": n === 63 ? 12 : 8.5, "font-weight": 800, fill: "#fff" }, g); t.textContent = n === 63 ? "Jardín de la Oca" : n;
      } else {
        var t2 = el("text", { y: 4.5, "text-anchor": "middle", "font-size": n === 0 ? 8.5 : 12, "font-weight": 700, fill: "#6b5a3a" }, g); t2.textContent = n === 0 ? TX.salida : n;
      }
    });
  }

  function pintaFichas() {
    var P = T.puntos, pin = T.pintores;
    var OFF = pin ? [[-17, -15], [17, -15], [-17, 17], [17, 17]] : [[-11, -11], [11, -11], [-11, 11], [11, 11]];
    var OFF63 = pin ? [[-45, -30], [45, -30], [-45, 30], [45, 30]] : [[-16, -10], [16, -10], [-16, 12], [16, 12]];
    fichas.forEach(function (f, j) {
      f.style.display = j < nJug ? "" : "none";
      if (j >= nJug) return;
      var p = P[pos[j]], o = pos[j] === 63 ? OFF63[j] : OFF[j];
      f.style.transform = "translate(" + (p[0] + o[0]).toFixed(1) + "px," + (p[1] + o[1]).toFixed(1) + "px)";
      f.setAttribute("aria-label", nombre(j) + ", " + TX.casilla + pos[j]);
    });
    var q = P[pos[turno]]; aro.style.transform = "translate(" + q[0].toFixed(1) + "px," + q[1].toFixed(1) + "px)"; aro.style.opacity = fin ? 0 : 1;
  }

  function dice(val) { var d = $("oca-dado"); d.textContent = val || "·"; d.classList.remove("oca-rueda"); void d.offsetWidth; if (val) d.classList.add("oca-rueda"); }
  function linea(txt, ok) {
    var m = $("oca-msg"); m.textContent = txt; m.className = "pt-msg" + (ok ? " ok" : "");
    var li = document.createElement("li"); li.textContent = txt; var ul = $("oca-registro"); ul.insertBefore(li, ul.firstChild);
    while (ul.children.length > 6) ul.removeChild(ul.lastChild);
  }
  function botones() {
    var b = $("oca-tirar"); b.disabled = fin || ocupado || esBot(turno);
    b.textContent = fin ? TX.fin : esBot(turno) ? TX.juega.replace("{n}", nombre(turno)) : TX.tira.replace("{n}", nombre(turno));
  }

  function nueva() {
    clearTimeout(timer);
    nJug = Number($("oca-jug").value); modoIA = $("oca-modo").value === "ia";
    construye();
    pos = []; perder = []; for (var i = 0; i < nJug; i++) { pos.push(0); perder.push(0); }
    turno = 0; fin = false; ocupado = false;
    $("oca-registro").innerHTML = "";
    dice(0); pintaFichas();
    linea(TX.ini[modoIA ? 1 : 0]);
    botones();
  }

  function resuelve(j, d) {
    var pasos = [], extra = false, dest = pos[j] + d;
    if (dest > 63) { dest = 63 - (dest - 63); pasos.push({ p: 63, t: msg("pasa", j, dest) }); }
    pasos.push({ p: dest, t: msg("avanza", j, dest) });
    var tipo = ESP[dest];
    var gana = { p: 63, t: msg("gana", j, 0), gana: true };
    if (tipo === "jardin") { pasos.push(gana); return { pasos: pasos, extra: false }; }
    if (tipo === "oca") {
      var sig = OCAS.filter(function (o) { return o > dest; })[0] || 63;
      pasos.push({ p: sig, t: msg("oca", j, sig) });
      if (sig === 63) { pasos.push(gana); return { pasos: pasos, extra: false }; }
      extra = true;
    } else if (tipo === "puente") {
      var otro = dest === 6 ? 12 : 6; pasos.push({ p: otro, t: msg("puente", j, otro) }); extra = true;
    } else if (tipo === "dados") {
      var o2 = dest === 26 ? 53 : 26; pasos.push({ p: o2, t: msg("dados", j, o2) }); extra = true;
    } else if (tipo === "posada") { perder[j] = 1; pasos.push({ p: dest, t: msg("posada", j, 0) }); }
    else if (tipo === "pozo") { perder[j] = 2; pasos.push({ p: dest, t: msg("pozo", j, 0) }); }
    else if (tipo === "carcel") { perder[j] = 2; pasos.push({ p: dest, t: msg("carcel", j, 0) }); }
    else if (tipo === "laberinto") { pasos.push({ p: 30, t: msg("laberinto", j, 0) }); }
    else if (tipo === "muerte") { pasos.push({ p: 0, t: msg("muerte", j, 0) }); }
    return { pasos: pasos, extra: extra };
  }

  function tirar() {
    if (fin || ocupado) return;
    ocupado = true; botones();
    var j = turno, d = 1 + Math.floor(Math.random() * 6);
    dice(d); linea(msg("saca", j, d));
    var r = resuelve(j, d), i = 0;
    (function paso() {
      if (i >= r.pasos.length) return acaba(j, r);
      var s = r.pasos[i++]; pos[j] = s.p; pintaFichas(); linea(s.t, s.gana);
      if (s.gana) { fin = true; ocupado = false; pintaFichas(); botones(); return; }
      timer = setTimeout(paso, 800);
    })();
  }

  function acaba(j, r) {
    ocupado = false;
    if (r.extra) { linea(msg("otra", j, 0)); turno = j; }
    else {
      var guard = 0;
      do {
        turno = (turno + 1) % nJug;
        if (perder[turno] > 0) { perder[turno]--; linea(msg("turno", turno, 0)); pintaFichas(); } else break;
      } while (++guard < 20);
    }
    pintaFichas(); botones();
    if (!fin && esBot(turno)) timer = setTimeout(tirar, 1100);
  }

  $("oca-tirar").addEventListener("click", tirar);
  $("oca-nuevo").addEventListener("click", nueva);
  $("oca-jug").addEventListener("change", nueva);
  $("oca-modo").addEventListener("change", nueva);
  $("oca-tab").addEventListener("change", nueva);
  nueva();
})();
