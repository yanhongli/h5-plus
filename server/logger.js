const pathLib = require("path");

const log4js = require("log4js");

log4js.configure({
  debug: true,
  appenders: {
    cheese: {
      type: process.env.NODE_ENV !== "prduction" ? "console" : "dateFile",
      filename: pathLib.join("./logs", "cheese.log"),
      alwaysIncludePattern: true,
      keepFileExt: true
    }
  },
  categories: {
    default: {
      appenders: ["cheese"],
      level: "ALL"
    }
  },
  disableClustering: true
});

const logger = log4js.getLogger("cheese");

module.exports = logger;
