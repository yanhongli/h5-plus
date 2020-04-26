import http from "../http";
import qs from "qs";
import { download } from "./event-list-item.sdk";
/**
 * 请求URLS
 */
const URLS = {
    /**
     * 获取地域画像列表接口
     */
    aList: "/portrait/area/list",
    /**
     * 获取地域画像Top列表接口
     */
    aTopList: "/portrait/area/topList",
    /**
     * 获取地域画像图表接口
     */
    aViews: "/portrait/area/views",
    /**
     * 地域画像分析-报表下载
     */
    aExport: "/H5Data/portrait/area/export",

    aAreaList: "/system/area/list"
};
/**
 * 获取地域画像列表接口
 */
export function apiAList(args) {
  return  http.get(`${URLS.aList}?${qs.stringify(args)}`);
}
/**
 * 获取地域画像Top列表接口
 */
export function apiATopList(args) {
  return  http.get(`${URLS.aTopList}?${qs.stringify(args)}`);
}
/**
 * 获取地域画像图表接口
 */
export function apiAViews(args) {
  return  http.get(`${URLS.aViews}?${qs.stringify(args)}`);
}
/**
 * 地域画像分析-报表下载
 */
export function apiAExport(args) {
  download(URLS.aExport, args);
}

/**
 * 获取地域列表
 */
export function apiAreaList() {
    return http.get(URLS.aAreaList)
}