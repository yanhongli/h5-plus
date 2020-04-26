const cheerio = require("cheerio");
const path = require("path");
/** 需要补全地址的列表 selector: 需要替换的标签选择器, attr: 需要替换的属性 */

var sources = [
  {
    selector: 'link[rel="stylesheet"]',
    attr: "href"
  },
  {
    selector: "script",
    attr: "src"
  },
  {
    selector: "img",
    attr: "src"
  }
];

/**
 * 获取注入后的Html
 * @param {URL} urlConfig 代理的原路径配置信息
 * @param {string} body 从代理路径捕获的源html
 */
const getInjectedHTML = (urlConfig, body) => {
  const $ = cheerio.load(body);
  console.log(urlConfig);
  for (var i = 0; i < sources.length; i++) {
    var source = sources[i];
    $(source.selector).each((index, item) => {
      var url = $(item).attr(source.attr) || "";
      var fullPath = "";
      if (url.startsWith("//") || url.startsWith("http")) {
        // 带有适应协议的绝对路径
        return;
      } else if (url.startsWith("/")) {
        // /开头的绝对路径
        fullPath = urlConfig.origin + url;
        $(item).attr(source.attr, fullPath);
      } else {
        // 相对路径
        fullPath =
          urlConfig.origin +
          path.join(urlConfig.pathname, "../" + url).replace(/\\/g, "/");
        $(item).attr(source.attr, fullPath);
      }
    });
  }

  return $.html();
};

module.exports = {
  getInjectedHTML
};
