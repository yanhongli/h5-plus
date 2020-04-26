import http from "../http";
/**
 * 请求URLS
 */
const URLS = {
  /**
   * 找回密码-下发验证码接口
   */
  uSendCode: "/user/open/api/v1/user/sendCode",
  /**
   * 找回密码-下发验证码接口
   */
  uSendCodeV2: "/user/open/api/v2/user/sendCode",
  /**
   * 找回密码-修改密码接口
   */
  uUpdatePassword: "/user/open/api/v1/user/updatePassword",
  /**
   * 找回密码-校验验证码接口
   */
  uCheckCode: "/user/open/api/v1/user/checkCode",
  /**
   * 找回密码-校验验证码接口
   */
  uCheckCodeV2: "/user/open/api/v2/user/checkCode"
};
/**
 * 找回密码-下发验证码接口
 */
export function apiUSendCode(args) {
  return http.post(URLS.uSendCode, args);
}
/**
 * 找回密码-修改密码接口
 */
export function apiUUpdatePassword(args) {
  return http.post(URLS.uUpdatePassword, args);
}

/**
 * 找回密码-校验验证码接口
 */
export function apiUCheckCode(args) {
  return http.post(URLS.uCheckCode, args);
}

/**
 * 找回密码-校验验证码接口
 */
export function apiUCheckCodeV2(args) {
  return http.post(URLS.uCheckCodeV2, args);
}