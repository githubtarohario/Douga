(() => {
  'use strict';

  const COLS = 10;
  const ROWS = 20;
  const CELL = 30;
  const LOCK_DELAY = 500;
  const MAX_LOCK_RESETS = 15;
  const LINE_POINTS = [0, 100, 300, 500, 800];

  const COLORS = {
    I: '#4dd8ff', O: '#ffd84d', T: '#b16cff', S: '#5be37a',
    Z: '#ff5a6e', J: '#4d7bff', L: '#ff9f43',
  };

  const SHAPES = {
    I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    O: [[1,1],[1,1]],
    T: [[0,1,0],[1,1,1],[0,0,0]],
    S: [[0,1,1],[1,1,0],[0,0,0]],
    Z: [[1,1,0],[0,1,1],[0,0,0]],
    J: [[1,0,0],[1,1,1],[0,0,0]],
    L: [[0,0,1],[1,1,1],[0,0,0]],
  };

  // SRS ウォールキック（y は上が正の SRS 表記。適用時に反転）
  const KICKS_JLSTZ = {
    '0>1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    '1>0': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
    '1>2': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
    '2>1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    '2>3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    '3>2': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    '3>0': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    '0>3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  };
  const KICKS_I = {
    '0>1': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
    '1>0': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
    '1>2': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
    '2>1': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
    '2>3': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
    '3>2': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
    '3>0': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
    '0>3': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
  };

  const $ = (id) => document.getElementById(id);
  const boardCtx = $('board').getContext('2d');
  const holdCanvas = $('hold');
  const nextCanvas = $('next');
  const holdCtx = holdCanvas.getContext('2d');
  const nextCtx = nextCanvas.getContext('2d');

  let grid, bag, queue, piece, holdType, canHold;
  let score, lines, level;
  let dropTimer, lockTimer, lockResets, lastTime;
  let state = 'title'; // title | playing | paused | over

  // ---------- ピース生成 ----------
  function refillBag() {
    const types = Object.keys(SHAPES);
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }
    bag.push(...types);
  }

  function takeNext() {
    while (queue.length < 4) {
      if (bag.length === 0) refillBag();
      queue.push(bag.shift());
    }
    return queue.shift();
  }

  function makePiece(type) {
    const matrix = SHAPES[type].map((r) => r.slice());
    return {
      type,
      matrix,
      rot: 0,
      x: Math.floor((COLS - matrix[0].length) / 2),
      y: type === 'I' ? -1 : 0,
    };
  }

  function rotateMatrix(m, dir) {
    const n = m.length;
    const out = Array.from({ length: n }, () => Array(n).fill(0));
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (dir > 0) out[x][n - 1 - y] = m[y][x];
        else out[n - 1 - x][y] = m[y][x];
      }
    }
    return out;
  }

  // ---------- 判定 ----------
  function collides(p, dx = 0, dy = 0, matrix = p.matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (!matrix[y][x]) continue;
        const nx = p.x + x + dx;
        const ny = p.y + y + dy;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && grid[ny][nx]) return true;
      }
    }
    return false;
  }

  function onGround() {
    return collides(piece, 0, 1);
  }

  // ---------- 操作 ----------
  function resetLockIfGrounded() {
    if (lockTimer !== null && lockResets < MAX_LOCK_RESETS) {
      lockTimer = 0;
      lockResets++;
    }
  }

  function move(dx) {
    if (collides(piece, dx, 0)) return false;
    piece.x += dx;
    resetLockIfGrounded();
    return true;
  }

  function rotate(dir) {
    if (piece.type === 'O') return;
    const from = piece.rot;
    const to = (from + dir + 4) % 4;
    const matrix = rotateMatrix(piece.matrix, dir);
    const kicks = (piece.type === 'I' ? KICKS_I : KICKS_JLSTZ)[`${from}>${to}`];
    for (const [kx, ky] of kicks) {
      if (!collides(piece, kx, -ky, matrix)) {
        piece.matrix = matrix;
        piece.x += kx;
        piece.y -= ky;
        piece.rot = to;
        resetLockIfGrounded();
        return;
      }
    }
  }

  function softDrop() {
    if (collides(piece, 0, 1)) return false;
    piece.y++;
    score += 1;
    dropTimer = 0;
    return true;
  }

  function hardDrop() {
    let dist = 0;
    while (!collides(piece, 0, 1)) {
      piece.y++;
      dist++;
    }
    score += dist * 2;
    lockPiece();
  }

  function hold() {
    if (!canHold) return;
    const current = piece.type;
    piece = makePiece(holdType ?? takeNext());
    holdType = current;
    canHold = false;
    afterSpawn();
  }

  // ---------- 進行 ----------
  function gravityInterval() {
    return Math.max(30, 1000 * Math.pow(0.8 - (level - 1) * 0.007, level - 1));
  }

  function spawn() {
    piece = makePiece(takeNext());
    canHold = true;
    afterSpawn();
  }

  function afterSpawn() {
    dropTimer = 0;
    lockTimer = null;
    lockResets = 0;
    if (collides(piece)) gameOver();
  }

  function lockPiece() {
    let above = true;
    piece.matrix.forEach((row, y) => row.forEach((v, x) => {
      if (!v) return;
      const gy = piece.y + y;
      if (gy >= 0) {
        grid[gy][piece.x + x] = piece.type;
        above = false;
      }
    }));
    if (above) return gameOver();

    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (grid[y].every(Boolean)) {
        grid.splice(y, 1);
        grid.unshift(Array(COLS).fill(null));
        cleared++;
        y++;
      }
    }
    if (cleared) {
      score += LINE_POINTS[cleared] * level;
      lines += cleared;
      level = Math.floor(lines / 10) + 1;
    }
    spawn();
  }

  function update(dt) {
    if (onGround()) {
      lockTimer = (lockTimer ?? 0) + dt;
      if (lockTimer >= LOCK_DELAY) lockPiece();
      return;
    }
    lockTimer = null;
    dropTimer += dt;
    const interval = gravityInterval();
    while (dropTimer >= interval && !onGround()) {
      piece.y++;
      dropTimer -= interval;
    }
  }

  function loop(time) {
    const dt = Math.min(100, time - (lastTime ?? time));
    lastTime = time;
    if (state === 'playing') update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // ---------- 描画 ----------
  function drawCell(ctx, x, y, size, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.fillRect(x * size + 1, y * size + 1, size - 2, 4);
    ctx.globalAlpha = 1;
  }

  function drawMini(ctx, type, offsetY, size) {
    if (!type) return;
    const m = SHAPES[type];
    const cells = [];
    m.forEach((row, y) => row.forEach((v, x) => v && cells.push([x, y])));
    const xs = cells.map((c) => c[0]);
    const ys = cells.map((c) => c[1]);
    const w = Math.max(...xs) - Math.min(...xs) + 1;
    const h = Math.max(...ys) - Math.min(...ys) + 1;
    const ox = (4 - w) / 2 - Math.min(...xs);
    const oy = (4 - h) / 2 - Math.min(...ys) + offsetY;
    cells.forEach(([x, y]) => drawCell(ctx, x + ox, y + oy, size, COLORS[type]));
  }

  function draw() {
    const ctx = boardCtx;
    ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);

    ctx.strokeStyle = 'rgba(255,255,255,.04)';
    for (let x = 1; x < COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke();
    }
    for (let y = 1; y < ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke();
    }

    if (grid) {
      grid.forEach((row, y) => row.forEach((t, x) => t && drawCell(ctx, x, y, CELL, COLORS[t])));
    }

    if (piece && state !== 'title') {
      let ghost = 0;
      while (!collides(piece, 0, ghost + 1)) ghost++;
      piece.matrix.forEach((row, y) => row.forEach((v, x) => {
        if (!v) return;
        if (piece.y + y + ghost >= 0) drawCell(ctx, piece.x + x, piece.y + y + ghost, CELL, COLORS[piece.type], 0.2);
        if (piece.y + y >= 0) drawCell(ctx, piece.x + x, piece.y + y, CELL, COLORS[piece.type]);
      }));
    }

    holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
    holdCtx.globalAlpha = canHold === false ? 0.4 : 1;
    drawMini(holdCtx, holdType, 0, 24);
    holdCtx.globalAlpha = 1;

    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    (queue || []).slice(0, 3).forEach((t, i) => drawMini(nextCtx, t, i * 4, 24));

    $('score').textContent = (score ?? 0).toLocaleString();
    $('lines').textContent = lines ?? 0;
    $('level').textContent = level ?? 1;
  }

  // ---------- 状態遷移 ----------
  const overlay = $('overlay');
  const overlayMsg = $('overlay-msg');
  const startBtn = $('start-btn');
  const form = $('submit-form');
  const nameInput = $('player-name');
  const submitStatus = $('submit-status');
  const submitBtn = form.querySelector('button');

  function start() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    bag = [];
    queue = [];
    holdType = null;
    score = 0;
    lines = 0;
    level = 1;
    state = 'playing';
    overlay.classList.add('hidden');
    spawn();
  }

  function togglePause() {
    if (state === 'playing') {
      state = 'paused';
      overlayMsg.textContent = '一時停止中 — P で再開';
      startBtn.classList.add('hidden');
      form.classList.add('hidden');
      overlay.classList.remove('hidden');
    } else if (state === 'paused') {
      state = 'playing';
      overlay.classList.add('hidden');
    }
  }

  function gameOver() {
    state = 'over';
    overlayMsg.innerHTML = `GAME OVER<br>スコア ${score.toLocaleString()}`;
    startBtn.textContent = 'もう一度';
    startBtn.classList.remove('hidden');
    submitStatus.textContent = '';
    submitBtn.disabled = false;
    form.classList.toggle('hidden', score <= 0);
    overlay.classList.remove('hidden');
    if (score > 0) setTimeout(() => nameInput.focus(), 50);
  }

  // ---------- ランキング（Vercel API） ----------
  function renderRanking(scores, highlightId) {
    const ol = $('ranking');
    ol.innerHTML = '';
    if (!scores.length) {
      ol.innerHTML = '<li class="muted">まだ記録がありません</li>';
      return;
    }
    for (const s of scores) {
      const li = document.createElement('li');
      li.textContent = s.name;
      const span = document.createElement('span');
      span.className = 's';
      span.textContent = s.score.toLocaleString();
      li.appendChild(span);
      li.title = `${s.lines} lines / Lv ${s.level} / ${new Date(s.date).toLocaleString()}`;
      if (s.id === highlightId) li.classList.add('me');
      ol.appendChild(li);
    }
  }

  async function loadRanking() {
    try {
      const res = await fetch('/api/scores');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      renderRanking(data.scores);
    } catch (e) {
      $('ranking').innerHTML = `<li class="muted">ランキングを取得できません</li>`;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;
    try { localStorage.setItem('tetris-name', name); } catch {}
    submitBtn.disabled = true;
    submitStatus.textContent = '送信中…';
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, score, lines, level }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '登録に失敗しました');
      submitStatus.textContent = data.rank && data.rank <= 100 ? `登録しました！ ${data.rank} 位` : '登録しました！';
      renderRanking(data.scores, data.entry.id);
    } catch (err) {
      submitStatus.textContent = err.message || '登録に失敗しました';
      submitBtn.disabled = false;
    }
  });

  try { nameInput.value = localStorage.getItem('tetris-name') || ''; } catch {}

  // ---------- 入力 ----------
  function act(action) {
    if (state !== 'playing') return;
    switch (action) {
      case 'left': move(-1); break;
      case 'right': move(1); break;
      case 'soft': softDrop(); break;
      case 'hard': hardDrop(); break;
      case 'rotate': rotate(1); break;
      case 'rotateL': rotate(-1); break;
      case 'hold': hold(); break;
    }
  }

  const KEYMAP = {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'soft',
    ArrowUp: 'rotate', x: 'rotate', X: 'rotate', z: 'rotateL', Z: 'rotateL',
    ' ': 'hard', c: 'hold', C: 'hold', Shift: 'hold',
  };
  const REPEATABLE = new Set(['left', 'right', 'soft']);

  document.addEventListener('keydown', (e) => {
    if (e.target === nameInput) return;
    if (e.key === 'Enter' && (state === 'title' || state === 'over')) { start(); return; }
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') { togglePause(); return; }
    const action = KEYMAP[e.key];
    if (!action) return;
    e.preventDefault();
    if (e.repeat && !REPEATABLE.has(action)) return;
    act(action);
  });

  startBtn.addEventListener('click', () => {
    if (state === 'paused') togglePause();
    else start();
  });

  // タッチボタン（長押しで連続移動）
  document.querySelectorAll('.touch button').forEach((btn) => {
    let timer = null;
    const stop = () => { clearInterval(timer); timer = null; };
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const action = btn.dataset.act;
      act(action);
      if (REPEATABLE.has(action)) {
        stop();
        timer = setInterval(() => act(action), 90);
      }
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
  });

  loadRanking();
  requestAnimationFrame(loop);
})();
