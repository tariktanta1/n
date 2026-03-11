const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, exec } = require('child_process');

const DEFAULT_SETTINGS = {
  autoStartEngine: true,
  streamHost: '127.0.0.1',
  streamPort: 6878,
  enginePath: '%APPDATA%\\ACEStream\\engine\\ace_engine.exe',
  playlistPath: 'C:\\Users\\%USERNAME%\\Desktop\\New folder (3)\\maclar\\maç.xspf',
  customChannels: [],
  hiddenChannelIds: [],
  channelOverrides: {},
  channelOrder: []
};

function getSettingsPath() {
  return path.join(app.getPath('userData'), 'settings.json');
}

function expandWindowsEnv(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw.replace(/%([^%]+)%/g, (_, key) => process.env[key] || `%${key}%`);
}

function ensureSettingsFile() {
  const settingsPath = getSettingsPath();
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf8');
  }
  return settingsPath;
}

function readSettings() {
  const settingsPath = ensureSettingsFile();
  try {
    const raw = fs.readFileSync(settingsPath, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(nextSettings) {
  const settingsPath = ensureSettingsFile();
  const payload = { ...DEFAULT_SETTINGS, ...nextSettings };
  fs.writeFileSync(settingsPath, JSON.stringify(payload, null, 2), 'utf8');
  return payload;
}

function decodeXmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(text) {
  return text.replace(/<[^>]+>/g, '').trim();
}

function extractTag(block, tagName) {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const m = block.match(re);
  if (!m) return '';
  return decodeXmlEntities(stripTags(m[1] || ''));
}

function normalizeAceLocation(location) {
  const trimmed = (location || '').trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('acestream://')) {
    return trimmed.slice('acestream://'.length);
  }

  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9]+)/i);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }

  return trimmed;
}

function isValidAceId(aceId) {
  return /^[a-zA-Z0-9]{20,}$/.test(aceId || '');
}

function parseXspfPlaylist(filePath) {
  const fullPath = expandWindowsEnv(filePath);
  if (!fs.existsSync(fullPath)) {
    return { channels: [], warning: `Playlist bulunamadi: ${fullPath}` };
  }

  let xml = '';
  try {
    xml = fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    return { channels: [], warning: `Playlist okunamadi: ${error.message}` };
  }

  const trackMatches = xml.match(/<track>[\s\S]*?<\/track>/gi) || [];
  const invalid = [];

  const channels = trackMatches.map((track, index) => {
    const title = extractTag(track, 'title') || `Kanal ${index + 1}`;
    const location = extractTag(track, 'location');
    const aceId = normalizeAceLocation(location);

    if (!aceId) {
      invalid.push(`${title}: baglanti yok`);
      return {
        id: `xspf-${index}-invalid`,
        source: 'playlist',
        title,
        aceId: '',
        playable: false,
        error: 'Baglanti alani bos.'
      };
    }

    if (!isValidAceId(aceId)) {
      invalid.push(`${title}: gecersiz baglanti`);
      return {
        id: `xspf-${index}-${aceId.slice(0, 8)}`,
        source: 'playlist',
        title,
        aceId,
        playable: false,
        error: 'Playlist baglantisi gecersiz.'
      };
    }

    return {
      id: `xspf-${index}-${aceId.slice(0, 8)}`,
      source: 'playlist',
      title,
      aceId,
      playable: true,
      error: ''
    };
  });

  const warning = invalid.length
    ? `${invalid.length} kanalda playlist hatasi var. Bu kanallar isaretlendi.`
    : '';

  return { channels, warning };
}

function mergeChannels(settings, parsedChannels) {
  const hidden = new Set(settings.hiddenChannelIds || []);
  const overrides = settings.channelOverrides || {};

  const base = parsedChannels
    .filter((c) => !hidden.has(c.id))
    .map((c) => {
      const o = overrides[c.id] || {};
      return {
        ...c,
        title: o.title || c.title,
        logo: o.logo || c.logo || ''
      };
    });

  const customs = (settings.customChannels || [])
    .filter((c) => !hidden.has(c.id))
    .map((c) => ({
      id: c.id,
      source: 'custom',
      title: c.title,
      aceId: c.aceId,
      playable: isValidAceId(c.aceId),
      error: isValidAceId(c.aceId) ? '' : 'Kanal baglantisi gecersiz.',
      logo: c.logo || ''
    }));

  const all = [...base, ...customs];
  const order = settings.channelOrder || [];
  const orderMap = new Map(order.map((id, idx) => [id, idx]));

  all.sort((a, b) => {
    const ai = orderMap.has(a.id) ? orderMap.get(a.id) : Number.MAX_SAFE_INTEGER;
    const bi = orderMap.has(b.id) ? orderMap.get(b.id) : Number.MAX_SAFE_INTEGER;
    if (ai !== bi) return ai - bi;
    return a.title.localeCompare(b.title, 'tr');
  });

  return all;
}

function composeState(settings) {
  const parsed = parseXspfPlaylist(settings.playlistPath);
  return {
    channels: mergeChannels(settings, parsed.channels),
    playlistWarning: parsed.warning
  };
}

function sanitizeAceInput(raw) {
  const aceId = normalizeAceLocation(raw);
  if (!isValidAceId(aceId)) return '';
  return aceId;
}

function isAceEngineRunning() {
  return new Promise((resolve) => {
    exec('tasklist /FI "IMAGENAME eq ace_engine.exe"', (err, stdout) => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(/ace_engine\.exe/i.test(stdout || ''));
    });
  });
}

async function startAceEngine(enginePathRaw) {
  const enginePath = expandWindowsEnv(enginePathRaw);
  if (!enginePath || !fs.existsSync(enginePath)) {
    return { started: false, message: `Engine bulunamadi: ${enginePath}` };
  }

  const alreadyRunning = await isAceEngineRunning();
  if (alreadyRunning) {
    return { started: true, message: 'Engine hazir.' };
  }

  try {
    const child = spawn(enginePath, [], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    });
    child.unref();
    return { started: true, message: 'Engine baslatiliyor...' };
  } catch (error) {
    return { started: false, message: `Engine baslatilamadi: ${error.message}` };
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1460,
    height: 920,
    minWidth: 1120,
    minHeight: 700,
    autoHideMenuBar: true,
    backgroundColor: '#08111f',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

ipcMain.handle('app:startup', async () => {
  const settings = readSettings();
  const state = composeState(settings);

  let engineStatus = { started: false, message: 'Otomatik baslatma kapali.' };
  if (settings.autoStartEngine) {
    engineStatus = await startAceEngine(settings.enginePath);
  }

  return {
    settings,
    channels: state.channels,
    playlistWarning: state.playlistWarning,
    engineStatus,
    settingsPath: getSettingsPath()
  };
});

ipcMain.handle('app:pickPlaylist', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Playlist Sec',
    filters: [{ name: 'Playlist', extensions: ['xspf', 'm3u', 'm3u8'] }],
    properties: ['openFile']
  });

  if (result.canceled || !result.filePaths?.[0]) {
    return { canceled: true };
  }

  const chosen = result.filePaths[0];
  const current = readSettings();
  const updated = saveSettings({ ...current, playlistPath: chosen });
  const state = composeState(updated);

  return {
    canceled: false,
    chosenPath: chosen,
    settings: updated,
    channels: state.channels,
    playlistWarning: state.playlistWarning
  };
});

ipcMain.handle('app:saveSettings', async (_event, partial) => {
  const current = readSettings();
  const updated = saveSettings({ ...current, ...partial });
  return updated;
});

ipcMain.handle('channel:add', async (_event, payload) => {
  const current = readSettings();
  const aceId = sanitizeAceInput(payload?.aceInput || '');
  if (!aceId) {
    return { ok: false, message: 'Gecerli bir ACE baglantisi gir.' };
  }

  const nextCustom = [...(current.customChannels || [])];
  const exists = nextCustom.some((c) => c.aceId === aceId);
  if (exists) {
    return { ok: false, message: 'Bu kanal zaten mevcut.' };
  }

  const item = {
    id: `custom-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    title: (payload?.title || '').trim() || 'Yeni Kanal',
    aceId,
    logo: (payload?.logo || '').trim()
  };

  nextCustom.push(item);
  const updated = saveSettings({ ...current, customChannels: nextCustom });
  const state = composeState(updated);

  return { ok: true, settings: updated, channels: state.channels, playlistWarning: state.playlistWarning };
});

ipcMain.handle('channel:remove', async (_event, payload) => {
  const id = payload?.id;
  if (!id) return { ok: false, message: 'Kanal kimligi eksik.' };

  const current = readSettings();
  const next = { ...current };

  const custom = [...(next.customChannels || [])];
  const idx = custom.findIndex((c) => c.id === id);

  if (idx >= 0) {
    custom.splice(idx, 1);
    next.customChannels = custom;
  } else {
    const hidden = new Set(next.hiddenChannelIds || []);
    hidden.add(id);
    next.hiddenChannelIds = [...hidden];
  }

  next.channelOrder = (next.channelOrder || []).filter((x) => x !== id);
  delete next.channelOverrides?.[id];

  const updated = saveSettings(next);
  const state = composeState(updated);
  return { ok: true, settings: updated, channels: state.channels, playlistWarning: state.playlistWarning };
});

ipcMain.handle('channel:update', async (_event, payload) => {
  const id = payload?.id;
  if (!id) return { ok: false, message: 'Kanal kimligi eksik.' };

  const current = readSettings();
  const next = { ...current };
  const custom = [...(next.customChannels || [])];
  const idx = custom.findIndex((c) => c.id === id);

  const nextTitle = (payload?.title || '').trim();
  const nextLogo = (payload?.logo || '').trim();

  if (idx >= 0) {
    custom[idx] = {
      ...custom[idx],
      title: nextTitle || custom[idx].title,
      logo: nextLogo
    };
    next.customChannels = custom;
  } else {
    const overrides = { ...(next.channelOverrides || {}) };
    overrides[id] = {
      ...(overrides[id] || {}),
      ...(nextTitle ? { title: nextTitle } : {}),
      logo: nextLogo
    };
    next.channelOverrides = overrides;
  }

  const updated = saveSettings(next);
  const state = composeState(updated);
  return { ok: true, settings: updated, channels: state.channels, playlistWarning: state.playlistWarning };
});

ipcMain.handle('channel:reorder', async (_event, payload) => {
  const ids = Array.isArray(payload?.ids) ? payload.ids : [];
  const current = readSettings();
  const updated = saveSettings({ ...current, channelOrder: ids });
  const state = composeState(updated);
  return { ok: true, settings: updated, channels: state.channels, playlistWarning: state.playlistWarning };
});

app.whenReady().then(() => {
  ensureSettingsFile();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
