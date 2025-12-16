const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  loadJson: (fileName) => ipcRenderer.invoke("load-json", fileName),
  saveGame: (user) => ipcRenderer.invoke("save-game", user),
  loadGame: (userId) => ipcRenderer.invoke("load-game", userId),
  loadFolders: () => ipcRenderer.invoke("load-folders"),
  saveSchedule: (user, schedule) => ipcRenderer.invoke("save-schedule", user, schedule)
});