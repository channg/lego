var style = document.createElement("style");

!(function() {
  function jss(blocks) {
    var css = [];
    for (var block in blocks)
      css.push(createStyleBlock(block, blocks[block]));
    injectCSS(css);
  }
  function createStyleBlock(selector, rules) {
    return selector + ' {\n' + parseRules(rules) + '\n}';
  }
  function parseRules(rules) {
    var css = [];
    for (var rule in rules)
      css.push('  '+rule+': '+rules[rule]+';');
    return css.join('\n');
  }
  function injectCSS(css) {
    var style = document.getElementById('jss-styles');
    if (!style) {
      style = document.createElement('style');
      style.setAttribute('id', 'jss-styles');
      var head = document.getElementsByTagName('head')[0];
      head.insertBefore(style, head.firstChild);
    }
    var node = document.createTextNode(css.join('\n\n'));
    style.appendChild(node);
  }
  if (typeof exports === 'object')
    module.exports = jss;
  else
    window.jss = jss;
})();


/*;(function () {
  let reg = /(<!--legoStart-->)([\s\S]*)(<!--legoEnd-->)/
  $('.main-base-doc').text($('.main-content').html().replace(reg, function (match, p1, p2) {
    return p2
  }))
  var ss = document.styleSheets[1].cssRules[0].cssText
  ss = ss.split("{").join('{\n    ').split("}").join('}\n').split(';').join(';\n    ')
  $('.main-base-css').text(ss)
})()*/

(function () {
  
  let reg = /(<!--legoStart-->)([\s\S]*)(<!--legoEnd-->)/
  $('.main-base-doc').text($('.main-content').html().replace(reg, function (match, p1, p2) {
    return p2
  }))
  $.get('/css',function (data) {
    $('.main-base-css').text(data)
    style.type = "text/css";
    try{
      style.appendChild(document.createTextNode(data));
    }catch(ex){
      style.styleSheet.cssText = data;//针对IE
    }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
  })
  
})()
