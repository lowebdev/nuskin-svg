#!/usr/bin/env node

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
                .option('color', { alias: 'c', describe: 'Valid CSS color value to apply to the svgs\' attribute. e.g.: rgba(0,0,0,1), #fff, blue, etc.', type: 'string' })
  }, recolor)
  .command('reset', 'Removes colors of a single (or all .svg in containing folder if path arg is a dir) .svg file\'s fill, background, stroke or all attribute(s)', (yargs) => {
    return yargs.usage('Usage: nuskin reset --path <path> --attr [attribute to recolor]')
                .option('path', { alias: 'p', describe: 'Path to file or directory containing SVG files to reset', type: 'string', demandOption: true })
                .option('attr', { alias: 'a', describe: 'The attribute to reset. Supports "fill", "stroke", "background". If none is specified, all attributes will be reset', type: 'string' })
  }, reset)
  .help()
  .argv
