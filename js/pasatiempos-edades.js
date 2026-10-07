/* Pasatiempos por edades: filtra los juegos y ajusta la dificultad de partida. Se carga después de pasatiempos.js. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var NOTAS = {
    t: "",
    p: "Para los más pequeños: parejas con fotos, la oca, puzzle de 3x3 y cuatro en raya fácil. Se juegan mirando, sin leer.",
    f: "Para jugar en familia: la oca, parejas, puzzle de 4x4, sopa de letras y sudoku fácil.",
    m: "Para mayores: sudoku, crucigrama, autodefinido y los niveles más difíciles de puzzle y cuatro en raya."
  };
  var AJUSTE = {
    p: { "pa-nivel": "6", "sl-n": "3", "c4-nivel": "facil" },
    f: { "pa-nivel": "8", "sl-n": "4", "c4-nivel": "medio", "su-nivel": "facil" },
    m: { "pa-nivel": "10", "sl-n": "5", "c4-nivel": "dificil", "su-nivel": "medio" }
  };
  function pon(id, v) {
    var el = $(id); if (!el || el.value === v) return;
    el.value = v; el.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function aplica(ed) {
    var btns = document.querySelectorAll(".pt-edad-b");
    Array.prototype.forEach.call(btns, function (b) {
      var on = b.getAttribute("data-edad") === ed;
      b.classList.toggle("active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    $("pt-edad-nota").textContent = NOTAS[ed];
    var tabs = document.querySelectorAll(".pt-tab"), primera = null, activaOculta = false;
    Array.prototype.forEach.call(tabs, function (t) {
      var ok = ed === "t" || (t.getAttribute("data-edad") || "").split(" ").indexOf(ed) >= 0;
      t.hidden = !ok;
      if (ok && !primera) primera = t;
      if (!ok && t.classList.contains("active")) activaOculta = true;
    });
    Array.prototype.forEach.call(document.querySelectorAll(".pt-grupo"), function (g) {
      var vis = g.querySelectorAll(".pt-tab:not([hidden])").length;
      g.hidden = vis === 0;
    });
    if (AJUSTE[ed]) Object.keys(AJUSTE[ed]).forEach(function (k) { pon(k, AJUSTE[ed][k]); });
    if (activaOculta && primera) primera.click();
  }
  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll(".pt-edad-b"), function (b) {
      b.addEventListener("click", function () { aplica(b.getAttribute("data-edad")); });
    });    var q = /[?&]edad=([pfm])/.exec(location.search);
    if (q) aplica(q[1]);
  });
})();
