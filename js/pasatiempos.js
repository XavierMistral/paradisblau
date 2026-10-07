/* Pasatiempos · Paradis Blau. Sin dependencias externas. */
(function () {
  'use strict';

  var D = window.PASATIEMPOS;

  function $(id) { return document.getElementById(id); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function setMsg(el, text, cls) {
    el.textContent = text || '';
    el.className = 'pt-msg' + (cls ? ' ' + cls : '');
  }

  /* ---------------- Pestañas ---------------- */
  var tabs = document.querySelectorAll('.pt-tab');
  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener('click', function () {
      Array.prototype.forEach.call(tabs, function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      Array.prototype.forEach.call(document.querySelectorAll('.pt-panel'), function (p) {
        p.classList.remove('active');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      $(tab.getAttribute('data-target')).classList.add('active');
    });
  });

  /* ---------------- Sudoku ---------------- */
  var Su = (function () {
    var solution = [], puzzle = [], cells = [];

    function masks() { return { r: new Array(9).fill(0), c: new Array(9).fill(0), b: new Array(9).fill(0) }; }

    // Cuenta soluciones (hasta limit). Si fill es true y hay solución la deja en g.
    function solve(g, limit, randomOrder) {
      var m = masks(), i;
      for (i = 0; i < 81; i++) {
        if (g[i]) {
          var bit = 1 << (g[i] - 1), r = (i / 9) | 0, c = i % 9, b = ((r / 3) | 0) * 3 + ((c / 3) | 0);
          m.r[r] |= bit; m.c[c] |= bit; m.b[b] |= bit;
        }
      }
      var count = 0, first = null;
      function rec() {
        var best = -1, bestMask = 0, bestN = 10;
        for (var k = 0; k < 81; k++) {
          if (g[k]) continue;
          var r = (k / 9) | 0, c = k % 9, b = ((r / 3) | 0) * 3 + ((c / 3) | 0);
          var free = (~(m.r[r] | m.c[c] | m.b[b])) & 511, n = 0, f = free;
          while (f) { f &= f - 1; n++; }
          if (n < bestN) { bestN = n; best = k; bestMask = free; if (n <= 1) break; }
        }
        if (best === -1) {
          count++;
          if (!first) first = g.slice();
          return count >= limit;
        }
        if (bestN === 0) return false;
        var opts = [];
        for (var d = 0; d < 9; d++) if (bestMask & (1 << d)) opts.push(d);
        if (randomOrder) shuffle(opts);
        var r2 = (best / 9) | 0, c2 = best % 9, b2 = ((r2 / 3) | 0) * 3 + ((c2 / 3) | 0);
        for (var o = 0; o < opts.length; o++) {
          var bit2 = 1 << opts[o];
          g[best] = opts[o] + 1;
          m.r[r2] |= bit2; m.c[c2] |= bit2; m.b[b2] |= bit2;
          var stop = rec();
          m.r[r2] &= ~bit2; m.c[c2] &= ~bit2; m.b[b2] &= ~bit2;
          g[best] = 0;
          if (stop) return true;
        }
        return false;
      }
      rec();
      return { count: count, first: first };
    }

    function generate(level) {
      var target = { facil: 40, medio: 33, dificil: 27 }[level] || 33;
      var full = new Array(81).fill(0);
      full = solve(full, 1, true).first;
      var p = full.slice();
      var order = shuffle(Array.apply(null, { length: 81 }).map(function (_, i) { return i; }));
      var clues = 81;
      for (var k = 0; k < order.length && clues > target; k++) {
        var idx = order[k], keep = p[idx];
        p[idx] = 0;
        if (solve(p.slice(), 2, false).count !== 1) p[idx] = keep; else clues--;
      }
      return { solution: full, puzzle: p };
    }

    function build() {
      var grid = $('su-grid');
      grid.innerHTML = '';
      cells = [];
      for (var i = 0; i < 81; i++) {
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.inputMode = 'numeric';
        inp.maxLength = 1;
        inp.autocomplete = 'off';
        inp.className = 'su-cell';
        var r = (i / 9) | 0, c = i % 9;
        if (c === 2 || c === 5) inp.classList.add('bd');
        if (r === 2 || r === 5) inp.classList.add('bb');
        inp.setAttribute('aria-label', 'Fila ' + (r + 1) + ', columna ' + (c + 1));
        (function (idx, el) {
          el.addEventListener('input', function () {
            var v = el.value.replace(/[^1-9]/g, '');
            el.value = v ? v.slice(-1) : '';
            el.classList.remove('mal');
          });
          el.addEventListener('keydown', function (e) {
            var r0 = (idx / 9) | 0, c0 = idx % 9, nr = r0, nc = c0;
            if (e.key === 'ArrowUp') nr--; else if (e.key === 'ArrowDown') nr++;
            else if (e.key === 'ArrowLeft') nc--; else if (e.key === 'ArrowRight') nc++;
            else return;
            if (nr < 0 || nr > 8 || nc < 0 || nc > 8) return;
            e.preventDefault();
            cells[nr * 9 + nc].focus();
          });
        })(i, inp);
        cells.push(inp);
        grid.appendChild(inp);
      }
    }

    function load() {
      setMsg($('su-msg'), 'Preparando el sudoku…');
      // pequeño retardo para que se pinte el mensaje antes del cálculo
      setTimeout(function () {
        var g = generate($('su-nivel').value);
        solution = g.solution; puzzle = g.puzzle;
        for (var i = 0; i < 81; i++) {
          cells[i].classList.remove('mal', 'fijo');
          if (puzzle[i]) { cells[i].value = puzzle[i]; cells[i].readOnly = true; cells[i].classList.add('fijo'); }
          else { cells[i].value = ''; cells[i].readOnly = false; }
        }
        setMsg($('su-msg'), '');
      }, 20);
    }

    function check() {
      var wrong = 0, empty = 0;
      for (var i = 0; i < 81; i++) {
        if (puzzle[i]) continue;
        var v = cells[i].value;
        cells[i].classList.remove('mal');
        if (!v) { empty++; continue; }
        if (Number(v) !== solution[i]) { wrong++; cells[i].classList.add('mal'); }
      }
      if (!wrong && !empty) setMsg($('su-msg'), 'Completado. Sudoku resuelto.', 'ok');
      else if (wrong) setMsg($('su-msg'), 'Hay ' + wrong + (wrong === 1 ? ' número mal colocado' : ' números mal colocados') + ' (en rojo).' + (empty ? ' Faltan ' + empty + ' casillas.' : ''), 'err');
      else setMsg($('su-msg'), 'Todo lo escrito es correcto. Faltan ' + empty + ' casillas.');
    }

    function reveal() {
      for (var i = 0; i < 81; i++) { cells[i].value = solution[i]; cells[i].classList.remove('mal'); }
      setMsg($('su-msg'), 'Solución mostrada.');
    }

    build();
    $('su-nuevo').addEventListener('click', load);
    $('su-nivel').addEventListener('change', load);
    $('su-comprobar').addEventListener('click', check);
    $('su-solucion').addEventListener('click', reveal);
    load();
  })();

  /* ---------------- Sopa de letras ---------------- */
  var So = (function () {
    var N = 12, DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
    var letters = [], placed = [], cells = [], start = null, dragging = false;

    function makePuzzle() {
      var pool = shuffle(D.sopa.filter(function (w) { return w.length <= N - 2; }));
      var g = [], i, j;
      for (i = 0; i < N * N; i++) g.push('');
      var out = [];
      for (var p = 0; p < pool.length && out.length < 10; p++) {
        var w = pool[p], ok = false;
        for (var t = 0; t < 250 && !ok; t++) {
          var d = DIRS[rnd(DIRS.length)], r = rnd(N), c = rnd(N);
          var er = r + d[0] * (w.length - 1), ec = c + d[1] * (w.length - 1);
          if (er < 0 || er >= N || ec < 0 || ec >= N) continue;
          var fits = true;
          for (i = 0; i < w.length; i++) {
            var ch = g[(r + d[0] * i) * N + c + d[1] * i];
            if (ch && ch !== w[i]) { fits = false; break; }
          }
          if (!fits) continue;
          var idxs = [];
          for (i = 0; i < w.length; i++) {
            var k = (r + d[0] * i) * N + c + d[1] * i;
            g[k] = w[i]; idxs.push(k);
          }
          out.push({ word: w, idxs: idxs, found: false });
          ok = true;
        }
      }
      var abc = 'ABCDEFGHIJKLMNOPRSTUVY';
      for (j = 0; j < N * N; j++) if (!g[j]) g[j] = abc[rnd(abc.length)];
      return { g: g, words: out };
    }

    function clearSel() {
      if (start !== null) cells[start].classList.remove('ini');
      start = null; dragging = false;
    }

    function line(a, b) {
      var ar = (a / N) | 0, ac = a % N, br = (b / N) | 0, bc = b % N;
      var dr = br - ar, dc = bc - ac;
      if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return null;
      var n = Math.max(Math.abs(dr), Math.abs(dc)), sr = Math.sign(dr), sc = Math.sign(dc), res = [];
      for (var i = 0; i <= n; i++) res.push((ar + sr * i) * N + ac + sc * i);
      return res;
    }

    function finish(a, b) {
      var idxs = line(a, b);
      clearSel();
      if (!idxs || idxs.length < 2) { setMsg($('so-msg'), ''); return; }
      var s = idxs.map(function (i) { return letters[i]; }).join(), rs = idxs.slice().reverse().map(function (i) { return letters[i]; }).join('');
      s = s.replace(/,/g, ''); rs = rs.replace(/,/g, '');
      for (var k = 0; k < placed.length; k++) {
        var p = placed[k];
        if (!p.found && (p.word === s || p.word === rs)) {
          p.found = true;
          p.idxs.forEach(function (i) { cells[i].classList.remove('pista'); cells[i].classList.add('hallada'); });
          paintList();
          var left = placed.filter(function (x) { return !x.found; }).length;
          if (!left) setMsg($('so-msg'), 'Has encontrado todas las palabras.', 'ok');
          else setMsg($('so-msg'), 'Muy bien: ' + p.word + '. Quedan ' + left + '.');
          return;
        }
      }
      setMsg($('so-msg'), 'Esa selección no coincide con ninguna palabra de la lista.', 'err');
    }

    function paintList() {
      var ul = $('so-lista');
      ul.innerHTML = '';
      placed.slice().sort(function (a, b) { return a.word < b.word ? -1 : 1; }).forEach(function (p) {
        var li = document.createElement('li');
        li.textContent = p.word;
        if (p.found) li.className = 'hecho';
        ul.appendChild(li);
      });
    }

    function cellFrom(e) {
      var el = document.elementFromPoint(e.clientX, e.clientY);
      return el && el.classList && el.classList.contains('so-cell') ? Number(el.getAttribute('data-i')) : null;
    }

    function build() {
      var pz = makePuzzle();
      letters = pz.g; placed = pz.words;
      var grid = $('so-grid');
      grid.innerHTML = '';
      grid.style.gridTemplateColumns = 'repeat(' + N + ', 1fr)';
      cells = [];
      letters.forEach(function (ch, i) {
        var d = document.createElement('div');
        d.className = 'so-cell';
        d.textContent = ch;
        d.setAttribute('data-i', i);
        cells.push(d);
        grid.appendChild(d);
      });
      start = null; dragging = false;
      paintList();
      setMsg($('so-msg'), '');
    }

    document.addEventListener('DOMContentLoaded', function () {});
    $('so-grid').addEventListener('pointerdown', function (e) {
      var i = cellFrom(e);
      if (i === null) return;
      e.preventDefault();
      if (start === null) {
        start = i; dragging = true; cells[i].classList.add('ini');
      } else if (start === i) {
        clearSel();
      } else {
        finish(start, i);
      }
    });
    document.addEventListener('pointerup', function (e) {
      if (!dragging || start === null) return;
      dragging = false;
      var i = cellFrom(e);
      if (i !== null && i !== start) finish(start, i);
    });
    $('so-nueva').addEventListener('click', build);
    $('so-solucion').addEventListener('click', function () {
      placed.forEach(function (p) {
        if (!p.found) p.idxs.forEach(function (i) { cells[i].classList.add('pista'); });
      });
      setMsg($('so-msg'), 'Palabras marcadas en amarillo.');
    });
    build();
  })();

  /* ---------------- Crucigrama y autodefinido ---------------- */
  function Cross(cfg) {
    var data = cfg.data, gridEl = $(cfg.grid), msgEl = $(cfg.msg);
    var h = data.h, w = data.w;
    var cellEl = {}, inputEl = {}, dir = 'A', cur = null;
    var wordAt = {};       // "r,c" -> {A: wordIndex, D: wordIndex}
    var words = data.words.map(function (wd, i) {
      var cs = [];
      for (var k = 0; k < wd.w.length; k++) cs.push(wd.d === 'A' ? [wd.r, wd.c + k] : [wd.r + k, wd.c]);
      cs.forEach(function (rc) {
        var key = rc[0] + ',' + rc[1];
        (wordAt[key] = wordAt[key] || {})[wd.d] = i;
      });
      return { w: wd.w, d: wd.d, cells: cs };
    });

    var clueByCell = {};
    (data.clues || []).forEach(function (cl) { clueByCell[cl.r + ',' + cl.c] = cl.items; });

    gridEl.style.gridTemplateColumns = 'repeat(' + w + ', auto)';
    for (var r = 0; r < h; r++) {
      for (var c = 0; c < w; c++) {
        var key = r + ',' + c, ch = data.cells[r][c];
        var div = document.createElement('div');
        div.className = 'gx-cell';
        if (ch === '.') {
          if (clueByCell[key]) {
            div.classList.add('pista');
            clueByCell[key].forEach(function (it) {
              var p = document.createElement('div');
              p.className = 'gx-pista';
              p.textContent = it.t + (it.d === 'A' ? ' →' : ' ↓');
              div.appendChild(p);
            });
          } else {
            div.classList.add('vacia');
          }
        } else {
          var inp = document.createElement('input');
          inp.type = 'text';
          inp.maxLength = 1;
          inp.autocomplete = 'off';
          inp.autocapitalize = 'characters';
          inp.setAttribute('aria-label', 'Fila ' + (r + 1) + ', columna ' + (c + 1));
          inp.setAttribute('data-k', key);
          inputEl[key] = inp;
          div.appendChild(inp);
          if (data.nums && data.nums[key]) {
            var n = document.createElement('span');
            n.className = 'gx-num';
            n.textContent = data.nums[key];
            div.appendChild(n);
          }
          hook(inp, r, c);
        }
        cellEl[key] = div;
        gridEl.appendChild(div);
      }
    }
    gridEl.classList.add('grid-x');

    if (cfg.across) {
      fillList($(cfg.across), data.across);
      fillList($(cfg.down), data.down);
    }

    function fillList(ol, items) {
      items.forEach(function (it) {
        var li = document.createElement('li');
        li.value = it.n;
        li.setAttribute('data-n', it.n);
        li.innerHTML = '';
        li.appendChild(document.createTextNode(it.clue + ' '));
        var s = document.createElement('span');
        s.className = 'cr-len';
        s.textContent = '(' + it.len + ')';
        li.appendChild(s);
        ol.appendChild(li);
      });
    }

    function activeWord(r, c) {
      var wa = wordAt[r + ',' + c];
      if (!wa) return null;
      if (wa[dir] === undefined) dir = wa.A !== undefined ? 'A' : 'D';
      return words[wa[dir]];
    }

    function refresh() {
      Object.keys(cellEl).forEach(function (k) { cellEl[k].classList.remove('resalt', 'foco'); });
      if (cfg.across) {
        Array.prototype.forEach.call(gridEl.parentNode.parentNode.querySelectorAll('.cr-list li'), function (li) { li.classList.remove('activa'); });
      }
      if (!cur) return;
      var wd = activeWord(cur[0], cur[1]);
      if (!wd) return;
      wd.cells.forEach(function (rc) { cellEl[rc[0] + ',' + rc[1]].classList.add('resalt'); });
      cellEl[cur[0] + ',' + cur[1]].classList.add('foco');
      if (cfg.across) {
        var f = wd.cells[0], num = data.nums[f[0] + ',' + f[1]];
        var list = $(wd.d === 'A' ? cfg.across : cfg.down);
        var li = list.querySelector('li[data-n="' + num + '"]');
        if (li) li.classList.add('activa');
      }
    }

    function move(r, c, dr, dc) {
      var nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < h && nc >= 0 && nc < w) {
        var k = nr + ',' + nc;
        if (inputEl[k]) { inputEl[k].focus(); return; }
        nr += dr; nc += dc;
      }
    }

    function hook(inp, r, c) {
      inp.addEventListener('focus', function () {
        cur = [r, c];
        var wa = wordAt[r + ',' + c];
        if (wa && wa[dir] === undefined) dir = wa.A !== undefined ? 'A' : 'D';
        refresh();
        inp.select();
      });
      inp.addEventListener('mousedown', function () {
        if (document.activeElement === inp) {
          var wa = wordAt[r + ',' + c];
          if (wa && wa.A !== undefined && wa.D !== undefined) { dir = dir === 'A' ? 'D' : 'A'; refresh(); }
        }
      });
      inp.addEventListener('input', function () {
        var v = inp.value.replace(/[^A-Za-z]/g, '').toUpperCase();
        inp.value = v ? v.slice(-1) : '';
        cellEl[r + ',' + c].classList.remove('mal', 'bien');
        if (inp.value) {
          var wa = wordAt[r + ',' + c];
          if (wa && wa[dir] === undefined) dir = wa.A !== undefined ? 'A' : 'D';
          if (dir === 'A') move(r, c, 0, 1); else move(r, c, 1, 0);
        }
      });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); move(r, c, 0, 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); move(r, c, 0, -1); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); move(r, c, 1, 0); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(r, c, -1, 0); }
        else if (e.key === 'Backspace' && !inp.value) {
          e.preventDefault();
          if (dir === 'A') move(r, c, 0, -1); else move(r, c, -1, 0);
        }
      });
    }

    function each(fn) {
      Object.keys(inputEl).forEach(function (k) {
        var rc = k.split(',');
        fn(inputEl[k], cellEl[k], data.cells[Number(rc[0])][Number(rc[1])]);
      });
    }

    return {
      check: function () {
        var wrong = 0, empty = 0;
        each(function (inp, div, sol) {
          div.classList.remove('mal', 'bien');
          if (!inp.value) { empty++; return; }
          if (inp.value.toUpperCase() !== sol) { wrong++; div.classList.add('mal'); }
        });
        if (!wrong && !empty) setMsg(msgEl, 'Completado. Todas las respuestas son correctas.', 'ok');
        else if (wrong) setMsg(msgEl, 'Hay ' + wrong + (wrong === 1 ? ' letra' : ' letras') + ' mal (en rojo).' + (empty ? ' Faltan ' + empty + ' casillas.' : ''), 'err');
        else setMsg(msgEl, 'Todo lo escrito es correcto. Faltan ' + empty + ' casillas.');
      },
      reveal: function () {
        each(function (inp, div, sol) { inp.value = sol; div.classList.remove('mal', 'bien'); });
        setMsg(msgEl, 'Solución mostrada.');
      },
      reset: function () {
        each(function (inp, div) { inp.value = ''; div.classList.remove('mal', 'bien'); });
        setMsg(msgEl, '');
      }
    };
  }

  var Cr = Cross({ data: D.cross, grid: 'cr-grid', msg: 'cr-msg', across: 'cr-across', down: 'cr-down' });
  $('cr-comprobar').addEventListener('click', Cr.check);
  $('cr-solucion').addEventListener('click', Cr.reveal);
  $('cr-reiniciar').addEventListener('click', Cr.reset);

  var Au = Cross({ data: D.auto, grid: 'au-grid', msg: 'au-msg' });
  $('au-comprobar').addEventListener('click', Au.check);
  $('au-solucion').addEventListener('click', Au.reveal);
  $('au-reiniciar').addEventListener('click', Au.reset);

  /* ---------------- Parejas ---------------- */
  (function () {
    var grid = $('pa-grid'), first = null, lock = false, intentos = 0, halladas = 0, total = 0;

    function nueva() {
      var n = Number($('pa-nivel').value);
      var elegidas = shuffle(D.parejas.slice()).slice(0, n);
      var cartas = shuffle(elegidas.concat(elegidas));
      total = n; halladas = 0; intentos = 0; first = null; lock = false;
      grid.innerHTML = '';
      grid.style.setProperty('--cols', n === 10 ? 5 : 4);
      cartas.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'pa-card';
        b.setAttribute('aria-label', 'Carta boca abajo');
        b.innerHTML = '<span class="pa-in"><span class="pa-back"></span><span class="pa-front"><img src="/assets/juegos/' + c.f + '.jpg" alt="' + c.t + '" loading="lazy"></span></span>';
        b.addEventListener('click', function () { voltear(b, c); });
        grid.appendChild(b);
      });
      setMsg($('pa-msg'), 'Intentos: 0');
    }

    function voltear(b, c) {
      if (lock || b.classList.contains('volteada') || b.classList.contains('pareja')) return;
      b.classList.add('volteada');
      b.setAttribute('aria-label', c.t);
      if (!first) { first = { b: b, c: c }; return; }
      intentos++;
      var a = first; first = null;
      if (a.c.f === c.f) {
        [a.b, b].forEach(function (x) { x.classList.remove('volteada'); x.classList.add('pareja'); x.disabled = true; });
        halladas++;
        if (halladas === total) setMsg($('pa-msg'), 'Completado en ' + intentos + (intentos === 1 ? ' intento.' : ' intentos.'), 'ok');
        else setMsg($('pa-msg'), 'Intentos: ' + intentos + ' · Parejas: ' + halladas + ' de ' + total);
      } else {
        lock = true;
        setMsg($('pa-msg'), 'Intentos: ' + intentos + ' · Parejas: ' + halladas + ' de ' + total);
        setTimeout(function () {
          [a.b, b].forEach(function (x) { x.classList.remove('volteada'); x.setAttribute('aria-label', 'Carta boca abajo'); });
          lock = false;
        }, 1000);
      }
    }

    $('pa-nuevo').addEventListener('click', nueva);
    $('pa-nivel').addEventListener('change', nueva);
    nueva();
  })();

  /* ---------------- Cuatro en raya ---------------- */
  (function () {
    var R = 6, C = 7, board, turn, over, thinking = false, cols = [];

    function idx(r, c) { return r * C + c; }
    function fresh() { var b = []; for (var i = 0; i < R * C; i++) b.push(0); return b; }
    function dropRow(b, c) { for (var r = R - 1; r >= 0; r--) if (!b[idx(r, c)]) return r; return -1; }

    function lineWin(b, p) {
      var dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) {
        if (b[idx(r, c)] !== p) continue;
        for (var d = 0; d < 4; d++) {
          var cells = [[r, c]], ok = true;
          for (var k = 1; k < 4; k++) {
            var rr = r + dirs[d][0] * k, cc = c + dirs[d][1] * k;
            if (rr < 0 || rr >= R || cc < 0 || cc >= C || b[idx(rr, cc)] !== p) { ok = false; break; }
            cells.push([rr, cc]);
          }
          if (ok) return cells;
        }
      }
      return null;
    }

    function full(b) { for (var c = 0; c < C; c++) if (dropRow(b, c) >= 0) return false; return true; }

    // Heurística: ventanas de 4 casillas y preferencia por el centro
    function evalBoard(b, me) {
      var opp = 3 - me, s = 0, r, c, k, d;
      for (r = 0; r < R; r++) { if (b[idx(r, 3)] === me) s += 3; else if (b[idx(r, 3)] === opp) s -= 3; }
      var dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (r = 0; r < R; r++) for (c = 0; c < C; c++) for (d = 0; d < 4; d++) {
        var m = 0, o = 0, ok = true;
        for (k = 0; k < 4; k++) {
          var rr = r + dirs[d][0] * k, cc = c + dirs[d][1] * k;
          if (rr < 0 || rr >= R || cc < 0 || cc >= C) { ok = false; break; }
          var v = b[idx(rr, cc)];
          if (v === me) m++; else if (v === opp) o++;
        }
        if (!ok || (m && o)) continue;
        if (m === 3) s += 50; else if (m === 2) s += 10; else if (o === 3) s -= 60; else if (o === 2) s -= 10;
      }
      return s;
    }

    var ORDER = [3, 2, 4, 1, 5, 0, 6];
    function minimax(b, depth, alpha, beta, maxi, me) {
      var opp = 3 - me;
      if (lineWin(b, me)) return 100000 + depth;
      if (lineWin(b, opp)) return -100000 - depth;
      if (depth === 0 || full(b)) return evalBoard(b, me);
      var best = maxi ? -Infinity : Infinity;
      for (var i = 0; i < ORDER.length; i++) {
        var c = ORDER[i], r = dropRow(b, c);
        if (r < 0) continue;
        b[idx(r, c)] = maxi ? me : opp;
        var v = minimax(b, depth - 1, alpha, beta, !maxi, me);
        b[idx(r, c)] = 0;
        if (maxi) { if (v > best) best = v; if (v > alpha) alpha = v; }
        else { if (v < best) best = v; if (v < beta) beta = v; }
        if (alpha >= beta) break;
      }
      return best;
    }

    function pick(nivel) {
      var me = 2, libres = ORDER.filter(function (c) { return dropRow(board, c) >= 0; });
      if (nivel === 'facil' && Math.random() < 0.45) return libres[rnd(libres.length)];
      var depth = nivel === 'facil' ? 2 : nivel === 'medio' ? 4 : 6;
      var best = null, bestV = -Infinity;
      libres.forEach(function (c) {
        var r = dropRow(board, c), b = board.slice();
        b[idx(r, c)] = me;
        var v = minimax(b, depth - 1, -Infinity, Infinity, false, me) + Math.random() * 0.5;
        if (v > bestV) { bestV = v; best = c; }
      });
      return best;
    }

    function paint(win) {
      cols.forEach(function (col, c) {
        var hs = col.children;
        for (var r = 0; r < R; r++) {
          var h = hs[r], v = board[idx(r, c)];
          h.className = 'c4-hueco' + (v ? ' j' + v : '');
        }
        col.disabled = over || dropRow(board, c) < 0 || thinking;
      });
      if (win) win.forEach(function (rc) { cols[rc[1]].children[rc[0]].classList.add('gana'); });
    }

    function say() {
      var ia = $('c4-modo').value === 'ia', m = $('c4-msg');
      if (over) return;
      if (ia) setMsg(m, thinking ? 'Pensando…' : 'Tu turno. Fichas amarillas.');
      else setMsg(m, turn === 1 ? 'Turno del jugador 1 (fichas amarillas).' : 'Turno del jugador 2 (fichas rojas con aro).');
    }

    function endCheck() {
      var ia = $('c4-modo').value === 'ia', m = $('c4-msg');
      var w = lineWin(board, turn);
      if (w) {
        over = true; paint(w);
        if (ia) setMsg(m, turn === 1 ? 'Has ganado.' : 'Gana el móvil. Prueba otra vez.', turn === 1 ? 'ok' : '');
        else setMsg(m, 'Gana el jugador ' + turn + '.', 'ok');
        return true;
      }
      if (full(board)) { over = true; paint(); setMsg(m, 'Empate.'); return true; }
      return false;
    }

    function play(c) {
      if (over || thinking) return;
      var r = dropRow(board, c);
      if (r < 0) return;
      board[idx(r, c)] = turn;
      paint();
      if (endCheck()) return;
      turn = 3 - turn;
      var ia = $('c4-modo').value === 'ia';
      if (ia && turn === 2) {
        thinking = true; paint(); say();
        setTimeout(function () {
          var mv = pick($('c4-nivel').value);
          thinking = false;
          var rr = dropRow(board, mv);
          board[idx(rr, mv)] = 2;
          paint();
          if (endCheck()) return;
          turn = 1; paint(); say();
        }, 450);
      } else { paint(); say(); }
    }

    function build() {
      var g = $('c4-grid');
      g.innerHTML = '';
      cols = [];
      for (var c = 0; c < C; c++) {
        var col = document.createElement('button');
        col.type = 'button';
        col.className = 'c4-col';
        col.setAttribute('aria-label', 'Columna ' + (c + 1));
        for (var r = 0; r < R; r++) { var h = document.createElement('div'); h.className = 'c4-hueco'; col.appendChild(h); }
        (function (cc) { col.addEventListener('click', function () { play(cc); }); })(c);
        cols.push(col);
        g.appendChild(col);
      }
    }

    function nueva() {
      var ia = $('c4-modo').value === 'ia';
      $('c4-nivel').style.display = ia ? '' : 'none';
      $('c4-nivel-l').style.display = ia ? '' : 'none';
      board = fresh(); turn = 1; over = false; thinking = false;
      paint(); say();
    }

    build();
    $('c4-nuevo').addEventListener('click', nueva);
    $('c4-modo').addEventListener('change', nueva);
    $('c4-nivel').addEventListener('change', nueva);
    nueva();
  })();

  /* ---------------- Puzzle deslizante ---------------- */
  (function () {
    var n, board, empty, moves, done, piezas = [];
    var tab = $('sl-tablero'), selFoto = $('sl-foto'), selN = $('sl-n');

    D.puzzle.forEach(function (p, i) {
      var o = document.createElement('option');
      o.value = i;
      o.textContent = p.t;
      selFoto.appendChild(o);
    });

    function src() { return '/assets/juegos/puzzle/' + D.puzzle[Number(selFoto.value)].f + '.jpg'; }

    // board[pos] = número de pieza (0..n*n-1); la pieza n*n-1 es el hueco
    function solved() {
      for (var i = 0; i < n * n; i++) if (board[i] !== i) return false;
      return true;
    }

    function barajar() {
      var total = n * n, last = -1;
      board = []; for (var i = 0; i < total; i++) board.push(i);
      empty = total - 1;
      var pasos = n === 3 ? 120 : n === 4 ? 260 : 420;
      // movimientos legales desde la posición resuelta: siempre tiene solución
      for (var k = 0; k < pasos; k++) {
        var r = (empty / n) | 0, c = empty % n, vecinos = [];
        if (r > 0) vecinos.push(empty - n);
        if (r < n - 1) vecinos.push(empty + n);
        if (c > 0) vecinos.push(empty - 1);
        if (c < n - 1) vecinos.push(empty + 1);
        vecinos = vecinos.filter(function (v) { return v !== last; });
        var v = vecinos[rnd(vecinos.length)];
        board[empty] = board[v]; board[v] = total - 1;
        last = empty; empty = v;
      }
      if (solved()) return barajar();
    }

    function colocar() {
      piezas.forEach(function (el, num) {
        var pos = board.indexOf(num);
        el.style.transform = 'translate(' + (pos % n) * 100 + '%,' + ((pos / n) | 0) * 100 + '%)';
        el.tabIndex = 0;
      });
    }

    function nueva() {
      n = Number(selN.value);
      barajar();
      moves = 0; done = false;
      tab.innerHTML = '';
      piezas = [];
      var img = src();
      $('sl-ref').src = img;
      for (var num = 0; num < n * n; num++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'sl-pieza';
        b.style.width = 100 / n + '%';
        b.style.height = 100 / n + '%';
        b.style.backgroundImage = 'url("' + img + '")';
        b.style.backgroundSize = n * 100 + '% ' + n * 100 + '%';
        var hr = (num / n) | 0, hc = num % n;
        b.style.backgroundPosition = (n > 1 ? hc / (n - 1) * 100 : 0) + '% ' + (n > 1 ? hr / (n - 1) * 100 : 0) + '%';
        b.setAttribute('aria-label', 'Pieza ' + (num + 1));
        var s = document.createElement('span');
        s.className = 'sl-num';
        s.textContent = num + 1;
        b.appendChild(s);
        if (num === n * n - 1) { b.style.visibility = 'hidden'; b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); }
        (function (nm, el) { el.addEventListener('click', function () { pulsar(nm); }); })(num, b);
        tab.appendChild(b);
        piezas.push(b);
      }
      colocar();
      setMsg($('sl-msg'), 'Movimientos: 0');
    }

    function pulsar(num) {
      if (done || num === n * n - 1) return;
      var pos = board.indexOf(num), pr = (pos / n) | 0, pc = pos % n, er = (empty / n) | 0, ec = empty % n;
      if (pr !== er && pc !== ec) return;
      // desliza todas las piezas entre la pulsada y el hueco
      var paso = pr === er ? (pc < ec ? 1 : -1) : (pr < er ? n : -n);
      var cur = empty;
      while (cur !== pos) { board[cur] = board[cur - paso]; cur -= paso; }
      board[pos] = n * n - 1;
      empty = pos;
      moves++;
      colocar();
      if (solved()) {
        done = true;
        piezas[n * n - 1].style.visibility = 'visible';
        setMsg($('sl-msg'), 'Completado en ' + moves + (moves === 1 ? ' movimiento.' : ' movimientos.'), 'ok');
      } else setMsg($('sl-msg'), 'Movimientos: ' + moves);
    }

    $('sl-barajar').addEventListener('click', nueva);
    selFoto.addEventListener('change', nueva);
    selN.addEventListener('change', nueva);
    $('sl-nums').addEventListener('change', function () { tab.classList.toggle('sl-oculta', !this.checked); });
    nueva();
  })();

})();
