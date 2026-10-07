/* Webcams en directo. El vídeo no se pide hasta que la persona pulsa «Ver en directo» (privacidad y datos del móvil). */
(function () {
  var CAMS = [
    { id: "platja-gran", f: "platja-gran", n: "Platja Gran", d: "La playa del pueblo, a los pies de la Vila Vella.", de: "Gran Hotel Reymar", u: "https://g0.ipcamlive.com/player/player.php?alias=645df166e8d91", mapa: "platja-gran", w: "https://www.hotelreymartossa.com/es/webcam-tossa-de-mar" },
    { id: "mar-menuda", f: "mar-menuda", n: "Platja de la Mar Menuda", d: "La cala al norte del pueblo.", de: "Gran Hotel Reymar", u: "https://g0.ipcamlive.com/player/player.php?alias=645df42b35714", mapa: "mar-menuda", w: "https://www.hotelreymartossa.com/es/webcam-tossa-de-mar" },
    { id: "turisme", f: "comun", n: "Webcam de Tossa Turisme", d: "La cámara que recomienda la Oficina de Turisme.", de: "Tossa Turisme · Vayawebcam", u: "https://www.youtube-nocookie.com/embed/nWFcWooDAxI?autoplay=1&mute=1", w: "https://visittossa.com/es/una-ventana-a-tossa/webcam/" }
  ];
  var $l = document.getElementById("wc-lista"); if (!$l) return;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var MAR = "https://embed.windy.com/embed2.html?lat=41.721&lon=2.939&detailLat=41.721&detailLon=2.939&width=650&height=450&zoom=11&level=surface&overlay=waves&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=true&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1";
  CAMS.push({ id: "mar", f: "comun", windy: true, n: "El mar hoy: olas y viento", d: "Altura de las olas, viento y su previsión para los próximos días en la costa de Tossa.", de: "Windy.com", u: MAR, w: "https://www.windy.com/?41.721,2.939,12,i:pressure,m:eOGagf2" });
  CAMS.forEach(function (c) {
    var a = el("article", "sv-card"); a.id = c.id;
    var v = el("div", "wc-video"); if (c.f) v.style.backgroundImage = "linear-gradient(rgba(16,48,58,.2),rgba(16,48,58,.4)),url(/assets/webcams/" + c.f + ".jpg)";
    var b = el("button", "wc-play", c.windy ? "Ver el mapa del mar" : "Ver en directo"); b.type = "button";
    b.addEventListener("click", function () {
      var f = document.createElement("iframe"); f.src = c.u; f.title = c.n + (c.windy ? "" : " en directo"); f.allow = "autoplay; fullscreen; picture-in-picture"; f.allowFullscreen = true; f.referrerPolicy = "strict-origin-when-cross-origin";
      v.innerHTML = ""; v.appendChild(f);
    });
    v.appendChild(b); a.appendChild(v);
    var body = el("div", "sv-body"); body.appendChild(el("h3", "", c.n)); body.appendChild(el("p", "", c.d));
    body.appendChild(el("p", "sv-nota", "Imagen: " + c.de));
    var act = el("div", "sv-act");
    if (c.mapa) { var m = el("a", "btn btn-line", "Ver en el mapa"); m.href = "index.html?p=" + c.mapa; act.appendChild(m); }
    var o = el("a", "btn btn-line", "Abrir en su web"); o.href = c.w; o.target = "_blank"; o.rel = "noopener"; act.appendChild(o);
    body.appendChild(act); a.appendChild(body); $l.appendChild(a);
  });
  /* ?v=id: solo esa cámara, con enlace para ver todas */
  var q = (location.search.match(/[?&]v=([\w-]+)/) || [])[1];
  if (q && document.getElementById(q)) {
    [].forEach.call($l.children, function (x) { if (x.id !== q) x.hidden = true; });
    $l.classList.add("wc-una");
    var t = document.querySelector(".hoy-head h1"); if (t) t.textContent = document.querySelector("#" + q + " h3").textContent;
    var p = document.createElement("p"); p.className = "sv-nota"; var m = el("a", "btn btn-line", "Ver todas las cámaras"); m.href = "webcams.html"; p.appendChild(m); $l.parentNode.insertBefore(p, $l.nextSibling);
  }
})();
