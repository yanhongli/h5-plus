import http from "../http";
import qs from "qs";
/**
 * 请求URLS
 */
const URLS = {
  /**
   * 获取菜单接口
   */
  pRoutes: "/user/open/api/v1/permission/routes"
};
export const MENUS = [];
/**
 * 获取菜单接口
 */
export function apiPRoutes(args) {
  return http.get(URLS.pRoutes + "?" + qs.stringify(args)).then(e => {
    // MENUS.push(...e);
    requestRoutesToMenus(e);
    return { homePage: homePage, menus: menus };
  });
}
let homePage = "",
  menus = [];
function requestRoutesToMenus(routes) {
  MENUS.length = 0;
  let recursion = function(rc, mc) {
    if (rc) {
      rc.forEach(e => {
        let menu = {
          text: e.name,
          expand: false,
          icon: e.source
        };
        if (!e.children || e.children.length <= 0) {
          menu.to = e.path;
          if (!homePage) homePage = menu.to;
        } else {
          menu.children = [];
        }
        mc.push(menu);
        menus.push(menu);
        e.children && e.children.length > 0 && recursion(e.children, menu.children);
      });
    }
  };
  recursion(routes, MENUS);
}
