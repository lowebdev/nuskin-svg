#!/usr/bin/env node

const fs = require('fs')
const fillRegex = /(fill=")#{0,1}([A-z]|[0-9]){0,}"/
const yargs = require('yargs')

// .option(name, { alias, describe, type:string, demandOption }) // demandOption == required
yargs
  // Help command
  .command('$0', 'Default command calls help', () => {}, (argv) => {
    console.log(`use 'nuskin --help' for a list of commands`)
  })
  // Recolor command
  .command('recolor', 'Recolors .svgs\' fill color', (yargs) => {
    return yargs.usage('Usage: nuskin recolor --path <path> --color [color]')
                .option('path', { alias: 'p', describe: 'Path to directory containing SVG files to be recolored', type: 'string', demandOption: true })
                .option('color', { alias: 'c', describe: 'The color you want to apply to svgs\' fill attribute (only supports CSS values e.g.: blue, rgb(0,0,0), #beeeef)', type: 'string', default: '#000' })
  }, recolor)
  .help()
  .argv

// Arguments
// 0: <path> Folder path containing SVG files
// 1: <color> Color replacement
async function recolor(argv) {
  const folderPath = argv.path
  const color = argv.color

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
