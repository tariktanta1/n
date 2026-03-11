const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aceApi', {
  startup: () => ipcRenderer.invoke('app:startup'),
  pickPlaylist: () => ipcRenderer.invoke('app:pickPlaylist'),
  saveSettings: (partial) => ipcRenderer.invoke('app:saveSettings', partial),
  addChannel: (payload) => ipcRenderer.invoke('channel:add', payload),
  removeChannel: (payload) => ipcRenderer.invoke('channel:remove', payload),
  updateChannel: (payload) => ipcRenderer.invoke('channel:update', payload),
  reorderChannels: (payload) => ipcRenderer.invoke('channel:reorder', payload)
});
