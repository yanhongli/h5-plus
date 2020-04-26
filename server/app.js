const urlLib = require("url");
const express = require("express");
const logger = require("./logger");
const request = require("request");
const webInjectService = require("./services/web-inject");

const app = express();

app.use((req, res, next) => {
  logger.log("收到请求:", req.query, req.body);
  next();
});

/** 网站代理服务 */
app.get("/api/proxy", (req, res) => {
  let { url } = req.query;
  url = decodeURI(url);
  if (!url) {
    logger.error("收到地址为空的代理请求");
    res.send({
      rs: 2,
      error: "代理地址不能为空"
    });
    return;
  }
  //   res.pipe();
  request(url, (err, requestRes) => {
    if (err) {
      logger.error(err);
      res.end({
        rs: 2,
        err: err
      });
    } else {
      let body = requestRes.body;

      const urlObj = new urlLib.URL(url);

      res.send(webInjectService.getInjectedHTML(urlObj, body));
    }
  });
});

app.listen(8000, () => {
  logger.log("服务启动成功");
});
