import http from "../http";
import qs from "qs";
/**
 * 请求URLS
 */
const URLS = {
  /**
   * 获取用户列表接口
   */
  uList: "/user/open/api/v1/user/list",
  /**
   * 编辑用户接口
   */
  uEdit: "/user/open/api/v1/user/edit",
  /**
   * 移除用户接口
   */
  uRemove: "/user/open/api/v1/user/remove",
  /**
   * 获取角色下拉接口
   */
  rRoleList: "/user/open/api/v1/role/roleList"
};
/**
 * 获取用户列表接口
 */
export function apiUList(args) {
  return http.get(URLS.uList + "?" + qs.stringify(args));
}
/**
 * 编辑用户接口
 */
export function apiUEdit(args) {
  return http.post(URLS.uEdit, args);
}
/**
 * 移除用户接口
 */
export function apiURemove(args) {
  return http.post(URLS.uRemove, { ...args });
}
/**
 * 获取角色下拉接口
 */
export function apiRRoleList(args) {
  return http.get(URLS.rRoleList + "?" + qs.stringify(args));
}
