// ── データ定義 ────────────────────────────────────────────────

var TYPES = [
  'ノーマル','ほのお','みず','でんき','くさ','こおり','かくとう','どく',
  'じめん','ひこう','エスパー','むし','いわ','ゴースト','ドラゴン','あく','はがね','フェアリー'
];

var CHART = {
  'ノーマル':  { 'いわ': 0.5, 'ゴースト': 0, 'はがね': 0.5 },
  'ほのお':    { 'ほのお': 0.5, 'みず': 0.5, 'くさ': 2, 'こおり': 2, 'むし': 2, 'いわ': 0.5, 'ドラゴン': 0.5, 'はがね': 2 },
  'みず':      { 'ほのお': 2, 'みず': 0.5, 'くさ': 0.5, 'じめん': 2, 'いわ': 2, 'ドラゴン': 0.5 },
  'でんき':    { 'みず': 2, 'でんき': 0.5, 'くさ': 0.5, 'じめん': 0, 'ひこう': 2, 'ドラゴン': 0.5 },
  'くさ':      { 'ほのお': 0.5, 'みず': 2, 'くさ': 0.5, 'どく': 0.5, 'じめん': 2, 'ひこう': 0.5, 'むし': 0.5, 'いわ': 2, 'ドラゴン': 0.5, 'はがね': 0.5 },
  'こおり':    { 'みず': 0.5, 'くさ': 2, 'こおり': 0.5, 'じめん': 2, 'ひこう': 2, 'ドラゴン': 2, 'はがね': 0.5 },
  'かくとう':  { 'ノーマル': 2, 'こおり': 2, 'どく': 0.5, 'いわ': 2, 'ゴースト': 0, 'ひこう': 0.5, 'エスパー': 0.5, 'むし': 0.5, 'あく': 2, 'はがね': 2, 'フェアリー': 0.5 },
  'どく':      { 'くさ': 2, 'どく': 0.5, 'じめん': 0.5, 'いわ': 0.5, 'ゴースト': 0.5, 'はがね': 0, 'フェアリー': 2 },
  'じめん':    { 'ほのお': 2, 'でんき': 2, 'くさ': 0.5, 'どく': 2, 'いわ': 2, 'はがね': 2, 'むし': 0.5, 'ひこう': 0 },
  'ひこう':    { 'でんき': 0.5, 'くさ': 2, 'かくとう': 2, 'むし': 2, 'いわ': 0.5, 'はがね': 0.5 },
  'エスパー':  { 'かくとう': 2, 'どく': 2, 'エスパー': 0.5, 'あく': 0, 'はがね': 0.5 },
  'むし':      { 'ほのお': 0.5, 'くさ': 2, 'かくとう': 0.5, 'ひこう': 0.5, 'エスパー': 2, 'ゴースト': 0.5, 'あく': 2, 'はがね': 0.5, 'フェアリー': 0.5 },
  'いわ':      { 'ほのお': 2, 'こおり': 2, 'かくとう': 0.5, 'じめん': 0.5, 'ひこう': 2, 'むし': 2, 'はがね': 0.5 },
  'ゴースト':  { 'ノーマル': 0, 'エスパー': 2, 'ゴースト': 2, 'あく': 0.5 },
  'ドラゴン':  { 'ドラゴン': 2, 'はがね': 0.5, 'フェアリー': 0 },
  'あく':      { 'かくとう': 0.5, 'エスパー': 2, 'ゴースト': 2, 'あく': 0.5, 'フェアリー': 0.5 },
  'はがね':    { 'ほのお': 0.5, 'みず': 0.5, 'でんき': 0.5, 'こおり': 2, 'いわ': 2, 'はがね': 0.5, 'フェアリー': 2 },
  'フェアリー':{ 'かくとう': 2, 'ドラゴン': 2, 'あく': 2, 'ほのお': 0.5, 'どく': 0.5, 'はがね': 0.5 }
};

var OPTIONS = [
  { label: '×', sub: '0倍（無効）',          key: '0'   },
  { label: '△', sub: '½倍（いまひとつ）',    key: '0.5' },
  { label: '－', sub: '１倍（ふつう）',       key: '1'   },
  { label: '○', sub: '２倍（こうかばつぐん）',key: '2'   }
];

// タイプ固有色マップ（CSS の .tc-* background に対応）
var TYPE_COLOR = {
  'ノーマル':  '#9ba09e',
  'ほのお':    '#f9734a',
  'みず':      '#4d9be6',
  'でんき':    '#f7c948',
  'くさ':      '#5da95d',
  'こおり':    '#72cfc0',
  'かくとう':  '#d05040',
  'どく':      '#a75ec1',
  'じめん':    '#d6b360',
  'ひこう':    '#8fa8d8',
  'エスパー':  '#f85888',
  'むし':      '#91c121',
  'いわ':      '#b8a148',
  'ゴースト':  '#705898',
  'ドラゴン':  '#6050c8',
  'あく':      '#50413c',
  'はがね':    '#6abde0',
  'フェアリー':'#f4b8e6'
};

// ── 状態変数 ────────────────────────────────────────────────

var questions = [], qIdx = 0, score = 0, answered = false, quizMode = 'atk';

// 相性表用
var cellMap    = {};  // cellMap[atkIdx][defIdx] = td
var atkHdrMap  = {};  // atkHdrMap[atkIdx] = th
var defHdrMap  = {};  // defHdrMap[defIdx] = th
var hideUnsel  = true;
var grayout    = false;
var chartMode  = 'atk';
var lastA = -1, lastD = -1;

// ── ヘルパー ────────────────────────────────────────────────

function getMultKey(atk, def) {
  var row = CHART[atk];
  if (!row) return '1';
  var v = row[def];
  return (v === undefined) ? '1' : String(v);
}

function hexToRgba(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function shuffle(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// ── セットアップ UI ─────────────────────────────────────────

var grid = document.getElementById('typeGrid');
for (var i = 0; i < TYPES.length; i++) {
  (function (t) {
    var inp = document.createElement('input');
    inp.type = 'checkbox'; inp.className = 'type-toggle';
    inp.id = 'chk-' + t; inp.value = t; inp.checked = false;
    inp.addEventListener('change', function () {
      if (document.getElementById('chartOverlay').style.display === 'flex') renderChart();
    });
    var lbl = document.createElement('label');
    lbl.htmlFor = 'chk-' + t;
    lbl.className = 'type-label tc-' + t;
    lbl.textContent = t;
    grid.appendChild(inp);
    grid.appendChild(lbl);
  })(TYPES[i]);
}

function setMode(m) {
  quizMode = m;
  document.getElementById('modeSw').checked = (m === 'def');
  document.getElementById('lbl-modeAtk').className = 'sw-lbl' + (m === 'atk' ? ' on' : '');
  document.getElementById('lbl-modeDef').className = 'sw-lbl' + (m === 'def' ? ' on' : '');
  document.getElementById('filterLabel').textContent =
    (m === 'atk') ? '絞り込む攻撃タイプを選ぶ' : '絞り込む防御タイプを選ぶ';
  if (document.getElementById('chartOverlay').style.display === 'flex') renderChart();
}

function selectAll(v) {
  for (var i = 0; i < TYPES.length; i++)
    document.getElementById('chk-' + TYPES[i]).checked = v;
  if (document.getElementById('chartOverlay').style.display === 'flex') renderChart();
}

function getChecked() {
  var r = [];
  for (var i = 0; i < TYPES.length; i++)
    if (document.getElementById('chk-' + TYPES[i]).checked) r.push(TYPES[i]);
  return r;
}

// ── 相性表 ──────────────────────────────────────────────────

function setChartMode(m) {
  chartMode = m;
  document.getElementById('chartModeSw').checked = (m === 'def');
  document.getElementById('lbl-chartAtk').className = 'sw-lbl' + (m === 'atk' ? ' on' : '');
  document.getElementById('lbl-chartDef').className = 'sw-lbl' + (m === 'def' ? ' on' : '');
  renderChart();
}

function applyTableClasses() {
  var tbl = document.getElementById('chartTable');
  tbl.classList.toggle('hide-unsel', hideUnsel);
  tbl.classList.toggle('grayout', grayout);
}

function setFilterMode(isGrayout) {
  hideUnsel = !isGrayout;
  grayout   = isGrayout;
  document.getElementById('lbl-hideUnsel').className = 'sw-lbl' + (!isGrayout ? ' on' : '');
  document.getElementById('lbl-grayout').className   = 'sw-lbl' + ( isGrayout ? ' on' : '');
  applyTableClasses();
}

function renderChart() {
  var selected = getChecked();
  var tbl = document.getElementById('chartTable');
  var n = selected.length;
  var baseCell = n >= 8 ? 22 : (n >= 4 ? 28 : 36);
  var selCell  = n >= 8 ? 44 : (n >= 4 ? 54 : 64);

  tbl.innerHTML = '';
  cellMap = {}; atkHdrMap = {}; defHdrMap = {};

  // ── thead ──
  var thead = document.createElement('thead');
  var hr = document.createElement('tr');

  var corner = document.createElement('th');
  corner.className = 'corner';
  corner.innerHTML = '<span class="c-def">防御→</span><span class="c-atk">↓攻撃</span>';
  hr.appendChild(corner);

  for (var d = 0; d < TYPES.length; d++) {
    var def = TYPES[d];
    var th = document.createElement('th');
    var defOff = (chartMode === 'def' && selected.indexOf(def) === -1);
    th.className = 'hdr-def' + (defOff ? ' col-dim' : '') + (defOff ? ' hdr-off' : '');
    th.id = 'dhdr-' + d;
    var isSelDef = (chartMode === 'def' && selected.indexOf(def) >= 0) || (chartMode === 'atk');
    th.style.width    = (isSelDef ? selCell : baseCell) + 'px';
    th.style.minWidth = (isSelDef ? selCell : baseCell) + 'px';
    var inner = document.createElement('span');
    inner.className = 'hdr-inner tc-' + def;
    inner.textContent = def;
    th.appendChild(inner);
    (function (t) {
      th.addEventListener('click', function () {
        var chk = document.getElementById('chk-' + t);
        if (chk) { chk.checked = !chk.checked; renderChart(); }
      });
    })(def);
    defHdrMap[d] = th;
    hr.appendChild(th);
  }
  thead.appendChild(hr);
  tbl.appendChild(thead);

  // ── tbody ──
  var tbody = document.createElement('tbody');
  for (var a = 0; a < TYPES.length; a++) {
    var atk = TYPES[a];
    var tr = document.createElement('tr');
    if (chartMode === 'atk' && selected.indexOf(atk) === -1) tr.classList.add('row-dim');
    cellMap[a] = {};

    var ath = document.createElement('th');
    var atkOff = (chartMode === 'atk' && selected.indexOf(atk) === -1);
    ath.className = 'hdr-atk' + (atkOff ? ' hdr-off' : '');
    ath.id = 'ahdr-' + a;
    var isSelAtk = (chartMode === 'atk' && selected.indexOf(atk) >= 0) || (chartMode === 'def');
    ath.style.height = (isSelAtk ? selCell : baseCell) + 'px';
    var aInner = document.createElement('span');
    aInner.className = 'hdr-inner tc-' + atk;
    aInner.textContent = atk;
    ath.appendChild(aInner);
    (function (t) {
      ath.addEventListener('click', function () {
        var chk = document.getElementById('chk-' + t);
        if (chk) { chk.checked = !chk.checked; renderChart(); }
      });
    })(atk);
    atkHdrMap[a] = ath;
    tr.appendChild(ath);

    for (var d2 = 0; d2 < TYPES.length; d2++) {
      var def2 = TYPES[d2];
      var td = document.createElement('td');
      td.className = 'cell';
      var cellW, cellH;
      if (chartMode === 'atk') {
        cellW = selCell;
        cellH = (selected.indexOf(atk) >= 0) ? selCell : baseCell;
      } else {
        cellH = selCell;
        cellW = (selected.indexOf(def2) >= 0) ? selCell : baseCell;
      }
      td.style.width    = cellW + 'px';
      td.style.minWidth = cellW + 'px';
      td.style.height   = cellH + 'px';

      var v = CHART[atk] ? CHART[atk][def2] : undefined;
      if (v === undefined) v = 1;
      var sym = '－', cls = 'eff1';
      if (v === 2)   { sym = '○'; cls = 'eff2'; }
      else if (v === 0.5) { sym = '△'; cls = 'eff05'; }
      else if (v === 0)   { sym = '×'; cls = 'eff0'; }
      td.textContent = sym;
      td.classList.add(cls);
      if (chartMode === 'def' && selected.indexOf(def2) === -1) td.classList.add('col-dim');

      td.dataset.a   = a;
      td.dataset.d   = d2;
      td.dataset.atk = atk;
      td.dataset.def = def2;
      td.dataset.val = String(v);

      td.addEventListener('mouseenter', onCellEnter);
      td.addEventListener('mouseleave', onCellLeave);
      td.addEventListener('click',      onCellClick);
      cellMap[a][d2] = td;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  tbl.appendChild(tbody);
  if (hideUnsel) tbl.classList.add('hide-unsel');
  else           tbl.classList.remove('hide-unsel');
}

// ── ハイライト ───────────────────────────────────────────────

function clearHighlight() {
  if (lastA < 0 || lastD < 0) return;
  document.getElementById('chartTable').classList.remove('hl-active');
  for (var d = 0; d < TYPES.length; d++) {
    var c = cellMap[lastA][d];
    if (c) { c.classList.remove('hl-row', 'hl-both'); c.style.cssText = ''; }
  }
  for (var a = 0; a < TYPES.length; a++) {
    var c = cellMap[a][lastD];
    if (c) { c.classList.remove('hl-col', 'hl-both'); c.style.cssText = ''; }
  }
  if (atkHdrMap[lastA]) atkHdrMap[lastA].classList.remove('hl-hdr-atk');
  if (defHdrMap[lastD]) defHdrMap[lastD].classList.remove('hl-hdr-def');
  lastA = -1; lastD = -1;
}

function applyHighlight(a, d) {
  clearHighlight();
  lastA = a; lastD = d;
  var atkColor = TYPE_COLOR[TYPES[a]] || '#ffffff';
  var defColor = TYPE_COLOR[TYPES[d]] || '#ffffff';

  document.getElementById('chartTable').classList.add('hl-active');

  // 行ライン
  for (var dd = 0; dd < TYPES.length; dd++) {
    var c = cellMap[a][dd];
    if (!c || dd === d) continue;
    c.style.setProperty('--hl-row-bg',    hexToRgba(atkColor, '0.15'));
    c.style.setProperty('--hl-atk-color', atkColor);
    c.classList.add('hl-row');
  }
  // 列ライン
  for (var aa = 0; aa < TYPES.length; aa++) {
    var c = cellMap[aa][d];
    if (!c || aa === a) continue;
    c.style.setProperty('--hl-col-bg',    hexToRgba(defColor, '0.15'));
    c.style.setProperty('--hl-def-color', defColor);
    c.classList.add('hl-col');
  }
  // 交差セル
  if (cellMap[a][d]) {
    var cr = cellMap[a][d];
    cr.style.setProperty('--hl-atk-color', atkColor);
    cr.style.setProperty('--hl-def-color', defColor);
    cr.classList.add('hl-both');
  }
  // ヘッダー
  if (atkHdrMap[a]) { atkHdrMap[a].style.setProperty('--hl-atk-color', atkColor); atkHdrMap[a].classList.add('hl-hdr-atk'); }
  if (defHdrMap[d]) { defHdrMap[d].style.setProperty('--hl-def-color', defColor); defHdrMap[d].classList.add('hl-hdr-def'); }
}

function onCellEnter(e) {
  var td  = e.currentTarget;
  var a   = parseInt(td.dataset.a),
      d   = parseInt(td.dataset.d);
  applyHighlight(a, d);
  var atk = td.dataset.atk, def = td.dataset.def, val = td.dataset.val;
  var sym  = val === '2' ? '○' : val === '0.5' ? '△' : val === '0' ? '×' : '－';
  var mult = val === '2' ? '2倍' : val === '0.5' ? '½倍' : val === '0' ? '無効（0倍）' : '等倍（1倍）';
  document.getElementById('cellInfo').textContent =
    '⚔️ ' + atk + '  →  🛡️ ' + def + '  ：  ' + sym + ' ' + mult;
}

function onCellLeave() {
  clearHighlight();
  document.getElementById('cellInfo').textContent = '';
}

function onCellClick(e) {}

// ── 相性表の開閉 ─────────────────────────────────────────────

function openChart() {
  if (chartMode !== quizMode) {
    chartMode = quizMode;
    var sw = document.getElementById('chartModeSw');
    if (sw) sw.checked = (chartMode === 'def');
    var la = document.getElementById('lbl-chartAtk');
    var ld = document.getElementById('lbl-chartDef');
    if (la) la.className = 'sw-lbl' + (chartMode === 'atk' ? ' on' : '');
    if (ld) ld.className = 'sw-lbl' + (chartMode === 'def' ? ' on' : '');
  }
  renderChart();
  document.getElementById('chartOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeChart() {
  document.getElementById('chartOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

function closeChartOutside(e) {
  if (e.target === document.getElementById('chartOverlay')) closeChart();
}

// ── クイズ ───────────────────────────────────────────────────

function startQuiz() {
  var selected = getChecked();
  if (selected.length === 0) { alert('1つ以上タイプを選んでください'); return; }
  var pool = [];
  if (quizMode === 'atk') {
    for (var i = 0; i < selected.length; i++)
      for (var j = 0; j < TYPES.length; j++)
        pool.push({ atk: selected[i], def: TYPES[j] });
  } else {
    for (var i = 0; i < selected.length; i++)
      for (var j = 0; j < TYPES.length; j++)
        pool.push({ atk: TYPES[j], def: selected[i] });
  }
  shuffle(pool);
  questions = pool.slice(0, 20);
  qIdx = 0; score = 0; answered = false;
  document.getElementById('qTotal').textContent = questions.length;
  document.getElementById('setup').style.display = 'none';
  document.getElementById('quiz').style.display  = 'block';
  showQuestion();
}

function showQuestion() {
  answered = false;
  var q = questions[qIdx], correctKey = getMultKey(q.atk, q.def);
  document.getElementById('qNum').textContent      = qIdx + 1;
  document.getElementById('scoreDisp').textContent = score;
  document.getElementById('progFill').style.width  = (qIdx / questions.length * 100) + '%';

  var ab = document.getElementById('atkBadge');
  ab.textContent = q.atk; ab.className = 'type-badge tc-' + q.atk;
  var db = document.getElementById('defBadge');
  db.textContent = q.def; db.className = 'type-badge tc-' + q.def;

  var wrap = document.getElementById('choices');
  wrap.innerHTML = '';
  for (var i = 0; i < OPTIONS.length; i++) {
    (function (opt) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn pop';
      btn.setAttribute('data-key', opt.key);
      btn.innerHTML = '<span>' + opt.label + '</span><span class="choice-sub">' + opt.sub + '</span>';
      btn.onclick = function () { answer(this, correctKey); };
      wrap.appendChild(btn);
    })(OPTIONS[i]);
  }
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className   = 'feedback';
  document.getElementById('btnNext').style.display = 'none';
}

function answer(clickedBtn, correctKey) {
  if (answered) return;
  answered = true;
  var chosenKey = clickedBtn.getAttribute('data-key');
  var isCorrect = (chosenKey === correctKey);
  if (isCorrect) score++;
  document.getElementById('scoreDisp').textContent = score;

  var allBtns = document.getElementById('choices').getElementsByClassName('choice-btn');
  for (var i = 0; i < allBtns.length; i++) {
    var btn = allBtns[i];
    btn.disabled = true;
    if (btn.getAttribute('data-key') === correctKey) btn.classList.add('correct');
    else if (btn === clickedBtn)                       btn.classList.add('wrong');
  }

  var fb = document.getElementById('feedback');
  if (isCorrect) {
    fb.textContent = '✓ 正解！';
    fb.className   = 'feedback correct';
  } else {
    var co = null;
    for (var i = 0; i < OPTIONS.length; i++)
      if (OPTIONS[i].key === correctKey) { co = OPTIONS[i]; break; }
    fb.textContent = '✗ 不正解… 正解は「' + co.label + '」(' + co.sub + ')';
    fb.className   = 'feedback wrong';
  }

  var btnNext = document.getElementById('btnNext');
  btnNext.textContent   = (qIdx + 1 >= questions.length) ? '結果を見る ✓' : '次の問題 →';
  btnNext.style.display = 'block';
}

function nextQuestion() {
  qIdx++;
  if (qIdx >= questions.length) { showResult(); return; }
  showQuestion();
}

function showResult() {
  document.getElementById('quiz').style.display   = 'none';
  document.getElementById('result').style.display = 'block';
  var total = questions.length, pct = score / total;
  document.getElementById('finalScore').textContent = score + ' / ' + total;
  document.getElementById('finalLabel').textContent = '正解率 ' + Math.round(pct * 100) + '%';
  var rank = '';
  if      (pct === 1)  rank = '🏆 パーフェクト！タイプマスター！';
  else if (pct >= 0.8) rank = '🌟 すばらしい！';
  else if (pct >= 0.6) rank = '👍 なかなかよい！';
  else if (pct >= 0.4) rank = '😅 まだまだ修行が必要…';
  else                 rank = '💦 タイプ表を見直そう！';
  document.getElementById('finalRank').textContent = rank;
}

function quitQuiz() {
  document.getElementById('quiz').style.display   = 'none';
  document.getElementById('result').style.display = 'none';
  document.getElementById('setup').style.display  = 'block';
}

function backToSetup() {
  document.getElementById('result').style.display = 'none';
  document.getElementById('setup').style.display  = 'block';
}

// ── 初期表示 ─────────────────────────────────────────────────
selectAll(true);
openChart();
