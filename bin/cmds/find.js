const style_regex = /<style>[A-z0-9-_{:(),;. #}]*<\/style>/
const class_regex = /\.[A-z_0-9- ]+{{1}[A-z0-9-_:(),;. #]+}/g
const class_name_regex = /[A-z_0-9- ]+/g
const class_attribute_regex = /class="[A-z_0-9- ]+"/

const fill_regex = /fill:[A-z0-9-_(,):. #]+;/g
const shape_element_regex = /<(path|rect|circle|polygon|ellipse|line|polyline)[A-z0-9-_{:(),;. ="#}]*\/*>/g
const shape_name_regex = /<[A-z-]+ */
const svg_string = '<svg style="fill:#fff6c7; fill:#fff6c7;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 27.67"><defs><style></style></defs><title>email icon</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path fill="#FE3354" class="cls-1" d="M40,27.67H0V0H40ZM1.87,25.79H38.13V1.87H1.87Z"/><rect class="cls-1" x="30.06" y="11.53" width="1.87" height="19.48" transform="translate(-3.99 35.02) rotate(-55.92)"/><rect class="cls-1" x="-0.74" y="20.34" width="19.48" height="1.87" transform="translate(-10.38 8.7) rotate(-34.09)"/><polygon class="cls-1" points="20 19.78 0.3 1.62 1.57 0.24 20 17.24 38.43 0.24 39.7 1.62 20 19.78"/></g></g></svg>'
const ATTR = 'fill'
const COLOR = 'red'

const class_manipulation = ['none', 'create', 'add']
// Create if - style tag does not contain a class definition (<elname class="classname")
// Add if - style tag has an existing class that contains the property `${ATTR}:${COLOR};`
let should_add_class = false
let classname = `nuskin-${ATTR}`

function main () {
  /*
  1- is there a style tag?
    Y- continue
    N- return
  2- is there a class with fill_regex matching?
    Y- replace the fill property with COLOR
    N- add class with fill property & COLOR // What is the class name?
  */

  const property = `${ATTR}:${COLOR};`
  let placeholder = svg_string
  // 1
  let style_tag = (placeholder.match(style_regex) || [null])[0] // [0]  // returns null if no match

  if (!style_tag)
    throw new Error('No style tag error')

  // 2
  let classes = style_tag.match(class_regex)
  if (!classes) {
    // Add class with `fill:${COLOR};`
    should_add_class = true
    let new_style_tag = style_tag.replace('<style>', `<style>.${classname}{${property}}`)
    placeholder = placeholder.replace(style_tag, new_style_tag)

  } else {
    // Replace fill property with COLOR
    classes.forEach((a_class) => {
      const nuclass = a_class.replace(fill_regex, property)
      const new_style_tag = style_tag.replace(a_class, nuclass)

      placeholder = placeholder.replace(style_tag, new_style_tag)
      style_tag = new_style_tag
    })
  }
  // replace everything upstream
  const output = changeElementsClass(placeholder)
  console.log(output)
}

function changeElementsClass(source) {

  if (!should_add_class) { return source }

  const shapes = source.match(shape_element_regex)
  let placeholder = source

  shapes.forEach((shape) => {
    const shape_name = shape.match(shape_name_regex)[0].replace('<', '')
    let new_shape_data
    new_shape_data = shape.replace(`<${shape_name}`, `<${shape_name}class="${classname}" `)

    placeholder = placeholder.replace(shape, new_shape_data)
  })

  return placeholder
}

function test() {
  const h = svg_string.replace(/rect/g, 'REKT')
  console.log(h)
}

main()
