const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const attributes = ['fill', 'stroke', 'background']

function recolorSvgAtAbsolutePath(pathArg, color, attr) {

  const attrRegex = new RegExp(`${attr}:([#\(,\) ]|[A-z]|[0-9])+;`)
  let svgStrData = fs.readFileSync(pathArg).toString('utf8')
  let startSvgTagData = (svgStrData.match(utils.svgStartingTagRegex) || []).indexOrUndefined(0)
  let svgStyleTagData = ((startSvgTagData || '').match(utils.styleAttributeRegex) || []).indexOrUndefined(0)
  let targetStyle = ((svgStyleTagData || '').match(attrRegex) || []).indexOrUndefined(0)

  if (!svgStyleTagData) {
    // Does not have style tag yet
    svgStrData = svgStrData.replace('<svg', `<svg style="${attr}:${color};"`)

  } else if (!targetStyle) {
    // Has style tag and does not have target style attribute
    let newSvgStyleTagData = svgStyleTagData.replace('style="', `style="${attr}:${color};`)
    svgStrData = svgStrData.replace(svgStyleTagData, newSvgStyleTagData)

  } else {
    // Has style tag & target attribute
    let newSvgStyleTagData = svgStyleTagData.replace(targetStyle, `${attr}:${color};`)
    svgStrData = svgStrData.replace(svgStyleTagData, newSvgStyleTagData)
  }

  // Overwrite file content with new data
  fs.writeFileSync(pathArg, svgStrData)
  console.log('Successfully changed color of ' + path.basename(pathArg))
}

function recolor(argv) {

  const pathArg = argv.path
  const color = argv.color
  const attr = argv.attr || 'fill'

  if (!attributes.includes(attr))
    throw new Error('"attr" argument must have a value of "fill", "stroke" or "background"')

  if (!color)
    throw new Error('No color provided. Please add a color argument.(see `$ nuskin --help` for more info)')

  try {
    const filenames = utils.getAbsoluteFilePaths(pathArg)
    const isSolo = filenames.length === 1
    console.log(`Found ${filenames.length} SVG file${isSolo ? '' : 's'} at provided path`)

    for (let i = 0; i < filenames.length; i++){
      recolorSvgAtAbsolutePath(filenames[i], color, attr)
    }

  } catch (err) {
    console.log(err)
  }
}

module.exports = { recolor, recolorSvgAtAbsolutePath }
