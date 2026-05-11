const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  loadJson: (fileName) => ipcRenderer.invoke("load-json", fileName),
  saveGame: (user) => ipcRenderer.invoke("save-game", user),
  loadGame: (userId) => ipcRenderer.invoke("load-game", userId),
  loadFolders: () => ipcRenderer.invoke("load-folders"),
  saveSchedule: (user, schedule) => ipcRenderer.invoke("save-schedule", user, schedule),
  savePlayers: (user, players) => ipcRenderer.invoke("save-players", user, players),
  saveUniversities: (user, universities) => ipcRenderer.invoke("save-universities", user, universities),
  saveHighSchoolPlayers: (userId, data) => ipcRenderer.invoke("save-high-school-players", userId, data),
  saveLeagueStandings: (userId, data) => ipcRenderer.invoke("save-league-standings", userId, data),
});