RegExp.prototype.firstMatch = function (str) {
  if (typeof str !== 'string')
    throw new Error('Argument must be of type String')

  const matches = this.exec(str)
  return matches ? matches[0] : null
}

RegExp.startTagRegExp = function (targetHTMLTag) {
  return new RegExp(`<${targetHTMLTag}\\s*[A-z0-9=":.;#/\\s]*>`)
}

String.prototype.matchCount = function (regexp) {
  if (RegExp !==  regexp.constructor)
    throw new Error('argument must be of type RegExp')

  const test = !regexp.global ? new RegExp(regexp.source, 'g') : regexp
  return (this.match(test) || []).length
}

String.prototype.firstMatch = function (regexp, defaultValue = null) {
  if (RegExp !==  regexp.constructor)
    throw new Error('argument must be of type RegExp')

  const matches = this.match(regexp)
  return matches ? matches[0] : defaultValue
}

Array.prototype.isEmpty = function () {
  return this.length < 1
}

const svg_start_tag_regex = /<svg\s*[A-z0-9=":.;#/\s]*>/
const defs_regex = /<defs>[A-z0-9-_{:(),;. #}<>/]*<\/defs>/
const style_regex = /<style>[A-z0-9-_{:(),;. #}]*<\/style>/g
const class_regex = /\.[A-z_0-9- ]+{{1}[A-z0-9-_:(),;. #]+}/g
const class_name_regex = /[A-z_0-9- ]+/g
const class_attribute_regex = /class="[A-z_0-9- ]+"\s*/
const css_class_property_regex = /[A-z0-9-]+:[A-z0-9-_:(),. #]+;/g

const shape_element_regex = /<(path|rect|circle|polygon|ellipse|line|polyline)[A-z0-9-_{:(),;. ="#}]*\/*>/g
const shape_name_regex = /<[A-z-]+ */

const no_style_tag_svg_string = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 27.67"><defs></defs><title>email icon</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path fill="#FE3354" class="cls-1" d="M40,27.67H0V0H40ZM1.87,25.79H38.13V1.87H1.87Z"/><rect class="cls-1" x="30.06" y="11.53" width="1.87" height="19.48" transform="translate(-3.99 35.02) rotate(-55.92)"/><rect class="cls-1" x="-0.74" y="20.34" width="19.48" height="1.87" transform="translate(-10.38 8.7) rotate(-34.09)"/><polygon class="cls-1" points="20 19.78 0.3 1.62 1.57 0.24 20 17.24 38.43 0.24 39.7 1.62 20 19.78"/></g></g></svg>'
const no_defs_tag_svg_string = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 27.67"><defs></defs><title>email icon</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path fill="#FE3354" class="cls-1" d="M40,27.67H0V0H40ZM1.87,25.79H38.13V1.87H1.87Z"/><rect class="cls-1" x="30.06" y="11.53" width="1.87" height="19.48" transform="translate(-3.99 35.02) rotate(-55.92)"/><rect class="cls-1" x="-0.74" y="20.34" width="19.48" height="1.87" transform="translate(-10.38 8.7) rotate(-34.09)"/><polygon class="cls-1" points="20 19.78 0.3 1.62 1.57 0.24 20 17.24 38.43 0.24 39.7 1.62 20 19.78"/></g></g></svg>'
const single_prop_class_svg_string = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 27.67"><defs><style>.cls-1{fill:blue;}</style></defs><title>email icon</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path fill="#FE3354" class="cls-1" d="M40,27.67H0V0H40ZM1.87,25.79H38.13V1.87H1.87Z"/><rect class="cls-1" x="30.06" y="11.53" width="1.87" height="19.48" transform="translate(-3.99 35.02) rotate(-55.92)"/><rect class="cls-1" x="-0.74" y="20.34" width="19.48" height="1.87" transform="translate(-10.38 8.7) rotate(-34.09)"/><polygon class="cls-1" points="20 19.78 0.3 1.62 1.57 0.24 20 17.24 38.43 0.24 39.7 1.62 20 19.78"/></g></g></svg>'
const multi_prop_class_svg_string = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 27.67"><defs><style>.cls-1{fill:blue;background-color:blue;}</style></defs><title>email icon</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path fill="#FE3354" class="cls-1" d="M40,27.67H0V0H40ZM1.87,25.79H38.13V1.87H1.87Z"/><rect class="cls-1" x="30.06" y="11.53" width="1.87" height="19.48" transform="translate(-3.99 35.02) rotate(-55.92)"/><rect class="cls-1" x="-0.74" y="20.34" width="19.48" height="1.87" transform="translate(-10.38 8.7) rotate(-34.09)"/><polygon class="cls-1" points="20 19.78 0.3 1.62 1.57 0.24 20 17.24 38.43 0.24 39.7 1.62 20 19.78"/></g></g></svg>'
const svg_string = single_prop_class_svg_string// multi_prop_class_svg_string
const ATTR = 'fill'
const COLOR = 'red'

const class_manipulation = ['none', 'create', 'add']
// Create if - style tag does not contain a class definition (<elname class="classname")
// Add if - style tag has an existing class that contains the property `${ATTR}`
let classname = `nuskin-${ATTR}`
let css_attr_regex = RegExp(`${ATTR}:[A-z0-9-# ()]+;`)
let html_attr_regex = RegExp(`${ATTR}="[A-z0-9-:(),; #]+"\\s*`)
let removed_classnames = []

function main () {
  /*
  1- is there a defs + style tag?
    Y- continue
    N- Add style tag
  2- is there a class with html_attr_regex matching?
    Y- replace the fill property with COLOR
    N- add class with fill property & COLOR // What is the class name?
  */

  const property = `${ATTR}:${COLOR};`
  let placeholder = svg_string
  // 1
  let defs_tag = placeholder.firstMatch(defs_regex)
  if (!defs_tag) {
    defs_tag = '<defs><style></style></defs>'
    const start_tag = placeholder.firstMatch(svg_start_tag_regex)
    placeholder = placeholder.replace(start_tag, `${start_tag}${defs_tag}`)
  }

  let style_tag = placeholder.firstMatch(style_regex)
  if (!style_tag) {
    style_tag = '<style></style>'
    const start_tag = placeholder.firstMatch(RegExp.startTagRegExp('defs'))
    placeholder = placeholder.replace(start_tag, `${start_tag}${style_tag}`)
  }

  if (!style_tag)
    throw new Error('No style tag error')

  // 2
  let classes = style_tag.match(class_regex) || []
  const classes_containing_attr = classes.filter((c) => { return c.includes(`${ATTR}`)})

  // If one of the classes contain `${ATTR}`, remove the property
  classes_containing_attr.forEach((c) => {
    // If only property in class, remove
    const is_only_prop = c.matchCount(css_class_property_regex) === 1
    let nuclass
    if (is_only_prop) {
      nuclass = ''
      removed_classnames.push(c.firstMatch(class_name_regex))
    } else {
      nuclass = c.replace(css_attr_regex, '')
    }

    const new_style_tag = style_tag.replace(c, nuclass)

    placeholder = placeholder.replace(style_tag, new_style_tag)
    style_tag = new_style_tag
  })

  // Add class with `${ATTR}:${COLOR};`
  let new_style_tag = style_tag.replace('<style>', `<style>.${classname}{${property}}`)
  defs_tag = defs_tag.replace(style_tag, new_style_tag)
  placeholder = placeholder.replace(style_tag, new_style_tag)

  // replace everything upstream
  const output = changeElementsClass(placeholder)
  console.log(output)
}

function sanitize(shape) {
  let sanitized_shape = shape.replace(html_attr_regex, '')
  let class_attr = shape.firstMatch(class_attribute_regex).trim()

  if (class_attr) {
    let remaining_classes = class_attr.split(/class|=*"/g) || []
    let remaining_class_tokens = remaining_classes.filter(c => c !== '' && !removed_classnames.includes(c))

    // Building the class attribute string
    class_attr = remaining_class_tokens.isEmpty() ? '' : `class="${remaining_class_tokens.join(' ')}" `
    // Apply newly constructed class string to shape
    sanitized_shape = sanitized_shape.replace(class_attribute_regex, class_attr)
  }

  return sanitized_shape
}

function changeElementsClass(source) {

  const shapes = source.match(shape_element_regex)
  let placeholder = source

  shapes.forEach((shape) => {
    const shape_name = shape.match(shape_name_regex)[0].replace('<', '')
    let new_shape_data = sanitize(shape)

    let class_attr = new_shape_data.match(class_attribute_regex)
    if (class_attr) {
      const new_class = class_attr[0].replace('class="', `class="${classname} `)
      new_shape_data = new_shape_data.replace(class_attr[0], new_class)
    } else {
      new_shape_data = new_shape_data.replace(`<${shape_name}`, `<${shape_name}class="${classname}" `)
    }

    placeholder = placeholder.replace(shape, new_shape_data)
  })

  return placeholder
}

main()
