import http from "../http";
/**
 * 请求URLS
 */
const URLS = {
  uGetVerifyCode: "/user/open/api/v1/user/getVerifyCode",
  uLogin: "/user/open/api/v1/user/login",
  u2Login: "/user/open/api/v2/user/login",
  uH5WGetVerifyCode: "/admire/h5/api/user/getAuthCode",
  uH5WLogin: "/admire/h5/api/user/login",
  /** 伊人建站域名 */
  YRJZDomain:  process.env.NODE_ENV == "production" ? "//p4p.163.com" : "//10.122.76.79:8187"
};
//伊人建站旧的验证方式
export function getH5WUrl(uid) {
  return (
    URLS.YRJZDomain +
    "/admire/h5/?uid=" +
    encodeURI(uid).replace(/\+/g, "%2B") +
    "#/template"
  );
}
//伊人建站新的验证方式
export function getH5WUrlForNew(token) {
  return (
    URLS.YRJZDomain +
    "/admire/h5/?token=" +
    token +
    "#/template"
  );
}
/**
 * 获取验证码接口
 */
export function apiUGetVerifyCode() {
  return `${URLS.uGetVerifyCode}?r=${Math.random()}`;
}
/**
 * 用户登录接口
 */
export function apiULogin(args) {
  return http.post(URLS.uLogin, args);
}
/**
 * 用户登录接口
 */
export function apiU2Login(args) {
  return http.post(URLS.u2Login, args);
}
/**
 * 伊人建站获取验证码接口
 */
export function apiUH5WGetVerifyCode() {
  return `${URLS.uH5WGetVerifyCode}?r=${Math.random()}`;
}
/**
 * 伊人建站用户登录接口
 */
export function apiUH5WLogin(args) {
  return http.post(URLS.uH5WLogin, args);
}
