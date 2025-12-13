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

module.exports = {
  saveGame,
  loadGame,
  loadFolders
}