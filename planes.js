/* Página de una sección de planes: planes.html?s=sol|lluvia|shopping|costa|girona|deportes */
(function () {
  var A = window.AGENDA;
  var ICO = {
    museo: '<path d="M3 9l9-5 9 5"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 20h18"/>',
    galeria: '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 16l4-4 3 3 3-4 6 6"/><circle cx="9" cy="9.5" r="1.3"/>',
    buceo: '<path d="M4 9h16v4a3 3 0 0 1-3 3h-2l-1-2h-4l-1 2H7a3 3 0 0 1-3-3z"/><path d="M20 9V4"/><circle cx="8" cy="12" r=".6"/><circle cx="16" cy="12" r=".6"/>',
    tren: '<rect x="5" y="4" width="14" height="12" rx="3"/><path d="M5 11h14"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/><path d="M8 20l2-4M16 20l-2-4"/>',
    deporte: '<path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12"/>',
    ciudad: '<path d="M3 21V10h5v11M8 21V5h6v16M14 21V12h7v9"/><path d="M3 21h18"/>',
    juego: '<path d="M10 4a2 2 0 1 1 4 0v2h4v4h-2a2 2 0 1 0 0 4h2v4h-4v-2a2 2 0 1 0-4 0v2H6v-4h2a2 2 0 1 0 0-4H6V6h4z"/>'
  };
  function tarjeta(e) {
    var media = e.img
      ? '<img src="' + e.img + '" alt="" loading="lazy" style="object-position:' + (e.pos || "50% 50%") + '">'
      : '<svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICO[e.ico] || "") + "</svg>";
    return '<li class="pl-card"><div class="pl-media' + (e.img ? "" : " pl-ico") + '">' + media + '</div><div class="pl-body"><b>' + e.t + "</b><span>" + e.n + "</span>" + (e.credito ? '<small class="pl-cred">Foto: ' + e.credito.a + ' · <a href="' + e.credito.u + '" target="_blank" rel="noopener">' + e.credito.l + "</a></small>" : "") +
      (e.u ? '<a class="hoy-mas" href="' + e.u + '"' + (e.interno ? "" : ' target="_blank" rel="noopener"') + ">" + (e.interno ? "Entrar" : "Más información") + "</a>" : "") + "</li>".replace("</li>", "</div></li>");
  }
  var q = /[?&]s=([a-z]+)/.exec(location.search), id = q ? q[1] : "sol";
  var S = A && A.secciones && A.secciones[id];
  if (!S) { document.getElementById("sec-cuerpo").innerHTML = '<p>No encontramos esa sección. <a href="index.html#planes">Volver a los planes</a>.</p>'; return; }
  document.title = S.t + " · Paradis Blau";
  document.getElementById("sec-t").textContent = S.t;
  document.getElementById("sec-i").textContent = S.intro;
  var html = "";
  S.listas.forEach(function (l) {
    var items = l.items || (A.planes[l.de] || []).filter(function (e) { return !e.interno; });
    if (l.titulo) html += '<h2 class="sec-tit">' + l.titulo + "</h2>";
    html += '<ul class="pl-car sec-grid" style="overflow:visible;padding:6px 0 0">' + items.map(tarjeta).join("") + "</ul>";
  });
  document.getElementById("sec-cuerpo").innerHTML = html;
})();
