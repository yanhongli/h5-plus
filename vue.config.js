// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  // 线上环境
  // publicPath: process.env.NODE_ENV === 'production'
  
  //   ? '/163h5/'
  //   : '/',
  // assetsDir: process.env.NODE_ENV === 'production'
  //   ? './163h5/'
  //   : '',
  publicPath: '/163h5/',
  assetsDir: './163h5/',
  filenameHashing: true,
  productionSourceMap: false,

  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config
          .plugin("webpack-bundle-analyzer")
          .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);

      const cdn = {
        // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
        css: ["//unpkg.com/element-ui@2.10.1/lib/theme-chalk/index.css"],
        js: [
          // "//cdn.bootcss.com/vue/2.6.10/vue.min.js", // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
          // "//cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js",
          // "//cdn.bootcss.com/vuex/3.1.1/vuex.min.js",
          // "//cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js",
          // "//cdn.bootcss.com/element-ui/2.12.0/index.js",
          // "//cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js"
        ]
      };

      // html中添加cdn
      config.plugin("html").tap(args => {
        args[0].cdn = cdn;
        args[0].minify = true;
        return args;
      });
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.externals = {
        // vue: "Vue",
        // "element-ui": "ELEMENT",
        // "vue-router": "VueRouter",
        // vuex: "Vuex",
        // axios: "axios",
        // echarts: "echarts"
      };
    }
  },
  devServer: {
    proxy: {
      // 落地页转发
      "/api/proxy": {
        target: "http://10.122.76.81:4000",
        changeOrigin: true
      },
      "/api/screenshot": {
        // 组内服务器
        // target: "http://localhost:4000/",
        target: "https://e.163.com/",
        changeOrigin: true,
        logLevel: "info",
        pathRewrite: {
          "/H5Data": ""
          // '/api/localmock/': '',
          // '/api/localhostmock/': ''
        }
      },
      "/api/screenshot4xpath": {
        // 组内服务器
        target: "http://10.234.138.31:4000/",
        changeOrigin: true,
        logLevel: "info",
        pathRewrite: {
          "/H5Data": ""
          // '/api/localmock/': '',
          // '/api/localhostmock/': ''
        }
      },
      "/H5Data/mock": {
        target: "http://api.f2e-yapi.com/mock/23/",
        changeOrigin: true,
        logLevel: "info",
        pathRewrite: {
          "/mock": ""
        }
      },
      "/H5Data": {
        //online
        // target: "https://e.163.com/",
        // target: "http://10.199.244.66:9050/",
        //song hong xu
        // target: "http://10.199.249.211:9050/",
        //zhang zhen zhen
        // target: "http://10.234.138.150:9991/",
        // qa
        target: "http://qa.e.163.com/",
        changeOrigin: true,
        logLevel: "error",
        pathRewrite: {
          // "/H5Data": ""
          // '/api/localmock/': '',
          // '/api/localhostmock/': ''
        }
      },
      "/admire/h5": {
        // qa
        // target: "http://10.122.76.111:8083",
        //song hong xu
        // target: "http://10.234.138.48:8082/",
        // target: "http://10.122.168.56:9991/",
        //zhang zhen zhen
        // target: "http://10.234.138.150:9991/",
        // target: "http://10.122.76.79:9991/",
        target: "http://10.199.241.14:8083/",
        changeOrigin: true,
        logLevel: "error",
        pathRewrite: {
          // '/api/localmock/': '',
          // '/api/localhostmock/': ''
        }
      },
      "/user": {
        // target: "https://e.163.com/",
        // dev
        // target: "http://10.199.236.105:9031/",
        // qa
        target: "http://qa.e.163.com/",
        //song hong xu
        // target: "http://10.199.225.72:9031/",
        //zhang zhen zhen
        // target: "http://10.122.76.79:9991/",
        // target: "http://10.234.138.150:9991/",
        changeOrigin: true,
        logLevel: "error",
        pathRewrite: {
          // "/user": ""
          // '/api/localmock/': '',
          // '/api/localhostmock/': ''
        }
      }
    }
  }
};
