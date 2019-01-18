const fs = require('fs')
const fse = require('fs-extra')
const cwd = process.cwd();
const path = require("path");

/**
 * 确保隐藏目录.lego 被创建在 命令运行目录
 */
function ensureLegoDir() {
  fse.ensureDirSync(path.resolve(cwd, './.lego'))
}


function copyToLego() {
  fse.copySync(path.resolve(__dirname, 'index/index.css'), path.resolve(cwd, './.lego/index.css'), {overwrite: true})
  fse.copySync(path.resolve(__dirname, 'index/index.html'), path.resolve(cwd, './.lego/index.html'), {overwrite: true})
}


function main() {
  ensureLegoDir()
  copyToLego()
  replaceMainHtml()
}

function readFileOfLegoHtml() {
  var data = fs.readFileSync(path.resolve(cwd, './lego.html'), 'utf8');
  return data
}

function replaceMainHtml() {
  var legoModel = readFileOfLegoHtml()
  var data = fs.readFileSync(path.resolve(cwd, './.lego/index.html'), 'utf8');
  let reg = /(<!--legoStart-->)[\s\S]*(<!--legoEnd-->)/
  var newstr = data.replace(reg, function (match, p1, p2) {
    return '<!--legoStart-->\n'+legoModel+'\n        <!--legoEnd-->'
  })
  fs.writeFileSync(path.resolve(cwd, './.lego/index.html'),newstr)
  fse.copySync(path.resolve(cwd, './lego.css'), path.resolve(cwd, './.lego/lego.css'), {overwrite: true})
}


main()
