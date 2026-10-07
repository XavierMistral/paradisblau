/* Bloque "Hoy en Tossa": tiempo, mar, puesta de sol, sugerencia según el tiempo y agenda (hoy / fin de semana / semana).
   El tiempo se lee de un archivo propio (tiempo.php en producción, tiempo.json como copia local) para que el navegador
   del visitante NO se conecte a terceros. Si no hay datos, el bloque lo dice y no inventa nada. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); return x; }
  function parse(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function lab(d) { return DIAS[d.getDay()] + " " + d.getDate() + " " + MESES[d.getMonth()]; }
  function dec(x, n) { return (Math.round(x * 10) / 10).toString().replace(".", ","); }
  function hhmm(s) { return s ? s.slice(11, 16) : ""; }

  /* ---------- Tiempo ---------- */
  function estado(code) {
    if (code === 0) return "Despejado";
    if (code === 1 || code === 2) return "Poco nuboso";
    if (code === 3) return "Cubierto";
    if (code === 45 || code === 48) return "Niebla";
    if (code >= 51 && code <= 57) return "Llovizna";
    if (code >= 61 && code <= 67) return "Lluvia";
    if (code >= 80 && code <= 82) return "Chubascos";
    if (code >= 95) return "Tormenta";
    return "Variable";
  }

  function sugerencia(w) {
    var c = w.f.current, d = w.f.daily;
    var code = c.weather_code, prob = d.precipitation_probability_max[0], gust = c.wind_gusts_10m;
    var olas = w.m && w.m.current ? w.m.current.wave_height : null;
    var mar = w.m && w.m.current ? w.m.current.sea_surface_temperature : null;
    var txt, tit;
    if (code >= 95) {
      tit = "Plan de interior";
      txt = "Hay tormenta en la previsión. Buen momento para el Museu de la Dona, el cine y una comida sin prisa. Deja el Camí de Ronda y las calas para otro día.";
    } else if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82) || prob >= 60) {
      tit = "Mejor con paraguas a mano";
      txt = "Hay probabilidad de chubascos. Aprovecha las horas secas para pasear por la Vila Vella y deja el museo o una buena mesa para cuando llueva.";
    } else if ((olas !== null && olas >= 1.5) || gust >= 45) {
      tit = "Mar y viento";
      txt = "El mar está movido. Pasea por la Vila Vella y el faro; el baño y el kayak, mejor otro día.";
    } else if (c.temperature_2m >= 22 && (mar === null || mar >= 19)) {
      tit = "Día de playa";
      txt = "Buen día para la Platja Gran o la Mar Menuda. Si te apetece algo más activo, el kayak hacia las calas de la costa.";
    } else {
      tit = "Día para caminar";
      txt = "Buen tiempo para pasear por la Vila Vella y subir al faro, o para una ruta junto al mar.";
    }
    var now = new Date();
    var ss = d.sunset[0] ? new Date(d.sunset[0]) : null;
    var extra = "";
    if (ss && now > new Date(ss.getTime() - 120 * 60000) && now < ss) {
      extra = " La puesta de sol es a las " + hhmm(d.sunset[0]) + ".";
    }
    return { tit: tit, txt: txt + extra };
  }

  var planActual = "sol";
  /* Pictogramas sencillos (línea, un solo color) para planes sin foto. Se sustituyen por foto cuando la haya. */
  var ICO = {
    museo: '<path d="M3 9l9-5 9 5"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 20h18"/>',
    galeria: '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 16l4-4 3 3 3-4 6 6"/><circle cx="9" cy="9.5" r="1.3"/>',
    juego: '<path d="M10 4a2 2 0 1 1 4 0v2h4v4h-2a2 2 0 1 0 0 4h2v4h-4v-2a2 2 0 1 0-4 0v2H6v-4h2a2 2 0 1 0 0-4H6V6h4z"/>',
    tren: '<rect x="5" y="4" width="14" height="12" rx="3"/><path d="M5 11h14"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/><path d="M8 20l2-4M16 20l-2-4"/>',
    deporte: '<path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12"/>',
    ciudad: '<path d="M3 21V10h5v11M8 21V5h6v16M14 21V12h7v9"/><path d="M3 21h18"/>',
    buceo: '<path d="M4 9h16v4a3 3 0 0 1-3 3h-2l-1-2h-4l-1 2H7a3 3 0 0 1-3-3z"/><path d="M20 9V4"/><circle cx="8" cy="12" r=".6"/><circle cx="16" cy="12" r=".6"/>'
  };
  function tarjeta(e) {
    var media;
    if (e.img) {
      media = '<img src="' + e.img + '" alt="" loading="lazy" style="object-position:' + (e.pos || "50% 50%") + '">';
    } else {
      media = '<svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICO[e.ico] || "") + "</svg>";
    }
    return '<li class="pl-card"><div class="pl-media' + (e.img ? "" : " pl-ico") + '">' + media + '</div><div class="pl-body"><b>' + e.t + "</b><span>" + e.n + "</span>" +
      (e.u ? '<a class="hoy-mas" href="' + e.u + '"' + (e.interno ? "" : ' target="_blank" rel="noopener"') + ">" + (e.interno ? "Entrar" : "Más información") + "</a>" : "") + "</div></li>";
  }
  function pintaRec() {
    var lista = (window.AGENDA && window.AGENDA.recomendados) || [], ul = $("hoy-rec");
    if (!ul) return;
    ul.innerHTML = lista.map(function (e) {
      var ext = /^https?:/.test(e.u || ""), bd = e.colab ? '<em class="rec colab-b">Colaborador</em>' : "";
      var enlace = ' href="' + (e.u || "#") + '"' + (ext ? ' target="_blank" rel="noopener"' : "");
      if (e.img) return "<li><a class=\"pt-t\"" + enlace + " style=\"--bg:url('" + e.img + "')\">" + bd + "<b>" + e.t + "</b><span>" + e.sub + "</span></a></li>";
      return '<li><a class="pt-t pt-t-ico"' + enlace + '><svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICO[e.ico] || "") + "</svg>" + bd + "<b>" + e.t + "</b><span>" + e.sub + "</span></a></li>";
    }).join("");
  }
  function marcaRec(cual) {
    Array.prototype.forEach.call(document.querySelectorAll(".pt-t .rec"), function (e) { e.hidden = e.getAttribute("data-rec") !== cual; });
  }
  function llueve(w) {
    var c = w.f.current.weather_code, p = w.f.daily.precipitation_probability_max[0];
    return (c >= 51 && c <= 67) || (c >= 80 && c <= 82) || c >= 95 || p >= 60;
  }


  /* ---------- Fondo del tiempo en la tarjeta de sugerencia ---------- */
  function estadoVisual(w) {
    var c = w.f.current, code = c.weather_code, p = w.f.daily.precipitation_probability_max[0];
    if (code >= 95) return "tormenta";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || p >= 60) return "lluvia";
    if (code <= 1) return c.is_day === 0 ? "noche" : "sol";
    return "nublado";
  }
  function pintaFondo(estado) {
    var card = $("hoy-sug-card"), wx = $("hoy-wx");
    if (!card || !wx) return;
    card.setAttribute("data-wx", estado);
    var h = "";
    function nubes(oscuras) {
      var o = "";
      for (var i = 0; i < 4; i++) o += '<span class="nube' + (oscuras ? " oscura" : "") + '" style="top:' + (1 + i * 8) + "%;animation-duration:" + (46 + i * 14) + "s;animation-delay:-" + (i * 11) + "s;transform:scale(" + (0.62 + i * 0.1).toFixed(2) + ')"></span>';
      return o;
    }
    function gotas(n) {
      var o = "";
      for (var i = 0; i < n; i++) o += '<i class="gota" style="left:' + ((i * 37) % 100) + "%;animation-duration:" + (0.7 + (i % 5) * 0.12).toFixed(2) + "s;animation-delay:-" + ((i * 0.17) % 1.4).toFixed(2) + 's"></i>';
      return o;
    }
    if (estado === "sol") h = '<span class="rayos"></span><span class="astro"></span><span class="nube" style="top:34%;animation-duration:70s;transform:scale(.6)"></span>';
    else if (estado === "noche") {
      h = '<span class="astro luna"></span>';
      for (var s = 0; s < 14; s++) h += '<i class="estrella" style="left:' + ((s * 53) % 100) + "%;top:" + ((s * 29) % 70) + "%;animation-delay:-" + (s * 0.4).toFixed(1) + 's"></i>';
    } else if (estado === "nublado") h = nubes(false);
    else if (estado === "lluvia") h = nubes(true) + gotas(34);
    else if (estado === "tormenta") h = nubes(true) + gotas(46) + '<span class="rayo"></span>';
    wx.innerHTML = h;
  }

  function pintaTiempo(w) {
    var c = w.f.current, d = w.f.daily;
    $("hoy-temp").textContent = Math.round(c.temperature_2m) + "°";
    $("hoy-estado").textContent = estado(c.weather_code);
    $("hoy-sens").textContent = "Sensación " + Math.round(c.apparent_temperature) + "°";
    var items = [];
    items.push(["Viento", Math.round(c.wind_speed_10m) + " km/h"]);
    if (w.m && w.m.current) {
      if (w.m.current.sea_surface_temperature != null) items.push(["Agua", dec(w.m.current.sea_surface_temperature) + " °C"]);
      if (w.m.current.wave_height != null) items.push(["Olas", dec(w.m.current.wave_height) + " m"]);
    }
    items.push(["Lluvia hoy", d.precipitation_probability_max[0] + " %"]);
    items.push(["Puesta de sol", hhmm(d.sunset[0])]);
    $("hoy-datos").innerHTML = items.map(function (i) {
      return "<div><dt>" + i[0] + "</dt><dd>" + i[1] + "</dd></div>";
    }).join("");
    var prox = "";
    for (var k = 1; k < d.time.length; k++) {
      prox += "<li><b>" + lab(parse(d.time[k])) + "</b><span>" + estado(d.weather_code[k]) + "</span><span>" +
        Math.round(d.temperature_2m_min[k]) + "° / " + Math.round(d.temperature_2m_max[k]) + "°</span></li>";
    }
    $("hoy-prox").innerHTML = prox;
    var s = sugerencia(w);
    $("hoy-sug-t").textContent = s.tit;
    $("hoy-sug-p").textContent = s.txt;
    marcaRec(llueve(w) ? "lluvia" : "sol");
    pintaFondo(estadoVisual(w));
    $("hoy-actualizado").textContent = "Actualizado a las " + hhmm(c.time) + " · Datos: Open-Meteo";
  }

  function sinDatos() {
    $("hoy-temp").textContent = "";
    $("hoy-estado").textContent = "Tiempo no disponible ahora mismo";
    $("hoy-sens").textContent = "";
    $("hoy-datos").innerHTML = "";
    $("hoy-prox").innerHTML = "";
    $("hoy-sug-t").textContent = "Un paseo siempre sienta bien";
    $("hoy-sug-p").textContent = "La Vila Vella, el faro y la Platja Gran están a pocos minutos unos de otros.";
    $("hoy-actualizado").textContent = "";
  }

  function carga() {
    function intenta(url) {
      return fetch(url, { cache: "no-store" }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      });
    }
    intenta("/tiempo.php").catch(function () { return intenta("/tiempo.json"); })
      .then(function (j) {
        if (!j || !j.f || !j.f.current) throw new Error("sin datos");
        /* una copia de respaldo vieja no se presenta como el tiempo de ahora */
        var t = new Date(j.f.current.time);
        if (isNaN(t.getTime()) || Math.abs(Date.now() - t.getTime()) > 6 * 3600 * 1000) throw new Error("datos antiguos");
        pintaTiempo(j);
      })
      .catch(sinDatos);
  }

  /* ---------- Agenda ---------- */
  function eventosEntre(a, b) {
    var out = [], A = window.AGENDA || { puntuales: [], semanales: [] };
    A.puntuales.forEach(function (e) {
      var d1 = parse(e.d), d2 = parse(e.h);
      if (d2 >= a && d1 <= b) out.push({ f: d1 < a ? a : d1, t: e.t, n: e.n, l: e.lugar, h: e.hora, u: e.u });
    });
    A.semanales.forEach(function (e) {
      for (var d = new Date(a); d <= b; d = addDays(d, 1)) {
        if (d.getDay() === e.dow && (!e.meses || e.meses.indexOf(d.getMonth() + 1) >= 0)) out.push({ f: new Date(d), t: e.t, n: e.n, l: e.lugar, h: e.hora, u: e.u });
      }
    });
    out.sort(function (x, y) { return x.f - y.f; });
    return out;
  }

  function rango(modo) {
    var h = new Date(); h = new Date(h.getFullYear(), h.getMonth(), h.getDate());
    if (modo === "hoy") return [h, h];
    if (modo === "finde") {
      var dow = h.getDay();
      if (dow === 6) return [h, addDays(h, 1)];
      if (dow === 0) return [h, h];
      return [addDays(h, 6 - dow), addDays(h, 7 - dow)];
    }
    return [h, addDays(h, 6)];
  }

  var CORTO = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
  var NOMD = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  var MESL = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var agOff = 0, agSel = null;
  function hoyFecha() { var h = new Date(); return new Date(h.getFullYear(), h.getMonth(), h.getDate()); }
  function lunesDe(d) { return addDays(d, -((d.getDay() + 6) % 7)); }
  function fijosHtml() {
    var fijos = (window.AGENDA && window.AGENDA.siempre) || [];
    return '<ul class="ag-fijos">' + fijos.map(function (e) { return "<li><b>" + e.t + "</b><span>" + e.n + "</span></li>"; }).join("") + "</ul>";
  }
  function detalleDia(d, h) {
    var ev = eventosEntre(d, d), esHoy = d.getTime() === h.getTime();
    var cab = '<p class="ag-fecha">' + (esHoy ? "Hoy, " : "") + NOMD[(d.getDay() + 6) % 7] + " " + d.getDate() + " de " + MESL[d.getMonth()] + "</p>";
    if (ev.length) {
      return cab + ev.map(function (e) {
        var meta = [e.h, e.l].filter(Boolean).join(" · ");
        return '<article class="ag-ev"><b>' + e.t + "</b>" + (meta ? '<span class="ag-meta">' + meta + "</span>" : "") + "<span>" + (e.n || "") + "</span>" +
          (e.u ? '<a class="hoy-mas" href="' + e.u + '" target="_blank" rel="noopener">Más información</a>' : "") + "</article>";
      }).join("");
    }
    var out = cab + '<p class="ag-vacio">Sin eventos señalados.</p>';
    if (d >= h) {
      if (esHoy) {
        var prox = eventosEntre(addDays(h, 1), addDays(h, 120))[0];
        if (prox) out += "<p>Lo próximo: <strong>" + prox.t + "</strong>, " + lab(prox.f) + ".</p>";
      }
      out += '<p class="ag-sub">Siempre disponible en Tossa:</p>' + fijosHtml();
    }
    return out;
  }
  function pintaAgenda() {
    var h = hoyFecha(), ini = addDays(lunesDe(h), agOff * 7), fin = addDays(ini, 6);
    if (!agSel || agSel < ini || agSel > fin) agSel = (h >= ini && h <= fin) ? h : ini;
    $("ag-rango").textContent = ini.getDate() + " " + MESES[ini.getMonth()] + " – " + fin.getDate() + " " + MESES[fin.getMonth()];
    var chips = "";
    for (var i = 0; i < 7; i++) {
      var d = addDays(ini, i), ev = eventosEntre(d, d), esHoy = d.getTime() === h.getTime(), sel = d.getTime() === agSel.getTime();
      chips += '<li><button type="button" class="ag-d' + (esHoy ? " es-hoy" : "") + (sel ? " sel" : "") + (d < h ? " pasado" : "") + (ev.length ? " con" : "") +
        '" data-dia="' + iso(d) + '" aria-pressed="' + sel + '" aria-label="' + NOMD[i] + " " + d.getDate() + (ev.length ? ", " + ev.length + " evento" + (ev.length > 1 ? "s" : "") : ", sin eventos") + '">' +
        "<small>" + CORTO[i] + "</small><b>" + d.getDate() + '</b><i class="ag-pt">' + (ev.length ? "<em></em>".repeat(Math.min(ev.length, 3)) : "") + "</i></button></li>";
    }
    $("ag-tira").innerHTML = chips;
    $("ag-detalle").innerHTML = detalleDia(agSel, h);
    $("ag-prev").disabled = agOff <= 0;
    $("ag-next").disabled = agOff >= 26;
  }

  function pintaPaseos() {
    var P = (window.AGENDA && window.AGENDA.paseos) || [];
    if (!P.length || !$("pas-tabs")) return;
    $("pas-tabs").innerHTML = P.map(function (p, i) {
      return "<button type=\"button\" data-paseo=\"" + p.id + "\" aria-selected=\"" + (i === 0) + "\">" + p.t + "</button>";
    }).join("");
    function muestra(id) {
      var p = P.filter(function (x) { return x.id === id; })[0];
      $("pas-intro").textContent = p.intro;
      $("pas-lista").innerHTML = p.paradas.map(function (s) {
        return "<li><b>" + s.t + "</b><span>" + s.n + "</span>" + (s.u ? "<a class=\"hoy-mas\" href=\"" + s.u + "\" target=\"_blank\" rel=\"noopener\">Más información</a>" : "") + "</li>";
      }).join("");
      var bs = document.querySelectorAll("[data-paseo]");
      for (var i = 0; i < bs.length; i++) bs[i].setAttribute("aria-selected", bs[i].getAttribute("data-paseo") === id ? "true" : "false");
    }
    var bs = document.querySelectorAll("[data-paseo]");
    for (var i = 0; i < bs.length; i++) bs[i].addEventListener("click", function () { muestra(this.getAttribute("data-paseo")); });
    var h = (location.hash || "").replace("#", ""), ini = P.filter(function (x) { return x.id === h; })[0];
    muestra(ini ? ini.id : P[0].id);
  }


  /* Portada: pase suave de fotos de Tossa (sin movimiento si el visitante lo tiene desactivado) */
  function heroRota() {
    var imgs = document.querySelectorAll(".hero img");
    if (imgs.length < 2) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var i = 0;
    setInterval(function () {
      if (document.hidden) return;
      imgs[i].classList.remove("on");
      i = (i + 1) % imgs.length;
      imgs[i].classList.add("on");
    }, 7000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    heroRota();
    pintaPaseos();
    pintaRec();
    if ($("hoy-temp")) {
      carga();
      $("ag-prev").addEventListener("click", function () { if (agOff > 0) { agOff--; pintaAgenda(); } });
      $("ag-next").addEventListener("click", function () { agOff++; pintaAgenda(); });
      $("ag-hoy").addEventListener("click", function () { agOff = 0; agSel = hoyFecha(); pintaAgenda(); });
      $("ag-tira").addEventListener("click", function (e) {
        var b = e.target.closest && e.target.closest("[data-dia]"); if (!b) return;
        agSel = parse(b.getAttribute("data-dia")); pintaAgenda();
      });
      var h = new Date();
      $("hoy-fecha").textContent = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"][h.getDay()] + " " + h.getDate() + " de " +
        ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][h.getMonth()];
      pintaAgenda();
    }
  });
})();
