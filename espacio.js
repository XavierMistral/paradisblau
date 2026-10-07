/* Comportamiento por espacio: muestra u oculta lo que es propio de cada espacio, añade la marca del colaborador
   (solo su logo, sin texto de colaboración) y rellena la bienvenida y el wifi de la vivienda. */
(function () {
  var id = window.PB_ESPACIO || "raiz";
  var C = (window.PB_ESPACIOS || {})[id] || {};
  document.documentElement.setAttribute("data-espacio", id);

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function visibilidad() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-solo]"), function (el) {
      el.hidden = el.getAttribute("data-solo") !== id;
    });
    /* Nota de la wifi de invitados: solo cuando el espacio la activa (wifi_invitados: true en espacios.js) */
    var w = document.getElementById("wifi-lh"); if (w && !C.wifi_invitados) w.hidden = true;
  }

  function marca() {
    if (!C.logo) return;
    var cab = document.querySelector(".top, .top-int");
    if (!cab || cab.querySelector(".cobrand")) return;
    var a = document.createElement("a");
    a.className = "cobrand"; a.href = C.web || "#"; a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = '<img src="' + C.logo + '" alt="' + esc(C.nombre) + '">';
    var ref = cab.querySelector(".volver") || cab.querySelector(".mn-btn");
    cab.insertBefore(a, ref);
  }

  function bienvenida() {
    var s = document.getElementById("bienvenida");
    if (!s || id === "raiz") return;
    var q = /[?&]v=([\w-]+)/.exec(location.search), v = q && C.viviendas ? C.viviendas[q[1]] : null;
    var wifi = v
      ? '<dl class="bv-wifi"><div><dt>Red</dt><dd>' + esc(v.wifi_red) + "</dd></div><div><dt>Contraseña</dt><dd>" + esc(v.wifi_clave) + "</dd></div></dl>"
      : "<p>Escanea el código QR de tu vivienda para ver aquí el nombre de la red y la contraseña del wifi.</p>";
    s.querySelector(".bv-cuerpo").innerHTML =
      "<h3>" + (v ? esc(v.nombre) : "Tu alojamiento") + "</h3>" + wifi +
      '<a class="btn btn-line" href="servicios.html#contacto">Contactar con tu alojamiento</a>';
  }

  document.addEventListener("DOMContentLoaded", function () { visibilidad(); marca(); bienvenida(); });
})();
