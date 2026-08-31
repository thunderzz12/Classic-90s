const releases = [
  {
    version: 'v0.6', name: 'New menu icon', date: 'Sep 2026', status: 'latest',
    summary: 'Changelogs and keybinds',
    changes: [
      { type: 'new', text: 'changelogs window' },
      { type: 'new', text: 'New keyboard shortcuts'},
      { type: 'new', text: 'Suggest feature, report bug buttons' }
    ],
  },
  {
    version: 'v0.5', name: 'Live Numbers', date: 'Aug 2026', status: 'null',
    summary: 'feels little less empty now',
    changes: [
      { type: 'new', text: 'Live listener count in the top bar' },
      { type: 'new', text: 'Total visit counter' },
      { type: 'fix', text: 'Fixed ui in mobile web for total visit no.'}
    ],
  },
  {
    version: 'v0.4', name: 'Mobile Support', date: 'Aug 2026', status: 'null',
    summary: 'listen from anywhere!',
    changes: [
      { type: 'new', text: 'better css for mobile web' },
      { type: 'wip', text: 'Live listener count'},
    ],
  },
  {
    version: 'v0.3', name: 'Shuffle & Repeat', date: 'Aug 2026', status: null,
    summary: 'Better audio player with new buttons.',
    changes: [
      { type: 'new', text: 'Custom queue logic'},  
      { type: 'new', text: 'Shuffle - reorders only the upcoming queue' },
      { type: 'new', text: 'Repeat - off / repeat-all / repeat-one audio track' },
      { type: 'new', text: 'Hint text for using shuffle button'},
      { type: 'fix', text: 'Seek bar hit area and drag-to-seek' },
    ],
  },
  {
    version: 'v0.2', name: 'Topbar link icons', date: 'Aug 2026', status: null,
    summary: 'github repo and ytm playlist links',
    changes: [
      { type: 'new', text: 'Link icons for github repo with nice looking hovering text and ytm playlist link too' },
    ],
  },
  {
    version: 'v0.1.1', name: 'Better Audio Player', date: 'Aug 2026', status: null,
    summary: 'better ui for audio player and some fixes',
    changes: [
      { type: 'new', text: 'Frosted-glass player redesign' },
      { type: 'new', text: 'Circular "CD" album art that spins while playing' },
      { type: 'fix', text: 'Thumbnail fallback for videos missing higher resolutions' },
    ],
  },
  {
    version: 'v0.1', name: 'Beginning', date: 'Aug 2026', status: 'first',
    summary: 'it started here.',
    changes: [
      { type: 'new', text: 'YT audio engine and player.' },
      { type: 'new', text: 'custom svgs and bg.' },
    ],
  },
];

const tagStyle = {
  new: { label: 'New', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
  fix: { label: 'Fix', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
  wip: { label: 'WIP', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
};

const GAP = 85;

let canvasEl = null;
let detailEl = null;
let pos = 0;
let dest = 0;
let cur = 0;
let rafId = null;
let wheelAccum = 0;
let wheelTime = 0;
let currentIdx = 0;

function redraw() {
  if (!canvasEl) return;
  const ctx = canvasEl.getContext('2d');
  const W = canvasEl.width;
  const H = canvasEl.height;
  const R = 700;
  const cx = W + R - 40;
  const cy = H / 2;
  const step = GAP / R;
  const off = pos;

  ctx.clearRect(0, 0, W, H);

  const span = step * 5;
  const a0 = Math.PI - span;
  const a1 = Math.PI + span;

  ctx.beginPath();
  ctx.arc(cx, cy, R, a0, a1);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  for (let i = -4; i <= 4; i++) {
    const ang = Math.PI + (i + 0.5 - (off - cur)) * step;
    if (ang < a0 - 0.05 || ang > a1 + 0.05) continue;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * (R - 14), cy + Math.sin(ang) * (R - 14));
    ctx.lineTo(cx + Math.cos(ang) * (R - 1), cy + Math.sin(ang) * (R - 1));
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  releases.forEach((r, i) => {
    const ang = Math.PI + (off - i) * step;
    const x = cx + Math.cos(ang) * R;
    const y = cy + Math.sin(ang) * R;
    if (y < -10 || y > H + 10) return;
    const dist = Math.abs(i - off);
    if (dist > 4.2) return;
    const active = dist < 0.4;
    ctx.save();
    ctx.font = `${active ? 300 : 400} ${Math.max(11, 30 - dist * 5)}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = active ? 'rgba(240,240,248,1)' : `rgba(160,160,175,${Math.max(0.06, 1 - dist * 0.24)})`;
    ctx.fillText(r.version, x, y);
    ctx.restore();
  });
}

function tick() {
  const d = dest - pos;
  if (Math.abs(d) < 0.003) {
    pos = dest;
    redraw();
    rafId = null;
    return;
  }
  pos += d * 0.16;
  redraw();
  rafId = requestAnimationFrame(tick);
}

function renderDetail(idx) {
  const entry = releases[idx];
  const prev = idx - 1;
  const next = idx + 1;

  const statusBadge =
    entry.status === 'latest'
      ? '<span class="changelog-badge changelog-badge--latest">Latest</span>'
      : entry.status === 'first'
        ? '<span class="changelog-badge changelog-badge--first">First release</span>'
        : '';

  const changesHtml = entry.changes
    .map((c, i) => {
      const t = tagStyle[c.type];
      const showGroup = c.group && (i === 0 || entry.changes[i - 1].group !== c.group);
      const groupHtml = showGroup
        ? `<div class="changelog-group"><span>◆ ${c.group}</span><div class="changelog-group-line"></div></div>`
        : '';
      return `${groupHtml}<div class="changelog-change">
        <span class="changelog-tag" style="color:${t.color};background:${t.bg};border-color:${t.border}">${t.label}</span>
        <p>${c.text}</p>
      </div>`;
    })
    .join('');


    // prev and next version buttons (vertically now)
  const prevBtn = prev >= 0 ? `<button class="changelog-nav-btn" data-goto="${prev}"><span>&uarr;</span> ${releases[prev].version}</button>` : '';
  const nextBtn = next < releases.length ? `<button class="changelog-nav-btn" data-goto="${next}"><span>&darr;</span> ${releases[next].version}</button>` : '';

  detailEl.innerHTML = `
    <div class="changelog-badges">${statusBadge}</div>
    <h1 class="changelog-title">${entry.version} - ${entry.name}</h1>
    <p class="changelog-date">${entry.date}</p>
    <p class="changelog-summary">${entry.summary}</p>
    <div class="changelog-divider"></div>
    <div class="changelog-changes">${changesHtml}</div>
    <div class="changelog-nav-buttons">${prevBtn}${nextBtn}</div>
  `;

// scroll for long list, not to scroll the wheel
  detailEl.querySelector('.changelog-changes')?.addEventListener('wheel', (e) => e.stopPropagation());

  detailEl.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => goTo(Number(btn.dataset.goto)));
  });
}

function goTo(n) {
  if (n < 0 || n >= releases.length || n === cur) return;
  cur = n;
  dest = n;
  detailEl.classList.remove('is-visible');
  setTimeout(() => {
    currentIdx = n;
    renderDetail(n);
    detailEl.classList.add('is-visible');
  }, 150);
  if (!rafId) rafId = requestAnimationFrame(tick);
}

function fitCanvas() {
  if (!canvasEl) return;
  canvasEl.width = canvasEl.offsetWidth;
  canvasEl.height = canvasEl.offsetHeight;
  redraw();
}


export function onChangelogOpen() {
  fitCanvas();
}

export function initChangelog() {
  canvasEl = document.getElementById('changelogCanvas');
  detailEl = document.getElementById('changelogDetail');
  if (!canvasEl || !detailEl) return;

  document.getElementById('changelogCount').textContent = `${releases.length} releases`;

  fitCanvas();
  renderDetail(currentIdx);
  detailEl.classList.add('is-visible');

  window.addEventListener('resize', fitCanvas);


  // scoped to panel (not windw)
  const panel = document.getElementById('changelogPanel');
  panel?.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - wheelTime < 100) return;
      wheelAccum += e.deltaY;
      if (Math.abs(wheelAccum) < 25) return;
      const d = wheelAccum > 0 ? 1 : -1;
      wheelAccum = 0;
      wheelTime = now;
      goTo(cur + d);
    },
    { passive: false },
  );
}