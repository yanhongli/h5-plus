import {
  data as dataFromEventList
} from "../SDK/data.EventList";
/**
 * 量化指标
 */
export function quantification() {
  return {
    model: "0",
    list: [{
        label: "浏览量",
        value: "0"
      },
      {
        label: "访客量",
        value: "1"
      },
      {
        label: "转化量",
        value: "2"
      },
      // {
      //   label: "转化率",
      //   value: "3"
      // },
      // {
      //   label: "平均停留时长",
      //   value: "4"
      // },
      // {
      //   label: "跳出率",
      //   value: "5"
      // }
    ]
  };
}
/**
 * 详情列表公共字段
 */
export function commonColumnsOfDetailTable() {
  return [{
      id: "pv",
      name: "浏览量",
      sortable: true,
      numberFormat: true,
    },
    {
      id: "uv",
      name: "访客量",
      sortable: true,
      numberFormat: true
    },
    {
      id: "ruv",
      name: "重复访客量",
      sortable: true,
      numberFormat: true,
      width: 110
    },
    {
      id: "ruvRate",
      name: "重复访客率",
      sortable: true,
      numberFormat: true,
      fixedFormat: "0.0",
      unit: "%",
      width: 110
    },
    {
      id: "converts",
      name: "转化量",
      sortable: true,
      numberFormat: true
    },
    {
      id: "convertRate",
      name: "转化率",
      sortable: true,
      numberFormat: true,
      fixedFormat: "0.0",
      unit: "%"
    },
    {
      id: "stayTimeAvg",
      name: "平均停留时长",
      sortable: true,
      numberFormat: true,
      fixedFormat: "0.0",
      width: 120
    },
    {
      id: "bounce",
      name: "跳出量",
      sortable: true,
      numberFormat: true
    },
    {
      id: "bounceRate",
      name: "跳出率",
      sortable: true,
      numberFormat: true,
      fixedFormat: "0.0",
      unit: "%"
    }
  ];
}
export function pageAndOrder() {
  return {
    page: {
      size: 10,
      current: 1,
      total: 0
    },
    order: {
      sort: "pv",
      dir: "desc"
    }
  };
}
const types = {
  "0": "操作系统",
  "1": "用户来源",
  "3": "品牌型号"
};
//创建页面tab数据原型
function createTab(typeIndex) {
  let type = types[typeIndex];
  return {
    visited: false,
    label: type,
    name: typeIndex,
    quantification: quantification(),
    charts: {
      titleText: type + "浏览量分布",
      seriesName: "浏览量",
      seriesData: []
    },
    tops: {
      legend: "",
      columns: [{
          id: "dimensionValue",
          name: type,
          width: 120
        },
        {
          id: "quotaValue",
          name: "浏览量",
          width: 80,
          numberFormat: true,
        },
        {
          id: "proportion",
          name: type + "占比（%）",
          width: 160,
          numberFormat: true,
          fixedFormat: "0.0"
        }
      ],
      rows: []
    },
    details: {
      columns: [{
          id: "dimensionValue",
          name: type
        },
        ...commonColumnsOfDetailTable()
      ],
      rows: [],
      ...pageAndOrder()
    }
  };
}

export function data(host) {
  let dataFromEventListData = dataFromEventList(host);
  return {
    loading: false,
    pickerOptions: dataFromEventListData.pickerOptions,
    dateRange: dataFromEventListData.dateRange,
    landingPages: {
      model: "",
      list: []
    },
    tabIndex: "1",
    tabs: [createTab("1"), createTab("0"), createTab("3")]
  };
}
