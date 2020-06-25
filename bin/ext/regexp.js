RegExp.prototype.firstMatch = function (str) {
  if (typeof str !== 'string')
    throw new Error('Argument must be of type String')

  const matches = this.exec(str)
  return matches ? matches[0] : null
}

RegExp.startTagRegExp = function (targetHTMLTag) {
  return new RegExp(`<${targetHTMLTag}\\s*[A-z0-9=":.;#/\\s]*>`)
}
