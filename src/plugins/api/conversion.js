import http from "../http";
import isDate from "lodash/isDate";
import format from "date-fns/format";
import qs from "qs";
import {
  BASE_URL
} from "../http";
import sortBy from "lodash/sortBy";
export function getConversionTypes() {
  return http.get("/conversion/analysis/types");
}
import numeral from "numeral";
import isNumber from "lodash/isNumber"

export function getConversionStatusSync() {
  return [{
      name: "转化状态",
      id: ""
    },
    {
      name: "未转化",
      id: 0
    },
    {
      name: "已转化",
      id: 1
    }
  ];
}

/** 获取转化列表 */
export function getConversionList(params) {
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const element = params[key];
      if (isDate(element)) {
        params[key] = format(element, "yyyy-MM-dd");
      }
    }
  }
  return http.get("/conversion/analysis/list", {
    params
  });
}

/** 导出转化详情列表 */
export function exportConversionListCSV(params) {
  // window.open(BASE_URL + "/conversion/export" + "?" + qs.stringify(params));
  const ifreame = document.createElement("iframe");
  ifreame.src = BASE_URL + "/conversion/export" + "?" + qs.stringify(params);
  ifreame.style.display = "none";
  document.body.appendChild(ifreame);
}

/** 获取转化详情列表 */
export async function getConversionDetail(params) {
  const res = await http.get("/conversion/analysis/details", {
    params
  });
  // res.url = "https://163h5.nos-jd.163yun.com/f2e-cdn/static/rep1.json";
  // res.url = "https://163h5.nos-jd.163yun.com/f2e-cdn/static/test.json";
  const TIME_KEY = "request_time";
  try {
    if (res.url) {
      const trackLogs = await http.get(res.url);
      // console.log(trackLogs, "track");
      res.trackLogs = sortBy(trackLogs, TIME_KEY);
    } else {
      res.trackLogs = [{
        [TIME_KEY]: new Date().toTimeString
      }];
    }
  } catch (error) {
    res.trackLogs = [{
      [TIME_KEY]: new Date().toTimeString
    }];
    return res;
  }

  return res;
}



/** 处理分析数据  */
export function handlerAnalysisTableData(data = []) {
  const arr = [...data]
  arr.forEach(item => {
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const element = item[key];
        const lowerKey = key.toLowerCase()
        if (lowerKey.endsWith('rate')) {
          item[key] = (numeral(item[key]).format('1.0') + '%')
        } else if (lowerKey !== 'id' && isNumber(item[key])) {
          item[key] = numeral(element).format('')
        } else if (lowerKey.endsWith('depth') && isNumber(item[key])) {
          item[key] = numeral(element).format('0.1')
        } else if (lowerKey.endsWith('staytime') && isNumber(item[key])) {
          item[key] = numeral(element).format('0.1')
        }

      }
    }
  })
  return arr
}

/** 获取浏览时长分析数据 */
export function getStayTimeData(params) {
  return http.get("/conversion/browse/time/analysis", {
      params
    })
    .then(res => {
      return res
    })
}

export function exportStayTimeData(params) {
  return http.download('/conversion/browse/time/export', params)
}

/** 获取浏览深度分析数据 */
export function getDepthData(params) {
  return http.get("/conversion/browse/depth/analysis", {
    params
  }).then(res => {
    handlerAnalysisTableData(res.list)
    return res
  })
}

export function exportDepthData(params) {
  return http.download('/conversion/browse/depth/export', params)
}

const FUNNEL_MOCK_DATA = {
  uvTotal: {
    current: 82,
    all: 100
  },
  uvEffective: {
    current: 72,
    all: 100
  },
  vp0: {
    current: 68,
    all: 100
  },
  vp1: {
    current: 42,
    all: 100
  },
  vp2: {
    current: 30,
    all: 100
  },
  convertNum: {
    current: 25,
    all: 100
  }
}


const FUNNEL_NULL_DATA = {
  uvTotal: {
    current: 0,
    all: 0
  },
  uvEffective: {
    current: 0,
    all: 0
  },
  vp0: {
    current: 0,
    all: 0
  },
  vp1: {
    current: 0,
    all: 0
  },
  vp2: {
    current: 0,
    all: 0
  },
  convertNum: {
    current: 0,
    all: 0
  }
}

/** 获取转化漏斗数据 */
export function getFunnelData(params) {
  if (window.__IS_DEV__) {
    return Promise.resolve(FUNNEL_MOCK_DATA)
  }
  return http.get('/conversion/funnel/view', {params})
}