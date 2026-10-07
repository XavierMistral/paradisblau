/* Comportamiento de web app: barra de navegación inferior en móvil, aviso sin conexión y service worker. */
(function () {
  var ICO = {
    inicio: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    planes: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    mapa: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>',
    ayuda: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'
  };
  var ITEMS = [
    { k: "inicio", t: "Inicio", h: "index.html", test: function (p, h) { return p === "index.html" && !h; } },
    { k: "planes", t: "Planes", h: "index.html#planes", test: function (p, h) { return p === "planes.html" || p === "paseos.html" || p === "pasatiempos.html" || (p === "index.html" && h === "#planes"); } },
    { k: "mapa", t: "Mapa", h: "index.html#mapa-sec", test: function (p, h) { return p === "index.html" && h === "#mapa-sec"; } },
    { k: "ayuda", t: "Ayuda", h: "servicios.html", test: function (p) { return p === "servicios.html"; } }
  ];
  function pagina() { var p = location.pathname.split("/").pop(); return p || "index.html"; }

  function nav() {
    var p = pagina(), h = location.hash;
    var el = document.createElement("nav");
    el.className = "appnav"; el.setAttribute("aria-label", "Navegación principal");
    el.innerHTML = ITEMS.map(function (i) {
      return '<a href="' + i.h + '"' + (i.test(p, h) ? ' class="act" aria-current="page"' : "") + '><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICO[i.k] + "</svg><span>" + i.t + "</span></a>";
    }).join("");
    document.body.appendChild(el);
    document.body.classList.add("con-appnav");
  }

  function aviso() {
    var b = document.createElement("div");
    b.className = "offline-aviso"; b.setAttribute("role", "status"); b.hidden = true;
    b.textContent = "Sin conexión: se muestra la información guardada en tu móvil.";
    document.body.appendChild(b);
    function pon() { b.hidden = navigator.onLine; }
    window.addEventListener("online", pon); window.addEventListener("offline", pon); pon();
  }

  document.addEventListener("DOMContentLoaded", function () { nav(); aviso(); });
  window.addEventListener("hashchange", function () {
    var n = document.querySelector(".appnav"); if (n) { n.remove(); document.body.classList.remove("con-appnav"); nav(); }
  });
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function () {}); });
  }
})();

/* Menú lateral: se cierra al elegir un enlace o con Escape */
(function () {
  var t = document.getElementById("mn"); if (!t) return;
  document.addEventListener("click", function (e) { if (t.checked && e.target.closest && e.target.closest(".nav a")) t.checked = false; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && t.checked) t.checked = false; });
})();
