#!/usr/bin/env node

const fs = require('fs')
const fillRegex = /fill="([#\(,\)]|[A-z]|[0-9])+"/g
const fillStyleRegex = /fill:([#\(,\) ]|[A-z]|[0-9])+;/g
const yargs = require('yargs')

// .option(name, { alias, describe, type:string, demandOption }) // demandOption == required
yargs
  // Help command
  .command('$0', 'Default command calls help', () => {}, (argv) => {
    console.log(`use 'nuskin --help' for a list of commands`)
  })
  // Recolor command
  .command('recolor', 'Recolors .svgs\' fill color', (yargs) => {
    return yargs.usage('Usage: nuskin recolor --path <path> --fill [fill color]')
                .option('path', { alias: 'p', describe: 'Path to directory containing SVG files to be recolored', type: 'string', demandOption: true })
                .option('fill', { alias: 'f', describe: 'The color you want to apply to svgs\' fill attribute (only supports CSS color values e.g.: blue, rgb(0,0,0), #beeeef)', type: 'string' })
  }, recolor)
  .help()
  .argv

// Arguments
// 0: <path> Folder path containing SVG files
// 1: [fill] Color replacement
function recolor(argv) {
  const folderPath = argv.path
  const fillColor = argv.fill

  if (!argv.fill && !argv.stroke) {
    console.log('No fill color provided. Please add a color argument.(see `$ nuskin --help` for more info)') // or stroke color entered.
    return
  }

  try {
    const filenames = getFolderContentInfo(folderPath)
    console.log(`Found ${filenames.length} SVG files.\r\n`)

    for (let i = 0; i < filenames.length; i++) {
      const filename = filenames[i]
      const fullFilePath = folderPath + '\\' + filename
      let svgStrData = fs.readFileSync(fullFilePath).toString('utf8')

      // 1- check if fill="<color>"
      // 2- check if fill fill:<color>;

      // Already has inline fill color. Replace with new color value
      if ((svgStrData.match(fillRegex) || []).length > 0 && fillColor) {
        console.log(`Changing inline fill color...`)
        svgStrData = svgStrData.replace(fillRegex, `fill="${fillColor}"`)
      }
      
      // Already has style fill color. Replace with new color value
      if ((svgStrData.match(fillStyleRegex) || []).length > 0 && fillColor) {
        console.log('Changing style fill color...')
        svgStrData = svgStrData.replace(fillStyleRegex, `fill:${fillColor};`)
      }

      // Overwrite file content with new data
      fs.writeFileSync(fullFilePath, svgStrData)
      console.log('Successfully changed color of ' + filename + '!\r\n')
    }
  } catch (err) {
    console.log(err)
  }
}

function getFolderContentInfo(folderName) {
  
  const files = fs.readdirSync(folderName, { withFileTypes: true })
    .filter(dirent => {
      return dirent.isFile() && dirent.name.includes('.svg')
    })

  return files.map(file => file.name)
}
