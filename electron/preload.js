const { contextBridge } = require('electron')

// Expose any Node.js APIs to the renderer here if needed
// For now, the app uses localStorage so no bridge is needed
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
})
