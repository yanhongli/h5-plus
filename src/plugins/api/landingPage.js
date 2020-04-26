import http from "../http";

/** 获取今日数据概览 */
export function getTodayData(landingPageId) {
  return http.post("/eventManagement/selectToday", {
    landingPageId
  });
}

/**
 * 站点名称是否可用（重复性）
 * @param {string} name 站点名称
 */
export function getNameisUniq (name) {
    return http.get('/admire/h5/api/site/checkName', {
        params: {title: name}
    })
}
/** 获取落地页列表 */
export function getLandingPages() {
  return http.post("/landingPage/list");
}

/** 获取落地页趋势分析图表数据 */
export function getTrendData(params) {
  return http.post("/eventManagement/selectTarget", params);
}
