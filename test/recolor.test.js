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
const path = require('path')
const fs = require('fs')
const u = require('../bin/utils')
const recolor = require('../bin/recolor')
const cmdName = 'recolor'
const referenceAssetsPath = path.join('test/.assets', cmdName)
const mutableAssetsPath = 'test/assets'
const mutableAssetsFolderPath = path.join(mutableAssetsPath, cmdName)

const soloAssetsTestDesc = 'Single .svg recolor tests'
const soloAssetPath = path.join(mutableAssetsFolderPath, 'apple.svg')
const multiAssetDirPath = path.join(mutableAssetsFolderPath, 'a_dir')

before(soloAssetsTestDesc, () => {
  console.log('Copying assets from immutable assets')
  u.copyFolderRecursiveSync(referenceAssetsPath, mutableAssetsPath)
})

describe('Multiple .svg in containing folder', () => {

  it('should batch recolor background to blue from folder path', () => {
    recolor.recolor({ path: multiAssetDirPath, attr: 'background', color: 'blue' })
    fs.readdirSync(multiAssetDirPath).forEach((filename) => {
      const filepath = path.join(multiAssetDirPath, filename)
      const result = fs.readFileSync(filepath).toString('utf8').includes('<svg style="background:blue;"')
      assert.ok(result, 'File does not contain style attribute')
    })
  })
})
