#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
// const fillRegex = /fill="([#\(,\)]|[A-z]|[0-9])+"/g
const fillStyleRegex = /fill:([#\(,\) ]|[A-z]|[0-9])+;/g
const styleTagRegex = /style="([#\(,:;\) ]|[A-z]|[0-9])+"/g
const svgStartingTagRegex = /<svg(\s|[a-z]|[A-Z]|["=:;,.]|[^<])+/
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
                .option('attr', { alias: 'a', describe: 'The attribute to apply the new color to. Supports "fill", "stroke" & "background". Defaults to "fill" ', type: 'string' })
                .option('color', { alias: 'c', describe: 'The color you want to apply to svgs\' attribute (only supports CSS color values e.g.: blue, rgb(0,0,0), #beeeef)', type: 'string' })
  }, recolor)
  .help()
  .argv

// Arguments
// 0: <path> Folder path containing SVG files
// 1: [fill] Color replacement
function recolor(argv) {
  const pathArg = argv.path
  const color = argv.color
  const attr = argv.attr || 'fill'

  if (!['fill', 'stroke', 'background'].includes(attr))
    throw new Error('"attr" argument must have a value of "fill", "stroke" or "background"')

  if (!color)
    throw new Error('No color provided. Please add a color argument.(see `$ nuskin --help` for more info)')

  try {
    const filenames = getAbsoluteFilePaths(pathArg)
    const isSolo = filenames.length === 1
    console.log(`Found ${filenames.length} SVG file${isSolo ? '' : 's'} at path.\r\n`)

    for (let i = 0; i < filenames.length; i++)
      recolorSvgAtAbsolutePath(filenames[i], color, attr)

  } catch (err) {
    console.log(err)
  }
}

function recolorSvgAtAbsolutePath(pathArg, color, attr) {
  const regex = new RegExp(`${attr}:([#\(,\) ]|[A-z]|[0-9])+;`)
  let svgStrData = fs.readFileSync(pathArg).toString('utf8')

  // Already has style color. Replace with new color value
  if ((svgStrData.match(regex) || []).length > 0) {
    console.log(`Changing ${attr} color...`)
    svgStrData = svgStrData.replace(regex, `${attr}:${color};`)

  } else if ((svgStrData.match(styleTagRegex) || []).length > 0) {
    // TODO
  } else {

    svgStrData = svgStrData.replace('<svg', `<svg style="${attr}:${color};"`)
  }

  // Overwrite file content with new data
  fs.writeFileSync(pathArg, svgStrData)
  console.log('Successfully changed color of ' + path.basename(pathArg) + '!\r\n')
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
