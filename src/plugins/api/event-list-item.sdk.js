import http, { BASE_URL } from "../http";
import qs from "qs";
/**
 * 请求URLS
 */
const URLS = {
  /**
   * 监控事件图表
   */
  eMSelectDetail: "/eventManagement/selectDetail",
  /**
   * 监控事件条目列表
   */
  eMSelectDetailTable: "/eventManagement/selectDetailTable",
  /**
   * 监控事件下拉列表
   */
  eMDropDown: "/eventManagement/dropDown",
  /**
   * 导出CSV
   */
  eMExport: BASE_URL + "/eventManagement/export"
};
/**
 * 监控事件图表
 */
export function apiEMSelectDetail(args) {
  return http.post(URLS.eMSelectDetail, { ...args });
}
/**
 * 监控事件条目列表
 */
export function apiEMSelectDetailTable(args) {
  return http.post(URLS.eMSelectDetailTable, { ...args });
}
/**
 * 监控事件下拉列表
 */
export function apiEMDropDown(args) {
  return http.post(URLS.eMDropDown, { ...args });
}
/**
 * 导出CSV
 */
export function apiEMExport(args) {
  // window.open(
  //   `${URLS.eMExport}?id=${args.id}&landingPageId=${args.landingPageId}&conversionType=${args.conversionType}&startTime=${args.startTime}&endTime=${args.endTime}`,
  //   "_blank"
  // );
  download(URLS.eMExport, args)
}
export function download(url, args){
  const ifreame = document.createElement("iframe");  
  ifreame.src =  url + (url.indexOf("?") > -1 ? "" : "?") + qs.stringify(args);
  ifreame.style.display = "none";
  document.body.appendChild(ifreame);
}
