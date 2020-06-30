const fs = require('fs')
const path = require('path')
const u = require('../utils')
const attributes = ['fill', 'stroke', 'background']

function recolorSvgAtAbsolutePath(pathArg, color, attr = 'background') {

  const attrRegex = new RegExp(`${attr}:([#\(,\) ]|[A-z]|[0-9])+;`)
  let svgStrData = fs.readFileSync(pathArg).toString('utf8')
  let startSvgTagData = svgStrData.firstMatch(RegExp.matchingHTMLStartTag('svg'))
  let svgStyleTagData = (startSvgTagData || '').firstMatch(RegExp.matchingHTMLAttribute('style'))
  let targetStyle = (svgStyleTagData || '').firstMatch(attrRegex)

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
    const filenames = u.getAbsoluteFilePaths(pathArg)
    const isSolo = filenames.length === 1
    console.log(`Found ${filenames.length} SVG file${isSolo ? '' : 's'} at provided path`)

    const recolorFct = attr === 'background' ? recolorSvgAtAbsolutePath : classedBasedRecolorAtAbsolutePath
    for (let i = 0; i < filenames.length; i++) {
      recolorFct(filenames[i], color, attr)
    }

  } catch (err) {
    console.log(err)
  }
}

const x = require('../ext/s')

const shape_element_regex = /<(path|rect|circle|polygon|ellipse|line|polyline)[A-z0-9-_{:(),;.\s="#}]*\/*>/g
const shape_name_regex = /<[A-z-]+ */
let removed_classnames

function classedBasedRecolorAtAbsolutePath (pathArg, color, attr) {
  let placeholder = fs.readFileSync(pathArg).toString('utf8')

  let css_property = `${attr}:${color};`
  const NUSKIN_CLASSNAME = 'nuskin'
  removed_classnames = []

  // Check if 'defs' tag is present and adds it if not found
  let defs_tag = placeholder.firstMatch(RegExp.matchingHTMLTag('defs'))
  if (!defs_tag) {
    defs_tag = '<defs><style></style></defs>'
    const start_tag = placeholder.firstMatch(RegExp.matchingHTMLStartTag('svg'))
    
    if (!start_tag) throw new Error('No <svg> start tag found')

    placeholder = placeholder.replace(start_tag, `${start_tag}${defs_tag}`)
  }

  // Check if 'style' tag is present and adds it if not found
  let style_tag = placeholder.firstMatch(RegExp.matchingHTMLTag('style'))
  if (!style_tag) {
    style_tag = '<style></style>'
    const start_tag = placeholder.firstMatch(RegExp.matchingHTMLTag('defs'))
    placeholder = placeholder.replace(start_tag, `${start_tag}${style_tag}`)
  }

  // Checks for css rules containing the target propercy
  let classes = style_tag.match(RegExp.matchingCSSRule()) || []
  const classes_containing_attr = classes.filter((c) => { return c.includes(`${attr}`)})

  // If one of the classes contain `${attr}`, remove the property
  classes_containing_attr.forEach((c) => {
    // If only property in class, remove
    const is_only_prop = c.matchCount(RegExp.matchingCSSProperty()) === 1
    let nuclass = ''
    if (is_only_prop) {
      removed_classnames.push(c.firstMatch(/[A-z_0-9- ]+/g))
    } else {
      nuclass = c.replace(RegExp.matchingCSSProperty(attr), '')
    }

    const new_style_tag = style_tag.replace(c, nuclass)
    placeholder = placeholder.replace(style_tag, new_style_tag)
    style_tag = new_style_tag
  })

  // Add class with `${attr}:${color};`
  let new_style_tag
  const has_nuskin_classname = style_tag.match(RegExp.matchingCSSRule(NUSKIN_CLASSNAME))
  if (has_nuskin_classname) {
    new_style_tag = style_tag.replace(new RegExp(`.${NUSKIN_CLASSNAME}\s*{{1}`), `.${NUSKIN_CLASSNAME}{${css_property}`)
  } else {
    new_style_tag = style_tag.replace('<style>', `<style>.${NUSKIN_CLASSNAME}{${css_property}}`)
  }

  defs_tag = defs_tag.replace(style_tag, new_style_tag)
  placeholder = placeholder.replace(style_tag, new_style_tag)

  // replace everything upstream
  const output = changeElementsClass(placeholder, NUSKIN_CLASSNAME)
  // console.log(output)
  // Overwrite file content with new data
  fs.writeFileSync(pathArg, output)
  console.log('Successfully changed color of ' + path.basename(pathArg))
}

function addPropertyToClass() {

}

function sanitize(shape) {
  let sanitized_shape = shape.replace(RegExp.matchingHTMLAttribute('fill'), '')
  sanitized_shape = sanitized_shape.replace(RegExp.matchingHTMLAttribute('background'), '')
  sanitized_shape = sanitized_shape.replace(RegExp.matchingHTMLAttribute('stroke'), '')
  let class_attr = shape.firstMatch(RegExp.matchingHTMLAttribute('class'))

  if (class_attr) {
    let remaining_classes = class_attr.trim().split(/class|=*"/g) || []
    let remaining_class_tokens = remaining_classes.filter(c => c !== '' && !removed_classnames.includes(c))

    // Building the class attribute string
    class_attr = remaining_class_tokens.isEmpty() ? '' : `class="${remaining_class_tokens.join(' ')}" `
    // Apply newly constructed class string to shape
    sanitized_shape = sanitized_shape.replace(RegExp.matchingHTMLAttribute('class'), class_attr)
  }

  return sanitized_shape
}

function changeElementsClass(source, NUSKIN_CLASSNAME) {

  const shapes = source.match(shape_element_regex)
  let placeholder = source

  shapes.forEach((shape) => {
    const shape_name = shape.match(shape_name_regex)[0].replace('<', '')
    let new_shape_data = sanitize(shape)

    let class_attr = new_shape_data.firstMatch(RegExp.matchingHTMLAttribute('class'))
    if (class_attr && !class_attr.includes(NUSKIN_CLASSNAME)) {
      const new_class = class_attr.replace('class="', `class="${NUSKIN_CLASSNAME} `)
      new_shape_data = new_shape_data.replace(class_attr, new_class)
    } else if (!class_attr) {
      new_shape_data = new_shape_data.replace(`<${shape_name}`, `<${shape_name}class="${NUSKIN_CLASSNAME}" `)
    }

    placeholder = placeholder.replace(shape, new_shape_data)
  })

  return placeholder
}

function applyClassToSVG(source, NUSKIN_CLASSNAME) {

  const svg_start_tag = source.match(RegExp.matchingHTMLStartTag('svg'))
  let placeholder = source

  let class_attr = new_shape_data.match(RegExp.matchingHTMLAttribute('class'))
  if (class_attr) {
    const new_class = class_attr[0].replace('class="', `class="${NUSKIN_CLASSNAME} `)
    new_shape_data = new_shape_data.replace(class_attr[0], new_class)
  } else {
    new_shape_data = new_shape_data.replace(`<${shape_name}`, `<${shape_name}class="${NUSKIN_CLASSNAME}" `)
  }

  placeholder = placeholder.replace(shape, new_shape_data)  
  return placeholder
}

module.exports = recolor
