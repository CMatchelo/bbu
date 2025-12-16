const { app } = require("electron")
const fs = require("fs")
const path = require("path")

const savesDir = path.join(app.getPath("userData"), "saves")

function ensureSavesFolder(userId) {
  const userSaveDir = path.join(savesDir, userId);

  if (!fs.existsSync(userSaveDir)) {
    fs.mkdirSync(userSaveDir, { recursive: true });
  }
}

function saveGame(user) {
  const folderName = `${user.name}_${user.id}`
  ensureSavesFolder(folderName)

  const filePath = path.join(savesDir, folderName, `save.json`)

  fs.writeFileSync(
    filePath,
    JSON.stringify(user, null, 2),
    "utf-8",
  )
}

function loadGame(userId) {
  const filePath = path.join(savesDir, userId, `save.json`)
  return JSON.parse(fs.readFileSync(filePath, "utf-8"))
}

function loadFolders() {
  if(!fs.existsSync(savesDir)) {
    return []
  }

  return fs.readdirSync(savesDir, { withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

function saveSchedule(userId, scheduleState) {
  if (!fs.existsSync(savesDir)) {
    fs.mkdirSync(savesDir, { recursive: true });
  }

  const userDir = path.join(savesDir, userId);

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const filePath = path.join(userDir, "schedule.json");

  fs.writeFileSync(
    filePath,
    JSON.stringify(scheduleState, null, 2),
    "utf-8"
  );

  return true;
}

function loadSchedule(userId) {
  const filePath = path.join(savesDir, userId, "schedule.json")
  return JSON.parse(fs.readFileSync(filePath, "utf-8"))
}

module.exports = {
  saveGame,
  loadGame,
  loadFolders,
  saveSchedule,
  loadSchedule
}