import http, { BASE_URL } from "../http";
/**
 * 请求URLS
 */
const URLS = {
  /**
   * 监控事件添加
   */
  eMAdd: "/eventManagement/add",
  /**
   * 落地页列表
   */
  lPList: "/landingPage/list",
  /**
   * 落地页新建
   */
  lPAdd: "/landingPage/add",
  /**
   * 落地页更新
   */
  lPUpdate: "/landingPage/update",
  /**
   * 落地页删除
   */
  lPDelete: "/landingPage/delete",
  /**
   * 下载JS
   */
  eMDownloadJS: "/eventManagement/downLoadJS"
};
/**
 * 监控事件添加
 */
export function apiEMAdd(args) {
  return http.post(URLS.eMAdd, { ...args });
}
/**
 * 落地页列表
 */
export function apiLPList() {
  return http.get(URLS.lPList + '?type=0');
}
/**
 * 落地页新建
 */
export function apiLPAdd(args) {
  return http.post(URLS.lPAdd, { ...args });
}

/**
 * 落地页更新
 */
export function apiLPUpdate(args) {
  return http.post(URLS.lPUpdate, { ...args });
}

/**
 * 落地页删除
 */
export function apiLPDelete(args) {
  return http.post(URLS.lPDelete, { ...args });
}

/**
 * 下载JS代码
 */
export function apiEMDownloadJS(args) {
  let url =
    BASE_URL +
    URLS.eMDownloadJS +
    `?id=${args.id}&js=${encodeURIComponent(args.js)}&cjs=${encodeURIComponent(
      args.cjs
    )}`;
  console.log(url);
  window.open(url);
}
