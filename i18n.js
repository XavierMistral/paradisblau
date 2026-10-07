/* Idiomas de Paradis Blau: traducción en el navegador por diccionario + selector de idioma.
   - El español es el original. En /ca/ y /en/ (y /letsholidays/ca|en/) la página lleva <html lang="ca|en"> y
     carga antes /i18n/<idioma>.js, que define window.PB_I18N = { x: {español: traducción}, p: [[regex, reemplazo]] }.
   - Cada texto, alt, title, aria-label y placeholder que aparezca en la página (también los que pinta otro script
     después) se sustituye si está en el diccionario. Lo que no esté se queda en español y se anota en window.PB_FALTAN.
   - Los nombres propios (negocios, calles, topónimos) no están en el diccionario: no se traducen. */
(function () {
  var html = document.documentElement, L = html.lang || "es";
  var m = /^((?:\/letsholidays)?)(?:\/(ca|en))?(\/.*)?$/.exec(location.pathname) || ["", "", "", "/"];
  var ESPACIO = m[1] || "", RESTO = m[3] || "/";
  var NOMBRES = { es: "Español", ca: "Català", en: "English" };

  var LEGAL = { es: ["aviso-legal.html", "privacidad.html", "cookies.html"], ca: ["avis-legal.html", "privacitat.html", "galetes.html"], en: ["legal-notice.html", "privacy-policy.html", "cookie-policy.html"] };
  var BASE = location.pathname.split("/").pop();
  function legal(l) { for (var i = 0; i < 3; i++) for (var k in LEGAL) if (LEGAL[k][i] === BASE) return "/" + LEGAL[l][i]; return null; }
  function url(l) {
    var lg = legal(l); if (lg) return lg; return ESPACIO + (l === "es" ? "" : "/" + l) + RESTO + location.search + location.hash; }
  function guardado() { try { return localStorage.getItem("pb_lang"); } catch (e) { return null; } }
  function guarda(l) { try { localStorage.setItem("pb_lang", l); } catch (e) {} }

  /* Quien ya eligió un idioma lo conserva al entrar por un enlace en español (por ejemplo, un QR). */
  if (L === "es" && !/[?&]nolang\b/.test(location.search)) {
    var g = guardado();
    if (g && g !== "es" && NOMBRES[g]) { location.replace(url(g)); return; }
  }

  var D = window.PB_I18N || { x: {}, p: [] };
  window.PB_FALTAN = window.PB_FALTAN || {};
  var V = {}; for (var kk in D.x) V[D.x[kk]] = 1;

  var SK = null;
  function subst(s) {
    if (!SK) SK = Object.keys(D.w || {}).sort(function (a, b) { return b.length - a.length; }).map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
    if (!SK.length) return s;
    return s.replace(new RegExp("(^|[^A-Za-zÀ-ÿ0-9])(" + SK.join("|") + ")(?![A-Za-zÀ-ÿ0-9])", "g"), function (m, p, k) { return p + D.w[k]; });
  }
  function pal(g) { return D.w && D.w[g] != null ? D.w[g] : (D.x[g] != null ? D.x[g] : g); }
  function tr(s) {
    var k = s.replace(/\s+/g, " ").trim();
    if (!k) return null;
    var v = D.x[k];
    if (v == null) for (var i = 0; i < D.p.length; i++) {
      var r = new RegExp(D.p[i][0]);
      if (r.test(k)) { var rep = D.p[i][1]; v = k.replace(r, function () { var a = arguments; return rep.replace(/\$([wts]?)(\d)/g, function (_, t, n) { var g = a[+n]; return t === "s" ? subst(g) : t === "w" ? pal(g) : t === "t" ? (D.x[g] != null ? D.x[g] : g) : g; }); }); V[v] = 1; break; }
    }
    if (v == null) { if (!V[k] && /[A-Za-zÀ-ÿ]{3}/.test(k)) window.PB_FALTAN[k] = 1; return null; }
    return /^\s*/.exec(s)[0] + v + /\s*$/.exec(s)[0];
  }
  var ATTR = ["alt", "title", "aria-label", "placeholder"];
  function nodo(n) {
    if (n.nodeType === 3) {
      var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.nodeName)) return;
      var v = tr(n.nodeValue); if (v != null && v !== n.nodeValue) n.nodeValue = v;
    } else if (n.nodeType === 1) {
      if (/^(SCRIPT|STYLE|NOSCRIPT|SVG)$/i.test(n.nodeName) || n.hasAttribute("data-nt")) return;
      for (var i = 0; i < ATTR.length; i++) if (n.hasAttribute(ATTR[i])) { var a = tr(n.getAttribute(ATTR[i])); if (a != null) n.setAttribute(ATTR[i], a); }
      for (var c = n.firstChild; c; c = c.nextSibling) nodo(c);
    }
  }
  if (L !== "es") {
    nodo(document);
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var r = ms[i];
        if (r.type === "childList") for (var j = 0; j < r.addedNodes.length; j++) nodo(r.addedNodes[j]);
        else if (r.type === "characterData") nodo(r.target);
        else if (r.type === "attributes") { var a = tr(r.target.getAttribute(r.attributeName)); if (a != null && a !== r.target.getAttribute(r.attributeName)) r.target.setAttribute(r.attributeName, a); }
      }
    }).observe(document, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  }

  /* Selector de idioma: bandera del idioma actual junto al menú; al pulsarla se despliegan los tres idiomas. */
  var n = 0;
  function bandera(l) {
    var id = "pbf" + (++n), W = 'width="26" height="18" viewBox="0 0 60 40" aria-hidden="true" focusable="false"';
    if (l === "es") return '<svg ' + W + '><rect width="60" height="40" fill="#c60b1e"/><rect y="10" width="60" height="20" fill="#ffc400"/></svg>';
    if (l === "ca") { var r = ""; for (var i = 0; i < 4; i++) r += '<rect y="' + ((2 * i + 1) * 40 / 9).toFixed(2) + '" width="60" height="' + (40 / 9).toFixed(2) + '" fill="#da121a"/>'; return '<svg ' + W + '><rect width="60" height="40" fill="#fcdd09"/>' + r + '</svg>'; }
    return '<svg ' + W + '><defs><clipPath id="' + id + 'a"><rect width="60" height="40"/></clipPath><clipPath id="' + id + 'b"><path d="M30 20h30v20zM30 20v20H0zM30 20H0V0zM30 20V0h30z"/></clipPath></defs><g clip-path="url(#' + id + 'a)"><rect width="60" height="40" fill="#012169"/><path d="M0 0l60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0l60 40M60 0L0 40" stroke="#c8102e" stroke-width="3.5" clip-path="url(#' + id + 'b)"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="13"/><path d="M30 0v40M0 20h60" stroke="#c8102e" stroke-width="7.5"/></g></svg>';
  }
  function selector() {
    var T = { es: "Idioma", ca: "Llengua", en: "Language" }[L];
    var d = document.createElement("div"); d.className = "pb-lang"; d.setAttribute("data-nt", "");
    var b = document.createElement("button"); b.type = "button"; b.className = "pb-lang-b"; b.setAttribute("aria-haspopup", "true"); b.setAttribute("aria-expanded", "false");
    b.setAttribute("aria-label", T + ": " + NOMBRES[L]); b.innerHTML = bandera(L) + "<span>" + L.toUpperCase() + "</span>";
    var ul = document.createElement("ul"); ul.className = "pb-lang-l"; ul.hidden = true;
    ["es", "ca", "en"].forEach(function (l) {
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = url(l); a.lang = l; a.innerHTML = bandera(l) + "<span>" + NOMBRES[l] + "</span>";
      if (l === L) a.setAttribute("aria-current", "true");
      a.addEventListener("click", function () { guarda(l); });
      li.appendChild(a); ul.appendChild(li);
    });
    function cierra() { ul.hidden = true; b.setAttribute("aria-expanded", "false"); }
    b.addEventListener("click", function (e) { e.stopPropagation(); var abre = ul.hidden; ul.hidden = !abre; b.setAttribute("aria-expanded", String(abre)); });
    document.addEventListener("click", function (e) { if (!d.contains(e.target)) cierra(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cierra(); });
    d.appendChild(b); d.appendChild(ul);
    return d;
  }
  document.addEventListener("DOMContentLoaded", function () {
    var h = document.querySelector(".top, .top-int"); if (!h) return;
    var ref = h.querySelector(".mn-btn") || h.querySelector(".volver");
    h.insertBefore(selector(), ref || null);
  });
})();
