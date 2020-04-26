import http from "../http";
import qs from "qs";
import { download } from "./event-list-item.sdk";
/**
 * 请求URLS
 */
const URLS = {
    /**
     * 设备画像-列表接口
     */
    eList: "/portrait/equipment/list",
    /**
     * 设备画像-top列表接口
     */
    eTopList: "/portrait/equipment/topList",
    /**
     * 设备画像-图表接口
     */
    eViews: "/portrait/equipment/views",
    /**
     * 设备画像分析-报表下载
     */
    eExport: "/H5Data/portrait/equipment/export"
};
/**
 * 设备画像-列表接口
 */
export function apiEList(args) {
  return  http.get(`${URLS.eList}?${qs.stringify(args)}`);
}
/**
 * 设备画像-top列表接口
 */
export function apiETopList(args) {
  return  http.get(`${URLS.eTopList}?${qs.stringify(args)}`);
}
/**
 * 设备画像-图表接口
 */
export function apiEViews(args) {
  return  http.get(`${URLS.eViews}?${qs.stringify(args)}`);
}
/**
 * 设备画像分析-报表下载
 */
export function apiEExport(args) {
  download(URLS.eExport, args);
}
