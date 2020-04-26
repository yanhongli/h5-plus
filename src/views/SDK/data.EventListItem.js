import { data as dataFromCreate } from "./data.Create";
import { data as dataFromEventList } from "./data.EventList";
export function hoursSpan() {
  let hs = [];
  for (let i = 0; i < 24; i++) hs.push(`${i > 9 ? i : `0${i}`}:00`);
  return hs;
}
export function daysSpan(st, et) {
  let ds = [];
  let month = st.getMonth(),
    day = st.getDate(),
    maxMonth,
    maxDay;
  for (let year = st.getFullYear(); year <= et.getFullYear(); year++) {
    maxMonth = year == et.getFullYear() ? et.getMonth() : 11;
    for (; month <= maxMonth; month++) {
      if (year == et.getFullYear() && month == et.getMonth()) {
        maxDay = et.getDate();
      } else {
        let t = new Date(year, month + 1, 1);
        t.setDate(-1);
        maxDay = t.getDate();
      }
      for (; day <= maxDay; day++) {
        let rmonth = month + 1;
        ds.push(
          `${year}-${rmonth > 9 ? rmonth : `0${rmonth}`}-${
            day > 9 ? day : `0${day}`
          }`
        );
      }
      day = 1;
    }
    month = 0;
  }
  return ds;
}
export function timesSpan(st, et) {
  if (et.getTime() - st.getTime() > 24 * 60 * 60 * 1000) {
    return daysSpan(st, et);
  } else {
    return hoursSpan();
  }
}
export function data(host) {
  let dataFromEventListData = dataFromEventList(host);
  return {
    selects: [
      {
        key: "landingPageName",
        name: "落地页名称",
        value: "",
        list: []
      },
      {
        key: "eventType",
        name: "监测类型",
        value: "",
        list: dataFromCreate().baseInfo.convertTypes.list
      },
      {
        key: "eventList",
        name: "监测事件",
        value: "",
        list: []
      }
    ],
    order: {
      sort: "",
      dir: ""
    },
    pickerOptions: dataFromEventListData.pickerOptions,
    dateRange: dataFromEventListData.dateRange,
    tableData: [],
    tableColumns: [
      "createTimeStr",
      "landingPageName",
      "mode",
      "conversionName",
      "browse",
      "visitor",
      "conversionAmount"
    ],
    customStates: {
      id: {
        name: "主键",
        checked: true,
        tempChecked: true
      },
      type: {
        name: "事件类型",
        checked: true,
        tempChecked: true
      },
      mode: {
        name: "监控方式",
        checked: true,
        tempChecked: true
      },
      conversionName: {
        name: "转化事件",
        checked: true,
        tempChecked: true
      },
      conversionType: {
        name: "转化类型",
        checked: true,
        tempChecked: true
      },
      createTimeStr: {
        name: "日期/时间",
        checked: true,
        tempChecked: true
      },
      browse: {
        name: "浏览量",
        checked: true,
        tempChecked: true,
        sortable: true
      },
      visitor: {
        name: "访问量",
        checked: true,
        tempChecked: true,
        sortable: true
      },
      conversionAmount: {
        name: "转化量",
        checked: false,
        tempChecked: false,
        sortable: true
      },
      landingPageName: {
        name: "落地页名称",
        checked: true,
        tempChecked: true
      }
    },
    page: {
      size: 10,
      current: 1,
      total: 0
    },
    chartData: []
  };
}
