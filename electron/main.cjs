

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { saveGame, loadGame, loadFolders } = require('./saveManager.cjs');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
  width: 1280,
  height: 720,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  }
});

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle("load-json", async (_event, fileName) => {
  const filePath = path.join(__dirname, "data", fileName + ".json");
  const content = await fs.promises.readFile(filePath, "utf8");
  return JSON.parse(content);
});

ipcMain.handle("save-game", (_, user) => {
  saveGame(user)
})

ipcMain.handle("load-game", (_, userId) => {
  return loadGame(userId)
})

ipcMain.handle("load-folders", (_) => {
  return loadFolders()
})