import http from "../../plugins/http";
export function getTimeRangeDiffData(params) {
  return http
    .get("/timeLine/compares", {
      params
    })
    .then(res => {
      // 测试单线支持
      // res.views = res.views.slice(0, 1)
      // handlerAnalysisTableData(res.list);
      return res;
    });
}

export function exportTimeRangeCSV(params) {
  return http.download('/timeLine/export', params)
}

/* 获取热力图数据 */
export function getHeatMapData(params) {

  return http.get("/click/thermal", {
    params
  });
}

/* 获取热力图数据 */
export function getDepthChartData(params) {

  return http.get("/visual/view", {
    params
  });
}
