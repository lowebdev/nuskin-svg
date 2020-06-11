// "recolor-fill-green": "node ./bin/index.js recolor -p ./test/solo/adobephotoshop.svg -c green",
// "recolor-fill-red": "node ./bin/index.js recolor -p ./test/solo/adobephotoshop.svg -c red",
// "recolor-stroke-green": "node ./bin/index.js recolor -p ./test/solo/adobephotoshop.svg -c green -a stroke",
// "recolor-stroke-red": "node ./bin/index.js recolor -p ./test/solo/adobephotoshop.svg -c red -a stroke",
// "recolor-background-green": "node ./bin/index.js recolor -p ./test/solo/adobephotoshop.svg -c green -a background",
// "recolor-background-red": "node ./bin/index.js recolor -p ./test/solo/adobephotoshop.svg -c red -a background",
// "reset-all": "node ./bin/index.js reset -p ./test/solo/adobephotoshop.svg",
// "reset-fill": "node ./bin/index.js reset -p ./test/solo/adobephotoshop.svg -a fill",
// "reset-stroke": "node ./bin/index.js reset -p ./test/solo/adobephotoshop.svg -a stroke",
// "reset-background": "node ./bin/index.js reset -p ./test/solo/adobephotoshop.svg -a background",
// "recolordir-fill-green": "node ./bin/index.js recolor -p ./test/multiple -c green",
// "resetdir-all": "node ./bin/index.js reset -p ./test/multiple"
const assert = require('assert')
const u = require('../bin/utils')
const tu = require('./testutils')
const recolor = require('../bin/cmds/recolor')

const soloSvgFilename = 'apple.svg'
const soloSvgFilepath = tu.resPath(soloSvgFilename)
const multiSvgDirname = 'a_dir'
const multiSvgDirpath = tu.resPath(multiSvgDirname)

before('Copying assets from immutable assets', () => {
  tu.resetRessource()
})

describe('Multiple .svg in containing folder', () => {

  it('recolor: from no style tag, should batch recolor all .svg files\' background to blue at folder path', () => {
    recolor({ path: multiSvgDirpath, attr: 'background', color: 'blue' })
    const result = u.allFilesInDirContain(multiSvgDirpath, '<svg style="background:blue;"')
    assert.ok(result, 'One of the files in the directory does not contain style attribute')
    tu.resetRessource(multiSvgDirname)
  })
})

describe('Single .svg recolor tests', () => {

  it('recolor: from no style tag, should recolor a single .svg file\'s background to blue at file path', () => {
    recolor({ path: soloSvgFilepath, attr: 'background', color: 'blue' })
    const result = u.fileContains(soloSvgFilepath, '<svg style="background:blue;"')
    assert.ok(result, 'File does not contain blue background style rule')
    tu.resetRessource(soloSvgFilename)
  })
})

// after('Destroying recolor module asset', () => {
//   tu.destroyRessources()
// })
