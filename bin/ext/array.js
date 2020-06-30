Array.prototype.isEmpty = function () {
  return this.length < 1
}

Array.prototype.indexOrUndefined = function(index) {
  return this.length >= index + 1 ? this[index] : undefined
}
