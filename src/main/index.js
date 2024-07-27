import { app, shell, BrowserWindow, ipcMain, protocol, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import expressApp from '../server/app.js'
import sequelize from '../server/config/db.js'
import fs from 'node:fs'
import path, { join } from 'node:path'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

// إعداد التحديث التلقائي
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  dialog
    .showMessageBox({
      title: 'Update Available',
      message: 'A new version of the application is available. Would you like to update now?'
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  log.info('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.')
})
autoUpdater.on('error', (err) => {
  log.error(`Error in auto-updater. ${err}`)
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = `Download speed: ${progressObj.bytesPerSecond}`
  log_message = `${log_message} - Downloaded ${progressObj.percent}%`
  log_message = `${log_message} (${progressObj.transferred}/${progressObj.total})`
  log.info(log_message)
})

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded')
  dialog
    .showMessageBox({
      title: 'Install Updates',
      message: 'Updates downloaded, application will be quit for update...'
    })
    .then(() => {
      setImmediate(() => autoUpdater.quitAndInstall())
    })
})

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // maximize window
  mainWindow.maximize()

  // Open the DevTools in development mode bottom
  if (is.dev) {
    mainWindow.webContents.openDevTools({ mode: 'bottom' })
    console.log(import.meta.env.VITE_GH_TOKEN, 'Checking for update')
  }

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // تحقق من التحديثات عند إنشاء النافذة
  autoUpdater.checkForUpdatesAndNotify()
}

function createErrorWindow(error) {
  const errorWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  errorWindow.loadURL(`data:text/html,${error}`)
}

// Register magicFile protocol
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true
    }
  }
])

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  protocol.handle('app', async (req) => {
    const __dirname = path.resolve()
    const { host, pathname } = new URL(req.url)
    const filePath = join(__dirname, host, pathname)
    const mimeType = getContentType(filePath)
    return new Response(fs.createReadStream(filePath), {
      headers: {
        'Content-Type': mimeType
      }
    })
  })

  function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase()
    switch (ext) {
      case '.html':
        return 'text/html'
      case '.js':
        return 'application/javascript'
      case '.css':
        return 'text/css'
      case '.json':
        return 'application/json'
      case '.png':
        return 'image/png'
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg'
      case '.gif':
        return 'image/gif'
      default:
        return 'application/octet-stream'
    }
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  const PORT = 5005
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
      return sequelize.sync()
    })
    .then(() => {
      expressApp.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
      })
      createWindow()
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err)
      createErrorWindow(err)
    })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('print-to-pdf', promptSavePDF)

function promptSavePDF(event, url) {
  console.log(url)
  const win = BrowserWindow.fromWebContents(event.sender)
  dialog
    .showSaveDialog(win, {
      title: 'Save PDF',
      defaultPath: path.join(__dirname, 'output.pdf'),
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    })
    .then(({ filePath }) => {
      if (filePath) {
        generatePDF('https://www.youtube.com/', filePath)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

function generatePDF(url, filePath) {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadURL(url)
  win.webContents.on('did-finish-load', () => {
    win.webContents
      .printToPDF({})
      .then((data) => {
        fs.writeFile(filePath, data, (error) => {
          if (error) throw error
          console.log('PDF Generated Successfully at:', filePath)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  })
}
