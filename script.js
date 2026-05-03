// ══════════════════════════════════════════
//  データ定義
// ══════════════════════════════════════════

var TYPES = [
  'ノーマル','ほのお','みず','でんき','くさ','こおり','かくとう','どく',
  'じめん','ひこう','エスパー','むし','いわ','ゴースト','ドラゴン','あく','はがね','フェアリー'
];

var CHART = {
  'ノーマル':   { 'いわ': 0.5, 'ゴースト': 0, 'はがね': 0.5 },
  'ほのお':     { 'ほのお': 0.5, 'みず': 0.5, 'くさ': 2, 'こおり': 2, 'むし': 2, 'いわ': 0.5, 'ドラゴン': 0.5, 'はがね': 2 },
  'みず':       { 'ほのお': 2, 'みず': 0.5, 'くさ': 0.5, 'じめん': 2, 'いわ': 2, 'ドラゴン': 0.5 },
  'でんき':     { 'みず': 2, 'でんき': 0.5, 'くさ': 0.5, 'じめん': 0, 'ひこう': 2, 'ドラゴン': 0.5 },
  'くさ':       { 'ほのお': 0.5, 'みず': 2, 'くさ': 0.5, 'どく': 0.5, 'じめん': 2, 'ひこう': 0.5, 'むし': 0.5, 'いわ': 2, 'ドラゴン': 0.5, 'はがね': 0.5 },
  'こおり':     { 'みず': 0.5, 'くさ': 2, 'こおり': 0.5, 'じめん': 2, 'ひこう': 2, 'ドラゴン': 2, 'はがね': 0.5 },
  'かくとう':   { 'ノーマル': 2, 'こおり': 2, 'どく': 0.5, 'いわ': 2, 'ゴースト': 0, 'ひこう': 0.5, 'エスパー': 0.5, 'むし': 0.5, 'あく': 2, 'はがね': 2, 'フェアリー': 0.5 },
  'どく':       { 'くさ': 2, 'どく': 0.5, 'じめん': 0.5, 'いわ': 0.5, 'ゴースト': 0.5, 'はがね': 0, 'フェアリー': 2 },
  'じめん':     { 'ほのお': 2, 'でんき': 2, 'くさ': 0.5, 'どく': 2, 'いわ': 2, 'はがね': 2, 'むし': 0.5, 'ひこう': 0 },
  'ひこう':     { 'でんき': 0.5, 'くさ': 2, 'かくとう': 2, 'むし': 2, 'いわ': 0.5, 'はがね': 0.5 },
  'エスパー':   { 'かくとう': 2, 'どく': 2, 'エスパー': 0.5, 'あく': 0, 'はがね': 0.5 },
  'むし':       { 'ほのお': 0.5, 'くさ': 2, 'かくとう': 0.5, 'ひこう': 0.5, 'エスパー': 2, 'ゴースト': 0.5, 'あく': 2, 'はがね': 0.5, 'フェアリー': 0.5 },
  'いわ':       { 'ほのお': 2, 'こおり': 2, 'かくとう': 0.5, 'じめん': 0.5, 'ひこう': 2, 'むし': 2, 'はがね': 0.5 },
  'ゴースト':   { 'ノーマル': 0, 'エスパー': 2, 'ゴースト': 2, 'あく': 0.5 },
  'ドラゴン':   { 'ドラゴン': 2, 'はがね': 0.5, 'フェアリー': 0 },
  'あく':       { 'かくとう': 0.5, 'エスパー': 2, 'ゴースト': 2, 'あく': 0.5, 'フェアリー': 0.5 },
  'はがね':     { 'ほのお': 0.5, 'みず': 0.5, 'でんき': 0.5, 'こおり': 2, 'いわ': 2, 'はがね': 0.5, 'フェアリー': 2 },
  'フェアリー': { 'かくとう': 2, 'ドラゴン': 2, 'あく': 2, 'ほのお': 0.5, 'どく': 0.5, 'はがね': 0.5 }
};

var OPTIONS = [
  { label: '×',  sub: '0倍（無効）',           key: '0'   },
  { label: '△',  sub: '½倍（いまひとつ）',     key: '0.5' },
  { label: '－',  sub: '１倍（ふつう）',        key: '1'   },
  { label: '○',  sub: '２倍（こうかばつぐん）', key: '2'   }
];

var TYPE_COLOR = {
  'ノーマル':   '#9ba09e', 'ほのお':    '#f9734a', 'みず':      '#4d9be6',
  'でんき':     '#f7c948', 'くさ':      '#5da95d', 'こおり':    '#72cfc0',
  'かくとう':   '#d05040', 'どく':      '#a75ec1', 'じめん':    '#d6b360',
  'ひこう':     '#8fa8d8', 'エスパー':  '#f85888', 'むし':      '#91c121',
  'いわ':       '#b8a148', 'ゴースト':  '#705898', 'ドラゴン':  '#6050c8',
  'あく':       '#50413c', 'はがね':    '#6abde0', 'フェアリー':'#f4b8e6'
};

// ══════════════════════════════════════════
//  状態変数
// ══════════════════════════════════════════

var quizMode  = 'atk';   // 'atk' | 'def'
var chartMode = 'atk';   // 相性表の絞り込み軸（quizModeと連動）
var grayout   = true;    // デフォルト: グレーアウト
var hideUnsel = false;   // デフォルト: グレーアウト（選択のみ=false）
var allSelected = false; // 全選択トグルの現在値

// クイズ用
var questions = [], qIdx = 0, score = 0, answered = false;

// 相性表ハイライト用
var cellMap   = {};
var atkHdrMap = {};
var defHdrMap = {};
var lastA = -1, lastD = -1;

// ══════════════════════════════════════════
//  ヘルパー
// ══════════════════════════════════════════

function getMultKey(atk, def) {
  var row = CHART[atk];
  if (!row) return '1';
  var v = row[def];
  return (v === undefined) ? '1' : String(v);
}

function hexToRgba(hex, alpha) {
  var r = parseInt(hex.slice(1,3),16),
      g = parseInt(hex.slice(3,5),16),
      b = parseInt(hex.slice(5,7),16);
  return 'rgba('+r+','+g+','+b+','+alpha+')';
}

function shuffle(a) {
  for (var i = a.length-1; i > 0; i--) {
    var j = Math.floor(Math.random()*(i+1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

// ══════════════════════════════════════════
//  タイプ選択状態（配列で管理）
// ══════════════════════════════════════════

var selectedTypes = [];  // 選択中タイプの配列

function getSelected() {
  return selectedTypes.slice();
}

function updateToggleAllBtn() {
  var btn = document.getElementById('btnToggleAll');
  var hasSel = (selectedTypes.length > 0);
  btn.textContent = hasSel ? '全解除' : '全選択';
  btn.className   = 'btn-sm' + (hasSel ? ' active' : '');
}

function toggleAllTypes() {
  if (selectedTypes.length > 0) {
    // 1つでも選択中なら全解除
    selectedTypes.length = 0;
  } else {
    // 何も選んでいなければ全選択
    for (var i = 0; i < TYPES.length; i++) selectedTypes.push(TYPES[i]);
  }
  updateToggleAllBtn();
  renderChart();
}

function toggleType(t) {
  var idx = selectedTypes.indexOf(t);
  if (idx >= 0) selectedTypes.splice(idx, 1);
  else          selectedTypes.push(t);
  updateToggleAllBtn();
  renderChart();
}

// ══════════════════════════════════════════
//  モード切り替え
// ══════════════════════════════════════════

function toggleMode() {
  quizMode  = (quizMode === 'atk') ? 'def' : 'atk';
  chartMode = quizMode;
  var btn = document.getElementById('btnMode');
  btn.textContent = (quizMode === 'atk') ? '⚔️ 攻撃' : '🛡️ 防御';
  renderChart();
}

function toggleFilter() {
  hideUnsel = !hideUnsel;
  grayout   = !hideUnsel;
  var btn = document.getElementById('btnFilter');
  btn.textContent = grayout ? 'グレーアウト' : '選択のみ';
  applyTableClasses();
}

function applyTableClasses() {
  var tbl = document.getElementById('chartTable');
  var hasSelection = getSelected().length > 0;
  // hide-unsel: 「選択のみ」モードのとき常に適用（全解除なら全行消える）
  tbl.classList.toggle('hide-unsel', hideUnsel);
  // grayout: 攻撃モードは常時、防御モードは選択中のみ
  tbl.classList.toggle('grayout',
    grayout && (chartMode === 'atk' || hasSelection)
  );
}

// ══════════════════════════════════════════
//  相性表レンダリング
// ══════════════════════════════════════════

// 選択サイズ: 固定56px
var SEL_SIZE = 56;
var BASE_SIZE = 30;

function renderChart() {
  var selected = getSelected();
  var hasSelection = selected.length > 0;
  var tbl = document.getElementById('chartTable');
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
    var th  = document.createElement('th');
    var selDef = (selected.indexOf(def) >= 0);
    // 防御モード: 未選択はdim。全解除時も全列dim
    var dimDef = (chartMode === 'def') && !selDef;
    th.className = 'hdr-def' + (dimDef ? ' col-dim hdr-off' : '');
    th.id = 'dhdr-' + d;
    // 防御モード: 選択された列だけ広く
    var colW = (chartMode === 'def' && selDef) ? SEL_SIZE : BASE_SIZE;
    th.style.width    = colW + 'px';
    th.style.minWidth = colW + 'px';

    var inner = document.createElement('span');
    inner.className = 'hdr-inner tc-' + def;
    inner.textContent = def;
    th.appendChild(inner);

    (function(t) {
      th.addEventListener('click', function() { toggleType(t); });
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
    var selAtk = (selected.indexOf(atk) >= 0);
    // 攻撃モード: 未選択はdim（hdr-offで薄く、hide-unselで非表示）
    // 選択されていればdimなし
    var dimAtk = (chartMode === 'atk') && !selAtk;

    var tr = document.createElement('tr');
    if (dimAtk) tr.classList.add('row-dim');
    // 攻撃モード: 選択された行だけ高く
    var rowH = (chartMode === 'atk' && selAtk) ? SEL_SIZE : BASE_SIZE;
    tr.style.height = rowH + 'px';
    cellMap[a] = {};

    var ath = document.createElement('th');
    ath.className = 'hdr-atk' + (dimAtk ? ' hdr-off' : '');
    ath.id = 'ahdr-' + a;

    var aInner = document.createElement('span');
    aInner.className = 'hdr-inner tc-' + atk;
    aInner.textContent = atk;
    ath.appendChild(aInner);

    (function(t) {
      ath.addEventListener('click', function() { toggleType(t); });
    })(atk);

    atkHdrMap[a] = ath;
    tr.appendChild(ath);

    for (var d2 = 0; d2 < TYPES.length; d2++) {
      var def2    = TYPES[d2];
      var selDef2 = (selected.indexOf(def2) >= 0);
      var dimDef2 = (chartMode === 'def') && !selDef2;

      var td = document.createElement('td');
      td.className = 'cell' + (dimDef2 ? ' col-dim' : '');
      // セルも行・列に合わせてサイズ設定
      var tdW = (chartMode === 'def' && selDef2) ? SEL_SIZE : BASE_SIZE;
      var tdH = (chartMode === 'atk' && selAtk)  ? SEL_SIZE : BASE_SIZE;
      td.style.width    = tdW + 'px';
      td.style.minWidth = tdW + 'px';
      td.style.height   = tdH + 'px';

      var v = (CHART[atk] && CHART[atk][def2] !== undefined) ? CHART[atk][def2] : 1;
      var sym = '－', cls = 'eff1';
      if      (v === 2)   { sym = '○'; cls = 'eff2';  }
      else if (v === 0.5) { sym = '△'; cls = 'eff05'; }
      else if (v === 0)   { sym = '×'; cls = 'eff0';  }
      td.textContent = sym;
      td.classList.add(cls);

      td.dataset.a   = a;
      td.dataset.d   = d2;
      td.dataset.atk = atk;
      td.dataset.def = def2;
      td.dataset.val = String(v);

      td.addEventListener('mouseenter', onCellEnter);
      td.addEventListener('mouseleave', onCellLeave);
      // タップ対応
      td.addEventListener('touchstart', onCellTouch, { passive: true });

      cellMap[a][d2] = td;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  tbl.appendChild(tbody);
  applyTableClasses();
}


// ══════════════════════════════════════════
//  ハイライト
// ══════════════════════════════════════════

function clearHighlight() {
  if (lastA < 0 || lastD < 0) return;
  document.getElementById('chartTable').classList.remove('hl-active');
  for (var d = 0; d < TYPES.length; d++) {
    var c = cellMap[lastA] && cellMap[lastA][d];
    if (c) {
      c.classList.remove('hl-row','hl-both');
      c.style.removeProperty('--hl-row-bg');
      c.style.removeProperty('--hl-atk-color');
      c.style.removeProperty('transform');
      c.style.removeProperty('box-shadow');
    }
  }
  for (var a = 0; a < TYPES.length; a++) {
    var c = cellMap[a] && cellMap[a][lastD];
    if (c) {
      c.classList.remove('hl-col','hl-both');
      c.style.removeProperty('--hl-col-bg');
      c.style.removeProperty('--hl-atk-color');
      c.style.removeProperty('transform');
      c.style.removeProperty('box-shadow');
    }
  }
  if (atkHdrMap[lastA]) atkHdrMap[lastA].classList.remove('hl-hdr-atk');
  if (defHdrMap[lastD]) defHdrMap[lastD].classList.remove('hl-hdr-def');
  lastA = -1; lastD = -1;
  document.getElementById('cellInfo').textContent = '';
}

function applyHighlight(a, d) {
  clearHighlight();
  lastA = a; lastD = d;
  var atkColor = TYPE_COLOR[TYPES[a]] || '#fff';
  var defColor = TYPE_COLOR[TYPES[d]] || '#fff';

  document.getElementById('chartTable').classList.add('hl-active');

  for (var dd = 0; dd < TYPES.length; dd++) {
    var c = cellMap[a][dd];
    if (!c || dd === d) continue;
    c.style.setProperty('--hl-row-bg', hexToRgba(atkColor, .18));
    c.classList.add('hl-row');
  }
  for (var aa = 0; aa < TYPES.length; aa++) {
    var c = cellMap[aa][d];
    if (!c || aa === a) continue;
    c.style.setProperty('--hl-col-bg', hexToRgba(defColor, .18));
    c.classList.add('hl-col');
  }
  var cr = cellMap[a][d];
  if (cr) {
    cr.style.setProperty('--hl-atk-color', atkColor);
    cr.classList.add('hl-both');
  }
  if (atkHdrMap[a]) {
    atkHdrMap[a].style.setProperty('--hl-atk-color', atkColor);
    atkHdrMap[a].classList.add('hl-hdr-atk');
  }
  if (defHdrMap[d]) {
    defHdrMap[d].style.setProperty('--hl-def-color', defColor);
    defHdrMap[d].classList.add('hl-hdr-def');
  }

  // セル情報表示
  var atk = TYPES[a], def = TYPES[d];
  var val = cr ? cr.dataset.val : '1';
  var sym  = val==='2' ? '○' : val==='0.5' ? '△' : val==='0' ? '×' : '－';
  var mult = val==='2' ? '2倍' : val==='0.5' ? '½倍' : val==='0' ? '無効（0倍）' : '等倍（1倍）';
  document.getElementById('cellInfo').textContent =
    '⚔️ ' + atk + '  →  🛡️ ' + def + '  ：  ' + sym + ' ' + mult;
}

function onCellEnter(e) {
  var td = e.currentTarget;
  applyHighlight(parseInt(td.dataset.a), parseInt(td.dataset.d));
}
function onCellLeave() { clearHighlight(); }

var lastTouchCell = null;
function onCellTouch(e) {
  var td = e.currentTarget;
  var a = parseInt(td.dataset.a), d = parseInt(td.dataset.d);
  if (lastTouchCell === td) { clearHighlight(); lastTouchCell = null; return; }
  lastTouchCell = td;
  applyHighlight(a, d);
}

// ══════════════════════════════════════════
//  クイズ
// ══════════════════════════════════════════

function startQuiz() {
  var selected = getSelected();
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
  showView('quizView');
  showQuestion();
}

function showQuestion() {
  answered = false;
  var q = questions[qIdx];
  var correctKey = getMultKey(q.atk, q.def);

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
    (function(opt) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn pop';
      btn.setAttribute('data-key', opt.key);
      btn.innerHTML = '<span>' + opt.label + '</span><span class="choice-sub">' + opt.sub + '</span>';
      btn.onclick = function() { answer(this, correctKey); };
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
    var co = OPTIONS.filter(function(o){ return o.key === correctKey; })[0];
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
  var total = questions.length, pct = score / total;
  document.getElementById('finalScore').textContent = score + ' / ' + total;
  document.getElementById('finalLabel').textContent = '正解率 ' + Math.round(pct * 100) + '%';
  var rank = pct === 1 ? '🏆 パーフェクト！タイプマスター！'
           : pct >= .8  ? '🌟 すばらしい！'
           : pct >= .6  ? '👍 なかなかよい！'
           : pct >= .4  ? '😅 まだまだ修行が必要…'
           :               '💦 タイプ表を見直そう！';
  document.getElementById('finalRank').textContent = rank;
  showView('resultView');
}

function quitQuiz()   { showView('mainView'); }
function backToChart() { showView('mainView'); }

// ══════════════════════════════════════════
//  画面切り替え
// ══════════════════════════════════════════

function showView(id) {
  ['mainView','quizView','resultView'].forEach(function(v) {
    document.getElementById(v).style.display = (v === id) ? '' : 'none';
  });
}

// ══════════════════════════════════════════
//  初期化
// ══════════════════════════════════════════

// デフォルト: 全解除・攻撃・グレーアウト
updateToggleAllBtn();
renderChart();
