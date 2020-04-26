import http from "../http";
/**
 * 请求URLS
 */
const URLS = {
  /**
   * 监控列表
   */
  eMList: "/eventManagement/list",
  /**
   * 监控事件更新
   */
  eMUpdate: "/eventManagement/update",
  /**
   * 监控列表项删除
   */
  eMDelete: "/eventManagement/delete",
  /**
   * 查看设置
   */
  eMSetup: "/eventManagement/setup",
  /**
   * 自定义列查询
   */
  aCSelect: "/autoColumn/select",
  /**
   * 检查是否有检测事件
   */
  eMCheck: "/eventManagement/check",
};
/**
 * 监控列表
 */
export function apiEMList(args) {
  return http.post(URLS.eMList, { ...args });
}
/**
 * 监控列表项更新
 */
export function apiEMUpdate(args) {
  return http.post(URLS.eMUpdate, { ...args });
}
/**
 * 监控列表项删除
 */
export function apiEMDelete(id) {
  return http.post(URLS.eMDelete, { id });
}
/**
 * 查看设置
 */
export function apiEMSetup(id) {
  return http.post(URLS.eMSetup, { id });
}
export function apiEMCheck(){
  return http.get(URLS.eMCheck);
}