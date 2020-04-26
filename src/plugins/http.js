import axios from "axios";
import qs from "qs";
import {
  Message
} from "element-ui";
import router from "../router";
import store from "../store";
import isNumber from "lodash/isNumber";
import isDate from "lodash/isDate"
import format from "date-fns/format"
export const BASE_URL = "/H5Data"; //"/H5Data";

let IDENTIFY_EXPIRE = false;
const date2Str = (params) => {
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const element = params[key];
      if (isDate(element)) {
        params[key] = format(element, 'yyyy-MM-dd')
      }
    }
  }
}

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 11000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  },
  paramsSerializer: function (params) {

    date2Str(params)

    return qs.stringify(params);
  }
});

http.interceptors.request.use(req => {
  // req.headers.uid = store.getters.userUID || "";
  if (["/user/open/api", "/admire/h5", "/api", 'http'].some(e => req.url.startsWith(e))) {
    req.baseURL = "";
  } else {
    req.baseURL = BASE_URL;
  }
  req.headers.token = localStorage["h5_token"];
  return req;
});

http.interceptors.response.use(
  res => {
    let {
      data
    } = res;
    if (data) {
      if (data.rs === 1) {
        /** 兼容部分表格特殊结构 */
        if (isNumber(data.total) && Array.isArray(data.data)) {
          return Promise.resolve({
            total: data.total,
            list: data.data
          });
        }
        if (typeof data.data === 'boolean') {
          return Promise.resolve(data.data)
        }
        return Promise.resolve(data.data || data);
      } else if (data.code === 200) {
        return Promise.resolve(data.data);
      } else if (data.code === 403 || data.rs === 3) {
        //防止登录失效时 多个接口调用出现相同的错误提示 特添加了失效的标识 5秒内只允许出现一次失效的提示
        console.log(window.inited, 'inites')
        if(!IDENTIFY_EXPIRE) {
          IDENTIFY_EXPIRE = true;
          window.inited && Message({
            showClose: true,
            message: "登录已失效 需要重新登录",
            type: "warning"
          });
          //登录失效时 为方便在当前页面看到登录失效提示 延迟2秒跳转到登录页
          setTimeout(() => {
            localStorage.removeItem("h5_token");
            router.replace("/login");    
          }, 0);
          setTimeout(() => {
            IDENTIFY_EXPIRE = false;
          }, 5000);
        }        
        return Promise.reject(data.msg || data.info);
      } else if (data.code && data.code !== 200) {
        return Promise.reject(data.info || data.msg);
      }
      else if (!data.rs) {
        return Promise.resolve(data);
      } else {
        return Promise.reject(data.info || data.msg);
      }
    }
  },
  err => {
    if (err.message && err.message.toString().includes("timeout")) {
      err.message = "网络状况不佳,请重试";
    }
    return Promise.reject(err.message);
  }
);

http.download = (url, params) => {
  date2Str(params)

  const ifreame = document.createElement("iframe");
  ifreame.src = BASE_URL + url + "?" + qs.stringify(params);

  if (__IS_DEV__) {
    console.log("开始下载:" + ifreame.src, params)
  }

  ifreame.style.display = "none";
  document.body.appendChild(ifreame);
  setTimeout(() => {
    document.body.removeChild(ifreame)
  }, 3000);
}

export default http;