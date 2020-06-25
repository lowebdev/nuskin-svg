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
