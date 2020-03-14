const fs = require('fs')
const fillRegex = /(fill=")#{0,1}([A-z]|[0-9]){0,}"/

// Arguments
// 0: Folder path containing SVG files
// 1: Color replacement
const args = process.argv.slice(2);
const folderPath = args[0]
const color = args[1]

// 1- fs get folder from arg 0
// 2- scan for all svg files
// 3- for each files, get file content and change fill="" (regex) for hex color then save
exports.recolor = async function recolor() {
  try {
    
    const filenames = await getFolderContentInfo(folderPath)
    console.log(filenames)

    for (let i = 0; i < filenames.length; i++) {
      const filename = filenames[i]
      const fullFilePath = folderPath + '\\' + filename

      fs.readFile(fullFilePath, (err, data) => {
        const strData = data.toString('utf8')

        // 1- check if fill=""
        // 2- else check for <path & replace with <path fill=""
        const alreadyHasFillColor = (strData.match(fillRegex) || []).length > 0
        let updatedSvgData

        if (alreadyHasFillColor) {

          // Already has fill color. Replace with new color value
          console.log('Already had a fill color. Replaced by new fill color')
          updatedSvgData = strData.replace(fillRegex, `fill="${color}"`)
        } else {

          // No color yet. Add color
          console.log('Did not have any color yet. Added fill color')
          updatedSvgData = strData.replace('<path ', `<path fill="${color}" `)
        }
        console.log(updatedSvgData)

        // Overwrite file content with new data
        fs.writeFile(fullFilePath, updatedSvgData, (err) => {
          if (err && typeof err === 'error') throw err
          console.log('Successfully changed color of ' + filename)
        })
      })
    }
  } catch (err) {
    console.log(err)
  }

}

async function getFolderContentInfo(folderName) {
  return new Promise((resolve, reject) => {

    fs.readdir(folderName, { withFileTypes: true }, async (err, dirContent) => {
      if (err) reject(err)

      const files = dirContent.filter(dirent => {
        return dirent.isFile() && dirent.name.includes('.svg')
      })

      resolve(files.map(file => file.name))
    })
  })
}
