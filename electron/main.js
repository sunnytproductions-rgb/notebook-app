const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const isDev = !app.isPackaged
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'My Notebook',
    icon: path.join(__dirname, '..', 'public', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // Frameless with custom title bar look (optional — remove for default Windows frame)
    // frame: false,
    backgroundColor: '#E8D5F5',
    show: false,
  })

  // Show window when ready to prevent white flash
  win.once('ready-to-show', () => {
    win.show()
  })

  if (isDev) {
    // In dev mode, load from Vite dev server
    win.loadURL('http://localhost:5173')
    // Uncomment to open DevTools automatically in dev:
    // win.webContents.openDevTools()
  } else {
    // In production, load the built files
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

// macOS: re-create window when dock icon clicked and no windows open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Quit when all windows closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(createWindow)
