#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const attributes = ['fill', 'stroke', 'background']
const utils = require('./utils')
const recolor = require('./recolor')
const yargs = require('yargs')

// .option(name, { alias, describe, type:string, demandOption }) // demandOption == required
yargs
  // Help command
  .command('$0', 'Default command calls help', () => {}, (argv) => {
    console.log(`use 'nuskin --help' for a list of commands`)
  })
  // Recolor command
  .command('recolor', 'Recolors a single (or all .svg in containing folder if path arg is a dir) .svg file\'s fill, background or stroke attribute', (yargs) => {
    return yargs.usage('Usage: nuskin recolor --path <path> --attr [attribute to recolor] --color [color to apply to attribute]')
                .option('path', { alias: 'p', describe: 'Path to file or directory containing SVG files to be recolored', type: 'string', demandOption: true })
                .option('attr', { alias: 'a', describe: 'The attribute to apply the new color to. Supports "fill", "stroke" & "background". Defaults to "fill" ', type: 'string' })
                .option('color', { alias: 'c', describe: 'The color you want to apply to svgs\' attribute (only supports CSS color values e.g.: blue, rgb(0,0,0), #beeeef)', type: 'string' })
  }, recolor.recolor)
  .command('reset', 'Removes colors of a single (or all .svg in containing folder if path arg is a dir) .svg file\'s fill, background, stroke or all attribute(s)', (yargs) => {
    return yargs.usage('Usage: nuskin reset --path <path> --attr [attribute to recolor] (--all resets all attributes to specified path)')
                .option('path', { alias: 'p', describe: 'Path to file or directory containing SVG files to reset', type: 'string', demandOption: true })
                .option('attr', { alias: 'a', describe: 'The attribute to reset. Supports "fill", "stroke", "background". If none is specified, all attributes will be reset', type: 'string' })
  }, reset)
  .help()
  .argv

// PREPARE FOR UNIT TESTING w/ MOCHA
function main(argv) {
  // Prints command name
  const cmdName = (argv._ || [''])[0]

  let filesToSave;
  switch (cmdName) {
    case 'recolor':
      break

    case 'reset':
      break
    
    default:
      break
  }
}

// function recolor(argv) {

//   const pathArg = argv.path
//   const color = argv.color
//   const attr = argv.attr || 'fill'

//   if (!attributes.includes(attr))
//     throw new Error('"attr" argument must have a value of "fill", "stroke" or "background"')

//   if (!color)
//     throw new Error('No color provided. Please add a color argument.(see `$ nuskin --help` for more info)')

//   try {
//     const filenames = getAbsoluteFilePaths(pathArg)
//     const isSolo = filenames.length === 1
//     console.log(`Found ${filenames.length} SVG file${isSolo ? '' : 's'} at provided path`)

//     for (let i = 0; i < filenames.length; i++)
//       recolorSvgAtAbsolutePath(filenames[i], color, attr)

//   } catch (err) {
//     console.log(err)
//   }
// }

// function recolorSvgAtAbsolutePath(pathArg, color, attr) {

//   const attrRegex = new RegExp(`${attr}:([#\(,\) ]|[A-z]|[0-9])+;`)
//   let svgStrData = fs.readFileSync(pathArg).toString('utf8')
//   let startSvgTagData = (svgStrData.match(svgStartingTagRegex) || []).indexOrUndefined(0)
//   let svgStyleTagData = ((startSvgTagData || '').match(styleTagRegex) || []).indexOrUndefined(0)
//   let targetStyle = ((svgStyleTagData || '').match(attrRegex) || []).indexOrUndefined(0)

//   if (!svgStyleTagData) {
//     // Does not have style tag yet
//     svgStrData = svgStrData.replace('<svg', `<svg style="${attr}:${color};"`)

//   } else if (!targetStyle) {
//     // Has style tag and does not have target style attribute
//     let newSvgStyleTagData = svgStyleTagData.replace('style="', `style="${attr}:${color};`)
//     svgStrData = svgStrData.replace(svgStyleTagData, newSvgStyleTagData)

//   } else {
//     // Has style tag & target attribute
//     let newSvgStyleTagData = svgStyleTagData.replace(targetStyle, `${attr}:${color};`)
//     svgStrData = svgStrData.replace(svgStyleTagData, newSvgStyleTagData)
//   }

//   // Overwrite file content with new data
//   fs.writeFileSync(pathArg, svgStrData)
//   console.log('Successfully changed color of ' + path.basename(pathArg))
// }

function reset(argv) {

  const pathArg = argv.path
  const attr = argv.attr

  try {
    const filenames = getAbsoluteFilePaths(pathArg)
    const isSolo = filenames.length === 1
    console.log(`Found ${filenames.length} SVG file${isSolo ? '' : 's'} at provided path`)

    for (let i = 0; i < filenames.length; i++)
      resetColorsAtPath(filenames[i], attr)

  } catch (err) {
    console.log(err)
  }
}

function resetColorsAtPath(pathArg, attribute) {

  const attrRegex = new RegExp(`${attribute}:([#\(,\) ]|[A-z]|[0-9])+;`)
  let svgStrData = fs.readFileSync(pathArg).toString('utf8')
  let startSvgTagData = (svgStrData.match(utils.svgStartingTagRegex) || []).indexOrUndefined(0)
  let svgStyleTagData = ((startSvgTagData || '').match(utils.styleAttributeRegex) || []).indexOrUndefined(0)
  let targetStyle = ((svgStyleTagData || '').match(attrRegex) || []).indexOrUndefined(0)

  if (!attribute && svgStyleTagData) {
    // Did not specify attribute, reset all attributes
    let newStartSvgTagData = startSvgTagData.replace(utils.styleAttributeRegex, '')
    svgStrData = svgStrData.replace(startSvgTagData, newStartSvgTagData)

  } else if (targetStyle) {
    // Has style tag & target attribute
    let newSvgStyleTagData = svgStyleTagData.replace(targetStyle, '')
    svgStrData = svgStrData.replace(svgStyleTagData, newSvgStyleTagData)

  } else {
    // 1- Has style tag and does not have target style attribute
    // 2- Does not have style tag yet
    console.log(`Cannot reset color because ${path.basename(pathArg)}'s target attribute does not exist`)
    return
  }

  // Overwrite file content with new data
  fs.writeFileSync(pathArg, svgStrData)
  console.log('Successfully reset colors of ' + path.basename(pathArg))
}

// UTILS
