const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  loadJson: (fileName) => ipcRenderer.invoke("load-json", fileName),
});