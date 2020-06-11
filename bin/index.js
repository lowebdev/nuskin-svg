#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const attributes = ['fill', 'stroke', 'background']
const recolor = require('./cmds/recolor')
const reset = require('./cmds/reset')
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
  }, recolor)
  .command('reset', 'Removes colors of a single (or all .svg in containing folder if path arg is a dir) .svg file\'s fill, background, stroke or all attribute(s)', (yargs) => {
    return yargs.usage('Usage: nuskin reset --path <path> --attr [attribute to recolor] (--all resets all attributes to specified path)')
                .option('path', { alias: 'p', describe: 'Path to file or directory containing SVG files to reset', type: 'string', demandOption: true })
                .option('attr', { alias: 'a', describe: 'The attribute to reset. Supports "fill", "stroke", "background". If none is specified, all attributes will be reset', type: 'string' })
  }, reset)
  .help()
  .argv

// function main(argv) {
//   // Prints command name
//   const cmdName = (argv._ || [''])[0]

//   let filesToSave;
//   switch (cmdName) {
//     case 'recolor':
//       break

//     case 'reset':
//       break
    
//     default:
//       break
//   }
// }
