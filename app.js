const WEEK_AVAILABILITY = {
  'davos':   { 2: true,  3: false, 4: false, 5: false, 6: false, 7: false },
  'hukuk':   { 2: true,  3: false, 4: false, 5: false, 6: false, 7: false },
  'gobilim': { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  'etik':    { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  'termin':  { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  'tibbi':   { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  'rusca4':  { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  'rusca6':  { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
};

function lockCheck() {
  const val = document.getElementById('lock-input').value;
  if (val === '3131') {
    document.getElementById('lockscreen').style.display = 'none';
    sessionStorage.setItem('unlocked', '1');
    initApp();
  } else {
    const inp = document.getElementById('lock-input');
    inp.classList.add('wrong');
    inp.value = '';
    setTimeout(() => inp.classList.remove('wrong'), 400);
  }
}
window.addEventListener('load', function () {
  if (sessionStorage.getItem('unlocked') === '1') {
    var ls = document.getElementById('lockscreen');
    if (ls) ls.style.display = 'none';
    initApp();
    return;
  }
  var inp = document.getElementById('lock-input');
  if (inp) {
    inp.addEventListener('input', function () {
      if (inp.value.length >= 4) lockCheck();
    });
    setTimeout(function () { inp.focus(); }, 300);
  }
});

// ════════════════════════════════════════════════
// DERS PROGRAMI VERİSİ
// ════════════════════════════════════════════════
const SCHEDULE = {
  'Pazartesi': [{ name: 'Ardıl Çeviriye Giriş', time: '09:30–13:15', panel: 'davos', color: '#c8f135', icon: '🎙️' }, { name: 'Hukuk Çevirisi', time: '13:30–16:15', panel: 'hukuk', color: '#e8c547', icon: '⚖️' }],
  'Salı': [{ name: 'Çeviri Göstergebilimi II', time: '11:30–14:30', panel: 'gobilim', color: '#a78bfa', icon: '📐' }],
  'Çarşamba': [{ name: 'Çeviride Etik', time: '08:30–11:15', panel: 'etik', color: '#f97316', icon: '⚡' }, { name: 'Çevirmenler İçin Terminoloji', time: '09:30–12:15', panel: 'termin', color: '#4ade80', icon: '📖' }, { name: 'Tıbbi Bitki', time: '13:00–14:45', panel: 'tibbi', color: '#fb923c', icon: '🌿' }],
  'Perşembe': [{ name: 'Rusça IV', time: '11:30–14:15', panel: 'rusca4', color: '#38bdf8', icon: '🇷🇺' }, { name: 'Rusça VI', time: '14:30–17:15', panel: 'rusca6', color: '#38bdf8', icon: '🇷🇺' }]
};
const COURSES = [
  { id: 'davos',   name: 'Ardıl Çeviriye Giriş',           icon: '🎙️', color: '#c8f135', desc: 'Davos 2026 · WEF terminoloji ve pratik',     room: 'FEF 228',  day: 'Pazartesi', time: '09:30–13:15', available: true  },
  { id: 'hukuk',   name: 'Hukuk Çevirisi (Seçmeli)',        icon: '⚖️',  color: '#e8c547', desc: 'Deborah Cao · AB Mevzuatı Çeviri Rehberi', room: 'FEF 140',  day: 'Pazartesi', time: '13:30–16:15', available: true  },
  { id: 'gobilim', name: 'Çeviri Göstergebilimi II',         icon: '📐',  color: '#a78bfa', desc: 'Göstergebilim · Öztürk Kasar modeli',        room: 'FEF 228',  day: 'Salı',      time: '13:30–14:30', available: false },
  { id: 'etik',    name: 'Çeviride Etik',                   icon: '⚡',  color: '#f97316', desc: 'Mesleki sorumluluklar · Etik ilkeler',       room: 'FEF 33',   day: 'Çarşamba',  time: '08:30–11:15', available: false },
  { id: 'termin',  name: 'Çevirmenler İçin Terminoloji',    icon: '📖',  color: '#4ade80', desc: 'Terminoloji teorisi ve uygulama',           room: 'FEF 235',  day: 'Çarşamba',  time: '09:30–12:15', available: false },
  { id: 'tibbi',   name: 'Tıbbi Bitki (Seçmeli)',            icon: '🌿',  color: '#fb923c', desc: 'Tıbbi terminoloji · Bitki sözlüğü',          room: '',         day: 'Çarşamba',  time: '13:00–14:45', available: false },
  { id: 'rusca4',  name: 'Rusça IV',                         icon: '🇷🇺', color: '#38bdf8', desc: 'Orta ileri Rusça terminoloji',              room: 'YDYO 226', day: 'Perşembe',  time: '11:30–14:15', available: false },
  { id: 'rusca6',  name: 'Rusça VI',                         icon: '🇷🇺', color: '#38bdf8', desc: 'İleri düzey Rusça terminoloji',             room: 'YDYO 226', day: 'Perşembe',  time: '14:30–17:15', available: false },
];

// ════════════════════════════════════════════════
// DROPDOWN
// ════════════════════════════════════════════════

function _positionMenu(dd) {
  var menu = document.querySelector('.drop-menu[data-parent-id="' + dd.id + '"]') || dd.querySelector('.drop-menu');
  if (!menu) return;
  var rect = dd.getBoundingClientRect();
  menu.style.position = 'fixed';
  menu.style.top = '52px';
  var leftPos = rect.left;
  if (leftPos + 260 > window.innerWidth) leftPos = window.innerWidth - 268;
  if (leftPos < 4) leftPos = 4;
  menu.style.left = leftPos + 'px';
}

function closeAllDrops() {
  document.querySelectorAll('.dropdown').forEach(function (d) { d.classList.remove('open'); });
  document.querySelectorAll('.body-menu').forEach(function (m) { m.style.display = 'none'; });
}

function toggleDrop(id) {
  var dd = document.getElementById(id);
  if (!dd) return;
  var isOpen = dd.classList.contains('open');
  closeAllDrops();
  if (!isOpen) {
    _positionMenu(dd);
    dd.classList.add('open');
    var menu = document.querySelector('.drop-menu[data-parent-id="' + id + '"]');
    if (menu) menu.style.display = 'flex';
  }
}

function initDropdowns() {
  document.querySelectorAll('.app-switcher .dropdown').forEach(function (dd) {
    if (!dd.id) return;
    var menu = dd.querySelector('.drop-menu');
    if (menu) {
      menu.dataset.parentId = dd.id;
      menu.classList.add('body-menu');
      document.body.appendChild(menu);
    }
  });

  var switcher = document.querySelector('.app-switcher');
  if (switcher) {
    var lastScroll = switcher.scrollLeft;
    switcher.addEventListener('scroll', function () {
      if (Math.abs(switcher.scrollLeft - lastScroll) > 10) {
        closeAllDrops();
      }
      lastScroll = switcher.scrollLeft;
    }, { passive: true });
  }

  const COURSE_DROP_MAP = {
    'drop-davos':   'davos',
    'drop-hukuk':   'hukuk',
    'drop-gobilim': 'gobilim',
    'drop-etik':    'etik',
    'drop-termin':  'termin',
    'drop-tibbi':   'tibbi',
    'drop-rusca4':  'rusca4',
    'drop-rusca6':  'rusca6'
  };

  document.querySelectorAll('.drop-label').forEach(function (btn) {
    var dropId = btn.getAttribute('data-drop-id');
    function handleToggle(e) {
      e.stopPropagation();
      if (e.type === 'touchstart') {
        btn.dataset.touched = '1';
        btn.dataset.touchX = e.touches[0].clientX;
        btn.dataset.touchY = e.touches[0].clientY;
        return;
      } else if (e.type === 'click' && btn.dataset.touched === '1') {
        btn.dataset.touched = '0';
        const dx = Math.abs(e.clientX - parseFloat(btn.dataset.touchX || 0));
        const dy = Math.abs(e.clientY - parseFloat(btn.dataset.touchY || 0));
        if (dx > 10 || dy > 10) return;
      }
      if (dropId === 'apps-menu') {
        toggleAppsMenu();
      } else if (dropId && COURSE_DROP_MAP[dropId]) {
        openWeekOverlay(COURSE_DROP_MAP[dropId]);
      } else if (dropId) {
        toggleDrop(dropId);
      }
    }
    btn.addEventListener('click', handleToggle);
    btn.addEventListener('touchstart', handleToggle, { passive: true });
  });

  document.querySelectorAll('.drop-item').forEach(function (btn) {
    var app = btn.getAttribute('data-app');
    var label = btn.getAttribute('data-label');
    var drop = btn.getAttribute('data-drop');
    if (app !== null) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeAllDrops();
        switchApp(app, label, drop);
      });
    }
  });

  var logo = document.querySelector('.app-logo');
  if (logo) {
    logo.addEventListener('click', function () {
      closeAllDrops();
      switchApp('dashboard', '', '');
    });
  }

  var searchBtn = document.getElementById('search-btn-main');
  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown') && !e.target.closest('#apps-popup') && !e.target.closest('.body-menu')) {
      closeAllDrops();
    }
  });
}

// ════════════════════════════════════════════════
// APP SWITCHER
// ════════════════════════════════════════════════
(function () {
  let lastY = 0;
  window.addEventListener('scroll', function () {
    const nav = document.querySelector('#panel-davos nav');
    if (!nav) return;
    const panel = document.getElementById('panel-davos');
    if (!panel || !panel.classList.contains('visible')) return;
    const y = window.scrollY;
    if (y > lastY && y > 100) nav.classList.add('nav-hidden');
    else nav.classList.remove('nav-hidden');
    lastY = y;
  }, { passive: true });
})();

function switchApp(app, label, dropId, fromPopState) {
  document.querySelectorAll('.app-panel').forEach(p => p.classList.remove('visible'));
  const panel = document.getElementById('panel-' + app);
  if (panel) panel.classList.add('visible');
  document.querySelectorAll('.drop-item').forEach(b => b.classList.remove('active-item'));
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('has-active', 'open'));
  if (dropId) {
    const targetDrop = document.getElementById('drop-' + dropId);
    if (targetDrop) {
      targetDrop.classList.add('has-active');
      targetDrop.querySelectorAll('.drop-item').forEach(b => {
        if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + app + "'")) b.classList.add('active-item');
      });
    }
  }
  if (!fromPopState) {
    try { const _urlId = app === 'davos' ? 'ardil' : app; history.pushState({ app, dropId }, '', '#' + _urlId); } catch (e) { }
  }
  try { localStorage.setItem('tariktanta-lastpanel', JSON.stringify({ app, dropId })); } catch (e) { }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('popstate', function (e) {
  if (e.state && e.state.app) {
    switchApp(e.state.app, '', e.state.dropId || '', true);
  } else {
    switchApp('dashboard', '', '', true);
  }
});

function restoreLastPanel() {
  try {
    const saved = localStorage.getItem('tariktanta-lastpanel');
    if (saved) {
      const { app, dropId } = JSON.parse(saved);
    }
  } catch (e) { }
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('drop-item')) { closeAllDrops(); return; }
  if (!e.target.closest('.dropdown') && !e.target.closest('.body-menu')) closeAllDrops();
  if (!e.target.closest('#search-overlay') && !e.target.closest('.search-btn')) closeSearch();
});

// ════════════════════════════════════════════════
// POMODORO
// ════════════════════════════════════════════════
const POMO_WORK = 25 * 60;
const POMO_SHORT = 5 * 60;
const POMO_LONG = 15 * 60;
let pomoRemaining = POMO_WORK;
let pomoRunning = false;
let pomoIsBreak = false;
let pomoSession = 0;
let pomoTimer = null;
const POMO_CIRC = 2 * Math.PI * 27;

function pomoRender() {
  const min = String(Math.floor(pomoRemaining / 60)).padStart(2, '0');
  const sec = String(pomoRemaining % 60).padStart(2, '0');
  const disp = document.getElementById('pomoDisplay');
  disp.textContent = min + ':' + sec;
  disp.className = 'pomo-display' + (pomoIsBreak ? ' break-mode' : '');

  const total = pomoIsBreak ? (pomoSession % 4 === 0 && pomoSession > 0 ? POMO_LONG : POMO_SHORT) : POMO_WORK;
  const pct = pomoRemaining / total;
  const offset = POMO_CIRC * (1 - pct);
  const fill = document.getElementById('pomoRingFill');
  fill.setAttribute('stroke-dashoffset', offset);
  fill.setAttribute('stroke', pomoIsBreak ? '#38bdf8' : '#c8f135');

  document.getElementById('pomoMode').textContent = (pomoIsBreak ? '☕ Mola' : '📚 Çalışma') + ' · ' + pomoSession + '/4';

  const btn = document.getElementById('pomoStartBtn');
  btn.textContent = pomoRunning ? '⏸ Duraklat' : '▶ ' + (pomoRemaining < (pomoIsBreak ? total : POMO_WORK) ? 'Devam' : 'Başlat');
  btn.className = 'pomo-btn' + (pomoRunning ? ' running' : '');

  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById('pd' + i);
    if (dot) dot.className = 'pomo-dot' + (i < pomoSession % 4 || (pomoSession > 0 && i < pomoSession && !pomoIsBreak) ? ' done' : '');
  }
  const completedInCycle = pomoIsBreak ? Math.min(4, (pomoSession)) : Math.min(4, pomoSession);
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById('pd' + i);
    if (dot) dot.className = 'pomo-dot' + (i < completedInCycle % 5 ? ' done' : '');
  }
}

function pomoToggle() {
  if (pomoRunning) {
    clearInterval(pomoTimer); pomoRunning = false;
  } else {
    pomoRunning = true;
    pomoTimer = setInterval(function () {
      if (pomoRemaining > 0) {
        pomoRemaining--;
      } else {
        clearInterval(pomoTimer); pomoRunning = false;
        if (!pomoIsBreak) {
          pomoSession++;
          pomoIsBreak = true;
          pomoRemaining = (pomoSession % 4 === 0) ? POMO_LONG : POMO_SHORT;
          try { const ctx = new AudioContext(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5); o.start(); o.stop(ctx.currentTime + 0.5); } catch (e) { }
        } else {
          pomoIsBreak = false;
          pomoRemaining = POMO_WORK;
          try { const ctx = new AudioContext(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value = 440; g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5); o.start(); o.stop(ctx.currentTime + 0.5); } catch (e) { }
        }
        pomoRunning = true;
        pomoTimer = setInterval(arguments.callee, 1000);
      }
      pomoRender();
    }, 1000);
  }
  pomoRender();
}

function pomoReset() {
  clearInterval(pomoTimer); pomoRunning = false; pomoIsBreak = false;
  pomoRemaining = POMO_WORK; pomoSession = 0; pomoRender();
}

// ════════════════════════════════════════════════
// DASHBOARD INIT
// ════════════════════════════════════════════════
function initDashboard() {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning, my lord' : hour < 18 ? 'Good afternoon, my lord' : 'Good evening, my lord';
  document.getElementById('dash-greeting').textContent = greet;
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const now = new Date();
  const todayIdx = now.getDay();
  const today = days[todayIdx];

  let showDay, showLabel, isTomorrow = false;
  const isPazar = todayIdx === 0;
  const isPersembe = todayIdx === 4;
  const switchTime = (isPazar) ? 12 : 18;

  if (hour >= switchTime) {
    isTomorrow = true;
    const tomorrowIdx = (todayIdx + 1) % 7;
    showDay = days[tomorrowIdx];
    showLabel = 'Yarın · ' + showDay;
  } else {
    showDay = today;
    showLabel = today;
  }

  const todayCourses = SCHEDULE[showDay] || [];
  document.getElementById('today-day-name').textContent = showLabel;
  const tc = document.getElementById('today-courses');
  if (todayCourses.length === 0) {
    const msg = (isPersembe && hour >= 18) ? '🎉 Hafta sonu — iyi dinlenmeler!' : 'Bugün ders yok 🎉';
    tc.innerHTML = `<span style="font-size:13px;color:var(--theme-muted);font-family:DM Sans,sans-serif">${msg}</span>`;
  } else {
    todayCourses.forEach(c => {
      const pill = document.createElement('button');
      pill.className = 'today-pill';
      pill.style.cssText = `color:${c.color};border-color:${c.color};background:${c.color}18`;
      pill.textContent = `${c.icon} ${c.name} · ${c.time}`;
      pill.onclick = () => { switchApp(c.panel, c.name, c.panel); };
      tc.appendChild(pill);
    });
  }
  const grid = document.getElementById('course-grid');
  COURSES.forEach((c) => {
    const isToday = todayCourses.some(t => t.panel === c.id);
    const card = document.createElement('div');
    card.className = 'course-card' + (isToday ? ' today-highlight' : '');
    card.style.setProperty('--card-accent', c.color);
    const pct = c.available ? 25 : 0;
    const r = 18, circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    card.innerHTML = `<svg class="course-progress-ring" width="44" height="44"><circle class="progress-ring-bg" cx="22" cy="22" r="${r}"/><circle class="progress-ring-fill" cx="22" cy="22" r="${r}" stroke="${c.color}" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/></svg><div class="course-icon">${c.icon}</div><div class="course-tag">${c.available ? '● Aktif' : '○ Yakında'}</div><div class="course-name">${c.name}</div><div class="course-desc">${c.desc}</div><div class="course-day">📅 ${c.day} · ${c.time}${c.room ? ` · <span style="opacity:0.7">🏛 ${c.room}</span>` : ''}</div>`;
    card.onclick = () => { switchApp(c.id, c.name, c.id); };
    grid.appendChild(card);
  });
  const sgrid = document.getElementById('schedule-grid');
  const dayOrder = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe'];
  dayOrder.forEach(day => {
    const courses = SCHEDULE[day] || [];
    const dc = document.createElement('div');
    dc.className = 'schedule-day-card' + (day === today ? ' is-today' : '');
    let inner = `<div class="schedule-day-header"><span class="day-name">${day}</span>${day === today ? '<span class="today-dot"></span>' : ''}</div>`;
    courses.forEach(c => {
      const cd = COURSES.find(x => x.id === c.panel);
      const room = cd && cd.room ? `<div class="schedule-course-room">🏛 ${cd.room}</div>` : '';
      inner += `<div class="schedule-course-item" onclick="switchApp('${c.panel}','${c.name}','${c.panel}')"><div class="schedule-course-name" style="color:${c.color}">${c.icon} ${c.name}</div><div class="schedule-course-time">${c.time}</div>${room}</div>`;
    });
    dc.innerHTML = inner;
    sgrid.appendChild(dc);
  });
}

// ── UYGULAMALAR MENÜ ──
function toggleAppsMenu() {
  const popup = document.getElementById('apps-popup');
  const isOpen = popup.style.display === 'flex';
  popup.style.display = isOpen ? 'none' : 'flex';
  popup.style.flexDirection = 'column';
  if (!isOpen) {
    setTimeout(() => {
      document.addEventListener('click', function handler(e) {
        if (!popup.contains(e.target) && !e.target.closest('#drop-apps')) {
          popup.style.display = 'none';
          document.removeEventListener('click', handler);
        }
      });
    }, 10);
  }
}

// ── DİL SEÇİCİ ──
let _currentLang = localStorage.getItem('tariktanta-lang') || 'tr';
function setLang(lang) {
  _currentLang = lang;
  localStorage.setItem('tariktanta-lang', lang);
  const isEN = lang === 'en';

  const ftr = document.getElementById('flag-tr');
  const fen = document.getElementById('flag-en');
  if (ftr) ftr.style.opacity = isEN ? '0.4' : '1';
  if (fen) fen.style.opacity = isEN ? '1' : '0.4';

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning, my lord' : hour < 18 ? 'Good afternoon, my lord' : 'Good evening, my lord';
  const greetEl = document.getElementById('dash-greeting');
  if (greetEl) greetEl.textContent = greet;

  const sub = document.getElementById('dash-subtitle');
  if (sub) sub.textContent = isEN ? 'Final year — 8 courses, 1 goal.' : 'Son sinif — 8 ders, 1 hedef.';

  const todayLabel = document.querySelector('.today-label');
  if (todayLabel) todayLabel.textContent = isEN ? '📅 Today\'s Classes' : '📅 Bugunun Dersleri';

  const appsLabel = document.querySelector('#drop-apps .drop-label');
  if (appsLabel) appsLabel.textContent = isEN ? 'APPS' : 'UYGULAMALAR';

  const navLabels = {
    'droplabel-hukuk': isEN ? 'LAW' : 'HUKUK',
    'droplabel-davos': isEN ? 'CONSEC.' : 'ARDIL',
  };
  Object.entries(navLabels).forEach(function (entry) {
    const el = document.getElementById(entry[0]);
    if (el) el.textContent = entry[1];
  });

  // Sıra: drop-gobilim, drop-etik, drop-termin, drop-tibbi, drop-rusca4, drop-rusca6
  const noIdLabels = isEN
    ? ['SEMIOTICS', 'ETHICS', 'TERMINOLOGY', 'MEDICINAL', 'RUSSIAN IV', 'RUSSIAN VI']
    : ['GÖSTERGEBİLİM', 'ETİK', 'TERMİNOLOJİ', 'TIBBİ BİTKİ', 'RUSÇA IV', 'RUSÇA VI'];
  const allDropLabels = document.querySelectorAll('.app-switcher .dropdown:not(#drop-hukuk):not(#drop-davos):not(#drop-apps) .drop-label');
  allDropLabels.forEach(function (el, i) { if (noIdLabels[i]) el.textContent = noIdLabels[i]; });

  const soundMap = [
    { key: 'none', tr: '🔇 Kapali', en: '🔇 Off' },
    { key: 'rain', tr: '🌧️ Yagmur', en: '🌧️ Rain' },
    { key: 'forest', tr: '🐦 Orman', en: '🐦 Forest' },
    { key: 'wind', tr: '💨 Ruzgar', en: '💨 Wind' },
    { key: 'fire', tr: '🔥 Somine', en: '🔥 Fire' },
    { key: 'piano', tr: '🎹 Piyano', en: '🎹 Piano' },
    { key: 'ocean', tr: '🌊 Okyanus', en: '🌊 Ocean' },
  ];
  document.querySelectorAll('.sound-opt').forEach(function (btn) {
    const s = soundMap.find(function (x) { return x.key === btn.dataset.sound; });
    if (s) btn.textContent = isEN ? s.en : s.tr;
  });

  const pomoStart = document.getElementById('pomoStartBtn');
  if (pomoStart && !pomoStart.classList.contains('running')) {
    pomoStart.textContent = isEN ? '▶ Start' : '▶ Baslat';
  }

  const wodLabel = document.querySelector('#word-of-day-widget .wod-label');
  if (wodLabel) {
    const isPhrasal = wodLabel.textContent.includes('Phrasal') || wodLabel.textContent.includes('phrasal');
    if (isEN) wodLabel.textContent = isPhrasal ? '🔤 Phrasal Verb of the Day' : '📚 Term of the Day';
    else wodLabel.textContent = isPhrasal ? '🔤 Gunun Phrasal Verbi' : '📚 Gunun Terimi';
  }
}

// ── UYGULAMA AÇICI ──
function openApp(app) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const apps = {
    instagram: { ios: 'instagram://', web: 'https://www.instagram.com' },
    x: { ios: 'twitter://', web: 'https://x.com' },
    youtube: { ios: 'youtube://', web: 'https://www.youtube.com' },
    tiktok: { ios: 'snssdk1180://', web: 'https://www.tiktok.com' },
    spotify: { ios: 'spotify://', web: 'https://open.spotify.com' },
    github: { ios: 'github://', web: 'https://github.com' },
    coc: { ios: 'clashofclans://', web: 'https://supercell.com/en/games/clashofclans/' },
  };
  const a = apps[app];
  if (!a) return;
  if (isIOS) {
    const start = Date.now();
    window.location.href = a.ios;
    setTimeout(() => {
      if (Date.now() - start < 2000) window.open(a.web, '_blank');
    }, 1500);
  } else {
    window.open(a.web, '_blank');
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('theme-btn').textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('tariktanta-theme', next);
}
function loadTheme() {
  const saved = localStorage.getItem('tariktanta-theme');
  if (saved) { document.documentElement.setAttribute('data-theme', saved); document.getElementById('theme-btn').textContent = saved === 'dark' ? '🌙' : '☀️'; }
}

// ════════════════════════════════════════════════
// GLOBAL SEARCH
// ════════════════════════════════════════════════
const SEARCH_INDEX = [];
function buildSearchIndex() {
  hCards.forEach(c => { SEARCH_INDEX.push({ en: c.q, tr: c.a, source: '⚖️ Hukuk Çevirisi', panel: 'hukuk', type: 'flashcard' }); });
  TERMS.forEach(cat => { cat.items.forEach(([en, tr, note]) => { SEARCH_INDEX.push({ en, tr, note, source: '🎙️ Davos · ' + cat.cat.replace(/^[^ ]+ /, ''), panel: 'davos', type: 'term' }); }); });
}
function openSearch() { document.getElementById('search-overlay').classList.add('open'); setTimeout(() => document.getElementById('global-search-input').focus(), 50); }
function closeSearch() { document.getElementById('search-overlay').classList.remove('open'); document.getElementById('global-search-input').value = ''; document.getElementById('search-results').innerHTML = '<div class="search-empty">Aramak istediğiniz terimi yazın.<br><span style="font-size:12px;color:#555">Tüm derslerin terminolojisinde arama yapılır.</span></div>'; }
function highlight(text, q) { if (!q) return text; const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'); return String(text).replace(re, '<mark>$1</mark>'); }
function globalSearch(q) {
  const res = document.getElementById('search-results');
  if (!q || q.length < 2) { res.innerHTML = '<div class="search-empty">En az 2 karakter girin.</div>'; return; }
  const ql = q.toLowerCase();
  const matches = SEARCH_INDEX.filter(item => (item.en && item.en.toLowerCase().includes(ql)) || (item.tr && item.tr.toLowerCase().includes(ql)) || (item.note && item.note.toLowerCase().includes(ql))).slice(0, 30);
  if (matches.length === 0) { res.innerHTML = '<div class="search-empty">Sonuç bulunamadı.</div>'; return; }
  let html = `<div class="search-section-label">${matches.length} sonuç</div>`;
  matches.forEach(item => { html += `<div class="search-result-item" onclick="closeSearch();switchApp('${item.panel}','','${item.panel}')"><div class="search-result-icon">${item.type === 'term' ? '📌' : '🃏'}</div><div><div class="search-result-en">${highlight(item.en, q)}</div><div class="search-result-tr">${highlight(item.tr, q)}</div><div class="search-result-source">${item.source}</div></div></div>`; });
  res.innerHTML = html;
}

// ════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ════════════════════════════════════════════════
document.addEventListener('keydown', function (e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const k = e.key.toLowerCase();
  if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); openSearch(); return; }
  if (k === 'escape') { closeSearch(); return; }
  if (k === 'd') { switchApp('dashboard', '', ''); return; }
  if (k === 't') { toggleTheme(); return; }
  if (k === '/') { e.preventDefault(); openSearch(); return; }
  const sc = { '1': 'hukuk', '2': 'davos', '3': 'gobilim', '4': 'rusca4', '5': 'rusca6', '6': 'etik', '7': 'termin', '8': 'tibbi' };
  if (sc[k]) { switchApp(sc[k], '', sc[k]); }
});

// ════════════════════════════════════════════════
// HUKUK LOGIC
// ════════════════════════════════════════════════
function hScrollTo(id) { const el = document.getElementById(id); if (!el) return; window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 110, behavior: 'smooth' }); }
const hCards = [
  { q: "Legal translation nedir?", a: "Hukuk diliyle ilgili metinleri kaynak dilden (SL) hedef dile (TL) aktarma. Teknik çevirinin alt dalıdır.", topic: "Temel Tanım" },
  { q: "Hukuki çeviri hangi 4 kritere göre sınıflandırılır?", a: "1) Konu maddesine 2) Kaynak metnin statüsüne 3) Metnin işlevine 4) Hedef metnin amacına göre", topic: "Sınıflandırma" },
  { q: "SHALL — kanun dilinde ne anlama gelir?", a: "Zorunluluk yükler: 'bir eylem yapmak zorundadır'", topic: "İllokütif Güç" },
  { q: "MAY — kanun dilinde ne anlama gelir?", a: "Hak / yetki / güç tanır: 'yapabilir'", topic: "İllokütif Güç" },
  { q: "Hukuki çevirinin üç zorluk kaynağı?", a: "1) Hukuk sistemleri farklılıkları 2) Dilsel ve terminolojik farklılıklar 3) Kültürel farklılıklar", topic: "Zorluk Kaynakları" },
  { q: "Eşit özgünlük ilkesi nedir?", a: "Uluslararası antlaşmaların tüm resmi dil versiyonları — çeviri olsa bile — eşit hukuki güce sahiptir.", topic: "Uluslararası Hukuk" },
  { q: "Regulation (Tüzük) neden direktiften farklıdır?", a: "Tüzük tüm üye devletlerde doğrudan bağlayıcı. Direktif ise ulusal hukuka aktarılmalıdır.", topic: "AB Düzenleme Türleri" },
  { q: "European Council'ın Türkçe karşılığı?", a: "AB Zirvesi — Council of Europe (Avrupa Konseyi) ile karıştırılmamalı!", topic: "Karıştırılan Terimler" },
  { q: "'Having regard to the Treaty on the Functioning of the European Union' — Türkçesi?", a: "Avrupa Birliği'nin İşleyişi Hakkında Antlaşma'yı … göz önünde tutarak,", topic: "Referans Kalıpları" },
  { q: "AB mevzuatı biçimsel çeviride hangi yazı tipi ve punto?", a: "Times New Roman, 12 punto. Yeni Word belgesi olarak hazırlanır.", topic: "Biçimsel Kurallar" },
  { q: "Whereas kalıbının Türkçe karşılığı?", a: "Format 1: 'Aşağıdaki gerekçelerle:' | Format 2: Her gerekçe '…dığından;' ile biter", topic: "Gerekçeler Bölümü" },
  { q: "HAVE ADOPTED THIS REGULATION — Türkçesi?", a: "İŞBU TÜZÜĞÜ KABUL ETMİŞTİR:", topic: "Gerekçe-Madde Bağlantısı" },
  { q: "OJ kısaltması: 1 Şubat 2003 öncesi ve sonrası?", a: "Öncesi: ATRG | Sonrası: ABRG", topic: "Atıf Kuralları" },
  { q: "'By way of derogation from Article …' ifadesinin Türkçesi?", a: "… maddesine istisna olarak,", topic: "Özel İfadeler" },
  { q: "'This Regulation establishes...' çevirisinde ne dikkat edilmeli?", a: "'-mektedir' eki KULLANILMAZ. Doğrusu: 'Bu Tüzük ile … tesis edilir.'", topic: "Zaman Kipleri" },
  { q: "Approximation vs Harmonization of laws farkı?", a: "Approximation = yaklaştırılması | Harmonization = uyumlaştırılması", topic: "Karıştırılan Terimler" },
  { q: "Hukuki dili 'sui generis' yapan nedir?", a: "Evrensel bilgi aktaran diğer teknik çevirilerden farklı; ulusal/kültürel bağlama sıkı bağlıdır.", topic: "Teorik Temel" },
  { q: "Inter alia ne demek?", a: "Diğerlerinin yanı sıra", topic: "Özel İfadeler" },
  { q: "AB mevzuatında başlık sıralaması nasıldır?", a: "Konu (on/concerning) → Tarih → Numara → Kurum adı", topic: "Biçimsel Kurallar" },
  { q: "'Done at Brussels, 12 March 2020.' Türkçesi?", a: "Brüksel'de, 12 Mart 2020 tarihinde düzenlenmiştir.", topic: "İmza Bölümü" }
];
let hKnown = [], hRetry = [], hShuffled = [...hCards], hCurrentIndex = 0;
function hGetCurrentQueue() { if (hRetry.length > 0) return hRetry; return hShuffled.filter(c => !hKnown.includes(c)); }
function hRenderCard() { const queue = hGetCurrentQueue(); if (queue.length === 0) { document.getElementById('hfc-question').textContent = '🎉 Tüm kartları biliyorsun!'; document.getElementById('hfc-answer').textContent = 'Karıştır ve tekrar başla.'; document.getElementById('hfc-topic').textContent = ''; document.getElementById('hfc-counter').textContent = 'Tamamlandı!'; hUpdateLeitnerStats(); return; } const c = queue[hCurrentIndex % queue.length]; const card = document.getElementById('hflashcard'); card.classList.remove('revealed'); document.getElementById('hfc-question').textContent = c.q; document.getElementById('hfc-answer').textContent = c.a; document.getElementById('hfc-hint').textContent = '↑ Cevabı görmek için tıkla'; document.getElementById('hfc-title').textContent = c.q.length > 50 ? c.q.substring(0, 50) + '…' : c.q; document.getElementById('hfc-topic').textContent = '📌 ' + c.topic; document.getElementById('hfc-counter').textContent = (hCurrentIndex % queue.length + 1) + ' / ' + queue.length; hUpdateLeitnerStats(); }
function hRevealCard() { document.getElementById('hflashcard').classList.add('revealed'); document.getElementById('hfc-hint').textContent = ''; }
function hMarkKnow() { const queue = hGetCurrentQueue(); const c = queue[hCurrentIndex % queue.length]; if (!hKnown.includes(c)) hKnown.push(c); hRetry = hRetry.filter(x => x !== c); hCurrentIndex = 0; hRenderCard(); }
function hMarkDunno() { const queue = hGetCurrentQueue(); const c = queue[hCurrentIndex % queue.length]; if (!hRetry.includes(c)) hRetry.push(c); hCurrentIndex = (hCurrentIndex + 1) % Math.max(1, queue.length); hRenderCard(); }
function hShuffleCards() { for (let i = hShuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[hShuffled[i], hShuffled[j]] = [hShuffled[j], hShuffled[i]]; } hKnown = []; hRetry = []; hCurrentIndex = 0; hRenderCard(); }
function hUpdateLeitnerStats() { const pending = hShuffled.filter(c => !hKnown.includes(c) && !hRetry.includes(c)).length; document.getElementById('h-stat-pending').textContent = pending; document.getElementById('h-stat-known').textContent = hKnown.length; document.getElementById('h-stat-retry').textContent = hRetry.length; }
function hToggleCheck(el) { el.classList.toggle('done'); const li = el.parentElement; li.querySelector('span').classList.toggle('done-item'); li.classList.toggle('done-item'); }

// ════════════════════════════════════════════════
// DAVOS DATA
// ════════════════════════════════════════════════
const SESSIONS = [
  { color: '#c8f135', num: 'OTURUM 01', name: 'Geopolitik & Güvenlik', desc: 'Demokrasinin geleceği, NATO, Ukrayna-Rusya, Grönland meselesi.', detail: `<strong>Ana Sorular:</strong><br>"Is Democracy in Trouble?" · "Who Brokers Trust Now?" · "Can Europe Defend Itself?"<br><br><strong>Öne Çıkanlar:</strong> ABD ile NATO müttefikleri arasındaki gerginlik, Grönland tartışmaları ve Ukrayna barış süreci.<br><div class="key-quote">"If you're not at the table, you're on the menu." — Mark Carney</div>` },
  { color: '#38bdf8', num: 'OTURUM 02', name: 'Küresel Ekonomi & Ticaret', desc: 'Gümrük tarifeleri, korumacılık, IMF verileri ve çok kutuplu ekonomik düzen.', detail: `<strong>Ana Soru:</strong> Küresel ekonomiyi parçalamadan ülkeler çıkarlarını nasıl koruyabilir?<br><br><strong>Kristalina Georgieva (IMF):</strong><div class="key-quote">"We are not in Kansas anymore." — Georgieva</div><strong>Dikkat:</strong> "tariffs", "levies", "duties" — hepsi gümrük/vergi ama farklı bağlamlarda.` },
  { color: '#f97316', num: 'OTURUM 03', name: 'Yapay Zeka & Teknoloji', desc: 'AI egemenliği, altyapı sahipliği, Jensen Huang ve dijital bölünme.', detail: `<strong>Öne Çıkan:</strong> Jensen Huang (NVIDIA CEO) — hesaplama altyapısının dönüşümü.<br><br><strong>Dikkat:</strong> "compute" isim olarak da kullanılır → <em>hesaplama kapasitesi/gücü</em>.` },
  { color: '#a78bfa', num: 'OTURUM 04', name: 'Enerji Güvenliği', desc: 'IEA Fatih Birol, nükleer rönesans, yenilenebilir enerji ve enerji trilemması.', detail: `<strong>"Who is Winning on Energy Security?"</strong><br>IEA Direktörü Fatih Birol: Küresel elektrik talebi genel enerji talebinin <strong>2,5 katı</strong> hızla büyüyor.<br><div class="key-quote">"Dispatchable sources" = talebe göre devreye giren kaynaklar.</div>` },
  { color: '#f87171', num: 'OTURUM 05', name: 'Demokrasi & Yönetişim', desc: 'Kutuplaşma, kurumsal güven krizi, sivil toplum ve çok paydaşlı model.', detail: `<strong>Dikkat:</strong> "governance" = yönetişim (sadece hükümet değil!). "government" = hükümet.` },
  { color: '#4ade80', num: 'OTURUM 06', name: 'Kadın Sağlığı & Toplumsal Eşitlik', desc: 'Sağlıkta cinsiyet uçurumu ve ekonomik boyutları.', detail: `Kadınlar, erkeklere kıyasla hayatlarının <strong>%25 daha fazlasını</strong> kötü sağlık koşullarında geçiriyor.<br><br><strong>Dikkat:</strong> "health equity" ≠ "health equality". Equity = hakkaniyetli erişim.` },
  { color: '#fbbf24', num: 'OTURUM 07', name: 'İklim & Sürdürülebilirlik', desc: '"Gezegenin sınırları içinde refah" ve adil enerji geçişi.', detail: `<strong>Dikkat:</strong> "net-zero" çevirirken "sıfır karbon" DEMEYİN → "net sıfır emisyon".` },
  { color: '#e879f9', num: 'OTURUM 08', name: 'Latin Amerika & Güvenlik', desc: 'Narco-terörizm, kurumsal kırılganlık ve Milei\'nin mali reform konuşması.', detail: `<strong>Javier Milei (Arjantin):</strong> Mali disiplin, devlet küçülmesi, hiperenflasyon.<br><div class="key-quote">"The state is not the solution. The state is the problem." — Milei</div>` }
];
const TERMS = [
  { cat: '🔵 Jeopolitik & Dış Politika', color: '#38bdf8', items: [['rules-based international order', 'kurallara dayalı uluslararası düzen', 'En sık geçen ifadelerden'], ['geopolitical fragmentation', 'jeopolitik parçalanma', ''], ['multilateralism', 'çok taraflılık', ''], ['great power rivalry', 'büyük güç rekabeti', ''], ['deterrence', 'caydırıcılık', ''], ['sovereignty', 'egemenlik', ''], ['sanctions', 'yaptırımlar', ''], ['coercion', 'zorlama, baskı', ''], ['bilateral talks', 'ikili görüşmeler', ''], ['strained alliances', 'gergin ittifaklar', ''], ['security guarantees', 'güvenlik güvenceleri', ''], ['annexation', 'ilhak', ''], ['contested norms', 'tartışmalı normlar', ''], ['middle powers', 'orta güçler', ''], ['expansionist overtures', 'yayılmacı girişimler', '']] },
  { cat: '🔴 Ekonomi & Ticaret', color: '#f87171', items: [['tariffs', 'gümrük tarifeleri', 'Toplantının ana kelimesi'], ['trade levies', 'ticaret vergileri/harçları', ''], ['protectionism', 'korumacılık', ''], ['economic nationalism', 'ekonomik milliyetçilik', ''], ['fiscal discipline', 'mali disiplin', 'Milei\'nin ana argümanı'], ['fiscal reform', 'mali reform', ''], ['hyperinflation', 'hiperenflasyon', ''], ['debt restructuring', 'borç yeniden yapılandırması', ''], ['productivity', 'verimlilik / üretkenlik', ''], ['export controls', 'ihracat kısıtlamaları', ''], ['value chains', 'değer zincirleri', ''], ['supply chain', 'tedarik zinciri', ''], ['foreign direct investment (FDI)', 'doğrudan yabancı yatırım (DYY)', ''], ['inclusive growth', 'kapsayıcı büyüme', ''], ['headwinds', 'olumsuz koşullar', 'Ekonomide "engel" anlamında']] },
  { cat: '🟢 Yapay Zeka & Teknoloji', color: '#4ade80', items: [['AI governance', 'yapay zeka yönetişimi', ''], ['AI sovereignty', 'yapay zeka egemenliği', ''], ['generative AI', 'üretici yapay zeka', ''], ['compute power / compute', 'hesaplama gücü / kapasitesi', ''], ['data centres', 'veri merkezleri', ''], ['AI agents', 'yapay zeka ajanları', ''], ['automation', 'otomasyon', ''], ['reskilling / upskilling', 'yeniden beceri kazandırma', ''], ['workforce preparedness', 'işgücü hazırlığı', ''], ['cybersecurity', 'siber güvenlik', ''], ['democratization of AI', 'yapay zekanın demokratikleşmesi', ''], ['digital infrastructure', 'dijital altyapı', ''], ['scalable', 'ölçeklenebilir', '']] },
  { cat: '🟡 Enerji & İklim', color: '#fbbf24', items: [['energy security', 'enerji güvenliği', ''], ['energy trilemma', 'enerji trilemması', 'güvenlik+erişilebilirlik+sürdürülebilirlik'], ['energy transition', 'enerji dönüşümü', ''], ['decarbonization', 'karbonsuzlaştırma', ''], ['nuclear renaissance', 'nükleer rönesans', ''], ['renewables', 'yenilenebilir enerji kaynakları', ''], ['net-zero', 'net sıfır (emisyon)', 'Sıfır karbon DEMEYİN!'], ['just transition', 'adil geçiş', ''], ['planetary boundaries', 'gezegenin ekolojik sınırları', ''], ['dispatchable sources', 'talebe göre devreye giren kaynaklar', ''], ['intermittent renewables', 'aralıklı yenilenebilir kaynaklar', ''], ['critical minerals', 'kritik mineraller', ''], ['rare earths', 'nadir toprak elementleri', '']] },
  { cat: '🟣 Yönetişim & Toplum', color: '#a78bfa', items: [['multistakeholder', 'çok paydaşlı', 'WEF\'in özgün terimi'], ['public-private cooperation', 'kamu-özel sektör işbirliği', ''], ['civil society', 'sivil toplum', ''], ['polarization', 'kutuplaşma', ''], ['social cohesion', 'sosyal uyum', ''], ['trust deficit', 'güven açığı', ''], ['accountability', 'hesap verebilirlik', ''], ['transparency', 'şeffaflık', ''], ['governance', 'yönetişim', 'government ≠ governance!'], ['humanitarian aid', 'insani yardım', ''], ['structural not cyclical', 'yapısal, döngüsel değil', '']] }
];
const PHRASES = [
  { en: '"If we\'re not at the table, we\'re on the menu."', tr: '"Masada olmazsak, menüde oluruz."', ctx: 'Mark Carney (Kanada Başbakanı)' },
  { en: '"A rupture, not a transition."', tr: '"Bu bir geçiş değil, köklü bir kopuş."', ctx: 'Carney — dünya düzeninin değişimini anlatırken' },
  { en: '"We are not in Kansas anymore."', tr: '"Artık eski dünyada değiliz."', ctx: 'Kristalina Georgieva (IMF)' },
  { en: '"Learn to think the unthinkable."', tr: '"Düşünülemezi düşünmeyi öğrenmek."', ctx: 'Georgieva — dışsal şoklara hazırlık' },
  { en: '"Exogenous shocks"', tr: '"Dışsal şoklar"', ctx: 'Dışarıdan gelen öngörülemeyen krizler' },
  { en: '"Structural, not cyclical"', tr: '"Yapısal, döngüsel değil"', ctx: 'Ekonomistlerin çok kullandığı ayrım' },
  { en: '"Echo chamber of consensus"', tr: '"Mutabakat yankı odası"', ctx: 'WEF Başkanı Borge Brende' },
  { en: '"Level playing field"', tr: '"Eşit rekabet ortamı"', ctx: 'Ticaret oturumlarında çok geçer' },
  { en: '"Double down"', tr: '"Kararlılığı artırmak, ısrar etmek"', ctx: 'Bir stratejiye sıkı bağlı kalmak' },
  { en: '"At a pivotal moment"', tr: '"Kritik bir dönüm noktasında"', ctx: 'Neredeyse her Davos konuşmasında' },
  { en: '"Unlock opportunities"', tr: '"Fırsatları açığa çıkarmak"', ctx: 'WEF\'in favori fiili' },
  { en: '"In the wake of"', tr: '"…nin ardından, akabinde"', ctx: 'Nedensellik zinciri kurarken' },
  { en: '"Loomed large"', tr: '"Gölge düşürdü, ağır bastı"', ctx: 'Tehdidin baskın olduğunu ifade eder' },
  { en: '"Fraught moment"', tr: '"Gergin / çalkantılı an"', ctx: '"Fraught" = çok sorun/gerginlik yüklü' },
  { en: '"Bright spots"', tr: '"Parlak noktalar / umut veren alanlar"', ctx: 'Karamsarlık içinde olumlu işaretler' },
  { en: '"Systemic fault lines"', tr: '"Sistemik kırık hatları"', ctx: 'Sistemdeki yapısal zayıflık' },
  { en: '"Geopolitical noise"', tr: '"Jeopolitik gürültü"', ctx: 'Dikkat dağıtıcı jeopolitik gelişmeler' },
  { en: '"To exist is to change."', tr: '"Var olmak değişmektir."', ctx: 'İsviçre Federal Konseyi Başkanı Parmelin' },
  { en: '"A who\'s who"', tr: '"Seçkin isimler topluluğu"', ctx: 'Trump\'ın kullandığı ifade' },
  { en: '"Impartial platform"', tr: '"Tarafsız platform"', ctx: 'WEF\'in kendini tanımlamak için kullandığı ifade' },
];
const FLASHCARDS_D = TERMS.flatMap(cat => cat.items.map(t => ({ en: t[0], tr: t[1], note: t[2] })));
const QUIZ_Q = [
  { q: '"Gümrük tarifeleri" İngilizcede nasıl denir?', opts: ['tariffs', 'levies', 'duties', 'hepsinin hepsi doğru'], ans: 3, exp: 'Tariffs, levies ve duties; hepsi gümrük/vergi anlamında kullanılabilir.' },
  { q: '"Çok taraflılık" terimini bul.', opts: ['multilateralism', 'bilateralism', 'unilateralism', 'multistakeholderism'], ans: 0, exp: '"Multilateralism" = çok taraflılık.' },
  { q: '"Net sıfır" derken neyi kastediyoruz?', opts: ['Hiç emisyon üretmemek', 'Salınan emisyonu telafi ederek sıfırlamak', 'Yenilenebilir enerjiye geçiş', 'Nükleer santral kullanımı'], ans: 1, exp: 'Net-zero: atmosfere salınan karbon miktarını uzaklaştırılan miktarla sıfırlamak.' },
  { q: '"Dispatchable sources" ne demek?', opts: ['İhracat yapılabilen kaynaklar', 'Talebe göre devreye giren kaynaklar', 'Dağıtılabilir doğal kaynaklar', 'Yayılabilir enerji türleri'], ans: 1, exp: 'Nükleer, doğalgaz gibi "istendiğinde açılabilen" enerji kaynakları.' },
  { q: '"Governance" ve "government" arasındaki fark?', opts: ['Aynı anlama gelir', 'Governance = yönetişim (geniş), Government = hükümet', 'Government = yönetişim, Governance = hükümet', 'Governance sadece kurumsal şirketler için'], ans: 1, exp: '"Governance" = daha geniş, kamu-özel-sivil toplumu kapsayan yönetim anlayışı.' },
  { q: 'Georgieva\'nın Davos 2026\'daki en ünlü ifadesi?', opts: ['If you\'re not at the table...', 'We are not in Kansas anymore', 'To exist is to change', 'The state is the problem'], ans: 1, exp: 'Georgieva, Wizard of Oz\'dan alıntıyla konuştu.' },
  { q: '"Just transition" Türkçesi nedir?', opts: ['Adalet geçişi', 'Hızlı geçiş', 'Adil geçiş', 'Doğru geçiş'], ans: 2, exp: '"Just" burada "adil" anlamında.' },
  { q: '"Reskilling" ne demek?', opts: ['Tekrar ölçeklendirmek', 'Yeniden beceri kazandırmak', 'Beceri değerlendirmesi', 'Eğitim bütçesi artırmak'], ans: 1, exp: '"Reskilling" = işgücüne yeni beceriler öğretmek.' },
  { q: '"Headwinds" ekonomi bağlamında ne anlama gelir?', opts: ['Rüzgar enerjisi potansiyeli', 'Olumsuz koşullar / engeller', 'Büyüme hızlanması', 'Döviz kuru dalgalanmaları'], ans: 1, exp: 'Ekonomide: büyümeyi yavaşlatan dış etkenler.' },
  { q: '"Multistakeholder" modeli kimin felsefesidir?', opts: ['IMF', 'NATO', 'WEF (Dünya Ekonomik Forumu)', 'BM Güvenlik Konseyi'], ans: 2, exp: 'WEF\'in kuruluşundan bu yana benimsediği model.' },
  { q: '"Exogenous shock" Türkçesi?', opts: ['İçsel kriz', 'Dışsal şok', 'Ekonomik çöküş', 'Yapısal sorun'], ans: 1, exp: '"Exogenous" = dışarıdan gelen.' },
  { q: '"Level playing field" en iyi nasıl çevrilir?', opts: ['Düz oyun alanı', 'Eşit rekabet ortamı', 'Adil saha', 'Standart koşullar'], ans: 1, exp: 'Spor metaforu: herkesin eşit koşullarda rekabet ettiği alan.' },
];
const PRACTICE = [
  { en: 'Globalization has not failed — it has simply become more complex, more contested, and more consequential than ever before.', tr: 'Küreselleşme başarısız olmadı — sadece her zamankinden daha karmaşık, daha tartışmalı ve daha belirleyici bir hal aldı.' },
  { en: 'Energy security must now be elevated to the same level as national security in every country\'s strategic agenda.', tr: 'Enerji güvenliği, her ülkenin stratejik gündeminde artık ulusal güvenlikle eş düzeye taşınmalıdır.' },
  { en: 'In a world defined by great power rivalry, middle powers that fail to act collectively will find themselves not at the table, but on the menu.', tr: 'Büyük güç rekabetinin şekillendirdiği bu dünyada, birlikte hareket edemeyen orta güçler masada oturanlar arasında değil, menüde yer alan unsurlar arasında kalacak.' },
  { en: 'These disruptions are structural, not cyclical — the world we once knew is not coming back.', tr: 'Bu aksaklıklar döngüsel değil, yapısaldır — bir zamanlar bildiğimiz dünya geri dönmeyecek.' },
  { en: 'We need to deploy innovation at scale, responsibly, and with equity in mind.', tr: 'İnovasyonu ölçekli, sorumlu ve hakkaniyetli bir biçimde hayata geçirmeliyiz.' },
  { en: 'The question is no longer whether artificial intelligence will transform our economies, but whether that transformation will be inclusive or extractive.', tr: 'Artık asıl soru, yapay zekanın ekonomilerimizi dönüştürüp dönüştürmeyeceği değil; bu dönüşümün kapsayıcı mı yoksa dışlayıcı mı olacağıdır.' },
  { en: 'Nuclear power is no longer a fringe option; it is increasingly seen as a cornerstone of any credible net-zero strategy.', tr: 'Nükleer enerji artık marjinal bir seçenek değil; güvenilir herhangi bir net-sıfır stratejisinin temel taşı olarak giderek daha fazla benimsenmektedir.' },
  { en: 'Democracy is not in decline because people have stopped believing in its values; it is under pressure because institutions have failed to deliver on its promises.', tr: 'Demokrasi, insanların değerlerine inanmayı bırakması nedeniyle gerilemiyor; kurumların bu değerlerin vaadini yerine getirememesi yüzünden baskı altında.' },
];
const SPEAKERS = [
  { name: 'Donald Trump', role: 'ABD Başkanı · Açılış konuşmacısı' },
  { name: 'Mark Carney', role: 'Kanada Başbakanı · "At the table" sözü' },
  { name: 'Emmanuel Macron', role: 'Fransa Cumhurbaşkanı · Avrupa savunması' },
  { name: 'Ursula von der Leyen', role: 'AB Komisyonu Başkanı' },
  { name: 'He Lifeng', role: 'Çin Başbakan Yardımcısı · Ticaret' },
  { name: 'Javier Milei', role: 'Arjantin Cumhurbaşkanı · Mali reform' },
  { name: 'Kristalina Georgieva', role: 'IMF Başkanı · "Kansas" sözü' },
  { name: 'Jensen Huang', role: 'NVIDIA CEO · AI & GPU' },
  { name: 'Fatih Birol', role: 'IEA Direktörü · Enerji güvenliği' },
  { name: 'Mark Rutte', role: 'NATO Genel Sekreteri' },
  { name: 'Volodymyr Zelenskyy', role: 'Ukrayna Cumhurbaşkanı' },
  { name: 'Daniel Noboa', role: 'Ekvador Cumhurbaşkanı · Narco-terör' },
  { name: 'Borge Brende', role: 'WEF Başkanı' },
  { name: 'Karin Keller-Sutter', role: 'İsviçre Federal Konseyi Başkanı' },
];
const NUMBERS = [
  { val: '2.5×', label: 'Küresel elektrik talebinin genel enerji talebine kıyasla büyüme hızı (IEA)' },
  { val: '39%', label: 'Yapay zeka nedeniyle geçerliliğini yitirecek mevcut becerilerin oranı' },
  { val: '25%', label: 'Kadınların erkeklere kıyasla daha fazla kötü sağlıkta geçirdikleri yaşam süresi' },
  { val: '$1T+', label: 'Küresel AI altyapı yatırımı beklentisi (2025-2030)' },
  { val: '1.5°C', label: 'Paris Anlaşması sıcaklık hedefi' },
  { val: '56.', label: 'WEF\'nin düzenlediği Yıllık Toplantı sayısı' },
];
const ABBREVS = [
  { short: 'WEF', full: 'World Economic Forum', tr: 'Dünya Ekonomik Forumu' },
  { short: 'IMF', full: 'International Monetary Fund', tr: 'Uluslararası Para Fonu' },
  { short: 'IEA', full: 'International Energy Agency', tr: 'Uluslararası Enerji Ajansı' },
  { short: 'NATO', full: 'North Atlantic Treaty Organisation', tr: 'Kuzey Atlantik Antlaşması Örgütü' },
  { short: 'WTO', full: 'World Trade Organization', tr: 'Dünya Ticaret Örgütü' },
  { short: 'EU', full: 'European Union', tr: 'Avrupa Birliği' },
  { short: 'AI', full: 'Artificial Intelligence', tr: 'Yapay Zeka' },
  { short: 'FDI', full: 'Foreign Direct Investment', tr: 'Doğrudan Yabancı Yatırım' },
  { short: 'GDP', full: 'Gross Domestic Product', tr: 'Gayri Safi Yurt İçi Hasıla (GSYİH)' },
  { short: 'G7/G20', full: 'Group of Seven / Twenty', tr: 'Yediler / Yirmiler Grubu' },
];

// ════════════════════════════════════════════════
// DAVOS RENDER
// ════════════════════════════════════════════════
function dRenderSessions() { const grid = document.getElementById('dSessionGrid'); const tracker = document.getElementById('dSessionTracker'); SESSIONS.forEach((s, i) => { const card = document.createElement('div'); card.className = 'session-card'; card.style.setProperty('--card-color', s.color); card.innerHTML = `<div class="session-num">${s.num}</div><div class="session-name">${s.name}</div><div class="session-desc">${s.desc}</div><div class="session-detail">${s.detail}</div>`; card.onclick = () => { card.classList.toggle('open'); dMarkTracked('sess_' + i); }; grid.appendChild(card); const ti = document.createElement('div'); ti.className = 'dtracker-item' + (dIsTracked('sess_' + i) ? ' checked' : ''); ti.id = 'dti_' + i; ti.innerHTML = `<div class="dtracker-check">✓</div><label>${s.name}</label>`; ti.onclick = () => { dToggleTracked('sess_' + i, 'dti_' + i); }; tracker.appendChild(ti); }); }
function dRenderTerms() { const c = document.getElementById('dTermListContainer'); TERMS.forEach(cat => { const sec = document.createElement('div'); sec.className = 'term-section'; sec.style.setProperty('--cat-color', cat.color); sec.innerHTML = `<div class="term-section-title">${cat.cat}</div>`; const grid = document.createElement('div'); grid.className = 'term-grid'; cat.items.forEach(([en, tr, note]) => { grid.innerHTML += `<div class="term-row"><div class="dterm-en">${en}</div><div class="dterm-tr">${tr}</div><div class="dterm-note">${note}</div></div>`; }); sec.appendChild(grid); c.appendChild(sec); }); }
function dRenderPhrases() { const c = document.getElementById('dPhraseContainer'); PHRASES.forEach(p => { c.innerHTML += `<div class="phrase-card"><div class="phrase-en">${p.en}</div><div class="phrase-tr">${p.tr}</div><div class="phrase-context">📌 ${p.ctx}</div></div>`; }); }
function dRenderPractice() { const c = document.getElementById('dPracticeContainer'); PRACTICE.forEach((p, i) => { const div = document.createElement('div'); div.className = 'practice-card'; div.innerHTML = `<div class="practice-num">CÜMLE ${i + 1} / ${PRACTICE.length}<button class="done-btn" id="ddone_${i}" onclick="dTogglePracticeDone(${i})">✓</button></div><div class="practice-en">${p.en}</div><button class="show-answer-btn" onclick="dShowAnswer(${i})">Türkçeyi Gör ▾</button><div class="practice-tr" id="dptr_${i}">${p.tr}</div>`; c.appendChild(div); }); }
function dShowAnswer(i) { document.getElementById('dptr_' + i).classList.add('visible'); }
function dTogglePracticeDone(i) { document.getElementById('ddone_' + i).classList.toggle('done'); dUpdateProgress(); }
function dRenderSpeakers() { const g = document.getElementById('dSpeakerGrid'); SPEAKERS.forEach(s => { g.innerHTML += `<div class="speaker-card"><div class="speaker-name">${s.name}</div><div class="speaker-role">${s.role}</div></div>`; }); const ng = document.getElementById('dNumberGrid'); NUMBERS.forEach(n => { ng.innerHTML += `<div class="number-card"><div class="number-val">${n.val}</div><div class="number-label">${n.label}</div></div>`; }); const ag = document.getElementById('dAbbrGrid'); ABBREVS.forEach(a => { ag.innerHTML += `<div class="abbr-card"><div class="abbr-short">${a.short}</div><div><div class="abbr-full">${a.full}</div><div class="abbr-tr">${a.tr}</div></div></div>`; }); }

// DAVOS FLASHCARDS
let dFlashIndex = 0, dShuffledCards = [...FLASHCARDS_D].sort(() => Math.random() - 0.5), dKnown = [], dRetry = [];
function dGetCurrentQueue() { if (dRetry.length > 0) return dRetry; return dShuffledCards.filter(c => !dKnown.includes(c)); }
function dRenderFlashcard() { const queue = dGetCurrentQueue(); if (queue.length === 0) { document.getElementById('dFlashEN').textContent = '🎉 Tüm kartları biliyorsun!'; document.getElementById('dFlashTR').textContent = 'Karıştır ve tekrar başla.'; document.getElementById('dFlashNote').textContent = ''; document.getElementById('dFlashCounter').textContent = 'Tamamlandı!'; dUpdateLeitnerStats(); return; } const card = queue[dFlashIndex % queue.length]; document.getElementById('dFlashEN').textContent = card.en; document.getElementById('dFlashTR').textContent = card.tr; document.getElementById('dFlashNote').textContent = card.note || ''; document.getElementById('dFlashCounter').textContent = `${dFlashIndex % queue.length + 1} / ${queue.length}`; document.getElementById('dMainFlashcard').classList.remove('flipped'); dUpdateLeitnerStats(); }
function dFlipCard() { document.getElementById('dMainFlashcard').classList.toggle('flipped'); }
function dNextCard() { const q = dGetCurrentQueue(); dFlashIndex = (dFlashIndex + 1) % Math.max(1, q.length); dRenderFlashcard(); }
function dPrevCard() { const q = dGetCurrentQueue(); dFlashIndex = (dFlashIndex - 1 + Math.max(1, q.length)) % Math.max(1, q.length); dRenderFlashcard(); }
function dMarkKnow() { const queue = dGetCurrentQueue(); const c = queue[dFlashIndex % queue.length]; if (!dKnown.includes(c)) dKnown.push(c); dRetry = dRetry.filter(x => x !== c); dFlashIndex = 0; dRenderFlashcard(); }
function dMarkDunno() { const queue = dGetCurrentQueue(); const c = queue[dFlashIndex % queue.length]; if (!dRetry.includes(c)) dRetry.push(c); dFlashIndex = (dFlashIndex + 1) % Math.max(1, queue.length); dRenderFlashcard(); }
function dUpdateLeitnerStats() { const pending = dShuffledCards.filter(c => !dKnown.includes(c) && !dRetry.includes(c)).length; document.getElementById('d-stat-pending').textContent = pending; document.getElementById('d-stat-known').textContent = dKnown.length; document.getElementById('d-stat-retry').textContent = dRetry.length; }

// DAVOS QUIZ
let dQuizQuestions = [], dQuizCur = 0, dQuizScore = 0, dQuizAnswered = false;
function dStartQuiz() { dQuizQuestions = [...QUIZ_Q].sort(() => Math.random() - 0.5).slice(0, 12); dQuizCur = 0; dQuizScore = 0; dQuizAnswered = false; document.getElementById('dQuizScore').textContent = '0'; document.getElementById('dQuizTotal').textContent = dQuizQuestions.length; document.getElementById('dQuizComplete').style.display = 'none'; document.getElementById('dQuizCard').style.display = 'block'; dRenderQuizQ(); }
function dRenderQuizQ() { if (dQuizCur >= dQuizQuestions.length) { dEndQuiz(); return; } dQuizAnswered = false; const q = dQuizQuestions[dQuizCur]; document.getElementById('dQuizCurrent').textContent = dQuizCur + 1; const opts = q.opts.map((o, i) => `<button class="quiz-option" onclick="dAnswerQuiz(${i})">${o}</button>`).join(''); document.getElementById('dQuizCard').innerHTML = `<div class="quiz-type">SORU ${dQuizCur + 1} / ${dQuizQuestions.length}</div><div class="quiz-q">${q.q}</div><div class="quiz-options">${opts}</div><div class="quiz-feedback" id="dqfb"></div><button class="quiz-next" id="dqnext" onclick="dNextQuizQ()">Sonraki Soru →</button>`; }
function dAnswerQuiz(i) { if (dQuizAnswered) return; dQuizAnswered = true; const q = dQuizQuestions[dQuizCur]; const opts = document.querySelectorAll('#dQuizCard .quiz-option'); opts.forEach(o => o.disabled = true); const fb = document.getElementById('dqfb'); if (i === q.ans) { opts[i].classList.add('correct'); dQuizScore++; document.getElementById('dQuizScore').textContent = dQuizScore; fb.className = 'quiz-feedback correct-fb show'; fb.textContent = '✓ Doğru! ' + q.exp; } else { opts[i].classList.add('wrong'); opts[q.ans].classList.add('correct'); fb.className = 'quiz-feedback wrong-fb show'; fb.textContent = '✗ Yanlış. ' + q.exp; } document.getElementById('dqnext').classList.add('show'); }
function dNextQuizQ() { dQuizCur++; if (dQuizCur >= dQuizQuestions.length) dEndQuiz(); else dRenderQuizQ(); }
function dEndQuiz() { document.getElementById('dQuizCard').style.display = 'none'; const comp = document.getElementById('dQuizComplete'); comp.style.display = 'block'; document.getElementById('dFinalScore').textContent = dQuizScore + ' / ' + dQuizQuestions.length; sessionStorage.setItem('dQuizDone', '1'); dUpdateProgress(); }
const D_SECTIONS = ['oturumlar', 'terminoloji', 'kaliplar', 'flashcard', 'quiz', 'pratik', 'konusmaci'];
function dShowSection(id, btn) { D_SECTIONS.forEach(s => { document.getElementById('dsec-' + s).classList.remove('active'); }); document.querySelectorAll('.dnav-btn').forEach(b => b.classList.remove('active')); const target = document.getElementById('dsec-' + id); target.classList.add('active'); if (btn) btn.classList.add('active'); sessionStorage.setItem('dvisited_' + id, '1'); dUpdateProgress(); setTimeout(() => { const top = target.getBoundingClientRect().top + window.pageYOffset - 160; window.scrollTo({ top, behavior: 'smooth' }); }, 50); }
function dUpdateProgress() { let score = 0, total = 10; D_SECTIONS.forEach(s => { if (sessionStorage.getItem('dvisited_' + s)) score += 1; }); SESSIONS.forEach((_, i) => { if (dIsTracked('sess_' + i)) score += 0.1; }); if (sessionStorage.getItem('dQuizDone')) score += 2; const pct = Math.min(100, Math.round((score / total) * 100)); document.getElementById('dProgressFill').style.width = pct + '%'; document.getElementById('dProgressPct').textContent = pct + '%'; }
function dIsTracked(key) { return sessionStorage.getItem('d_' + key) === '1'; }
function dMarkTracked(key) { sessionStorage.setItem('d_' + key, '1'); dUpdateProgress(); }
function dToggleTracked(key, elId) { if (dIsTracked(key)) sessionStorage.removeItem('d_' + key); else sessionStorage.setItem('d_' + key, '1'); const el = document.getElementById(elId); if (el) el.classList.toggle('checked', dIsTracked(key)); dUpdateProgress(); }

// ════════════════════════════════════════════════
// PWA
// ════════════════════════════════════════════════
function registerSW() { if ('serviceWorker' in navigator) { const swCode = `const CACHE='tariktanta-v2';const ASSETS=['/'];self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const clone=res.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return res;}).catch(()=>caches.match('/')))));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));`; const blob = new Blob([swCode], { type: 'application/javascript' }); const url = URL.createObjectURL(blob); navigator.serviceWorker.register(url).catch(() => { }); } }

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
let _woSwipeStartY = 0;

function openWeekOverlay(courseId) {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return;
  closeAllDrops();

  const overlay = document.getElementById('week-overlay');
  document.getElementById('wo-icon').textContent = course.icon;
  document.getElementById('wo-title').textContent = course.name;
  document.getElementById('wo-sub').textContent = course.day + ' · ' + course.time;
  document.getElementById('wo-header-bar').style.setProperty('--wo-color', course.color);

  const cardsContainer = document.getElementById('wo-cards');
  cardsContainer.innerHTML = '';
  const avail = WEEK_AVAILABILITY[courseId] || {};

  for (let w = 2; w <= 7; w++) {
    const isAvail = !!avail[w];
    const panelId = w === 2 ? courseId : courseId + '-w' + w;
    const card = document.createElement('div');
    card.className = 'week-card ' + (isAvail ? 'week-card--active' : 'week-card--locked');
    card.style.setProperty('--wc-color', course.color);
    card.innerHTML = `
      <div class="wc-week-num">HAFTA ${w}</div>
      <div class="wc-status">${isAvail ? '<span class="wc-dot"></span>Hazır' : '🔒 Yakında'}</div>
    `;
    if (isAvail) {
      card.addEventListener('click', function() {
        closeWeekOverlay();
        switchApp(panelId, course.name, courseId);
      });
      card.addEventListener('mousemove', function(e) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(500px) rotateY(${x*16}deg) rotateX(${-y*16}deg) translateY(-4px) scale(1.03)`;
      });
      card.addEventListener('mouseleave', function() { card.style.transform = ''; });
    }
    cardsContainer.appendChild(card);
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  const modal = overlay.querySelector('.week-overlay-modal');
  modal.ontouchstart = function(e) { _woSwipeStartY = e.touches[0].clientY; };
  modal.ontouchmove = function(e) {
    const dy = e.touches[0].clientY - _woSwipeStartY;
    if (dy > 0) modal.style.transform = 'translateY(' + dy + 'px)';
  };
  modal.ontouchend = function(e) {
    const dy = e.changedTouches[0].clientY - _woSwipeStartY;
    if (dy > 90) { closeWeekOverlay(); }
    else { modal.style.transform = ''; }
  };
}

function closeWeekOverlay() {
  const overlay = document.getElementById('week-overlay');
  const modal = overlay.querySelector('.week-overlay-modal');
  overlay.classList.remove('open');
  modal.style.transform = '';
  document.body.style.overflow = '';
}

function initApp() {
  loadTheme();
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    var soundWrap = document.querySelector('.pomo-sound-row-wrap');
    if (soundWrap) soundWrap.style.display = 'none';
    var searchBtn = document.getElementById('search-btn-main');
    if (searchBtn) searchBtn.style.display = 'none';
  }
  initDropdowns();
  initDashboard();
  pomoRender();
  hRenderCard();
  dRenderSessions();
  dRenderTerms();
  dRenderPhrases();
  dRenderPractice();
  dRenderSpeakers();
  dRenderFlashcard();
  dStartQuiz();
  dUpdateProgress();
  buildSearchIndex();
  registerSW();
  restoreLastPanel();
  setTimeout(function () { setLang(_currentLang); }, 150);
  initPremium();
}

// ════════════════════════════════════════════════
// PREMIUM ÖZELLİKLER
// ════════════════════════════════════════════════
function initPremium() {
  initCursorGlow();
  initWordOfDay();
  initPWABanner();
  initPullToRefresh();
  initSoundEngine();
  init3DTilt();
}

function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let hasMouse = false;
  window.addEventListener('mousemove', function onFirstMove(e) {
    hasMouse = true;
    window.removeEventListener('mousemove', onFirstMove);
    glow.style.opacity = '1';
  }, { once: true, passive: true });
  document.addEventListener('mousemove', e => {
    if (!hasMouse) return;
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { if (hasMouse) glow.style.opacity = '1'; });
}

const WOD_LIST = [
  { term: 'Break down', def: '🔤 Phrasal Verb — Çökmek · "The negotiations broke down." → Müzakereler çöktü.', type: 'phrasal' },
  { term: 'Carry out', def: '🔤 Phrasal Verb — Yürütmek · "Carry out the terms of the contract." → Sözleşmeyi uygulamak.', type: 'phrasal' },
  { term: 'Draw up', def: '🔤 Phrasal Verb — Taslak hazırlamak · "Draw up an agreement." → Anlaşma taslağı hazırlamak.', type: 'phrasal' },
  { term: 'Back out', def: '🔤 Phrasal Verb — Caymak · "Back out of a deal." → Anlaşmadan caymak.', type: 'phrasal' },
  { term: 'Set out', def: '🔤 Phrasal Verb — Belirtmek · "Set out the conditions." → Koşulları belirtmek.', type: 'phrasal' },
  { term: 'Come into force', def: '🔤 Phrasal Verb — Yürürlüğe girmek · "The law came into force." → Kanun yürürlüğe girdi.', type: 'phrasal' },
  { term: 'Rule out', def: '🔤 Phrasal Verb — Dışlamak · "Rule out any ambiguity." → Her türlü belirsizliği elemek.', type: 'phrasal' },
  { term: 'Stand by', def: '🔤 Phrasal Verb — Uymak · "Stand by the agreement." → Anlaşmaya uymak.', type: 'phrasal' },
  { term: 'Phase out', def: '🔤 Phrasal Verb — Aşamalı kaldırmak · "Phase out fossil fuels." → Fosil yakıtları kaldırmak.', type: 'phrasal' },
  { term: 'Look into', def: '🔤 Phrasal Verb — İncelemek · "Look into the matter." → Konuyu incelemek.', type: 'phrasal' },
  { term: 'Put forward', def: '🔤 Phrasal Verb — Öne sürmek · "Put forward a proposal." → Teklif sunmak.', type: 'phrasal' },
  { term: 'Call off', def: '🔤 Phrasal Verb — İptal etmek · "Call off the negotiations." → Müzakereleri iptal etmek.', type: 'phrasal' },
  { term: 'Force Majeure', def: '📚 Terminoloji — Mücbir sebep · Tarafların kontrolü dışındaki olağanüstü olaylar.', type: 'term' },
  { term: 'Habeas Corpus', def: '📚 Terminoloji — Kişi özgürlüğü güvencesi · Yasadışı tutukluluğa karşı hukuki ilke.', type: 'term' },
  { term: 'Simultaneous Interpreting', def: '📚 Terminoloji — Simultane çeviri · Konuşmayla eş zamanlı sözlü çeviri.', type: 'term' },
  { term: 'Net-zero Emissions', def: '📚 Terminoloji — Net sıfır emisyon · Atmosfere salınan karbonu dengeleyerek sıfıra indirmek.', type: 'term' },
  { term: 'Due Diligence', def: '📚 Terminoloji — Gerekli özen · İşlem öncesi risklerin kapsamlı araştırılması.', type: 'term' },
  { term: 'Consecutive Interpreting', def: '📚 Terminoloji — Konsekütif çeviri · Konuşmacı duraksadıktan sonra yapılan çeviri.', type: 'term' },
  { term: 'Localization', def: '📚 Terminoloji — Yerelleştirme · İçeriği hedef kitlenin kültürüne uyarlama.', type: 'term' },
  { term: 'Source Text', def: '📚 Terminoloji — Kaynak metin · Çevirinin yapıldığı özgün dildeki metin.', type: 'term' },
  { term: 'Target Text', def: '📚 Terminoloji — Erek metin · Çeviri sonucu elde edilen hedef dildeki metin.', type: 'term' },
  { term: 'Sworn Translation', def: '📚 Terminoloji — Yeminli çeviri · Resmi makamlarca onaylanan hukuki çeviri.', type: 'term' },
  { term: 'Register', def: '📚 Terminoloji — Dil kullanım düzeyi · Bağlama göre değişen resmiyet biçimi.', type: 'term' },
  { term: 'Equivalence', def: '📚 Terminoloji — Eşdeğerlik · Kaynak ve erek metin arasındaki anlam-işlev dengesi.', type: 'term' },
];
function initWordOfDay() {
  const el = document.getElementById('word-of-day-widget');
  if (!el) return;
  const idx = Math.floor(Math.random() * WOD_LIST.length);
  const w = WOD_LIST[idx];
  const labelEl = document.querySelector('#word-of-day-widget .wod-label');
  if (labelEl) labelEl.textContent = w.type === 'phrasal' ? '🔤 Günün Phrasal Verbi' : '📚 Günün Terimi';
  const termEl = document.getElementById('wod-term');
  const defEl = document.getElementById('wod-def');
  if (termEl) termEl.innerHTML = w.term;
  if (defEl) defEl.innerHTML = w.def;
}

let _deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _deferredPrompt = e;
  if (!localStorage.getItem('pwa-dismissed')) {
    setTimeout(() => document.getElementById('pwa-banner').classList.add('show'), 3000);
  }
});
function initPWABanner() {
  const btn = document.getElementById('pwa-install-btn');
  if (!btn) return;
  btn.onclick = async () => {
    if (_deferredPrompt) {
      _deferredPrompt.prompt();
      await _deferredPrompt.userChoice;
      _deferredPrompt = null;
    }
    document.getElementById('pwa-banner').classList.remove('show');
  };
}

function initPullToRefresh() {
  let startY = 0, pulling = false;
  const ind = document.getElementById('ptr-indicator');
  document.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (window.scrollY === 0 && e.touches[0].clientY - startY > 60) {
      pulling = true;
      ind.textContent = '↓ Bırak — Yenile';
      ind.classList.add('ptr-ready');
    }
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (pulling) { setTimeout(() => location.reload(), 200); }
    pulling = false;
    ind.classList.remove('ptr-ready');
    ind.textContent = '↓ Yenile';
  }, { passive: true });
}

const SOUND_VIDEOS = {
  rain: 'mPZkdNFkNps',
  forest: 'xNN7iTA57jM',
  wind: 'bGKth93bHUw',
  fire: 'L_LUpnjgPso',
  piano: 'lTRiuFIWV54',
  ocean: 'bn9F19Hi1Lk',
};
const SOUND_MP3 = {
  rain: 'https://cdn.freesound.org/previews/346/346170_5121236-lq.mp3',
  forest: 'https://cdn.freesound.org/previews/416/416079_7037-lq.mp3',
  wind: 'https://cdn.freesound.org/previews/553/553736_6381832-lq.mp3',
  fire: 'https://cdn.freesound.org/previews/349/349813_5121236-lq.mp3',
  piano: 'https://cdn.freesound.org/previews/476/476178_8418129-lq.mp3',
  ocean: 'https://cdn.freesound.org/previews/402/402543_6381832-lq.mp3',
};
const SOUND_ICONS = { rain: '🌧️', forest: '🐦', wind: '💨', fire: '🔥', piano: '🎹', ocean: '🌊' };
const _isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
let _ytPlayer = null, _ytReady = false, _ytPendingVideo = null, _currentSound = 'none', _isMuted = false;
let _iosAudio = null;

function loadYTApi() {
  if (_isIOS) return;
  if (document.getElementById('yt-api-script')) return;
  const tag = document.createElement('script');
  tag.id = 'yt-api-script';
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function () {
  if (_isIOS) return;
  const div = document.createElement('div');
  div.id = 'yt-player-container';
  div.style.cssText = 'position:fixed;bottom:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1';
  document.body.appendChild(div);
  _ytPlayer = new YT.Player('yt-player-container', {
    width: '1', height: '1',
    videoId: 'mPZkdNFkNps',
    playerVars: { autoplay: 0, controls: 0, loop: 1, disablekb: 1, fs: 0, modestbranding: 1, rel: 0, playsinline: 1 },
    events: {
      onReady: function (e) {
        _ytReady = true;
        e.target.setVolume(40);
        e.target.pauseVideo();
        if (_ytPendingVideo) {
          e.target.loadVideoById({ videoId: _ytPendingVideo, startSeconds: 0 });
          e.target.playVideo();
          _ytPendingVideo = null;
        }
      },
      onStateChange: function (e) {
        if (e.data === YT.PlayerState.ENDED) _ytPlayer.seekTo(0);
      }
    }
  });
};

function getIosAudio() {
  if (!_iosAudio) {
    _iosAudio = new Audio();
    _iosAudio.loop = true;
  }
  return _iosAudio;
}

function stopSound() {
  if (_isIOS) {
    if (_iosAudio) { _iosAudio.pause(); }
  } else {
    if (_ytPlayer && _ytReady) { try { _ytPlayer.pauseVideo(); } catch (e) { } }
  }
  const ctrl = document.getElementById('sound-controls');
  if (ctrl) ctrl.style.display = 'none';
  _currentSound = 'none';
}

function playAmbient(type) {
  if (type === 'none') { stopSound(); return; }
  const vol = parseInt(document.getElementById('sound-volume') ? document.getElementById('sound-volume').value : 40);
  if (_isIOS) {
    const audio = getIosAudio();
    audio.pause();
    const url = SOUND_MP3[type];
    if (!url) return;
    audio.src = url;
    audio.volume = vol / 100;
    audio.play().catch(function () { });
  } else {
    const videoId = SOUND_VIDEOS[type];
    if (!videoId) return;
    if (_ytReady && _ytPlayer) {
      _ytPlayer.loadVideoById({ videoId: videoId, startSeconds: 0 });
      _ytPlayer.setVolume(vol);
      _ytPlayer.playVideo();
    } else {
      _ytPendingVideo = videoId;
      loadYTApi();
    }
  }
  const ctrl = document.getElementById('sound-controls');
  if (ctrl) ctrl.style.display = 'flex';
  const icon = document.getElementById('sound-icon');
  if (icon) icon.textContent = SOUND_ICONS[type] || '🎵';
}

function setSoundVolume(val) {
  if (_isIOS) { if (_iosAudio) _iosAudio.volume = val / 100; }
  else { if (_ytPlayer && _ytReady) _ytPlayer.setVolume(parseInt(val)); }
  const lbl = document.getElementById('sound-vol-label');
  if (lbl) lbl.textContent = val + '%';
}

function toggleSoundMute() {
  const btn = document.getElementById('sound-mute-btn');
  _isMuted = !_isMuted;
  if (_isIOS) { if (_iosAudio) _iosAudio.muted = _isMuted; }
  else { if (_ytPlayer && _ytReady) { _isMuted ? _ytPlayer.mute() : _ytPlayer.unMute(); } }
  if (btn) btn.textContent = _isMuted ? '▶' : '⏸';
}

function setSound(btn) {
  document.querySelectorAll('.sound-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _currentSound = btn.dataset.sound;
  playAmbient(_currentSound);
}

function initSoundEngine() { loadYTApi(); }

function init3DTilt() {
  function applyTilt(el) {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-2px)`;
    }, { passive: true });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }
  document.querySelectorAll('.course-card').forEach(applyTilt);
  document.querySelectorAll('.session-card').forEach(applyTilt);
  const obs = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.classList && (n.classList.contains('course-card') || n.classList.contains('session-card'))) applyTilt(n);
    }));
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

async function runDict() {
  const q = document.getElementById('q-dict').value.trim();
  const box = document.getElementById('dict-result');
  if (!q) return;

  box.style.display = 'block';
  box.innerHTML = `<div style="padding:18px; color:var(--theme-muted); font-family:'IBM Plex Sans',sans-serif; font-size:13px;">🔍 Aranıyor…</div>`;

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('not found');
    const data = await res.json();
    const entry = data[0];

    const phonetic = entry.phonetics?.find(p => p.text)?.text || '';
    const audioUrl = entry.phonetics?.find(p => p.audio && p.audio.trim())?.audio || '';

    let bodyHTML = '';
    entry.meanings.forEach(m => {
      bodyHTML += `<div class="dict-pos">${m.partOfSpeech}</div>`;
      m.definitions.slice(0, 3).forEach((d, i) => {
        const syns = (d.synonyms || []).slice(0, 5)
          .map(s => `<span class="dict-syn-chip" onclick="document.getElementById('q-dict').value='${s}';runDict()">${s}</span>`)
          .join('');
        bodyHTML += `
              <div class="dict-def-item">
                <div class="dict-def-text"><span class="dict-def-num">${i + 1}.</span>${d.definition}</div>
                ${d.example ? `<div class="dict-example">💬 "${d.example}"</div>` : ''}
                ${syns ? `<div class="dict-synonyms">${syns}</div>` : ''}
              </div>`;
      });
    });

    box.innerHTML = `
          <div class="dict-header">
            <div>
              <div class="dict-word">${entry.word}</div>
              ${phonetic ? `<div class="dict-phonetic">${phonetic}</div>` : ''}
            </div>
            ${audioUrl ? `<button class="dict-speak-btn" onclick="new Audio('${audioUrl}').play()" title="Seslendir">🔊</button>` : ''}
          </div>
          ${bodyHTML}
          <div class="dict-footer">
            <a href="https://tureng.com/tr/turkce-ingilizce/${encodeURIComponent(q)}" target="_blank" rel="noopener" class="dict-tureng-link">Tureng'de TR↔EN karşılığını gör ↗</a>
          </div>
        `;
  } catch (e) {
    box.innerHTML = `
          <div class="dict-not-found">
            ❌ "<strong style="color:var(--theme-text)">${q}</strong>" bulunamadı.
            <br><br>
            <a href="https://tureng.com/tr/turkce-ingilizce/${encodeURIComponent(q)}" target="_blank" rel="noopener" class="dict-tureng-link" style="font-size:13px;">→ Tureng'de ara ↗</a>
          </div>
        `;
  }
}

(function initOfflineDetect() {
  const toast = document.createElement('div');
  toast.id = 'offline-toast';
  toast.textContent = '📡 Çevrimdışısın — bazı özellikler çalışmayabilir';
  document.body.appendChild(toast);

  function showToast() { toast.classList.add('show'); }
  function hideToast() { toast.classList.remove('show'); }

  window.addEventListener('offline', showToast);
  window.addEventListener('online', () => {
    toast.textContent = '✅ Bağlantı geri geldi';
    toast.style.color = 'var(--theme-accent)';
    showToast();
    setTimeout(hideToast, 2500);
  });

  if (!navigator.onLine) showToast();
})();
