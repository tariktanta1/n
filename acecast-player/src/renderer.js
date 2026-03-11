const SVG = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3c0 0-.01.08-.01.12A7.8 7.8 0 0 0 21 12.79Z"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  add: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M19 20 9 12l10-8"/><path d="M5 19V5"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="m5 4 10 8-10 8"/><path d="M19 5v14"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
  volume: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 6a8.5 8.5 0 0 1 0 12"/></svg>',
  mute: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m23 9-6 6"/><path d="m17 9 6 6"/></svg>',
  fullscreen: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M8 3H3v5M21 8V3h-5M16 21h5v-5M3 16v5h5"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="m18 6-12 12M6 6l12 12"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M5 4h11l3 3v13H5z"/><path d="M9 4v6h6V4"/><path d="M9 20v-6h6v6"/></svg>',
  drag: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="9" cy="7" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="9" cy="17" r="1.4"/><circle cx="15" cy="7" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="15" cy="17" r="1.4"/></svg>'
};

const state = {
  settings: null,
  channels: [],
  filtered: [],
  currentChannelId: null,
  isSeeking: false,
  buffering: false,
  hls: null,`n  mpegtsPlayer: null,`n  hlsFallbackTimer: null,
  retryTimer: null,
  retryAttempt: 0,
  maxRetry: 2,
  currentEditId: null,
  currentContextId: null,
  fullscreenHideTimer: null,
  draggingId: null
};

const el = {
  durumYazi: document.getElementById('durumYazi'),
  temaBtn: document.getElementById('temaBtn'),
  playlistBtn: document.getElementById('playlistBtn'),
  ekleBtn: document.getElementById('ekleBtn'),
  geriBtn: document.getElementById('geriBtn'),
  ileriBtn: document.getElementById('ileriBtn'),
  araInput: document.getElementById('araInput'),
  engineAuto: document.getElementById('engineAuto'),
  kanalSayisi: document.getElementById('kanalSayisi'),
  kanalListe: document.getElementById('kanalListe'),
  uyari: document.getElementById('uyari'),
  aktifKanal: document.getElementById('aktifKanal'),
  aktifMeta: document.getElementById('aktifMeta'),
  engineDurum: document.getElementById('engineDurum'),
  oynatimDurum: document.getElementById('oynatimDurum'),
  videoSahne: document.getElementById('videoSahne'),
  video: document.getElementById('video'),
  yukleniyor: document.getElementById('yukleniyor'),
  yukleniyorMetin: document.getElementById('yukleniyorMetin'),
  kontrolKatman: document.getElementById('kontrolKatman'),
  playBtn: document.getElementById('playBtn'),
  sessizBtn: document.getElementById('sessizBtn'),
  seek: document.getElementById('seek'),
  sureAnlik: document.getElementById('sureAnlik'),
  sureToplam: document.getElementById('sureToplam'),
  ses: document.getElementById('ses'),
  tamBtn: document.getElementById('tamBtn'),
  kanalModal: document.getElementById('kanalModal'),
  kanalAdInput: document.getElementById('kanalAdInput'),
  aceInput: document.getElementById('aceInput'),
  logoInput: document.getElementById('logoInput'),
  kanalModalKapat: document.getElementById('kanalModalKapat'),
  kanalModalKaydet: document.getElementById('kanalModalKaydet'),
  duzenleModal: document.getElementById('duzenleModal'),
  duzenleAd: document.getElementById('duzenleAd'),
  duzenleLogo: document.getElementById('duzenleLogo'),
  duzenleKapat: document.getElementById('duzenleKapat'),
  duzenleKaydet: document.getElementById('duzenleKaydet'),
  sagTikMenu: document.getElementById('sagTikMenu')
};

function iconize() {
  el.temaBtn.innerHTML = SVG.sun;
  el.playlistBtn.innerHTML = SVG.folder;
  el.ekleBtn.innerHTML = SVG.add;
  el.geriBtn.innerHTML = SVG.prev;
  el.ileriBtn.innerHTML = SVG.next;
  el.playBtn.innerHTML = SVG.play;
  el.sessizBtn.innerHTML = SVG.volume;
  el.tamBtn.innerHTML = SVG.fullscreen;
  el.kanalModalKapat.innerHTML = SVG.close;
  el.kanalModalKaydet.innerHTML = SVG.save;
  el.duzenleKapat.innerHTML = SVG.close;
  el.duzenleKaydet.innerHTML = SVG.save;
}

function temaUygula(next) {
  const tema = next === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', tema);
  localStorage.setItem('ace-tema', tema);
  el.temaBtn.innerHTML = tema === 'light' ? SVG.moon : SVG.sun;
}

function temaBaslat() {
  temaUygula(localStorage.getItem('ace-tema') || 'dark');
}

function yaziKisa(text, len = 12) {
  if (!text) return '';
  if (text.length <= len) return text;
  return text.slice(0, len) + '...';
}

function setUyari(text) {
  if (!text) {
    el.uyari.textContent = '';
    el.uyari.classList.add('gizli');
    return;
  }
  el.uyari.textContent = text;
  el.uyari.classList.remove('gizli');
}

function setYukleniyor(isOn, text = 'Yükleniyor...') {
  state.buffering = isOn;
  if (isOn) {
    el.yukleniyorMetin.textContent = text;
    el.yukleniyor.classList.remove('gizli');
    el.oynatimDurum.textContent = 'Buffering';
    return;
  }
  el.yukleniyor.classList.add('gizli');
}

function setOynatimDurum(text) {
  el.oynatimDurum.textContent = text;
}

function sureFormat(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function channelLogo(channel) {
  if (channel.logo) return channel.logo;
  const n = channel.title.toLowerCase();
  const picks = [
    ['dazn', 'https://logo.clearbit.com/dazn.com'],
    ['tnt', 'https://logo.clearbit.com/tntsports.co.uk'],
    ['sky', 'https://logo.clearbit.com/skysports.com'],
    ['eleven', 'https://logo.clearbit.com/elevensports.com'],
    ['polsat', 'https://logo.clearbit.com/polsat.pl'],
    ['bein', 'https://logo.clearbit.com/beinsports.com'],
    ['ziggo', 'https://logo.clearbit.com/ziggo.nl'],
    ['match', 'https://logo.clearbit.com/matchtv.ru'],
    ['liga', 'https://logo.clearbit.com/uefa.com']
  ];

  const found = picks.find(([key]) => n.includes(key));
  return found ? found[1] : '';
}

function streamManifest(aceId) {
  const host = state.settings?.streamHost || '127.0.0.1';
  const port = state.settings?.streamPort || 6878;
  return `http://${host}:${port}/ace/manifest.m3u8?id=${aceId}`;
}

function streamGetstream(aceId) {
  const host = state.settings?.streamHost || '127.0.0.1';
  const port = state.settings?.streamPort || 6878;
  return `http://${host}:${port}/ace/getstream?id=${aceId}`;
}

function aktifKanal() {
  return state.channels.find((c) => c.id === state.currentChannelId) || null;
}

function sonrakiKanal(step) {
  if (!state.channels.length) return;
  const playable = state.channels.filter((c) => c.playable);
  if (!playable.length) return;

  const current = playable.findIndex((c) => c.id === state.currentChannelId);
  const start = current >= 0 ? current : 0;
  const next = (start + step + playable.length) % playable.length;
  kanalOynat(playable[next].id);
}

function kanalListeCiz() {
  const q = (el.araInput.value || '').trim().toLowerCase();
  state.filtered = state.channels.filter((c) => {
    if (!q) return true;
    return c.title.toLowerCase().includes(q) || c.aceId.toLowerCase().includes(q);
  });

  el.kanalSayisi.textContent = String(state.filtered.length);

  if (!state.filtered.length) {
    el.kanalListe.innerHTML = '<div class="kanal-item"><div class="kanal-bilgi"><div class="kanal-ad">Kanal bulunamadı</div></div></div>';
    return;
  }

  el.kanalListe.innerHTML = state.filtered.map((ch) => {
    const active = ch.id === state.currentChannelId ? 'aktif' : '';
    const invalid = !ch.playable ? 'gecersiz' : '';
    const logo = channelLogo(ch);
    const initials = ch.title.split(' ').slice(0, 2).map((x) => x[0] || '').join('').toUpperCase();

    return `
      <button class="kanal-item ${active} ${invalid}" data-id="${ch.id}" draggable="true">
        <div class="logo">
          ${logo ? `<img src="${logo}" alt="" onerror="this.remove(); this.parentElement.textContent='${initials}'">` : initials}
        </div>
        <div class="kanal-bilgi">
          <div class="kanal-ad">${ch.title}</div>
          <div class="kanal-alt">${ch.playable ? yaziKisa(ch.aceId, 16) : (ch.error || 'Bağlantı hatalı')}</div>
        </div>
        <div class="tasinabilir">${SVG.drag}</div>
      </button>
    `;
  }).join('');

  [...el.kanalListe.querySelectorAll('.kanal-item')].forEach((btn) => {
    const id = btn.getAttribute('data-id');

    btn.addEventListener('click', () => {
      const ch = state.channels.find((c) => c.id === id);
      if (!ch) return;
      if (!ch.playable) {
        setUyari(`${ch.title}: ${ch.error || 'Bu kanal oynatılamıyor.'}`);
        return;
      }
      kanalOynat(id);
    });

    btn.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      state.currentContextId = id;
      el.sagTikMenu.style.left = `${event.clientX}px`;
      el.sagTikMenu.style.top = `${event.clientY}px`;
      el.sagTikMenu.classList.remove('gizli');
    });

    btn.addEventListener('dragstart', () => {
      state.draggingId = id;
    });

    btn.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    btn.addEventListener('drop', async (event) => {
      event.preventDefault();
      const from = state.draggingId;
      const to = id;
      if (!from || !to || from === to) return;
      kanalSirasiDegistir(from, to);
      await window.aceApi.reorderChannels({ ids: state.channels.map((c) => c.id) });
    });
  });
}

function kanalSirasiDegistir(fromId, toId) {
  const arr = [...state.channels];
  const fromIndex = arr.findIndex((c) => c.id === fromId);
  const toIndex = arr.findIndex((c) => c.id === toId);
  if (fromIndex < 0 || toIndex < 0) return;
  const [item] = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, item);
  state.channels = arr;
  kanalListeCiz();
}

function oynatmaTemizle() {
  clearTimeout(state.retryTimer);
  if (state.hls) {
    state.hls.destroy();
    state.hls = null;
  }
  el.video.pause();
  el.video.removeAttribute('src');
  el.video.load();
}

function retryPlanla(channel, reason) {
  clearTimeout(state.retryTimer);
  if (state.retryAttempt >= state.maxRetry) {
    setYukleniyor(false);
    setOynatimDurum('Bağlantı hatası');
    setUyari(`${channel.title}: ${reason}`);
    return;
  }

  state.retryAttempt += 1;
  const info = `${channel.title} tekrar deneniyor (${state.retryAttempt}/${state.maxRetry})`;
  setYukleniyor(true, info);
  state.retryTimer = setTimeout(() => {
    kanalOynat(channel.id, true);
  }, 800);
}

async function kanalOynat(channelId, isRetry = false) {
  const channel = state.channels.find((c) => c.id === channelId);
  if (!channel || !channel.playable) return;

  if (!isRetry) state.retryAttempt = 0;
  state.currentChannelId = channel.id;
  kanalListeCiz();

  const manifest = streamManifest(channel.aceId);
  const getstream = streamGetstream(channel.aceId);
  el.aktifKanal.textContent = channel.title;
  el.aktifMeta.textContent = manifest;
  setUyari('');
  setYukleniyor(true, 'Yayına bağlanılıyor...');
  setOynatimDurum('Bağlanıyor');

  oynatmaTemizle();

  state.retryTimer = setTimeout(() => {
    retryPlanla(channel, 'Buffering uzun sürdü.');
  }, 18000);

  const fallbackToGetstream = async (reason) => {
    try {
      if (state.hls) {
        state.hls.destroy();
        state.hls = null;
      }
      setOynatimDurum('Yedek akış deneniyor');
      el.aktifMeta.textContent = getstream;
      el.video.src = getstream;
      el.video.load();
      await el.video.play();
    } catch (error) {
      retryPlanla(channel, `${reason} / ${error.message}`);
    }
  };

  try {
    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 24
      });
      state.hls = hls;

      let switched = false;
      const safeFallback = async (reason) => {
        if (switched) return;
        switched = true;
        await fallbackToGetstream(reason);
      };

      hls.on(window.Hls.Events.ERROR, (_event, data) => {
        if (!data?.fatal) return;
        if (data.type === 'mediaError') {
          hls.recoverMediaError();
          return;
        }
        safeFallback(`HLS hata (${data.type || 'bilinmiyor'})`);
      });

      hls.loadSource(manifest);
      hls.attachMedia(el.video);

      hls.on(window.Hls.Events.MANIFEST_PARSED, async () => {
        try {
          await el.video.play();
        } catch (error) {
          await safeFallback(error.message);
        }
      });
      return;
    }

    await fallbackToGetstream('HLS desteklenmedi');
  } catch (error) {
    retryPlanla(channel, error.message);
  }
}

function tamEkranToggle() {
  if (!document.fullscreenElement) {
    el.videoSahne.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

function tamEkranKontrolGoster() {
  el.kontrolKatman.classList.remove('gizle');
  clearTimeout(state.fullscreenHideTimer);

  if (document.fullscreenElement) {
    state.fullscreenHideTimer = setTimeout(() => {
      el.kontrolKatman.classList.add('gizle');
    }, 2200);
  }
}

function eventBagla() {
  el.temaBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    temaUygula(next);
  });

  el.playlistBtn.addEventListener('click', async () => {
    const res = await window.aceApi.pickPlaylist();
    if (res.canceled) return;
    state.settings = res.settings;
    state.channels = res.channels || [];
    setUyari(res.playlistWarning || '');
    kanalListeCiz();
  });

  el.engineAuto.addEventListener('change', async () => {
    state.settings = await window.aceApi.saveSettings({ autoStartEngine: !!el.engineAuto.checked });
  });

  el.araInput.addEventListener('input', kanalListeCiz);

  el.ekleBtn.addEventListener('click', () => {
    el.kanalAdInput.value = '';
    el.aceInput.value = '';
    el.logoInput.value = '';
    el.kanalModal.classList.remove('gizli');
  });

  el.kanalModalKapat.addEventListener('click', () => el.kanalModal.classList.add('gizli'));

  el.kanalModalKaydet.addEventListener('click', async () => {
    const payload = {
      title: el.kanalAdInput.value,
      aceInput: el.aceInput.value,
      logo: el.logoInput.value
    };
    const res = await window.aceApi.addChannel(payload);
    if (!res.ok) {
      setUyari(res.message || 'Kanal eklenemedi.');
      return;
    }
    state.settings = res.settings;
    state.channels = res.channels || [];
    setUyari(res.playlistWarning || '');
    kanalListeCiz();
    el.kanalModal.classList.add('gizli');
  });

  el.duzenleKapat.addEventListener('click', () => el.duzenleModal.classList.add('gizli'));

  el.duzenleKaydet.addEventListener('click', async () => {
    const id = state.currentEditId;
    if (!id) return;
    const res = await window.aceApi.updateChannel({
      id,
      title: el.duzenleAd.value,
      logo: el.duzenleLogo.value
    });
    if (!res.ok) {
      setUyari(res.message || 'Güncelleme başarısız.');
      return;
    }
    state.settings = res.settings;
    state.channels = res.channels || [];
    kanalListeCiz();
    el.duzenleModal.classList.add('gizli');
  });

  el.sagTikMenu.addEventListener('click', async (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = state.currentContextId;
    el.sagTikMenu.classList.add('gizli');

    if (!id) return;

    if (action === 'kaldir') {
      const res = await window.aceApi.removeChannel({ id });
      if (res.ok) {
        state.settings = res.settings;
        state.channels = res.channels;
        if (state.currentChannelId === id) {
          state.currentChannelId = null;
          oynatmaTemizle();
          el.aktifKanal.textContent = 'Kanal seç';
          el.aktifMeta.textContent = 'Oynatma beklemede';
        }
        kanalListeCiz();
      }
      return;
    }

    if (action === 'ozellestir') {
      const ch = state.channels.find((c) => c.id === id);
      if (!ch) return;
      state.currentEditId = id;
      el.duzenleAd.value = ch.title;
      el.duzenleLogo.value = ch.logo || '';
      el.duzenleModal.classList.remove('gizli');
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.sag-tik')) {
      el.sagTikMenu.classList.add('gizli');
    }

    if (event.target === el.kanalModal) el.kanalModal.classList.add('gizli');
    if (event.target === el.duzenleModal) el.duzenleModal.classList.add('gizli');
  });

  el.geriBtn.addEventListener('click', () => sonrakiKanal(-1));
  el.ileriBtn.addEventListener('click', () => sonrakiKanal(1));

  el.playBtn.addEventListener('click', () => {
    if (el.video.paused) {
      el.video.play().catch(() => {});
    } else {
      el.video.pause();
    }
  });

  el.sessizBtn.addEventListener('click', () => {
    el.video.muted = !el.video.muted;
    el.sessizBtn.innerHTML = el.video.muted ? SVG.mute : SVG.volume;
  });

  el.tamBtn.addEventListener('click', tamEkranToggle);

  el.ses.addEventListener('input', () => {
    const v = Number(el.ses.value);
    el.video.volume = v;
    el.video.muted = v === 0;
    el.sessizBtn.innerHTML = el.video.muted ? SVG.mute : SVG.volume;
  });

  el.seek.addEventListener('mousedown', () => {
    state.isSeeking = true;
  });

  el.seek.addEventListener('mouseup', () => {
    state.isSeeking = false;
    const d = el.video.duration;
    if (Number.isFinite(d) && d > 0) {
      el.video.currentTime = (Number(el.seek.value) / 100) * d;
    }
  });

  el.video.addEventListener('playing', () => {
    clearTimeout(state.retryTimer);
    setYukleniyor(false);
    setOynatimDurum('Oynuyor');
    el.playBtn.innerHTML = SVG.pause;
  });

  el.video.addEventListener('pause', () => {
    el.playBtn.innerHTML = SVG.play;
    if (!state.buffering) setOynatimDurum('Duraklatıldı');
  });

  el.video.addEventListener('waiting', () => setYukleniyor(true, 'Buffering...'));
  el.video.addEventListener('canplay', () => setYukleniyor(false));

  el.video.addEventListener('timeupdate', () => {
    if (state.isSeeking) return;
    const current = el.video.currentTime || 0;
    const duration = Number.isFinite(el.video.duration) ? el.video.duration : 0;
    el.sureAnlik.textContent = sureFormat(current);

    if (duration > 0) {
      el.sureToplam.textContent = sureFormat(duration);
      el.seek.value = String((current / duration) * 100);
    } else {
      el.sureToplam.textContent = 'canlı';
    }
  });

  el.video.addEventListener('error', () => {
    const ch = aktifKanal();
    if (ch) retryPlanla(ch, 'Oynatma hatası.');
  });

  document.addEventListener('keydown', (event) => {
    const tag = (event.target?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      if (el.video.paused) el.video.play().catch(() => {});
      else el.video.pause();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (Number.isFinite(el.video.duration)) {
        el.video.currentTime = Math.max(0, el.video.currentTime - 10);
      }
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (Number.isFinite(el.video.duration)) {
        el.video.currentTime = Math.min(el.video.duration, el.video.currentTime + 10);
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      el.video.volume = Math.min(1, (el.video.volume || 0) + 0.05);
      el.ses.value = String(el.video.volume);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      el.video.volume = Math.max(0, (el.video.volume || 0) - 0.05);
      el.ses.value = String(el.video.volume);
      return;
    }

    if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      tamEkranToggle();
      return;
    }

    if (event.key === 'Escape' && document.fullscreenElement) {
      event.preventDefault();
      document.exitFullscreen().catch(() => {});
    }
  });

  document.addEventListener('fullscreenchange', () => {
    tamEkranKontrolGoster();
  });

  el.videoSahne.addEventListener('mousemove', tamEkranKontrolGoster);
}

async function baslat() {
  iconize();
  temaBaslat();
  eventBagla();

  setYukleniyor(true, 'Uygulama hazırlanıyor...');

  const startup = await window.aceApi.startup();
  state.settings = startup.settings;
  state.channels = startup.channels || [];

  el.engineAuto.checked = !!state.settings.autoStartEngine;
  el.engineDurum.textContent = startup.engineStatus?.started ? `Engine: ${startup.engineStatus.message}` : `Engine: ${startup.engineStatus?.message || 'Hazır değil'}`;
  el.durumYazi.textContent = startup.engineStatus?.message || 'Hazır';

  setUyari(startup.playlistWarning || '');
  kanalListeCiz();

  // İlk açılışta otomatik kanal oynatma yok.
  setYukleniyor(false);
  setOynatimDurum('Hazır');
}

baslat();




