const assert = require('assert')
const path = require('path')
const utils = require('../bin/utils')

describe('Utilities module test', () => {
  it('Array.prototype.indexOrUndefined: should equal \'hello\'', () => {
    const arr = ['is', 'name', 'hello', 'my' ]

    assert.equal('hello', arr.indexOrUndefined(2))
  })

  it('Array.prototype.indexOrUndefined: should equal undefined', () => {
    const arr = ['is', 'name', 'hello', 'my' ]

    assert.equal(undefined, arr.indexOrUndefined(5))
  })

  // ------------------------------
  // - regex: svgStartingTagRegex -
  // ------------------------------
  it('svgStartingTagRegex: Should match <svg ... >', () => {
    const completeSvgEl = '<svg role="img" xmlns="http://www.w3.org/2000/svg"><title>Apple icon</title><path d=".....1.26z"/></svg>'
    const svgStartTag = '<svg role="img" xmlns="http://www.w3.org/2000/svg">'
    const matches = completeSvgEl.match(utils.svgStartingTagRegex)

    assert.equal(svgStartTag, matches.indexOrUndefined(0))
  })

  it('svgStartingTagRegex: Should equal undefined', () => {
    const partialSvgEl = '<title>Apple icon</title><path d=".....1.26z"/></svg>'
    const matches = partialSvgEl.match(utils.svgStartingTagRegex)

    assert.equal(null, matches)
  })

  // ------------------------------
  // - regex: styleAttributeRegex -
  // ------------------------------
  it('styleAttributeRegex: Should match style="background:blue;"', () => {
    const completeSvgEl = '<svg style="background:blue;" role="img" xmlns="http://www.w3.org/2000/svg"><title>Apple icon</title><path d=".....1.26z"/></svg>'
    const svgStyleAttribute = ' style="background:blue;"'
    const matches = completeSvgEl.match(utils.styleAttributeRegex)

    assert.equal(svgStyleAttribute, matches.indexOrUndefined(0))
  })

  
  it('styleAttributeRegex: Should not match anything in the svg tag', () => {
    const completeSvgEl = '<svg role="img" xmlns="http://www.w3.org/2000/svg"><title>Apple icon</title><path d=".....1.26z"/></svg>'
    const matches = completeSvgEl.match(utils.styleAttributeRegex)

    assert.equal(null, matches)
  })

  // ------------------------------
  // - func: getFolderContentInfo -
  // ------------------------------
  it('getFolderContentInfo: returns relative path to .svg files only', () => {
    const pathToDir = 'test/.utils/'
    const expectedFilenames = [`test${path.sep}.utils${path.sep}a.svg`, `test${path.sep}.utils${path.sep}j.svg`]
    const relevantFilenames = utils.getFolderContentInfo(pathToDir)

    assert.deepStrictEqual(expectedFilenames, relevantFilenames)
  })

  it('getFolderContentInfo: returns nothing from folder containing files other than .svg', () => {
    const testPath = 'test/.utils/k/'
    const expectedResult = []
    const relevantFilenames = utils.getFolderContentInfo(testPath)

    assert.deepStrictEqual(expectedResult, relevantFilenames)
  })

  // ------------------------------
  // - func: getAbsoluteFilePaths -
  // ------------------------------
  it('getAbsoluteFilePaths: returns absolute path to .svg files only', () => {
    const absoluteMatchingFilePaths = [path.resolve('test/.utils/a.svg'), path.resolve('test/.utils/j.svg')]
    const result = utils.getAbsoluteFilePaths('test/.utils/')

    assert.deepStrictEqual(absoluteMatchingFilePaths, result)
  })

  // ----------------------
  // - func: fileContains -
  // ----------------------
  it('fileContains: file content matches RegEx test', () => {
    const filePath = 'test/.utils/a.svg'
    const regexTest = /<svg role="/g
    const result = utils.fileContains(filePath, regexTest)

    assert.ok(result)
  })

  it('fileContains: file content includes \'<svg role="\' string', () => {
    const filePath = 'test/.utils/a.svg'
    const stringTest = '<svg role="'
    const result = utils.fileContains(filePath, stringTest)

    assert.ok(result)
  })

  it('fileContains: file does not match RegEx test /lorem ipsum/g', () => {
    const filePath = 'test/.utils/a.svg'
    const regexTest = /lorem ipsum/g
    const result = utils.fileContains(filePath, regexTest)

    assert.strictEqual(false, result)
  })

  it('fileContains: file does not include \'lorem ipsum\' string', () => {
    const filePath = 'test/.utils/a.svg'
    const stringTest = 'lorem ipsum'
    const result = utils.fileContains(filePath, stringTest)

    assert.strictEqual(false, result)
  })

  // ------------------------------
  // - func: allFilesInDirContain -
  // ------------------------------
  it('allFilesInDirContain: all files in folder contains RegEx test /<svg role="/g', () => {
    const filePath = 'test/.utils/'
    const regexTest = /<svg role="/g
    const result = utils.allFilesInDirContain(filePath, regexTest)

    assert.ok(result)
  })

  it('allFilesInDirContain: all files in folder includes \'<svg role="\' string', () => {
    const filePath = 'test/.utils/'
    const stringTest = '<svg role="'
    const result = utils.allFilesInDirContain(filePath, stringTest)

    assert.ok(result)
  })

  it('allFilesInDirContain: no file in folder matches RegEx test /lorem ipsum/g', () => {
    const filePath = 'test/.utils/'
    const regexTest = /lorem ipsum/g
    const result = utils.allFilesInDirContain(filePath, regexTest)

    assert.strictEqual(false, result)
  })

  it('allFilesInDirContain: no file in folder includes \'lorem ipsum\' string', () => {
    const filePath = 'test/.utils/'
    const stringTest = 'lorem ipsum'
    const result = utils.allFilesInDirContain(filePath, stringTest)

    assert.strictEqual(false, result)
  })
})