import { dateComponentShortcuts } from "../../config/dates";
import isBefore from "date-fns/isBefore";
import isAfter from "date-fns/isAfter";
import differenceInDays from "date-fns/differenceInDays";
import endOfToday from "date-fns/endOfToday/index";
import startOfYear from "date-fns/startOfYear";
import subDays from "date-fns/subDays";
import endOfYesterday from "date-fns/endOfYesterday";

const TODAY = endOfToday();
/** 起始日期2019年初 */
const START_DATE = startOfYear(new Date().setFullYear(2019));
export function previousWeek() {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  end.setTime(end.getTime() - 3600 * 1000 * 24);
  return [start, end];
}
/**
/**
 * 导出元数据
 */
export function data(host) {
  return {
    dialog: {
      config: {
        model: {},
        visible: false
      },
      del: {
        model: {},
        visible: false
      },
      eventName: {
        model: {
          conversionName: {
            value: "",
            error: ""
          },
          id: {
            value: "",
            error: ""
          }
        },
        visible: false
      }
    },
    selects: [
      {
        key: "status",
        value: "-1",
        list: [
          {
            value: "-1",
            label: "全部未删除"
          },
          {
            value: "0",
            label: "活跃"
          },
          {
            value: "1",
            label: "未活跃"
          },
          {
            value: "2",
            label: "已删除"
          }
        ]
      }
      ,
      {
        key: "mode",
        value: "-1",
        list: [
          {
            value: "-1",
            label: "全部监测方式"
          },
          {
            value: "0",
            label: "JS部码"
          },
          {
            value: "1",
            label: "XPath"
          }
        ]
      }
    ],
    eventInput: "",
    pickerOptions: {
      shortcuts: dateComponentShortcuts,
      disabledDate(date) {
        return (
          isAfter(date, TODAY) ||
          isBefore(date, START_DATE) ||
          (host.checkedStartDate &&
            Math.abs(differenceInDays(date, host.checkedStartDate)) > 89)
        );
      },
      onPick({ maxDate, minDate }) {
        host.checkedStartDate = maxDate || minDate;
      }
    },
    dateRange: [subDays(endOfYesterday(), 6), endOfYesterday()],
    tableData: [],
    tableColumns: [
      "id",
      "conversionName",
      "status",
      "conversionTypeName",
      "mode",
      "landingPageName",
      "url",
      "browse",
      "visitor",
      "conversionAmount",
      "createTime",
      "operate"
    ],
    customStates: {
      id: {
        name: "事件ID",
        checked: false,
        tempChecked: false,
        width: 120
      },
      conversionName: {
        name: "事件名称",
        checked: true,
        tempChecked: true,
        width: 250
      },
      status: {
        name: "状态",
        checked: true,
        tempChecked: true,
        width: 110
      },
      conversionTypeName: {
        name: "事件类型",
        checked: true,
        tempChecked: true,
        width: 120
      },
      mode: {
        name: "监测方式",
        checked: true,
        tempChecked: true,
        width: 120
      },
      landingPageName: {
        name: "落地页名称",
        checked: true,
        tempChecked: true,
        width: 180
      },
      url: {
        name: "落地页URL",
        checked: false,
        tempChecked: false,
        width: 120
      },
      browse: {
        name: "浏览量",
        checked: true,
        tempChecked: true,
        width: 120
      },
      visitor: {
        name: "访问量",
        checked: true,
        tempChecked: true,
        width: 120
      },
      conversionAmount: {
        name: "转化量",
        checked: true,
        tempChecked: true,
        width: 120
      },
      createTime: {
        name: "创建时间",
        checked: true,
        tempChecked: true,
        width: 200
      },
      operate: {
        name: "操作",
        checked: true,
        tempChecked: true,
        width: "auto",
        minWidth: 240
      },
      fInfo: {
        name: "事件信息",
        checked: true,
        tempChecked: true
      },
      sInfo: {
        name: "基础指标",
        checked: true,
        tempChecked: true
      }
    },
    customGroups: [
      {
        key: "fInfo",
        isIndeterminate: false,
        children: [
          "id",
          "conversionName",
          "status",
          "conversionTypeName",
          "mode",
          "landingPageName",
          "url",
          "createTime"
        ]
      },
      {
        key: "sInfo",
        isIndeterminate: false,
        children: ["browse", "visitor", "conversionAmount"]
      }
    ],
    page: {
      size: 10,
      current: 1,
      total: 0
    },
    conversionNameEdition: {
      id: "",
      value: ""
    }
  };
}
