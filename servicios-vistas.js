/* Servicios: ?v=<vista> muestra solo lo que se ha pedido desde «Lo importante, a mano» (con un enlace para ver todo). */
(function () {
  var v = (/[?&]v=([a-z]+)/.exec(location.search) || [])[1]; if (!v) return;
  var VISTAS = {
    emergencias: { ver: ["sv-urg", "seguridad"] },
    policia: { ver: ["sv-urg", "seguridad"], solo: "policia" },
    cap: { ver: ["sv-urg", "seguridad", "salud"], solo: "cap" },
    bomberos: { ver: ["sv-urg", "seguridad"], solo: "bomberos" },
    farmacias: { ver: ["farmacias"] },
    turismo: { ver: ["info", "pueblo"] },
    wifi: { ver: ["wifi"] },
    contacto: { ver: ["contacto"] }
  };
  var c = VISTAS[v]; if (!c) return;
  var main = document.querySelector("main.sv");
  Array.prototype.forEach.call(main.children, function (e) {
    var id = e.id || (e.classList.contains("sv-urg") ? "sv-urg" : "");
    if (!id) return;
    if (c.ver.indexOf(id) < 0) e.hidden = true;
  });
  if (c.solo) Array.prototype.forEach.call(document.querySelectorAll("#seguridad [data-c]"), function (a) { a.hidden = a.getAttribute("data-c") !== c.solo; });
  var t = document.getElementById("sv-todo"); if (t) t.hidden = false;
  var s = document.getElementById(c.ver[c.ver.length > 1 && c.ver[0] === "sv-urg" ? 1 : 0]); if (s && s.scrollIntoView) s.scrollIntoView({ block: "start" });
})();
