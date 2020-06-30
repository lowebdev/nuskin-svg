RegExp.prototype.firstMatch = function (str) {
  if (typeof str !== 'string')
    throw new Error('Argument must be of type String')

  const matches = this.exec(str)
  return matches ? matches[0] : null
}

RegExp.matchingHTMLStartTag = function (targetHTMLTag) {
  return new RegExp(`<${targetHTMLTag}\\s*[A-z0-9-=":.;#/\\s]*>`)
}

RegExp.matchingHTMLTag = function (targetHTMLTag) {
  return new RegExp(`<${targetHTMLTag}>[A-z0-9-_{:(),;. #}<>/]*</${targetHTMLTag}>`, 'g')
}

RegExp.matchingHTMLAttribute = function (targetHTMLTag) {
  return new RegExp(`${targetHTMLTag}="[A-z0-9-:(),; #]+"\\s*`, 'g')
}

RegExp.matchingCSSProperty = function (propertyName = '[A-z0-9-]+') {
return new RegExp(`${propertyName}:[A-z0-9-_:(),. #]+;`, 'g')
}

RegExp.matchingCSSRule = function (cssRule = '\.[A-z_0-9- ]+') {
  return RegExp(`${cssRule}{{1}[A-z0-9-_:(),;. #]+}`, 'g')
}