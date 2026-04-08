const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow() {
  const isDev = !app.isPackaged
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'My Notebook',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#E8D5F5',
    show: false,
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

// File selection dialog
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documents', extensions: ['pdf', 'txt', 'md', 'doc', 'docx'] },
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  if (result.canceled) return []

  const files = []
  for (const filePath of result.filePaths) {
    const ext = path.extname(filePath).toLowerCase()
    const name = path.basename(filePath)
    const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
    const isPdf = ext === '.pdf'

    if (isImage) {
      const buffer = fs.readFileSync(filePath)
      const base64 = buffer.toString('base64')
      const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : 'image/webp'
      files.push({ name, type: 'image', mimeType, base64, size: buffer.length })
    } else if (isPdf) {
      const buffer = fs.readFileSync(filePath)
      const base64 = buffer.toString('base64')
      files.push({ name, type: 'pdf', base64, size: buffer.length })
    } else {
      const text = fs.readFileSync(filePath, 'utf-8')
      files.push({ name, type: 'text', content: text, size: Buffer.byteLength(text) })
    }
  }
  return files
})

// Read a single file
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath)
    return { success: true, data: buffer.toString('base64'), size: buffer.length }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Process a source with Gemini AI
ipcMain.handle('process-source', async (event, source, apiKey) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const parts = []

    if (source.type === 'image') {
      parts.push({ inlineData: { mimeType: source.mimeType, data: source.base64 } })
    } else if (source.type === 'pdf') {
      parts.push({ inlineData: { mimeType: 'application/pdf', data: source.base64 } })
    } else {
      parts.push({ text: `Here is the source material:\n\n${source.content}` })
    }

    parts.push({ text: 'Analyze this study material. Provide:\n1. A clear summary\n2. Key concepts as bullet points\n3. Detailed notes\n\nRespond ONLY with valid JSON, no markdown code blocks:\n{"summary": "...", "bulletNotes": ["...", "..."], "inDepthNotes": "...", "suggestedTitle": "..."}' })

    const result = await model.generateContent(parts)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return { success: true, data: JSON.parse(jsonMatch[0]) }
    }
    return { success: true, data: { summary: text, bulletNotes: [], inDepthNotes: text } }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Generate notes from multiple sources
ipcMain.handle('generate-notes', async (event, sources, instructions, apiKey) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const parts = []

    for (const source of sources) {
      if (source.type === 'image') {
        parts.push({ inlineData: { mimeType: source.mimeType, data: source.base64 } })
      } else if (source.type === 'pdf') {
        parts.push({ inlineData: { mimeType: 'application/pdf', data: source.base64 } })
      } else {
        parts.push({ text: `[Source: ${source.name}]\n${source.content}` })
      }
    }

    parts.push({ text: `Based on all sources above, generate comprehensive study notes organized into chapters and sections. ${instructions || ''}\n\nRespond ONLY with valid JSON, no markdown code blocks:\n{"chapters": [{"name": "...", "summary": "...", "sections": [{"name": "...", "summary": "...", "bulletNotes": ["..."], "inDepthNotes": "..."}]}]}` })

    const result = await model.generateContent(parts)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return { success: true, data: JSON.parse(jsonMatch[0]) }
    }
    return { success: false, error: 'Could not parse AI response' }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(createWindow)
