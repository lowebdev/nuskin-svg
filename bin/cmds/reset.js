const path = require('path')
const fs = require('fs')
const u = require('../utils')

function reset(argv) {

  const pathArg = argv.path
  const attr = argv.attr

  try {
    const filenames = u.getAbsoluteFilePaths(pathArg)
    const isSolo = filenames.length === 1
    console.log(`Found ${filenames.length} SVG file${isSolo ? '' : 's'} at provided path`)

    const reset_function = attr ? resetColorsAtPath : resetAll
    for (let i = 0; i < filenames.length; i++)
    reset_function(filenames[i], attr)

  } catch (err) {
    console.log(err)
  }
}

function resetAll(pathArg) {
  let svgData = fs.readFileSync(pathArg).toString('utf8')

  svgData = svgData.replace(RegExp.matchingHTMLTag('style'), '')
  svgData = svgData.replace(RegExp.matchingHTMLAttribute('style'), '')
  svgData = svgData.replace(RegExp.matchingHTMLAttribute('class'), '')

  fs.writeFileSync(pathArg, svgData)
}

function resetColorsAtPath(pathArg, attribute) {

  const attrRegex = new RegExp(`${attribute}:([#\(,\) ]|[A-z]|[0-9])+;`)
  let svgStrData = fs.readFileSync(pathArg).toString('utf8')
  let startSvgTagData = (svgStrData.match(u.svgStartingTagRegex) || []).indexOrUndefined(0)
  let svgStyleTagData = ((startSvgTagData || '').match(u.styleAttributeRegex) || []).indexOrUndefined(0)
  let targetStyle = ((svgStyleTagData || '').match(attrRegex) || []).indexOrUndefined(0)

  if (!attribute && svgStyleTagData) {
    // Did not specify attribute, reset all attributes
    let newStartSvgTagData = startSvgTagData.replace(u.styleAttributeRegex, '')
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

module.exports = reset