const fs = require('fs')
const fse = require('fs-extra')
const cwd = process.cwd();
const path = require("path");
const spawn = require('cross-spawn');
var colors = require('colors');
const isWin = process.platform === 'win32';
var watch = require('node-watch');
var livereload = require('livereload');
var server = livereload.createServer();
var express = require('express')
var app = express()

server.watch(path.resolve(cwd, './.lego'));

/**
 * 确保隐藏目录.lego 被创建在 命令运行目录
 */
function ensureLegoDir() {
  fse.ensureDirSync(path.resolve(cwd, './.lego'))
}

/**
 * 复制模板到隐藏目录
 */
function copyToLego() {
  fse.copySync(path.resolve(__dirname, 'index/index.css'), path.resolve(cwd, './.lego/index.css'), {overwrite: true})
  fse.copySync(path.resolve(__dirname, 'index/index.html'), path.resolve(cwd, './.lego/index.html'), {overwrite: true})
  fse.copySync(path.resolve(__dirname, 'index/index.js'), path.resolve(cwd, './.lego/index.js'), {overwrite: true})
}


function main() {
  ensureLegoDir()
  copyToLego()
  replaceMainHtml()
  runServe()
}

/**
 * 读取用户模板
 * @returns {*}
 */
function readFileOfLegoHtml() {
  var data = fs.readFileSync(path.resolve(cwd, './lego.html'), 'utf8');
  return data
}

function logHosts(){
  console.log('http://localhost:8080'.underline.green)
}


/**
 * 替换内容到.lego 隐藏目录
 */
function replaceMainHtml() {
  var legoModel = readFileOfLegoHtml()
  var data = fs.readFileSync(path.resolve(cwd, './.lego/index.html'), 'utf8');
  let reg = /(<!--legoStart-->)[\s\S]*(<!--legoEnd-->)/
  var newstr = data.replace(reg, function (match, p1, p2) {
    return '<!--legoStart-->\n' + legoModel + '\n        <!--legoEnd-->'
  })
  fs.writeFileSync(path.resolve(cwd, './.lego/index.html'), newstr)
  fse.copySync(path.resolve(cwd, './lego.css'), path.resolve(cwd, './.lego/lego.css'), {overwrite: true})
}


function runServe() {
  app.use('/', express.static(path.resolve(cwd, './.lego/')))
  var server = app.listen(8081)
  console.log('http://localhost:8081/'.red)
}



function getBin(binName) {
  return path.resolve(
    __dirname,
    `./node_modules/.bin/${binName}${isWin ? '.cmd' : ''}`,
  );
}

function watchModel(){
  watch('./', { filter: f => !/.lego/.test(f)},function (evt,name) {
    ensureLegoDir()
    copyToLego()
    replaceMainHtml()
    console.log("some thing change!".red)
  });
}




main()
watchModel()
