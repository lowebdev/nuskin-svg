const path = require('path')
const fs = require('fs')

const styleAttributeRegex = /\s*style="([#\(,:;\) ]|[A-z]|[0-9])+"/g
const svgStartingTagRegex = /<svg(\s|[a-z]|[A-Z]|["=:;,.]|[^<])+/

Array.prototype.indexOrUndefined = function(index) {
  return this.length >= index + 1 ? this[index] : undefined
}

function getAbsoluteFilePaths(filepath) {

  if (!path.isAbsolute(filepath)) {
    filepath = path.resolve(filepath)
  }

  const pathStats = fs.lstatSync(filepath)
  if (pathStats.isFile() && path.extname(filepath).toLowerCase() === '.svg')
    return [filepath]

  return getFolderContentInfo(filepath)
}

function getFolderContentInfo(folderName) {

  const files = fs.readdirSync(folderName, { withFileTypes: true })
    .filter(dirent => {
      return dirent.isFile() && dirent.name.includes('.svg')
    })

  return files.map(file => path.join(folderName, file.name))
}

function copyFileSync(source, target) {

  let targetFile = target
  //if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source))
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source))
}

function copyFolderRecursiveSync(source, target) {
  let files = []

  //check if folder needs to be created or integrated
  let targetFolder = path.basename(source) === path.basename(target) ? target : path.join(target, path.basename(source))

  if (!fs.existsSync(targetFolder))
    fs.mkdirSync(targetFolder, { recursive: true })

  //copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source)
    files.forEach(function (file) {
      let curSource = path.join(source, file)
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder)
      } else {
        copyFileSync(curSource, targetFolder)
      }
    })
  }
}

function destroyFolderRecursiveSync(target) {
  // TODO
}

function fileContains(path, test) {
  const fileContent = fs.readFileSync(path).toString('utf-8')

  if (test.constructor === RegExp)
    return (fileContent.match(test) || []).indexOrUndefined(0) !== undefined
  
  return fileContent.includes(test)
}

function allFilesInDirContain(dirpath, test) {

  const filenames = getFolderContentInfo(dirpath)
  return filenames.every((filename) => fileContains(filename, test))
}

module.exports = {
  getAbsoluteFilePaths,
  getFolderContentInfo,
  copyFolderRecursiveSync,
  fileContains,
  allFilesInDirContain,
  destroyFolderRecursiveSync,
  styleAttributeRegex,
  svgStartingTagRegex
}