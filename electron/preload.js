const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  // File reading
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  selectFiles: () => ipcRenderer.invoke('select-files'),
  // AI processing
  processSource: (source, apiKey) => ipcRenderer.invoke('process-source', source, apiKey),
  generateNotes: (sources, instructions, apiKey) => ipcRenderer.invoke('generate-notes', sources, instructions, apiKey),
})
