import http from "../http";

/**
 * 请求URLS
 */
const URLS = {
  /**
   * 获取用户接口
   */
  uCurrent: "/user/open/api/v1/user/current",

  /**
   * 用户退出接口
   */
  uLogout: "/user/open/api/v1/user/logout"
};
/**
 * 获取用户接口
 */
export function apiUCurrent() {
  // if (UserInfo.id) return Promise.resolve(UserInfo);
  return http.get(URLS.uCurrent).then(e => {
    Object.assign(UserInfo, e);
    UserInfo.M_ADD_EVENT_VIEW = e.permissions.some(x => x === 'M_ADD_EVENT_VIEW');
  });
}
/**
 * 用户退出接口
 */
export function apiULogout() {
  return http.get(URLS.uLogout);
}
export const UserInfo = {
  id: "",
  createUser: "",
  createTime: "",
  updateUser: "",
  updateTime: "",
  status: "",
  isDeleted: "",
  tenantCode: "",
  account: "",
  password: "",
  name: "",
  realName: "",
  email: "",
  phone: "",
  birthday: null,
  sex: null,
  avatar: "",
  roleId: "",
  deptId: "",
  isSuper: "",
  source: "",
  relUserId: null,
  groupUserId: "",
  roleName: "",
  deptName: null,
  sexName: "",
  oldPassword: null,
  permissions: [],
  roles: [],
  deptIds: null,
  startTime: null,
  endTime: null,
  way: null,
  code: null,
  createUserName: null,
  updateUserName: null,
  ids: null,
  M_ADD_EVENT_VIEW: false
};
