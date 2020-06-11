const path = require('path')
const fs = require('fs')
const u = require('../bin/utils')

const immutableAssetFolder = path.join('test', '.assets')
const assetFolder = path.join('test', 'assets')

function resetRessource(ressourcePath) {
  const cmdName = getCallerFilename()

  if (!ressourcePath) {
    u.copyFolderRecursiveSync(path.join(immutableAssetFolder, cmdName), path.join(assetFolder, cmdName))
    return
  }

  const basename = path.basename(ressourcePath)
  const from = path.join(immutableAssetFolder, cmdName, basename)
  
  if (fs.lstatSync(from).isFile())
    fs.copyFileSync(from, path.join(assetFolder, cmdName, basename))
  else
    u.copyFolderRecursiveSync(from, path.join(assetFolder, cmdName))
}

// GENIUS => https://stackoverflow.com/questions/28631260/how-to-get-filename-and-line-number-of-where-a-function-is-called-in-node
function getCallerFilename() {
  const e = new Error()
  const regex = /\((.*):(\d+):(\d+)\)$/
  const match = regex.exec(e.stack.split("\n")[3])
  // const callerInfo = { filepath: match[1], line: match[2], column: match[3] }

  return path.basename(match[1]).split('.').indexOrUndefined(0)
}

function getAssetFolder() {

  return path.join(assetFolder, getCallerFilename())
}

function resPath(resPath) {
  return path.join(assetFolder, getCallerFilename(), resPath)
}

function destroyRessources() {
  const pathToDestroy = path.join(assetFolder, getCallerFilename())
  u.destroyFolderRecursiveSync(pathToDestroy)
}

module.exports = { resetRessource, getAssetFolder, resPath, destroyRessources }