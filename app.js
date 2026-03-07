// ════════════════════════════════════════════════ 
// ⚡ UTILITY: DEBOUNCE & THROTTLE
// ════════════════════════════════════════════════
function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = performance.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

let _davosRendered = false;
const _scrollPositions = {};

const WEEK_AVAILABILITY = {
  'davos': { 2: true, 3: false, 4: false, 5: false, 6: false, 7: false },
  'hukuk': { 2: true, 3: false, 4: false, 5: false, 6: false, 7: false },
  'gobilim': { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  'etik': { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  'termin': { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  'tibbi': { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  'rusca4': { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  'rusca6': { 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
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
  'Pazartesi': [
    { id: 'davos', panel: 'davos', color: '#c8f135', icon: '🎙️', time: '09:30–13:15', name: { tr: 'Ardıl Çeviriye Giriş', en: 'Intro to Consecutive Interpretation' } },
    { id: 'hukuk', panel: 'hukuk', color: '#e8c547', icon: '⚖️', time: '13:30–16:15', name: { tr: 'Hukuk Çevirisi', en: 'Legal Translation' } }
  ],
  'Salı': [
    { id: 'gobilim', panel: 'gobilim', color: '#a78bfa', icon: '📐', time: '11:30–14:30', name: { tr: 'Çeviri Göstergebilimi II', en: 'Translation Semiotics II' } }
  ],
  'Çarşamba': [
    { id: 'etik', panel: 'etik', color: '#f97316', icon: '⚡', time: '08:30–11:15', name: { tr: 'Çeviride Etik', en: 'Ethics in Translation' } },
    { id: 'termin', panel: 'termin', color: '#4ade80', icon: '📖', time: '09:30–12:15', name: { tr: 'Çevirmenler İçin Terminoloji', en: 'Terminology for Translators' } },
    { id: 'tibbi', panel: 'tibbi', color: '#fb923c', icon: '🔬', time: '13:00–14:45', name: { tr: 'Araştırma Becerileri', en: 'Research Skills' } }
  ],
  'Perşembe': [
    { id: 'rusca4', panel: 'rusca4', color: '#38bdf8', icon: '🇷🇺', time: '11:30–14:15', name: { tr: 'Rusça IV', en: 'Russian IV' } },
    { id: 'rusca6', panel: 'rusca6', color: '#38bdf8', icon: '🇷🇺', time: '14:30–17:15', name: { tr: 'Rusça VI', en: 'Russian VI' } }
  ]
};

const COURSES = [
  { id: 'davos', name: { tr: 'Ardıl Çeviriye Giriş', en: 'Intro to Consecutive Interpretation' }, icon: '🎙️', color: '#c8f135', desc: { tr: 'Davos 2026 · WEF terminoloji ve pratik', en: 'Davos 2026 · WEF terminology & practice' }, room: 'FEF 228', day: 'Pazartesi', time: '09:30–13:15', available: true },
  { id: 'hukuk', name: { tr: 'Hukuk Çevirisi', en: 'Legal Translation' }, icon: '⚖️', color: '#e8c547', desc: { tr: 'Deborah Cao · AB Mevzuatı Çeviri Rehberi', en: 'Deborah Cao · EU Legislation Translation Guide' }, room: 'FEF 140', day: 'Pazartesi', time: '13:30–16:15', available: true },
  { id: 'gobilim', name: { tr: 'Çeviri Göstergebilimi II', en: 'Translation Semiotics II' }, icon: '📐', color: '#a78bfa', desc: { tr: 'Göstergebilim · Öztürk Kasar modeli', en: 'Semiotics · Öztürk Kasar model' }, room: 'FEF 228', day: 'Salı', time: '13:30–14:30', available: false },
  { id: 'etik', name: { tr: 'Çeviride Etik', en: 'Ethics in Translation' }, icon: '⚡', color: '#f97316', desc: { tr: 'Mesleki sorumluluklar · Etik ilkeler', en: 'Professional responsibilities · Ethical principles' }, room: 'FEF 33', day: 'Çarşamba', time: '08:30–11:15', available: false },
  { id: 'termin', name: { tr: 'Çevirmenler İçin Terminoloji', en: 'Terminology for Translators' }, icon: '📖', color: '#4ade80', desc: { tr: 'Terminoloji teorisi ve uygulama', en: 'Terminology theory and practice' }, room: 'FEF 235', day: 'Çarşamba', time: '09:30–12:15', available: false },
  { id: 'tibbi', name: { tr: 'Araştırma Becerileri', en: 'Research Skills' }, icon: '🔬', color: '#fb923c', desc: { tr: 'Akademik araştırma · Kaynak kullanımı', en: 'Academic research · Resource usage' }, room: '', day: 'Çarşamba', time: '13:00–14:45', available: false },
  { id: 'rusca4', name: { tr: 'Rusça IV', en: 'Russian IV' }, icon: '🇷🇺', color: '#38bdf8', desc: { tr: 'Orta ileri Rusça terminoloji', en: 'Intermediate-advanced Russian terminology' }, room: 'YDYO 226', day: 'Perşembe', time: '11:30–14:15', available: false },
  { id: 'rusca6', name: { tr: 'Rusça VI', en: 'Russian VI' }, icon: '🇷🇺', color: '#38bdf8', desc: { tr: 'İleri düzey Rusça terminoloji', en: 'Advanced Russian terminology' }, room: 'YDYO 226', day: 'Perşembe', time: '14:30–17:15', available: false },
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
  // app-switcher kaldırıldı, drop-menu yoktur
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
    'drop-davos': 'davos',
    'drop-hukuk': 'hukuk',
    'drop-gobilim': 'gobilim',
    'drop-etik': 'etik',
    'drop-termin': 'termin',
    'drop-tibbi': 'tibbi',
    'drop-rusca4': 'rusca4',
    'drop-rusca6': 'rusca6'
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
  window.addEventListener('scroll', throttle(function () {
    const nav = document.querySelector('#panel-davos nav');
    if (!nav) return;
    const panel = document.getElementById('panel-davos');
    if (!panel || !panel.classList.contains('visible')) return;
    const y = window.scrollY;
    if (y > lastY && y > 100) nav.classList.add('nav-hidden');
    else nav.classList.remove('nav-hidden');
    lastY = y;
    // Nav scrolled shadow
    const switcher = document.querySelector('.app-switcher');
    if (switcher) switcher.classList.toggle('scrolled', y > 20);
  }, 16), { passive: true });
})();

function switchApp(app, label, dropId, fromPopState) {
  // Scroll pozisyonunu kaydet
  document.querySelectorAll('.app-panel.visible').forEach(p => {
    _scrollPositions[p.id.replace('panel-', '')] = window.scrollY;
  });
  // Cinematic sweep
  if (window._cinematicSweep) {
    window._cinematicSweep.classList.remove('cinematic-active');
    void window._cinematicSweep.offsetWidth;
    window._cinematicSweep.classList.add('cinematic-active');
    setTimeout(() => window._cinematicSweep.classList.remove('cinematic-active'), 500);
  }
  document.querySelectorAll('.app-panel').forEach(p => p.classList.remove('visible'));
  const panel = document.getElementById('panel-' + app);
  if (panel) {
    panel.classList.add('visible');
    panel.classList.remove('panel-enter');
    void panel.offsetWidth;
    panel.classList.add('panel-enter');
    setTimeout(() => panel.classList.remove('panel-enter'), 400);
  }
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
  // Scroll restore: kayıtlı pozisyon varsa oraya git, yoksa başa
  requestAnimationFrame(() => {
    const savedY = _scrollPositions[app] !== undefined ? _scrollPositions[app] : 0;
    window.scrollTo({ top: savedY, behavior: 'instant' });
  });
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
    // Sadece URL hash varsa git, yoksa dashboard
    const hash = location.hash.replace('#', '');
    if (hash) {
      const appFromHash = hash === 'ardil' ? 'davos' : hash;
      switchApp(appFromHash, '', appFromHash, true);
      return;
    }
    // localStorage'dan restore KALDIRILDI - site her zaman dashboard'dan açılır
    switchApp('dashboard', '', '', true);
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
  const isEN = _currentLang === 'en';
  const t = (tr, en) => isEN ? en : tr;

  const hour = new Date().getHours();
  const greets = {
    tr: hour < 12 ? 'GÜNAYDIN TARIK' : hour < 18 ? 'TÜNAYDIN TARIK' : 'İYİ AKŞAMLAR TARIK',
    en: hour < 12 ? 'GOOD MORNING MY LORD' : hour < 18 ? 'GOOD AFTERNOON MY LORD' : 'GOOD EVENING MY LORD'
  };
  const greetText = document.getElementById('greeting-text');
  if (greetText) greetText.textContent = greets[_currentLang];

  const daysTR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const daysEN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const todayIdx = now.getDay();
  const todayTR = daysTR[todayIdx];

  let showDayTR, showLabel, isTomorrow = false;
  const isPazar = todayIdx === 0;
  const isPersembe = todayIdx === 4;
  const switchTime = (isPazar) ? 12 : 18;

  if (hour >= switchTime) {
    isTomorrow = true;
    const tomorrowIdx = (todayIdx + 1) % 7;
    showDayTR = daysTR[tomorrowIdx];
    showLabel = t('Yarın · ', 'Tomorrow · ') + (isEN ? daysEN[tomorrowIdx] : daysTR[tomorrowIdx]);
  } else {
    showDayTR = todayTR;
    showLabel = isEN ? daysEN[todayIdx] : daysTR[todayIdx];
  }

  const todayCourses = SCHEDULE[showDayTR] || [];
  const dayNameEl = document.getElementById('today-day-name');
  if (dayNameEl) dayNameEl.textContent = showLabel;

  const tc = document.getElementById('today-courses');
  const tcHero = document.getElementById('today-courses-hero');
  if (tc) tc.innerHTML = '';
  if (tcHero) tcHero.innerHTML = '';

  if (todayCourses.length === 0) {
    const msg = (isPersembe && hour >= 18) ? t('🎉 Hafta sonu — iyi dinlenmeler!', '🎉 Weekend — enjoy your rest!') : t('Bugün ders yok 🎉', 'No classes today 🎉');
    const emptySpan = `<span style="font-size:13px;color:var(--theme-muted);font-family:DM Sans,sans-serif">${msg}</span>`;
    if (tc) tc.innerHTML = emptySpan;
    if (tcHero) tcHero.innerHTML = emptySpan;
  } else {
    todayCourses.forEach(c => {
      const pill = document.createElement('button');
      pill.className = 'today-pill';
      pill.style.cssText = `color:${c.color};border-color:${c.color};background:${c.color}18`;
      const name = isEN ? c.name.en : c.name.tr;
      pill.textContent = `${c.icon} ${name} · ${c.time}`;
      pill.onclick = () => { switchApp(c.panel, name, c.panel); };
      if (tc) tc.appendChild(pill);
      if (tcHero) {
        const pill2 = pill.cloneNode(true);
        pill2.onclick = () => { switchApp(c.panel, name, c.panel); };
        tcHero.appendChild(pill2);
      }
    });
  }

  const grid = document.getElementById('course-grid');
  if (grid) {
    grid.innerHTML = '';
    COURSES.forEach((c) => {
      const isToday = todayCourses.some(t => t.panel === c.id);
      const card = document.createElement('div');
      card.className = 'course-card' + (isToday ? ' today-highlight' : '');
      card.style.setProperty('--card-accent', c.color);
      const pct = c.available ? 25 : 0;
      const r = 18, circ = 2 * Math.PI * r;
      const offset = circ - (pct / 100) * circ;
      const name = isEN ? c.name.en : c.name.tr;
      const desc = isEN ? c.desc.en : c.desc.tr;
      const day = isEN ? daysEN[daysTR.indexOf(c.day)] : c.day;
      const tag = c.available ? t('● Aktif', '● Active') : t('○ Yakında', '○ Coming Soon');
      card.innerHTML = `<svg class="course-progress-ring" width="44" height="44"><circle class="progress-ring-bg" cx="22" cy="22" r="${r}"/><circle class="progress-ring-fill" cx="22" cy="22" r="${r}" stroke="${c.color}" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/></svg><div class="course-icon">${c.icon}</div><div class="course-tag">${tag}</div><div class="course-name">${name}</div><div class="course-desc">${desc}</div><div class="course-day">📅 ${day} · ${c.time}${c.room ? ` · <span style="opacity:0.7">🏛 ${c.room}</span>` : ''}</div>`;
      card.onclick = () => { switchApp(c.id, name, c.id); };
      grid.appendChild(card);
    });
  }

  const sgrid = document.getElementById('schedule-grid');
  if (sgrid) {
    sgrid.innerHTML = '';
    const dayOrder = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe'];
    const dayOrderEN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    dayOrder.forEach((dayTR, idx) => {
      const courses = SCHEDULE[dayTR] || [];
      const dc = document.createElement('div');
      dc.className = 'schedule-day-card' + (dayTR === todayTR ? ' is-today' : '');
      const dayDisplay = isEN ? dayOrderEN[idx] : dayTR;
      let inner = `<div class="schedule-day-header"><span class="day-name">${dayDisplay}</span>${dayTR === todayTR ? '<span class="today-dot"></span>' : ''}</div>`;
      courses.forEach(c => {
        const cd = COURSES.find(x => x.id === c.panel);
        const room = cd && cd.room ? `<div class="schedule-course-room">🏛 ${cd.room}</div>` : '';
        const name = isEN ? c.name.en : c.name.tr;
        inner += `<div class="schedule-course-item" onclick="switchApp('${c.panel}','${name}','${c.panel}')"><div class="schedule-course-name" style="color:${c.color}">${c.icon} ${name}</div><div class="schedule-course-time">${c.time}</div>${room}</div>`;
      });
      dc.innerHTML = inner;
      sgrid.appendChild(dc);
    });
  }
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
  const t = (tr, en) => isEN ? en : tr;

  const ftr = document.getElementById('flag-tr');
  const fen = document.getElementById('flag-en');
  if (ftr) ftr.style.opacity = isEN ? '0.4' : '1';
  if (fen) fen.style.opacity = isEN ? '1' : '0.4';

  // Dashboard & Hero
  const titleSub = document.getElementById('dash-subtitle');
  if (titleSub) titleSub.textContent = t('Son sınıf — 8 ders, 1 hedef.', 'Final year — 8 courses, 1 goal.');

  const hSession = document.getElementById('hero-session-info');
  if (hSession) hSession.textContent = t('Son sınıf · 8 ders', 'Senior year · 8 courses');

  const scrollHint = document.getElementById('scroll-hint-text');
  if (scrollHint) scrollHint.textContent = t('kaydır', 'scroll');

  const todayLabel = document.querySelector('.today-label');
  if (todayLabel) todayLabel.textContent = t('📅 Bugünün Dersleri', '📅 Today\'s Classes');

  // Sidebar
  const sbMap = {
    'sb-dashboard': ['Dashboard', 'Dashboard'],
    'sb-stats': ['İstatistik', 'Statistics'],
    'sb-notes': ['Notlar', 'Notes'],
    'sb-graph': ['Bilgi Grafiği', 'Knowledge Graph']
  };
  Object.entries(sbMap).forEach(([id, [tr, en]]) => {
    const el = document.getElementById(id);
    if (el) el.querySelector('span').textContent = isEN ? en : tr;
  });
  const sbTheme = document.getElementById('sb-theme-text');
  if (sbTheme) sbTheme.textContent = t('Tema', 'Theme');

  // Apps Popup
  const appsPopTitle = document.getElementById('apps-popup-title');
  if (appsPopTitle) appsPopTitle.textContent = t('📱 Hızlı Aç', '📱 Quick Open');

  // drop-apps kaldırıldı

  // Navigation
  const navLabels = {
    'droplabel-hukuk': t('HUKUK', 'LAW'),
    'droplabel-davos': t('ARDIL', 'CONSEC.'),
  };
  Object.entries(navLabels).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  const noIdLabels = isEN
    ? ['SEMIOTICS', 'ETHICS', 'TERMINOLOGY', 'RESEARCH', 'RUSSIAN IV', 'RUSSIAN VI']
    : ['GÖSTERGEBİLİM', 'ETİK', 'TERMİNOLOJİ', 'ARAŞTIRMA', 'RUSÇA IV', 'RUSÇA VI'];
  const allDropLabels = document.querySelectorAll('.app-switcher .dropdown:not(#drop-hukuk):not(#drop-davos):not(#drop-apps) .drop-label');
  allDropLabels.forEach((el, i) => { if (noIdLabels[i]) el.textContent = noIdLabels[i]; });

  // Pomodoro
  const pMode = document.getElementById('pModeText'); // Assuming I might add this or handled in pomoRender
  const pStart = document.getElementById('pomoStartBtn');
  if (pStart && !pomoRunning) pStart.textContent = t('▶ Başlat', '▶ Start');

  const soundMap = [
    { key: 'none', tr: '🔇 Kapalı', en: '🔇 Off' },
    { key: 'rain', tr: '🌧️ Yağmur', en: '🌧️ Rain' },
    { key: 'forest', tr: '🐦 Orman', en: '🐦 Forest' },
    { key: 'wind', tr: '💨 Rüzgar', en: '💨 Wind' },
    { key: 'fire', tr: '🔥 Şömine', en: '🔥 Fire' },
    { key: 'piano', tr: '🎹 Piyano', en: '🎹 Piano' },
    { key: 'ocean', tr: '🌊 Okyanus', en: '🌊 Ocean' },
  ];
  document.querySelectorAll('.sound-opt').forEach(btn => {
    const s = soundMap.find(x => x.key === btn.dataset.sound);
    if (s) btn.textContent = isEN ? s.en : s.tr;
  });

  // Bento labels
  const bentoLabels = {
    'label-daily-goal': ['GÜNLÜK HEDEF', 'DAILY GOAL'],
    'label-flashcard': ['flashcard', 'flashcards'],
    'label-wod': ['GÜNÜN TERİMİ', 'TERM OF THE DAY'],
    'label-dict': ['SÖZLÜK', 'DICTIONARY'],
    'dict-search-btn': ['ARA', 'SEARCH'],
    'title-all-courses': ['— TÜM DERSLER', '— ALL COURSES'],
    'title-schedule': ['— HAFTALIK PROGRAM', '— WEEKLY SCHEDULE']
  };
  Object.entries(bentoLabels).forEach(([id, [tr, en]]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = isEN ? en : tr;
  });
  if (document.getElementById('q-dict')) document.getElementById('q-dict').placeholder = t('Kelime ara…', 'Search word…');

  // Word of Day
  const wodLabel = document.querySelector('#word-of-day-widget .wod-label');
  if (wodLabel) {
    const isPhrasal = wodLabel.textContent.includes('Phrasal') || wodLabel.textContent.includes('phrasal') || wodLabel.textContent.includes('Verb');
    if (isEN) wodLabel.textContent = isPhrasal ? '🔤 Phrasal Verb of the Day' : '📚 Term of the Day';
    else wodLabel.textContent = isPhrasal ? '🔤 Günün Phrasal Verbi' : '📚 Günün Terimi';
  }

  // PWA & Search
  const pwaContent = document.getElementById('pwa-text-content');
  if (pwaContent) pwaContent.textContent = t('Ana ekrana ekle, uygulama gibi kullan', 'Add to home screen, use like an app');
  const pwaBtn = document.getElementById('pwa-install-btn');
  if (pwaBtn) pwaBtn.textContent = t('Ekle', 'Add');

  const lockPrompt = document.getElementById('lock-prompt');
  if (lockPrompt) lockPrompt.textContent = t('Şifreyi gir', 'Enter password');

  const sSearchBtn = document.getElementById('search-btn-text');
  if (sSearchBtn) sSearchBtn.textContent = t('Ara', 'Search');
  const sSearchInp = document.getElementById('global-search-input');
  if (sSearchInp) sSearchInp.placeholder = t('Terim ara… (Türkçe veya İngilizce)', 'Search term… (TR or EN)');
  const sSearchEmpty = document.getElementById('search-empty-msg');
  if (sSearchEmpty) sSearchEmpty.innerHTML = t('Aramak istediğiniz terimi yazın.<br><span style="font-size:12px;color:#555">Tüm derslerin terminolojisinde arama yapılır.</span>', 'Type the term you want to search.<br><span style="font-size:12px;color:#555">Searches across all courses.</span>');

  initDashboard();
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
  // Command palette
  if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); openCommandPalette(); return; }
  // Escape - kapat
  if (e.key === 'Escape') {
    closeSearch();
    closeCommandPalette();
    document.getElementById('shortcuts-overlay').style.display = 'none';
    document.getElementById('inactivity-overlay') && document.getElementById('inactivity-overlay').classList.remove('show');
    return;
  }
  if (k === 'd') { switchApp('dashboard', '', ''); return; }
  if (k === 't') { toggleTheme(); return; }
  if (k === '/') { e.preventDefault(); openSearch(); return; }
  // ? = shortcuts overlay
  if (e.key === '?') { e.preventDefault(); const o = document.getElementById('shortcuts-overlay'); o.style.display = o.style.display === 'none' ? 'flex' : 'none'; return; }
  // Flashcard kısayolları
  const hPanel = document.getElementById('panel-hukuk');
  const dPanel = document.getElementById('panel-davos');
  if (hPanel && hPanel.classList.contains('visible')) {
    if (e.key === ' ') { e.preventDefault(); hRevealCard(); return; }
    if (e.key === 'Enter') { hMarkKnow(); return; }
    if (e.key === 'ArrowRight') { hMarkKnow(); return; }
    if (e.key === 'ArrowLeft') { hMarkDunno(); return; }
  }
  if (dPanel && dPanel.classList.contains('visible')) {
    if (e.key === ' ') { e.preventDefault(); dFlipCard(); return; }
    if (e.key === 'ArrowRight') { dNextCard(); return; }
    if (e.key === 'ArrowLeft') { dPrevCard(); return; }
    if (e.key === 'Enter') { dMarkKnow(); return; }
  }
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
function dRenderTerms() {
  const c = document.getElementById('dTermListContainer');
  TERMS.forEach((cat, ci) => {
    const sec = document.createElement('div');
    sec.className = 'term-section';
    sec.style.setProperty('--cat-color', cat.color);
    sec.innerHTML = `<div class="term-section-title">${cat.cat}</div>`;
    const grid = document.createElement('div');
    grid.className = 'term-grid';
    cat.items.forEach(([en, tr, note], i) => {
      const row = document.createElement('div');
      row.className = 'term-row stagger-item';
      row.style.animationDelay = (ci * 0.05 + i * 0.03) + 's';
      row.innerHTML = `<div class="dterm-en">${en}</div><div class="dterm-tr">${tr}</div><div class="dterm-note">${note}</div><button class="copy-term-btn" data-copy="${en} — ${tr}" title="Kopyala">📋</button>`;
      grid.appendChild(row);
    });
    sec.appendChild(grid);
    c.appendChild(sec);
  });
}
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
function dMarkKnow() { const queue = dGetCurrentQueue(); const c = queue[dFlashIndex % queue.length]; if (!dKnown.includes(c)) { dKnown.push(c); updateDailyGoal(1); } dRetry = dRetry.filter(x => x !== c); dFlashIndex = 0; dRenderFlashcard(); }
function dMarkDunno() { const queue = dGetCurrentQueue(); const c = queue[dFlashIndex % queue.length]; if (!dRetry.includes(c)) dRetry.push(c); dFlashIndex = (dFlashIndex + 1) % Math.max(1, queue.length); dRenderFlashcard(); }
function dUpdateLeitnerStats() { const pending = dShuffledCards.filter(c => !dKnown.includes(c) && !dRetry.includes(c)).length; document.getElementById('d-stat-pending').textContent = pending; document.getElementById('d-stat-known').textContent = dKnown.length; document.getElementById('d-stat-retry').textContent = dRetry.length; }

// DAVOS QUIZ
let dQuizQuestions = [], dQuizCur = 0, dQuizScore = 0, dQuizAnswered = false;
function dStartQuiz() { dQuizQuestions = [...QUIZ_Q].sort(() => Math.random() - 0.5).slice(0, 12); dQuizCur = 0; dQuizScore = 0; dQuizAnswered = false; document.getElementById('dQuizScore').textContent = '0'; document.getElementById('dQuizTotal').textContent = dQuizQuestions.length; document.getElementById('dQuizComplete').style.display = 'none'; document.getElementById('dQuizCard').style.display = 'block'; dRenderQuizQ(); }
function dRenderQuizQ() { if (dQuizCur >= dQuizQuestions.length) { dEndQuiz(); return; } dQuizAnswered = false; const q = dQuizQuestions[dQuizCur]; document.getElementById('dQuizCurrent').textContent = dQuizCur + 1; const opts = q.opts.map((o, i) => `<button class="quiz-option" onclick="dAnswerQuiz(${i})">${o}</button>`).join(''); document.getElementById('dQuizCard').innerHTML = `<div class="quiz-type">SORU ${dQuizCur + 1} / ${dQuizQuestions.length}</div><div class="quiz-q">${q.q}</div><div class="quiz-options">${opts}</div><div class="quiz-feedback" id="dqfb"></div><button class="quiz-next" id="dqnext" onclick="dNextQuizQ()">Sonraki Soru →</button>`; }
function dAnswerQuiz(i) { if (dQuizAnswered) return; dQuizAnswered = true; const q = dQuizQuestions[dQuizCur]; const opts = document.querySelectorAll('#dQuizCard .quiz-option'); opts.forEach(o => o.disabled = true); const fb = document.getElementById('dqfb'); if (i === q.ans) { opts[i].classList.add('correct'); dQuizScore++; document.getElementById('dQuizScore').textContent = dQuizScore; fb.className = 'quiz-feedback correct-fb show'; fb.textContent = '✓ Doğru! ' + q.exp; } else { opts[i].classList.add('wrong'); opts[q.ans].classList.add('correct'); fb.className = 'quiz-feedback wrong-fb show'; fb.textContent = '✗ Yanlış. ' + q.exp; } document.getElementById('dqnext').classList.add('show'); }
function dNextQuizQ() { dQuizCur++; if (dQuizCur >= dQuizQuestions.length) dEndQuiz(); else dRenderQuizQ(); }
function dEndQuiz() { document.getElementById('dQuizCard').style.display = 'none'; const comp = document.getElementById('dQuizComplete'); comp.style.display = 'block'; document.getElementById('dFinalScore').textContent = dQuizScore + ' / ' + dQuizQuestions.length; sessionStorage.setItem('dQuizDone', '1'); dUpdateProgress(); launchConfetti(); }
const D_SECTIONS = ['oturumlar', 'terminoloji', 'kaliplar', 'flashcard', 'quiz', 'pratik', 'konusmaci'];
function dShowSection(id, btn) { D_SECTIONS.forEach(s => { document.getElementById('dsec-' + s).classList.remove('active'); }); document.querySelectorAll('.dnav-btn').forEach(b => b.classList.remove('active')); const target = document.getElementById('dsec-' + id); target.classList.add('active'); if (btn) btn.classList.add('active'); sessionStorage.setItem('dvisited_' + id, '1'); dUpdateProgress(); setTimeout(() => { const top = target.getBoundingClientRect().top + window.pageYOffset - 160; window.scrollTo({ top, behavior: 'smooth' }); }, 50); }
function dUpdateProgress() { let score = 0, total = 10; D_SECTIONS.forEach(s => { if (sessionStorage.getItem('dvisited_' + s)) score += 1; }); SESSIONS.forEach((_, i) => { if (dIsTracked('sess_' + i)) score += 0.1; }); if (sessionStorage.getItem('dQuizDone')) score += 2; const pct = Math.min(100, Math.round((score / total) * 100)); document.getElementById('dProgressFill').style.width = pct + '%'; document.getElementById('dProgressPct').textContent = pct + '%'; }
function dIsTracked(key) { return sessionStorage.getItem('d_' + key) === '1'; }
function dMarkTracked(key) { sessionStorage.setItem('d_' + key, '1'); dUpdateProgress(); }
function dToggleTracked(key, elId) { if (dIsTracked(key)) sessionStorage.removeItem('d_' + key); else sessionStorage.setItem('d_' + key, '1'); const el = document.getElementById(elId); if (el) el.classList.toggle('checked', dIsTracked(key)); dUpdateProgress(); }

// ════════════════════════════════════════════════
// PWA
// ════════════════════════════════════════════════
function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  const swCode = `
    const CACHE = 'tariktanta-v5';
    const ASSETS = ['/', '/index.html', '/app.js', '/styles.css'];

    // Install: tüm kritik dosyaları cache'e al
    self.addEventListener('install', e => {
      e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
      );
      self.skipWaiting();
    });

    // Activate: eski cache'leri temizle
    self.addEventListener('activate', e => {
      e.waitUntil(
        caches.keys().then(keys =>
          Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
      );
      self.clients.claim();
    });

    // Fetch: stale-while-revalidate — önce cache'den ver, arka planda güncelle
    self.addEventListener('fetch', e => {
      if (e.request.method !== 'GET') return;
      const url = new URL(e.request.url);
      // Sadece kendi origin'den gelen istekleri handle et
      if (url.origin !== location.origin) return;

      e.respondWith(
        caches.open(CACHE).then(cache =>
          cache.match(e.request).then(cached => {
            const fetchPromise = fetch(e.request).then(res => {
              if (res && res.status === 200) {
                cache.put(e.request, res.clone());
              }
              return res;
            }).catch(() => cached);

            // Cache varsa anında ver, arka planda güncelle
            return cached || fetchPromise;
          })
        )
      );
    });
  `;
  const blob = new Blob([swCode], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  navigator.serviceWorker.register(url).catch(() => { });
}

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
      card.addEventListener('click', function () {
        closeWeekOverlay();
        switchApp(panelId, course.name, courseId);
      });
      card.addEventListener('mousemove', function (e) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(500px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateY(-4px) scale(1.03)`;
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    }
    cardsContainer.appendChild(card);
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  const modal = overlay.querySelector('.week-overlay-modal');
  modal.ontouchstart = function (e) { _woSwipeStartY = e.touches[0].clientY; };
  modal.ontouchmove = function (e) {
    const dy = e.touches[0].clientY - _woSwipeStartY;
    if (dy > 0) modal.style.transform = 'translateY(' + dy + 'px)';
  };
  modal.ontouchend = function (e) {
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
  // Davos render'larını baştan yap - lazy render notları kaybettiriyordu
  dRenderSessions();
  dRenderTerms();
  dRenderPhrases();
  dRenderPractice();
  dRenderSpeakers();
  dRenderFlashcard();
  dStartQuiz();
  dUpdateProgress();
  _davosRendered = true;
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
  initAurora();
  initLiveClock();
  initStreak();
  initMotivationQuote();
  initTypingCursor();
  initRipple();
  initMagneticBtns();
  initPageTransition();
  initParallax();
  initStatCounters();
  initConfetti();
  initHoloCards();
  initCinematicSweep();
  initCommandPalette();
  initKeyboardShortcutsOverlay();
  initToastSystem();
  initSessionTimer();
  initDailyGoal();
  initReadingProgress();
  initStaggeredLists();
  initInlineCopyBtns();
  initLongPress();
  initInactivityDetector();
  initAmbientMode();
  initShareBtns();
  initScrollRestore();
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

// ════════════════════════════════════════════════
// 🌌 AURORA ARKA PLAN
// ════════════════════════════════════════════════
function initAurora() {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', debounce(resize, 150), { passive: true });

  const orbs = [
    { x: 0.2, y: 0.3, r: 0.45, color: [200, 241, 53], speed: 0.00018, phase: 0 },
    { x: 0.7, y: 0.2, r: 0.40, color: [56, 189, 248], speed: 0.00023, phase: 2 },
    { x: 0.5, y: 0.7, r: 0.38, color: [167, 139, 250], speed: 0.00015, phase: 4 },
    { x: 0.85, y: 0.6, r: 0.30, color: [249, 115, 22], speed: 0.00020, phase: 1 },
  ];

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;

    orbs.forEach(orb => {
      const px = (orb.x + Math.sin(t * orb.speed * 1000 + orb.phase) * 0.18) * W;
      const py = (orb.y + Math.cos(t * orb.speed * 800 + orb.phase) * 0.14) * H;
      const radius = orb.r * Math.min(W, H);

      const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
      grad.addColorStop(0, `rgba(${orb.color[0]},${orb.color[1]},${orb.color[2]},0.55)`);
      grad.addColorStop(0.4, `rgba(${orb.color[0]},${orb.color[1]},${orb.color[2]},0.18)`);
      grad.addColorStop(1, `rgba(${orb.color[0]},${orb.color[1]},${orb.color[2]},0)`);

      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    t = performance.now();
    requestAnimationFrame(draw);
  }
  draw();
}

// ════════════════════════════════════════════════
// 🕐 LIVE CLOCK
// ════════════════════════════════════════════════
function initLiveClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;

  const heroDateEl = document.getElementById('hero-date');
  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

  // Sliding clock yapısı oluştur
  function buildSlidingClock() {
    el.innerHTML = '';
    el.className = 'sliding-clock';
    // HH:MM:SS — 8 slot (2 rakam + : + 2 rakam + : + 2 rakam)
    const structure = [
      { type: 'digit', id: 'sc-h1', max: 2 },
      { type: 'digit', id: 'sc-h2', max: 9 },
      { type: 'sep' },
      { type: 'digit', id: 'sc-m1', max: 5 },
      { type: 'digit', id: 'sc-m2', max: 9 },
      { type: 'sep' },
      { type: 'digit', id: 'sc-s1', max: 5 },
      { type: 'digit', id: 'sc-s2', max: 9 },
    ];

    structure.forEach(item => {
      if (item.type === 'sep') {
        const sep = document.createElement('span');
        sep.className = 'sc-sep';
        sep.textContent = ':';
        el.appendChild(sep);
      } else {
        const col = document.createElement('div');
        col.className = 'sc-col';
        col.id = item.id;
        const drum = document.createElement('div');
        drum.className = 'sc-drum';
        // 0–max rakamlarını doldur
        for (let i = 0; i <= item.max; i++) {
          const d = document.createElement('div');
          d.className = 'sc-digit';
          d.textContent = i;
          drum.appendChild(d);
        }
        col.appendChild(drum);
        el.appendChild(col);
      }
    });
  }

  function setDigit(id, val, max) {
    const col = document.getElementById(id);
    if (!col) return;
    const drum = col.querySelector('.sc-drum');
    if (!drum) return;
    const digitH = col.offsetHeight || 80;
    // val'ı max+1 içinde clamp et
    const safeVal = Math.min(val, max);
    drum.style.transform = `translateY(-${safeVal * digitH}px)`;
  }

  function tick() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    setDigit('sc-h1', Math.floor(h / 10), 2);
    setDigit('sc-h2', h % 10, 9);
    setDigit('sc-m1', Math.floor(m / 10), 5);
    setDigit('sc-m2', m % 10, 9);
    setDigit('sc-s1', Math.floor(s / 10), 5);
    setDigit('sc-s2', s % 10, 9);

    // Gün/gece sınıfı
    el.className = 'sliding-clock';
    if (h >= 0 && h < 6) el.classList.add('late-night');
    else if (h >= 6 && h < 12) el.classList.add('morning');
    else if (h >= 12 && h < 18) el.classList.add('afternoon');
    else el.classList.add('evening');

    if (heroDateEl) {
      heroDateEl.textContent = dayNames[now.getDay()] + ', ' + now.getDate() + ' ' + monthNames[now.getMonth()] + ' ' + now.getFullYear();
    }
  }

  buildSlidingClock();
  // DOM hazır olunca ilk tick
  requestAnimationFrame(() => {
    tick();
    setInterval(tick, 1000);
  });
}

// ════════════════════════════════════════════════
// 🔥 STREAK SAYACI
// ════════════════════════════════════════════════
function initStreak() {
  const badge = document.getElementById('streak-badge');
  const countEl = document.getElementById('streak-count');
  if (!badge || !countEl) return;

  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem('tariktanta-lastvisit');
  let streak = parseInt(localStorage.getItem('tariktanta-streak') || '0');

  if (lastVisit === today) {
    // Bugün zaten açılmış, streak aynı
  } else if (lastVisit === new Date(Date.now() - 86400000).toDateString()) {
    // Dün açılmış, streak artar
    streak++;
    localStorage.setItem('tariktanta-streak', streak);
  } else if (!lastVisit) {
    // İlk kez
    streak = 1;
    localStorage.setItem('tariktanta-streak', streak);
  } else {
    // Seri bozulmuş
    streak = 1;
    localStorage.setItem('tariktanta-streak', streak);
  }
  localStorage.setItem('tariktanta-lastvisit', today);

  countEl.textContent = streak;

  if (streak >= 7) badge.style.borderColor = '#f97316';
  else if (streak >= 3) badge.style.borderColor = '#fbbf24';

  badge.title = streak + ' gün üst üste açtın!';
}

// ════════════════════════════════════════════════
// 💬 MOTİVASYON QUOTE ROTASYONU
// ════════════════════════════════════════════════
const MOTIVATION_QUOTES = [
  '"Bilgi güçtür, çeviri ise o gücü dünyayla paylaşmaktır."',
  '"Her yeni kelime, yeni bir dünyanın kapısıdır."',
  '"Son sınıf. Bitmek üzere. Devam et."',
  '"Çevirmen sadece dil değil, kültür taşır."',
  '"Bugün öğrendiğin, yarın seni öne çıkarır."',
  '"Zorluk seviye atlattırır, pes etmek ise yerinde sayar."',
  '"If you\'re not at the table, you\'re on the menu. — Carney"',
  '"We are not in Kansas anymore. — Georgieva"',
  '"Küçük adımlar, büyük mesafeler eder."',
  '"Bir dil, bir insan. İki dil, iki insan."',
  '"Sınav tarihi yaklaşıyor — notları şimdi al."',
  '"To exist is to change. — Parmelin"',
];

function initMotivationQuote() {
  const el = document.getElementById('motivation-quote');
  if (!el) return;

  let idx = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
  el.textContent = MOTIVATION_QUOTES[idx];
  el.classList.add('fade-in');

  setInterval(() => {
    el.classList.remove('fade-in');
    el.classList.add('fade-out');
    setTimeout(() => {
      idx = (idx + 1) % MOTIVATION_QUOTES.length;
      el.textContent = MOTIVATION_QUOTES[idx];
      el.classList.remove('fade-out');
      el.classList.add('fade-in');
    }, 500);
  }, 8000);
}

// ════════════════════════════════════════════════
// ⌨️ TYPING CURSOR EFEKTİ
// ════════════════════════════════════════════════
function initTypingCursor() {
  const textEl = document.getElementById('greeting-text');
  if (!textEl) return;

  const fullText = textEl.textContent;
  textEl.textContent = '';
  let i = 0;

  function type() {
    if (i < fullText.length) {
      textEl.textContent += fullText[i];
      i++;
      setTimeout(type, 80 + Math.random() * 40);
    }
  }
  setTimeout(type, 400);
}

// ════════════════════════════════════════════════
// 💧 RİPPLE EFEKTİ
// ════════════════════════════════════════════════
function initRipple() {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.ripple-container');
    if (!btn) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';

    const rect = btn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
}

// ════════════════════════════════════════════════
// 🧲 MAGNETİK BUTON
// ════════════════════════════════════════════════
function initMagneticBtns() {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });
}

// ════════════════════════════════════════════════
// 🎭 PAGE TRANSİTİON
// ════════════════════════════════════════════════
function initPageTransition() {
  // switchApp içine entegre edildi
}

// ════════════════════════════════════════════════
// 📜 PARALLAX SCROLL
// ════════════════════════════════════════════════
function initParallax() {
  const hero = document.querySelector('.dash-hero');
  if (!hero) return;

  window.addEventListener('scroll', throttle(function () {
    const panel = document.getElementById('panel-dashboard');
    if (!panel || !panel.classList.contains('visible')) return;
    const y = window.scrollY;
    hero.style.transform = `translateY(${y * 0.25}px)`;
    hero.style.opacity = Math.max(0, 1 - y / 320);
  }, 16), { passive: true });
}

// ════════════════════════════════════════════════
// 🔢 STAT COUNTER ANİMASYON
// ════════════════════════════════════════════════
function initStatCounters() {
  // Stat sayaçları değişince bump animasyonu
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.type === 'childList' || m.type === 'characterData') {
        const el = m.target.nodeType === 3 ? m.target.parentElement : m.target;
        if (el && el.classList.contains('stat-count')) {
          el.classList.remove('bump');
          void el.offsetWidth;
          el.classList.add('bump');
          setTimeout(() => el.classList.remove('bump'), 350);
        }
      }
    });
  });

  document.querySelectorAll('.stat-count').forEach(el => {
    observer.observe(el, { childList: true, subtree: true, characterData: true });
  });
}

// ════════════════════════════════════════════════
// 🎊 CONFETTİ
// ════════════════════════════════════════════════
function initConfetti() {
  // launchConfetti() dEndQuiz ve flashcard tamamlama içinden çağrılır
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#c8f135', '#38bdf8', '#a78bfa', '#f97316', '#f87171', '#fbbf24', '#4ade80'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height * 0.5,
    w: Math.random() * 10 + 5,
    h: Math.random() * 6 + 3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 4 + 2,
    angle: Math.random() * 360,
    spin: (Math.random() - 0.5) * 8,
    alpha: 1,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      if (p.y > canvas.height * 0.7) p.alpha -= 0.02;
      if (p.alpha <= 0) return;
      alive++;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (alive > 0 && frame < 300) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }
  draw();
}

// Confetti: quiz bitince otomatik tetiklenir (dEndQuiz override kaldırıldı, güvenli versiyon aşağıda)

// ════════════════════════════════════════════════
// 🌟 HOLOGRAFİK KART EFEKTİ
// ════════════════════════════════════════════════
function initHoloCards() {
  function attachHolo(el) {
    el.addEventListener('mousemove', function (e) {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      el.style.setProperty('--mouse-x', x + '%');
      el.style.setProperty('--mouse-y', y + '%');
    }, { passive: true });
    el.addEventListener('mouseleave', function () {
      el.style.removeProperty('--mouse-x');
      el.style.removeProperty('--mouse-y');
    });
    // iOS touch
    el.addEventListener('touchmove', function (e) {
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((touch.clientY - rect.top) / rect.height * 100).toFixed(1);
      el.style.setProperty('--mouse-x', x + '%');
      el.style.setProperty('--mouse-y', y + '%');
    }, { passive: true });
  }

  document.querySelectorAll('.holo-card').forEach(attachHolo);

  // Dinamik eklenen kartları da yakala
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1) {
        if (n.classList && n.classList.contains('holo-card')) attachHolo(n);
        n.querySelectorAll && n.querySelectorAll('.holo-card').forEach(attachHolo);
      }
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ════════════════════════════════════════════════
// 🎭 CİNEMATİC PANEL GEÇİŞİ
// ════════════════════════════════════════════════
function initCinematicSweep() {
  const sweep = document.createElement('div');
  sweep.id = 'cinematic-sweep';
  document.body.appendChild(sweep);
  // sweep element oluşturuldu, switchApp içinde kullanılıyor
  window._cinematicSweep = sweep;
}

// ════════════════════════════════════════════════
// 🔍 COMMAND PALETTE
// ════════════════════════════════════════════════
const CMD_COMMANDS = [
  { icon: '🏠', label: 'Dashboard', sub: 'D', action: () => switchApp('dashboard', '', '') },
  { icon: '⚖️', label: 'Hukuki Çeviri', sub: '1', action: () => switchApp('hukuk', '', 'hukuk') },
  { icon: '🎙️', label: 'Ardıl Çeviri', sub: '2', action: () => switchApp('davos', '', 'davos') },
  { icon: '📐', label: 'Göstergebilim', sub: '3', action: () => switchApp('gobilim-w2', '', 'gobilim') },
  { icon: '🇷🇺', label: 'Rusça IV', sub: '4', action: () => switchApp('rusca4-w2', '', 'rusca4') },
  { icon: '🇷🇺', label: 'Rusça VI', sub: '5', action: () => switchApp('rusca6-w2', '', 'rusca6') },
  { icon: '⚡', label: 'Çeviride Etik', sub: '6', action: () => switchApp('etik-w2', '', 'etik') },
  { icon: '📖', label: 'Terminoloji', sub: '7', action: () => switchApp('termin-w2', '', 'termin') },
  { icon: '🔬', label: 'Araştırma Becerileri', sub: '8', action: () => switchApp('tibbi-w2', '', 'tibbi') },
  { icon: '🌙', label: 'Temayı Değiştir', sub: 'T', action: () => toggleTheme() },
  { icon: '🔍', label: 'Arama', sub: '/', action: () => openSearch() },
  { icon: '⌨️', label: 'Klavye Kısayolları', sub: '?', action: () => { document.getElementById('shortcuts-overlay').style.display = 'flex'; } },
  { icon: '🌙', label: 'Ambient Mode', sub: '', action: () => toggleAmbientMode() },
];

let _cmdActive = -1;

function openCommandPalette() {
  const overlay = document.getElementById('command-palette-overlay');
  if (!overlay) return;
  overlay.style.display = 'block';
  const input = document.getElementById('cmd-input');
  input.value = '';
  _cmdActive = -1;
  renderCmdResults('');
  setTimeout(() => input.focus(), 50);
}

function closeCommandPalette() {
  const overlay = document.getElementById('command-palette-overlay');
  if (overlay) overlay.style.display = 'none';
}

function renderCmdResults(query) {
  const container = document.getElementById('cmd-results');
  if (!container) return;
  const q = query.toLowerCase().trim();
  const filtered = q ? CMD_COMMANDS.filter(c =>
    c.label.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q)
  ) : CMD_COMMANDS;

  container.innerHTML = '';
  if (!q) {
    const label = document.createElement('div');
    label.className = 'cmd-section-label';
    label.textContent = 'Hızlı Git';
    container.appendChild(label);
  }
  filtered.forEach((cmd, i) => {
    const item = document.createElement('div');
    item.className = 'cmd-item' + (i === _cmdActive ? ' cmd-active' : '');
    item.innerHTML = `<span class="cmd-item-icon">${cmd.icon}</span><span class="cmd-item-label">${cmd.label}</span>${cmd.sub ? `<span class="cmd-item-sub">${cmd.sub}</span>` : ''}`;
    item.addEventListener('click', () => { cmd.action(); closeCommandPalette(); });
    container.appendChild(item);
  });
}

function initCommandPalette() {
  const overlay = document.getElementById('command-palette-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeCommandPalette();
  });

  const input = document.getElementById('cmd-input');
  input.addEventListener('input', () => { _cmdActive = -1; renderCmdResults(input.value); });

  input.addEventListener('keydown', e => {
    const items = document.querySelectorAll('.cmd-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); _cmdActive = Math.min(_cmdActive + 1, items.length - 1); renderCmdResults(input.value); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); _cmdActive = Math.max(_cmdActive - 1, -1); renderCmdResults(input.value); }
    else if (e.key === 'Enter') {
      const q = input.value.toLowerCase().trim();
      const filtered = q ? CMD_COMMANDS.filter(c => c.label.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q)) : CMD_COMMANDS;
      const idx = _cmdActive >= 0 ? _cmdActive : 0;
      if (filtered[idx]) { filtered[idx].action(); closeCommandPalette(); }
    }
    else if (e.key === 'Escape') { closeCommandPalette(); }
  });
}

// ════════════════════════════════════════════════
// ⌨️ KEYBOARD SHORTCUTS OVERLAY
// ════════════════════════════════════════════════
function initKeyboardShortcutsOverlay() {
  const overlay = document.getElementById('shortcuts-overlay');
  if (!overlay) return;
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
}

// ════════════════════════════════════════════════
// 🔔 TOAST BİLDİRİM SİSTEMİ
// ════════════════════════════════════════════════
function initToastSystem() {
  window.showToast = function (msg, type = 'info', duration = 2800) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    toast.addEventListener('click', () => dismissToast(toast));
    container.appendChild(toast);
    setTimeout(() => dismissToast(toast), duration);
  };
  function dismissToast(toast) {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 260);
  }
  // Swipe to dismiss toast
  container => {
    let sx = 0;
    document.addEventListener('touchstart', e => {
      const t = e.target.closest('.toast');
      if (t) sx = e.touches[0].clientX;
    }, { passive: true });
    document.addEventListener('touchend', e => {
      const t = e.target.closest('.toast');
      if (t && Math.abs(e.changedTouches[0].clientX - sx) > 60) dismissToast(t);
    }, { passive: true });
  };
}

// ════════════════════════════════════════════════
// ⏱ SESSION TIMER
// ════════════════════════════════════════════════
function initSessionTimer() {
  const el = document.getElementById('session-time');
  if (!el) return;
  const start = Date.now();
  setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    el.textContent = String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
  }, 1000);
}

// ════════════════════════════════════════════════
// 🎯 DAILY GOAL RING
// ════════════════════════════════════════════════
function initDailyGoal() {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem('tariktanta-dailygoal') || '{}');
  if (saved.date !== today) {
    localStorage.setItem('tariktanta-dailygoal', JSON.stringify({ date: today, done: 0 }));
  }
  renderDailyGoal();
}

function updateDailyGoal(delta) {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem('tariktanta-dailygoal') || '{"date":"","done":0}');
  const done = (saved.date === today ? saved.done : 0) + delta;
  localStorage.setItem('tariktanta-dailygoal', JSON.stringify({ date: today, done }));
  renderDailyGoal();
  if (done === 20) { showToast && showToast('🎯 Günlük hedef tamamlandı!', 'success', 3500); launchConfetti(); }
}

function renderDailyGoal() {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem('tariktanta-dailygoal') || '{"date":"","done":0}');
  const done = saved.date === today ? saved.done : 0;
  const total = 20;
  const fill = document.getElementById('goal-ring-fill');
  const doneEl = document.getElementById('goal-done');
  if (!fill || !doneEl) return;
  const circumference = 2 * Math.PI * 24;
  const offset = circumference - (done / total) * circumference;
  fill.style.strokeDasharray = circumference;
  fill.style.strokeDashoffset = offset;
  doneEl.textContent = done;
}

// ════════════════════════════════════════════════
// 📖 READING PROGRESS BAR
// ════════════════════════════════════════════════
function initReadingProgress() {
  const bar = document.getElementById('reading-progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', throttle(function () {
    const panel = document.getElementById('panel-hukuk');
    if (!panel || !panel.classList.contains('visible')) { bar.style.width = '0%'; return; }
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    const pct = Math.min(100, (window.scrollY / total) * 100);
    bar.style.width = pct + '%';
  }, 16), { passive: true });
}

// ════════════════════════════════════════════════
// 🌊 STAGGERED LIST ANİMASYONU
// ════════════════════════════════════════════════
function initStaggeredLists() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-item').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  // Dinamik olarak eklenenler için
  const mutObs = new MutationObserver(mutations => {
    mutations.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1) {
        const items = n.classList && n.classList.contains('stagger-item') ? [n] : (n.querySelectorAll ? n.querySelectorAll('.stagger-item') : []);
        items.forEach(el => { el.style.animationPlayState = 'paused'; observer.observe(el); });
      }
    }));
  });
  mutObs.observe(document.body, { childList: true, subtree: true });
}

// ════════════════════════════════════════════════
// 📋 INLINE COPY BUTTONS
// ════════════════════════════════════════════════
function initInlineCopyBtns() {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.copy-term-btn');
    if (!btn) return;
    const text = btn.dataset.copy;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓';
      btn.classList.add('copied');
      showToast && showToast('📋 Kopyalandı!', 'success', 1800);
      setTimeout(() => { btn.textContent = '📋'; btn.classList.remove('copied'); }, 1500);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = '📋'; }, 1500);
    });
  });
}

// ════════════════════════════════════════════════
// 📱 LONG PRESS CONTEXT MENU
// ════════════════════════════════════════════════
function initLongPress() {
  let pressTimer = null;
  let menu = null;

  function showMenu(x, y, card) {
    removeMenu();
    const app = card.dataset.app;
    const label = card.dataset.label || '';
    if (!app) return;
    menu = document.createElement('div');
    menu.id = 'long-press-menu';

    const items = [
      { icon: '🚀', label: 'Panele Git', action: () => { switchApp(app, label, card.dataset.drop || ''); } },
      { icon: '📋', label: 'Ders Adını Kopyala', action: () => { navigator.clipboard.writeText(label || app).catch(() => { }); showToast && showToast('📋 Kopyalandı!', 'success', 1800); } },
    ];
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'lp-item';
      el.innerHTML = `<span class="lp-item-icon">${item.icon}</span>${item.label}`;
      el.addEventListener('click', () => { item.action(); removeMenu(); });
      menu.appendChild(el);
    });

    // Ekran dışına taşmasın
    const safeX = Math.min(x, window.innerWidth - 200);
    const safeY = Math.min(y, window.innerHeight - 120);
    menu.style.left = safeX + 'px';
    menu.style.top = safeY + 'px';
    document.body.appendChild(menu);
    document.addEventListener('click', removeMenu, { once: true });
  }

  function removeMenu() {
    if (menu) { menu.remove(); menu = null; }
  }

  document.addEventListener('touchstart', function (e) {
    const card = e.target.closest('.drop-item, .course-card, .today-pill');
    if (!card) return;
    pressTimer = setTimeout(() => {
      const touch = e.touches[0];
      showMenu(touch.clientX, touch.clientY, card);
      if (navigator.vibrate) navigator.vibrate(30);
    }, 500);
  }, { passive: true });

  document.addEventListener('touchend', () => { clearTimeout(pressTimer); }, { passive: true });
  document.addEventListener('touchmove', () => { clearTimeout(pressTimer); }, { passive: true });
}

// ════════════════════════════════════════════════
// 😴 İNACTİVİTY DETECTOR
// ════════════════════════════════════════════════
function initInactivityDetector() {
  const TIMEOUT = 10 * 60 * 1000; // 10 dakika
  let timer;
  let overlay = document.getElementById('inactivity-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'inactivity-overlay';
    overlay.innerHTML = '<p>😴 Hâlâ burada mısın?</p><button onclick="dismissInactivity()">Evet, devam et!</button>';
    document.body.appendChild(overlay);
  }

  window.dismissInactivity = function () {
    overlay.classList.remove('show');
    resetTimer();
    // Pomodoro duraklatıldıysa devam ettir
    const pomoBtn = document.getElementById('pomoStartBtn');
    if (pomoBtn && pomoBtn.textContent.includes('Devam')) pomoBtn.click();
  };

  function showInactivity() {
    overlay.classList.add('show');
    // Pomodoro çalışıyorsa duraklat
    const pomoBtn = document.getElementById('pomoStartBtn');
    if (pomoBtn && pomoBtn.textContent.includes('Durdur')) pomoBtn.click();
  }

  function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(showInactivity, TIMEOUT);
  }

  ['mousemove', 'keydown', 'touchstart', 'click', 'scroll'].forEach(ev => {
    window.addEventListener(ev, resetTimer, { passive: true });
  });
  resetTimer();
}

// ════════════════════════════════════════════════
// 🌙 AMBIENT MODE
// ════════════════════════════════════════════════
function initAmbientMode() {
  window.toggleAmbientMode = function () {
    document.body.classList.toggle('ambient-mode');
    const isAmbient = document.body.classList.contains('ambient-mode');
    showToast && showToast(isAmbient ? '🌙 Ambient mode açık — tıkla kapat' : '☀️ Ambient mode kapatıldı', 'info');
  };
  // Tıklayınca ambient mode'dan çık
  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('ambient-mode')) return;
    if (e.target.closest('#live-clock') || e.target.closest('#aurora-canvas')) {
      document.body.classList.remove('ambient-mode');
    }
  });
}

// ════════════════════════════════════════════════
// 🔗 SHARE API
// ════════════════════════════════════════════════
function initShareBtns() {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.share-btn');
    if (!btn) return;
    const text = btn.dataset.share || document.title;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Tariktanta', text, url }).catch(() => { });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        showToast && showToast('🔗 Link kopyalandı!', 'success', 2000);
      }).catch(() => { });
    }
  });
}

// ════════════════════════════════════════════════
// 📜 SMART SCROLL RESTORE
// ════════════════════════════════════════════════

function initScrollRestore() {
  // _scrollPositions objesi global tanımlı, switchApp içinde kullanılıyor
}

// ════════════════════════════════════════════════
// 🗂 SIDEBAR
// ════════════════════════════════════════════════
function sidebarSetActive(app) {
  document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('sb-' + app);
  if (btn) btn.classList.add('active');
}

// ════════════════════════════════════════════════
// 📊 İSTATİSTİK & HEATMAP
// ════════════════════════════════════════════════
function initStats() {
  statsRenderSummary();
  statsRenderHeatmap();
  statsRenderWeekly();
  statsRenderWeakTopics();
  statsRenderRevisionPlan();
}

function statsGetPomodoroData() {
  try {
    const raw = localStorage.getItem('tariktanta-pomo-log');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function statsLogPomodoro() {
  try {
    const data = statsGetPomodoroData();
    const today = new Date().toISOString().split('T')[0];
    data[today] = (data[today] || 0) + 25;
    localStorage.setItem('tariktanta-pomo-log', JSON.stringify(data));
  } catch (e) { }
}

function statsGetQuizLog() {
  try {
    const raw = localStorage.getItem('tariktanta-quiz-log');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function statsLogQuizAnswer(topic, correct) {
  try {
    const log = statsGetQuizLog();
    log.push({ topic, correct, date: new Date().toISOString() });
    if (log.length > 500) log.splice(0, log.length - 500);
    localStorage.setItem('tariktanta-quiz-log', JSON.stringify(log));
  } catch (e) { }
}

function statsRenderSummary() {
  // Streak
  const streakEl = document.getElementById('st-streak');
  const streakCount = parseInt(localStorage.getItem('tariktanta-streak') || '0');
  if (streakEl) streakEl.textContent = streakCount;

  // Toplam dakika
  const minEl = document.getElementById('st-totalmin');
  if (minEl) {
    const data = statsGetPomodoroData();
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    minEl.textContent = total;
  }

  // Kart sayısı
  const cardsEl = document.getElementById('st-cards');
  if (cardsEl) {
    const hCards = parseInt(localStorage.getItem('tariktanta-hcards-done') || '0');
    const dCards = parseInt(localStorage.getItem('tariktanta-dcards-done') || '0');
    cardsEl.textContent = hCards + dCards;
  }

  // Quiz skoru
  const quizEl = document.getElementById('st-quizscore');
  if (quizEl) {
    const log = statsGetQuizLog();
    if (log.length === 0) { quizEl.textContent = '—'; return; }
    const correct = log.filter(x => x.correct).length;
    quizEl.textContent = Math.round((correct / log.length) * 100) + '%';
  }
}

function statsRenderHeatmap() {
  const grid = document.getElementById('heatmap-grid');
  const monthsEl = document.getElementById('heatmap-months');
  if (!grid) return;

  const data = statsGetPomodoroData();
  const today = new Date();
  const weeks = 16;
  const days = weeks * 7;

  // Başlangıç günü — haftanın pazartesisi
  const start = new Date(today);
  start.setDate(today.getDate() - days + 1);

  grid.innerHTML = '';
  monthsEl && (monthsEl.innerHTML = '');

  let currentWeekEl = null;
  let lastMonth = -1;

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().split('T')[0];
    const mins = data[key] || 0;

    // Yeni hafta
    if (i % 7 === 0) {
      currentWeekEl = document.createElement('div');
      currentWeekEl.className = 'heatmap-week';
      grid.appendChild(currentWeekEl);

      // Ay etiketi
      if (monthsEl && d.getMonth() !== lastMonth) {
        const span = document.createElement('span');
        span.textContent = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][d.getMonth()];
        span.style.cssText = `width:${Math.ceil(days / weeks) * 16}px;display:inline-block;`;
        monthsEl.appendChild(span);
        lastMonth = d.getMonth();
      }
    }

    const cell = document.createElement('div');
    cell.className = 'hm-cell';
    const level = mins === 0 ? 0 : mins < 25 ? 1 : mins < 50 ? 2 : mins < 75 ? 3 : 4;
    cell.dataset.level = level;
    cell.title = key + (mins ? ` · ${mins} dk` : ' · Çalışılmadı');
    currentWeekEl.appendChild(cell);
  }
}

function statsRenderWeekly() {
  const wrap = document.getElementById('weekly-bars');
  if (!wrap) return;
  const data = statsGetPomodoroData();
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const today = new Date();
  // Bu haftanın pazartesisi
  const mon = new Date(today);
  mon.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const vals = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    vals.push(data[d.toISOString().split('T')[0]] || 0);
  }

  const maxVal = Math.max(...vals, 1);
  wrap.innerHTML = '';

  days.forEach((day, i) => {
    const pct = Math.round((vals[i] / maxVal) * 80);
    const wrap2 = document.createElement('div');
    wrap2.className = 'weekly-bar-wrap';
    wrap2.innerHTML = `
      <div class="weekly-bar-val">${vals[i] ? vals[i] + 'dk' : ''}</div>
      <div class="weekly-bar" style="height:${pct + 4}px" title="${day}: ${vals[i]} dk"></div>
      <div class="weekly-bar-label">${day}</div>`;
    wrap.appendChild(wrap2);
  });
}

function statsRenderWeakTopics() {
  const el = document.getElementById('weak-topics-list');
  if (!el) return;
  const log = statsGetQuizLog();
  if (log.length === 0) return;

  const topicMap = {};
  log.forEach(x => {
    if (!topicMap[x.topic]) topicMap[x.topic] = { correct: 0, total: 0 };
    topicMap[x.topic].total++;
    if (x.correct) topicMap[x.topic].correct++;
  });

  const weak = Object.entries(topicMap)
    .map(([topic, s]) => ({ topic, pct: Math.round((s.correct / s.total) * 100), total: s.total }))
    .filter(x => x.pct < 70)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 6);

  if (weak.length === 0) {
    el.innerHTML = '<div class="weak-empty">Henüz zayıf konu yok — harika! 🎉</div>';
    return;
  }

  el.innerHTML = weak.map(w => `
    <div class="weak-topic-item">
      <span class="weak-topic-name">${w.topic}</span>
      <span class="weak-topic-score">${w.pct}% doğru · ${w.total} soru</span>
    </div>`).join('');
}

// ════════════════════════════════════════════════
// 🔄 SM-2 SPACED REPETITION
// ════════════════════════════════════════════════
function sm2GetData() {
  try {
    const raw = localStorage.getItem('tariktanta-sm2');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function sm2Save(data) {
  try { localStorage.setItem('tariktanta-sm2', JSON.stringify(data)); } catch (e) { }
}

// quality: 0-5 (0=tamamen yanlış, 5=mükemmel)
function sm2Update(cardId, quality) {
  const data = sm2GetData();
  const now = new Date();
  let card = data[cardId] || { ef: 2.5, interval: 1, reps: 0, nextReview: now.toISOString().split('T')[0] };

  if (quality < 3) {
    card.reps = 0;
    card.interval = 1;
  } else {
    if (card.reps === 0) card.interval = 1;
    else if (card.reps === 1) card.interval = 6;
    else card.interval = Math.round(card.interval * card.ef);
    card.reps++;
  }

  card.ef = Math.max(1.3, card.ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const next = new Date(now);
  next.setDate(now.getDate() + card.interval);
  card.nextReview = next.toISOString().split('T')[0];
  card.lastQuality = quality;

  data[cardId] = card;
  sm2Save(data);
  return card;
}

function sm2GetDueCards() {
  const data = sm2GetData();
  const today = new Date().toISOString().split('T')[0];
  return Object.entries(data)
    .filter(([, c]) => c.nextReview <= today)
    .map(([id, c]) => ({ id, ...c }));
}

function statsRenderRevisionPlan() {
  const el = document.getElementById('revision-plan');
  if (!el) return;

  const data = sm2GetData();
  const today = new Date();
  const items = [];

  Object.entries(data).forEach(([id, c]) => {
    const diff = Math.ceil((new Date(c.nextReview) - today) / 86400000);
    items.push({ id, diff, nextReview: c.nextReview, ef: c.ef });
  });

  items.sort((a, b) => a.diff - b.diff);
  const show = items.slice(0, 8);

  if (show.length === 0) {
    el.innerHTML = '<div class="weak-empty">Flashcard çalıştıkça tekrar planın otomatik oluşur.</div>';
    return;
  }

  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  el.innerHTML = show.map(item => {
    const d = new Date(item.nextReview);
    const label = item.diff < 0 ? 'Gecikmiş' : item.diff === 0 ? 'Bugün' : item.diff === 1 ? 'Yarın' : days[d.getDay()] + ' ' + d.getDate();
    const badge = item.diff <= 0 ? 'due' : item.diff <= 2 ? 'soon' : 'ok';
    const shortId = item.id.replace('card-', '').substring(0, 30);
    return `<div class="revision-item">
      <span class="revision-day">${label}</span>
      <span class="revision-topic">${shortId}</span>
      <span class="revision-badge ${badge}">${badge === 'due' ? 'Tekrar Et' : badge === 'soon' ? 'Yakında' : 'Tamam'}</span>
    </div>`;
  }).join('');
}

// ════════════════════════════════════════════════
// 📝 NOTES EDITÖRÜ
// ════════════════════════════════════════════════
let _notesActive = null;

function notesGetAll() {
  try {
    const raw = localStorage.getItem('tariktanta-notes');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function notesSaveAll(notes) {
  try { localStorage.setItem('tariktanta-notes', JSON.stringify(notes)); } catch (e) { }
}

function notesInit() {
  notesRenderList();
  const notes = notesGetAll();
  if (notes.length > 0) notesOpen(notes[0].id);
  else notesShowEmpty();

  const editor = document.getElementById('notes-editor');
  if (editor) {
    editor.addEventListener('input', () => {
      notesSaveContent();
      notesRenderList();
      const status = document.getElementById('notes-save-status');
      if (status) { status.textContent = 'Kaydedildi ✓'; status.style.color = 'var(--theme-accent)'; setTimeout(() => { status.textContent = 'Kaydedildi'; status.style.color = ''; }, 1500); }
    });
  }
}

function notesRenderList(filter = '') {
  const list = document.getElementById('notes-list');
  if (!list) return;
  const notes = notesGetAll().filter(n => !filter || n.title.toLowerCase().includes(filter) || (n.content || '').toLowerCase().includes(filter));
  list.innerHTML = notes.map(n => `
    <div class="notes-list-item ${_notesActive === n.id ? 'active' : ''}" onclick="notesOpen('${n.id}')">
      <div class="notes-list-title">${n.title || 'Başlıksız'}</div>
      <div class="notes-list-preview">${(n.content || '').replace(/<[^>]+>/g, '').substring(0, 50)}</div>
    </div>`).join('') || '<div style="padding:16px;font-size:12px;color:var(--theme-muted);text-align:center">Not yok</div>';
}

function notesOpen(id) {
  const notes = notesGetAll();
  const note = notes.find(n => n.id === id);
  if (!note) return;
  _notesActive = id;
  document.getElementById('notes-title-input').value = note.title || '';
  document.getElementById('notes-editor').innerHTML = note.content || '';
  const meta = document.getElementById('notes-meta');
  if (meta) meta.textContent = new Date(note.updated || note.created).toLocaleString('tr-TR');
  notesRenderList();
}

function notesNew() {
  const notes = notesGetAll();
  const note = { id: 'note-' + Date.now(), title: 'Yeni Not', content: '', created: new Date().toISOString(), updated: new Date().toISOString() };
  notes.unshift(note);
  notesSaveAll(notes);
  notesOpen(note.id);
  notesRenderList();
  setTimeout(() => { const t = document.getElementById('notes-title-input'); if (t) { t.focus(); t.select(); } }, 50);
}

function notesShowEmpty() {
  const editor = document.getElementById('notes-editor');
  const title = document.getElementById('notes-title-input');
  if (editor) editor.innerHTML = '';
  if (title) title.value = '';
}

function notesSaveContent() {
  if (!_notesActive) return;
  const notes = notesGetAll();
  const idx = notes.findIndex(n => n.id === _notesActive);
  if (idx === -1) return;
  notes[idx].content = document.getElementById('notes-editor').innerHTML;
  notes[idx].updated = new Date().toISOString();
  notesSaveAll(notes);
}

function notesSaveTitle(val) {
  if (!_notesActive) return;
  const notes = notesGetAll();
  const idx = notes.findIndex(n => n.id === _notesActive);
  if (idx === -1) return;
  notes[idx].title = val;
  notes[idx].updated = new Date().toISOString();
  notesSaveAll(notes);
  notesRenderList();
}

function notesDelete() {
  if (!_notesActive) return;
  if (!confirm('Bu notu silmek istiyor musun?')) return;
  const notes = notesGetAll().filter(n => n.id !== _notesActive);
  notesSaveAll(notes);
  _notesActive = null;
  notesRenderList();
  if (notes.length > 0) notesOpen(notes[0].id);
  else notesShowEmpty();
}

function notesFilter(val) {
  notesRenderList(val.toLowerCase());
}

function notesFmt(cmd, val) {
  document.getElementById('notes-editor').focus();
  document.execCommand(cmd, false, val || null);
  notesSaveContent();
}

// Highlight → Flashcard (notlar panelinden)
function notesToFlashcard() {
  const sel = window.getSelection();
  const text = sel ? sel.toString().trim() : '';
  const modal = document.getElementById('hfc-modal');
  if (!modal) return;
  document.getElementById('hfc-q').value = text.substring(0, 120);
  document.getElementById('hfc-a').value = '';
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('hfc-a').focus(), 50);
}

// Global highlight popup (tüm panellerde seçim)
function initHighlightPopup() {
  const popup = document.getElementById('highlight-popup');
  if (!popup) return;

  document.addEventListener('mouseup', (e) => {
    if (popup.contains(e.target)) return;
    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : '';
      if (text.length > 3) {
        const range = sel.getRangeAt(0).getBoundingClientRect();
        popup.style.display = 'flex';
        popup.style.top = (range.top + window.scrollY - 48) + 'px';
        popup.style.left = Math.min(range.left, window.innerWidth - 200) + 'px';
        window._highlightText = text;
      } else {
        popup.style.display = 'none';
      }
    }, 10);
  });

  document.addEventListener('mousedown', (e) => {
    if (!popup.contains(e.target)) popup.style.display = 'none';
  });
}

function highlightToFlashcard() {
  const text = window._highlightText || '';
  const modal = document.getElementById('hfc-modal');
  if (!modal) return;
  document.getElementById('highlight-popup').style.display = 'none';
  document.getElementById('hfc-q').value = text.substring(0, 120);
  document.getElementById('hfc-a').value = '';
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('hfc-a').focus(), 50);
}

function highlightCopy() {
  const text = window._highlightText || '';
  navigator.clipboard.writeText(text).catch(() => { });
  document.getElementById('highlight-popup').style.display = 'none';
  showToast && showToast('📋 Kopyalandı', 'success', 1500);
}

function hfcSave() {
  const q = document.getElementById('hfc-q').value.trim();
  const a = document.getElementById('hfc-a').value.trim();
  const cat = document.getElementById('hfc-cat').value;
  if (!q || !a) { showToast && showToast('Soru ve cevap gerekli', 'error', 2000); return; }

  // localStorage'a custom flashcard olarak kaydet
  try {
    const raw = localStorage.getItem('tariktanta-custom-fc');
    const cards = raw ? JSON.parse(raw) : [];
    const id = 'card-' + cat + '-' + Date.now();
    cards.push({ id, q, a, cat, created: new Date().toISOString() });
    localStorage.setItem('tariktanta-custom-fc', JSON.stringify(cards));
    // SM-2'ye ekle
    sm2Update(id, 3);
  } catch (e) { }

  document.getElementById('hfc-modal').style.display = 'none';
  showToast && showToast('✅ Flashcard eklendi! · ' + cat, 'success', 2000);
}

// ════════════════════════════════════════════════
// 🕸 BİLGİ GRAFİĞİ
// ════════════════════════════════════════════════
const GRAPH_DATA = {
  all: {
    nodes: [
      { id: 'ceviribilim', label: 'Çeviribilim', group: 'genel', desc: 'Çeviriyi bilimsel olarak inceleyen disiplin' },
      { id: 'skopos', label: 'Skopos Teorisi', group: 'genel', desc: 'Çevirinin amacını ön plana çıkaran teori (Reiss & Vermeer)' },
      { id: 'functionalism', label: 'Fonksiyonalizm', group: 'genel', desc: 'Metnin işlevini esas alan çeviri yaklaşımı' },
      { id: 'eqivalence', label: 'Eşdeğerlik', group: 'genel', desc: 'Kaynak ve hedef metin arasındaki denklik' },
      { id: 'dynamic-eq', label: 'Dinamik Eşdeğerlik', group: 'genel', desc: 'Nida\'nın alıcı odaklı eşdeğerlik kavramı' },
      { id: 'formal-eq', label: 'Biçimsel Eşdeğerlik', group: 'genel', desc: 'Kaynak metne yapısal bağlılık' },
      { id: 'domestication', label: 'Evcilleştirme', group: 'genel', desc: 'Metni hedef kültüre uyarlama (Venuti)' },
      { id: 'foreignization', label: 'Yabancılaştırma', group: 'genel', desc: 'Kaynak kültürü koruma stratejisi (Venuti)' },
      { id: 'geopolitik', label: 'Jeopolitik', group: 'davos', desc: 'Coğrafyanın siyaset üzerindeki etkisi' },
      { id: 'multilateralism', label: 'Multilateralizm', group: 'davos', desc: 'Çok taraflı uluslararası iş birliği' },
      { id: 'sovereignty', label: 'Egemenlik', group: 'davos', desc: 'Devletin bağımsız yönetim hakkı' },
      { id: 'soft-power', label: 'Soft Power', group: 'davos', desc: 'Caydırıcı olmayan etki gücü (Nye)' },
      { id: 'hukuk-cevirisi', label: 'Hukuki Çeviri', group: 'hukuk', desc: 'Hukuki metinlerin çevirisi' },
      { id: 'terminoloji', label: 'Terminoloji', group: 'hukuk', desc: 'Teknik terimlerin sistematik incelenmesi' },
      { id: 'legalization', label: 'Legalizasyon', group: 'hukuk', desc: 'Resmi belge onaylama süreci' },
      { id: 'feminist-trans', label: 'Feminist Çeviri', group: 'genel', desc: 'Toplumsal cinsiyeti göz önünde bulunduran çeviri' },
    ],
    edges: [
      ['ceviribilim', 'skopos'], ['ceviribilim', 'eqivalence'], ['ceviribilim', 'functionalism'],
      ['skopos', 'functionalism'], ['eqivalence', 'dynamic-eq'], ['eqivalence', 'formal-eq'],
      ['domestication', 'functionalism'], ['foreignization', 'functionalism'],
      ['domestication', 'eqivalence'], ['geopolitik', 'multilateralism'],
      ['geopolitik', 'sovereignty'], ['multilateralism', 'soft-power'],
      ['hukuk-cevirisi', 'terminoloji'], ['hukuk-cevirisi', 'legalization'],
      ['terminoloji', 'ceviribilim'], ['feminist-trans', 'ceviribilim'],
      ['skopos', 'hukuk-cevirisi'],
    ]
  }
};

let _graphNodes = [];
let _graphEdges = [];
let _graphDrag = null;
let _graphOffset = { x: 0, y: 0 };
let _graphAnimFrame = null;

function graphRender() {
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;
  cancelAnimationFrame(_graphAnimFrame);

  const filter = document.getElementById('graph-filter')?.value || 'all';
  const allData = GRAPH_DATA.all;
  const nodes = filter === 'all' ? allData.nodes : allData.nodes.filter(n => n.group === filter || n.group === 'genel');
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = allData.edges.filter(([a, b]) => nodeIds.has(a) && nodeIds.has(b));

  const W = canvas.offsetWidth || 800;
  const H = canvas.offsetHeight || 500;
  canvas.width = W;
  canvas.height = H;

  const colorMap = { genel: '#c8f135', davos: '#38bdf8', hukuk: '#f472b6' };

  // Force-directed layout init
  _graphNodes = nodes.map((n, i) => ({
    ...n,
    x: W / 2 + Math.cos((i / nodes.length) * Math.PI * 2) * (W * 0.3),
    y: H / 2 + Math.sin((i / nodes.length) * Math.PI * 2) * (H * 0.3),
    vx: 0, vy: 0,
    color: colorMap[n.group] || '#888'
  }));
  _graphEdges = edges.map(([a, b]) => ({
    src: _graphNodes.find(n => n.id === a),
    tgt: _graphNodes.find(n => n.id === b)
  })).filter(e => e.src && e.tgt);

  function simulate() {
    // Repulsion
    for (let i = 0; i < _graphNodes.length; i++) {
      for (let j = i + 1; j < _graphNodes.length; j++) {
        const a = _graphNodes[i], b = _graphNodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = 3000 / (dist * dist);
        const fx = (dx / dist) * force, fy = (dy / dist) * force;
        a.vx -= fx; a.vy -= fy;
        b.vx += fx; b.vy += fy;
      }
    }
    // Attraction (edges)
    _graphEdges.forEach(e => {
      const dx = e.tgt.x - e.src.x, dy = e.tgt.y - e.src.y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const force = (dist - 120) * 0.03;
      const fx = (dx / dist) * force, fy = (dy / dist) * force;
      e.src.vx += fx; e.src.vy += fy;
      e.tgt.vx -= fx; e.tgt.vy -= fy;
    });
    // Center gravity
    _graphNodes.forEach(n => {
      n.vx += (W / 2 - n.x) * 0.005;
      n.vy += (H / 2 - n.y) * 0.005;
      // Damping
      n.vx *= 0.85; n.vy *= 0.85;
      if (n !== _graphDrag) {
        n.x += n.vx; n.y += n.vy;
      }
      // Bounds
      n.x = Math.max(50, Math.min(W - 50, n.x));
      n.y = Math.max(30, Math.min(H - 30, n.y));
    });
  }

  function draw() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    // Edges
    _graphEdges.forEach(e => {
      ctx.beginPath();
      ctx.moveTo(e.src.x, e.src.y);
      ctx.lineTo(e.tgt.x, e.tgt.y);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Nodes
    _graphNodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = n.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#fff';
      ctx.font = '11px IBM Plex Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y - 13);
    });
  }

  let tick = 0;
  function loop() {
    if (tick < 200) { simulate(); tick++; }
    draw();
    _graphAnimFrame = requestAnimationFrame(loop);
  }
  loop();

  // Drag
  canvas.onmousedown = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    _graphDrag = _graphNodes.find(n => Math.hypot(n.x - mx, n.y - my) < 14) || null;
    if (_graphDrag) { _graphOffset = { x: mx - _graphDrag.x, y: my - _graphDrag.y }; }
  };
  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    if (_graphDrag) { _graphDrag.x = mx - _graphOffset.x; _graphDrag.y = my - _graphOffset.y; }

    // Tooltip
    const tooltip = document.getElementById('graph-tooltip');
    if (!tooltip) return;
    const hovered = _graphNodes.find(n => Math.hypot(n.x - mx, n.y - my) < 14);
    if (hovered) {
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX + 12) + 'px';
      tooltip.style.top = (e.clientY - 10) + 'px';
      tooltip.innerHTML = `<strong>${hovered.label}</strong><br><span style="font-size:11px;opacity:0.7">${hovered.desc}</span>`;
    } else {
      tooltip.style.display = 'none';
    }
  };
  canvas.onmouseup = () => { _graphDrag = null; };
  canvas.onmouseleave = () => {
    _graphDrag = null;
    const tooltip = document.getElementById('graph-tooltip');
    if (tooltip) tooltip.style.display = 'none';
  };
}

// ════════════════════════════════════════════════
// switchApp'e yeni paneller için hook
// ════════════════════════════════════════════════
const _origSwitchApp = switchApp;
window.switchApp = function (app, label, dropId, fromPopState) {
  _origSwitchApp(app, label, dropId, fromPopState);
  sidebarSetActive(app);
  if (app === 'stats') setTimeout(initStats, 50);
  if (app === 'notes') setTimeout(notesInit, 50);
  if (app === 'graph') setTimeout(graphRender, 50);
};

// initPremium'a highlight popup ekle
const _origInitPremium = initPremium;
window.initPremium = function () {
  _origInitPremium();
  initHighlightPopup();
};


// ════════════════════════════════════════════════
// 💊 FLOATING PILL NAVBAR
// ════════════════════════════════════════════════

const PILL_WEEKS = {
  davos:   { icon:'🎙️', label:'Ardıl', weeks:['davos','davos-w3','davos-w4','davos-w5','davos-w6','davos-w7'],   labels:['2. Hafta — Davos','3. Hafta','4. Hafta','5. Hafta','6. Hafta','7. Hafta'] },
  hukuk:   { icon:'⚖️', label:'Hukuk', weeks:['hukuk','hukuk-w3','hukuk-w4','hukuk-w5','hukuk-w6','hukuk-w7'],   labels:['2. Hafta — Hukuk','3. Hafta','4. Hafta','5. Hafta','6. Hafta','7. Hafta'] },
  gobilim: { icon:'📐', label:'Gösterge', weeks:['gobilim-w2','gobilim-w3','gobilim-w4','gobilim-w5','gobilim-w6','gobilim-w7'], labels:['2. Hafta','3. Hafta','4. Hafta','5. Hafta','6. Hafta','7. Hafta'] },
  etik:    { icon:'⚡', label:'Etik', weeks:['etik-w2','etik-w3','etik-w4','etik-w5','etik-w6','etik-w7'],         labels:['2. Hafta','3. Hafta','4. Hafta','5. Hafta','6. Hafta','7. Hafta'] },
  termin:  { icon:'📖', label:'Terminoloji', weeks:['termin-w2','termin-w3','termin-w4','termin-w5','termin-w6','termin-w7'], labels:['2. Hafta','3. Hafta','4. Hafta','5. Hafta','6. Hafta','7. Hafta'] },
  tibbi:   { icon:'🔬', label:'Araştırma', weeks:['tibbi-w2','tibbi-w3','tibbi-w4','tibbi-w5','tibbi-w6','tibbi-w7'],  labels:['2. Hafta','3. Hafta','4. Hafta','5. Hafta','6. Hafta','7. Hafta'] },
  rusca4:  { icon:'🇷🇺', label:'Rusça IV', weeks:['rusca4-w2','rusca4-w3','rusca4-w4','rusca4-w5','rusca4-w6','rusca4-w7'], labels:['2. Hafta','3. Hafta','4. Hafta','5. Hafta','6. Hafta','7. Hafta'] },
  rusca6:  { icon:'🇷🇺', label:'Rusça VI', weeks:['rusca6-w2','rusca6-w3','rusca6-w4','rusca6-w5','rusca6-w6','rusca6-w7'], labels:['2. Hafta','3. Hafta','4. Hafta','5. Hafta','6. Hafta','7. Hafta'] },
};

let _pillCurrentGroup = null; // aktif ders grubu
let _pillCurrentApp   = 'dashboard';
let _weekPopupOpen    = false;
let _weekPopupGroup   = null;

function pillNav(app) {
  _weekPopupClose();
  _pillCurrentApp = app;
  const dropMap = { stats:'stats', notes:'notes', graph:'graph', dashboard:'' };
  const drop = dropMap[app] || '';
  switchApp(app, app, drop);
  _pillIndicatorMove(app);
}

function pillNavWeeks(group, e) {
  if (e) e.stopPropagation();

  // Eğer aynı gruba tıklandıysa ve popup açıksa kapat
  if (_weekPopupOpen && _weekPopupGroup === group) {
    _weekPopupClose();
    return;
  }

  _weekPopupGroup = group;
  _weekPopupOpen  = true;

  const cfg   = PILL_WEEKS[group];
  const popup  = document.getElementById('week-popup');
  const inner  = document.getElementById('week-popup-inner');
  if (!popup || !inner || !cfg) return;

  // Aktif hafta hangisi?
  const activeApp = _pillCurrentGroup === group ? _pillCurrentApp : cfg.weeks[0];

  inner.innerHTML =
    `<div class="week-popup-label">${cfg.icon} ${cfg.label}</div>` +
    cfg.weeks.map((w, i) =>
      `<button class="week-popup-item${w === activeApp ? ' active-week' : ''}"
        onclick="_weekSelect('${group}','${w}',event)">
        ${cfg.icon} ${cfg.labels[i]}
      </button>`
    ).join('');

  // Pozisyonu pill butonun üstüne hizala
  const btn    = document.getElementById('pill-' + group);
  const nav    = document.getElementById('pill-nav');
  if (btn && nav) {
    const btnRect = btn.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    popup.style.display = 'block';
    popup.style.bottom   = (window.innerHeight - navRect.top + 12) + 'px';
    // Ekran dışına taşma kontrolü
    requestAnimationFrame(() => {
      const pw = inner.offsetWidth || 200;
      let left = btnRect.left + btnRect.width / 2 - pw / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - pw - 12));
      popup.style.left = left + 'px';
    });
  }
}

function _weekSelect(group, app, e) {
  if (e) e.stopPropagation();
  _pillCurrentGroup = group;
  _pillCurrentApp   = app;
  _weekPopupClose();
  switchApp(app, '', group);
  // Pill indicator → ders grubunun pill'ine taşı
  _pillIndicatorMove('pill-' + group, true);
  // Pill butonunu aktif yap
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('pill-' + group);
  if (btn) btn.classList.add('active');
}

function _weekPopupClose() {
  _weekPopupOpen  = false;
  _weekPopupGroup = null;
  const popup = document.getElementById('week-popup');
  if (popup) popup.style.display = 'none';
}

// Dışarı tıklayınca popup kapat
document.addEventListener('click', function(e) {
  if (!_weekPopupOpen) return;
  const popup = document.getElementById('week-popup');
  const nav   = document.getElementById('pill-nav');
  if (popup && nav) {
    if (!popup.contains(e.target) && !nav.contains(e.target)) {
      _weekPopupClose();
    }
  }
});

// ── Sliding indicator ──────────────────────────
function _pillIndicatorMove(appOrId, isId) {
  const indicator = document.getElementById('pill-indicator');
  const navInner  = document.querySelector('.pill-nav-inner');
  if (!indicator || !navInner) return;

  const btnId = isId ? appOrId : 'pill-' + appOrId;
  const btn   = document.getElementById(btnId);
  if (!btn) { indicator.style.width = '0'; return; }

  const navRect = navInner.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  const scrollLeft = navInner.scrollLeft || 0;

  indicator.style.left  = (btnRect.left - navRect.left + scrollLeft) + 'px';
  indicator.style.width = btnRect.width + 'px';
}

// ── Pill aktif durumunu güncelle ───────────────
function _pillSetActive(btnId) {
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(btnId);
  if (btn) btn.classList.add('active');
  _pillIndicatorMove(btnId, true);
}

// ── switchApp override — pill'i güncelle ──────
const _pillOrigSwitch = window.switchApp;
window.switchApp = function(app, label, dropId, fromPopState) {
  _pillOrigSwitch(app, label, dropId, fromPopState);

  // Hangi pill aktif?
  // Araç panelleri
  if (['dashboard','stats','notes','graph'].includes(app)) {
    _pillSetActive('pill-' + app);
    _pillCurrentApp = app;
  } else {
    // Ders paneli — hangi gruba ait?
    let foundGroup = null;
    for (const [grp, cfg] of Object.entries(PILL_WEEKS)) {
      if (cfg.weeks.includes(app)) { foundGroup = grp; break; }
    }
    if (foundGroup) {
      _pillCurrentGroup = foundGroup;
      _pillCurrentApp   = app;
      _pillSetActive('pill-' + foundGroup);
    }
  }
};

// ── Tema değişince icon güncelle ──────────────
const _pillOrigToggle = window.toggleTheme;
if (_pillOrigToggle) {
  window.toggleTheme = function() {
    _pillOrigToggle();
    _syncPillThemeIcon();
  };
}
function _syncPillThemeIcon() {
  const icon = document.getElementById('pill-theme-icon');
  if (!icon) return;
  const dark = document.body.getAttribute('data-theme') !== 'light';
  icon.textContent = dark ? '🌙' : '☀️';
}

// ── İlk yükleme ───────────────────────────────
function initPillNav() {
  // Mevcut aktif paneli bul
  const visiblePanel = document.querySelector('.app-panel.visible');
  let activeApp = 'dashboard';
  if (visiblePanel) activeApp = visiblePanel.id.replace('panel-', '');

  // İlk indicator yerleştir (DOM render sonrası)
  setTimeout(() => {
    let activeBtnId = 'pill-' + activeApp;
    // Ders grubu olabilir
    for (const [grp, cfg] of Object.entries(PILL_WEEKS)) {
      if (cfg.weeks.includes(activeApp)) { activeBtnId = 'pill-' + grp; break; }
    }
    _pillSetActive(activeBtnId);
    _syncPillThemeIcon();
  }, 100);
}

// initPremium hook'una ekle
const _pillOrigPremium = window.initPremium;
window.initPremium = function() {
  _pillOrigPremium();
  initPillNav();
};

