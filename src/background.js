'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import { autoUpdater } from "electron-updater"
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// /*************************************************************
//  * py process
//  *************************************************************/
// const path = require('path')
// const PY_DIST_FOLDER = 'pycalcdist'
// const PY_FOLDER = 'pycalc'
// const PY_MODULE = 'api' // without .py suffix
 
// let pyProc = null
// let pyPort = null
 
// const guessPackaged = () => {
//    const fullPath = path.join(__dirname, PY_DIST_FOLDER)
//    return require('fs').existsSync(fullPath)
//  }
 
// const getScriptPath = () => {
//    if (!guessPackaged()) {
//      return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
//    }
//    if (process.platform === 'win32') {
//      return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
//    }
//    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
//  }
 
// const selectPort = () => {
//    pyPort = 5000
//    return pyPort
//  }
 
// const createPyProc = () => {
//    let script = getScriptPath()
//    let port = '' + selectPort()
 
//    if (guessPackaged()) {
//      pyProc = require('child_process').execFile(script, [port])
//    } else {
//      pyProc = require('child_process').spawn('python', [script, port])
//    }
  
//    if (pyProc != null) {
//      //console.log(pyProc)
//      console.log('child process success on port ' + port)
//    }
// }
 
// const exitPyProc = () => {
//    pyProc.kill()
//    pyProc = null
//    pyPort = null
//  }
 
// app.on('ready', createPyProc)
// app.on('will-quit', exitPyProc)


async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Data Super App",
    icon: path.join(__static, 'icon.png'),
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    },
    autoHideMenuBar: true,
  })
  win.maximize()
  win.on("page-title-updated", (event) => event.preventDefault());
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    autoUpdater.checkForUpdatesAndNotify()
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
