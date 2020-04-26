export function data() {
  return {
    id: '',
    score: 0,
    scoreRate: 0,
    showRateDes: true,
    /**
     * 任务信息
     */
    task: {
      // "id": 1,
      // "url": "http://showdoc.ws.netease.com/web/#/page/edit/9/0",
      // "name": "",
      // "typeStr": "非建站H5",
      // "os": "IOS",
      // "netEnv": "wifi",
      // "statusStr": "准备中",
      // "score": 5.6,
      // "createTime": "2019-11-04",
      // "gradeDetail": ""
    },
    summary: {
      firstContentfulPaint: 0,
      timeToFirstByte: 0,
      firstMeaningfulPaint: 0,
      firstCpuIdle: 0,
      totalByteWeight: 0,
      domSize: 0,
      redirects: 0,
    },
    /**
     * 统计信息
     */
    resourceMap: {
      columns: [
        {
          id: "label",
          name: "资源统计类型"
        },
        {
          id: "size",
          name: "大小（MB）"
        },
        {
          id: "requestCount",
          name: "数量（个）"
        }
      ],
      rows: [],
      chartData: {
        // titleText: ``,
        // seriesName: [],
        seriesData: []
      }
    },
    slowResourceList: {
      chartData: {
        yAxisData: [],
        seriesData: []
      }
    },
    customColors: [
      { color: '#EF7F25', percentage: 89 },
      { color: '#53E000', percentage: 100 },
    ],
    scoreDetail: {
      columns: [
        {
          id: "name",
          name: "评分项",
          width: 150
        },
        {
          id: "percent",
          name: "评分结果（扣分分值）",
          width: 200
        },
        {
          id: "desp",
          name: "扣分原因"
        }
      ],
      rows: [
        // {
        //   t1: '页面脚本跳转数量', t2: -2, t3: 'Page', p: 80
        // },
        // {
        //   t1: '首次有效渲染检测', t2: -0.5, t3: 'Page', p: 95
        // }
      ]
    }
  }
}

export const MOCKDATA = {
  /**
     *  数据总览

        白屏时间（首次渲染时间） first-contentful-paint

        首资源时间 time-to-first-byte

        有效渲染时间（首次有意义渲染） first-meaningful-paint

        加载时长(首次cpu空闲时间) first-cpu-idle

        网页总大小 total-byte-weight

        DOM数量 dom-size

        页面重定向数据 redirects
     */
  summary: {
    firstContentfulPaint: 3035.4919999999993,
    timeToFirstByte: 87.39099999999999,
    firstMeaningfulPaint: 3035.4919999999993,
    firstCpuIdle: 3771.7539999999995,
    totalByteWeight: 2488270,
    domSize: 369,
    redirects: 101.07,
  },
  // 加载速度最慢的资源
  slowResourceList: [
    {
      url: 'http://www.cqzb86.com/pp/wy/hty/indexsj01.html',
      startTime: 0,
      endTime: 875.3339999821037,
      transferSize: 324,
      resourceSize: 0,
      statusCode: 301,
      mimeType: 'text/html',
      resourceType: undefined,
      timeCost: 875.3339999821037,
    },
    {
      url: 'https://www.cqzb86.com/pp/wy/hty/indexsj01.html',
      startTime: 875.6659999489784,
      endTime: 1161.5619999938644,
      transferSize: 44310,
      resourceSize: 43967,
      statusCode: 200,
      mimeType: 'text/html',
      resourceType: 'Document',
      timeCost: 285.896000044886,
    },
    {
      url: 'https://www.cqzb86.com/pp/wy/hty/cqzb68/bootstrap.min.css',
      startTime: 1131.90300000133,
      endTime: 1393.1069999816827,
      transferSize: 122947,
      resourceSize: 122533,
      statusCode: 200,
      mimeType: 'text/css',
      resourceType: 'Stylesheet',
      timeCost: 261.2039999803528,
    },
    {
      url: 'https://www.cqzb86.com/pp/wy/hty/js/jquery-1.11.0.min.js',
      startTime: 1133.0609999713488,
      endTime: 1380.9289999771863,
      transferSize: 96808,
      resourceSize: 96381,
      statusCode: 200,
      mimeType: 'application/javascript',
      resourceType: 'Script',
      timeCost: 247.86800000583753,
    },
    {
      url: 'https://www.cqzb86.com/pp/wy/hty/cqzb68/hm.js',
      startTime: 1132.4019999592565,
      endTime: 1344.6919999551028,
      transferSize: 25030,
      resourceSize: 24604,
      statusCode: 200,
      mimeType: 'application/javascript',
      resourceType: 'Script',
      timeCost: 212.2899999958463,
    },
    {
      url: 'https://s13.cnzz.com/z_stat.php?id=1274784072&web_id=1274784072',
      startTime: 1133.637999999337,
      endTime: 1342.116999963764,
      transferSize: 4496,
      resourceSize: 11797,
      statusCode: 200,
      mimeType: 'application/javascript',
      resourceType: 'Script',
      timeCost: 208.4789999644272,
    },
    {
      url: 'https://www.cqzb86.com/pp/wy/hty/cqzb68/bj.png',
      startTime: 1876.5419999836013,
      endTime: 2045.4499999759719,
      transferSize: 59417,
      resourceSize: 59004,
      statusCode: 200,
      mimeType: 'image/png',
      resourceType: 'Image',
      timeCost: 168.9079999923706,
    },
    {
      url: 'https://cnzz.mmstat.com/9.gif?abc=1&rnd=280555080',
      startTime: 1653.305999992881,
      endTime: 1815.5729999998584,
      transferSize: 381,
      resourceSize: 43,
      statusCode: 200,
      mimeType: 'image/gif',
      resourceType: 'Image',
      timeCost: 162.26700000697747,
    },
    {
      url: 'https://www.cqzb86.com/pp/wy/hty/cqzb68/hty_80.jpg',
      startTime: 2220.612999983132,
      endTime: 2378.895999980159,
      transferSize: 11054,
      resourceSize: 10640,
      statusCode: 200,
      mimeType: 'image/jpeg',
      resourceType: 'Image',
      timeCost: 158.28299999702722,
    },
    {
      url: 'https://www.cqzb86.com/pp/wy/hty/cqzb68/hty_82.jpg',
      startTime: 2307.106999971438,
      endTime: 2464.793999970425,
      transferSize: 13997,
      resourceSize: 13583,
      statusCode: 200,
      mimeType: 'image/jpeg',
      resourceType: 'Image',
      timeCost: 157.68699999898672,
    },
  ],
  // 资源统计
  resourceMap: [
    {
      resourceType: 'total',
      label: '总计',
      requestCount: 149,
      size: 2488270,
    },
    {
      resourceType: 'image',
      label: '图片',
      requestCount: 136,
      size: 2074068,
    },
    {
      resourceType: 'script',
      label: '脚本',
      requestCount: 9,
      size: 243955,
    },
    {
      resourceType: 'stylesheet',
      label: '样式表',
      requestCount: 2,
      size: 125613,
    },
    {
      resourceType: 'document',
      label: '文档',
      requestCount: 1,
      size: 44310,
    },
    {
      resourceType: 'other', label: '其他', requestCount: 1, size: 324,
    },
    {
      resourceType: 'media', label: '媒体', requestCount: 0, size: 0,
    },
    {
      resourceType: 'font', label: '字体', requestCount: 0, size: 0,
    },
    {
      resourceType: 'third-party',
      label: '第三方',
      requestCount: 8,
      size: 21016,
    },
  ],
  scoreDetail:
    [
      {
        tag: 'fullpageLoadTime', // 指标名称
        score: 1, // 扣分分数
        value: 9281, // 指标数值 时间统一为毫秒
      },
      {
        tag: 'pageLoadTime', // 指标名称
        score: 1, // 扣分分数
        value: 9281, // 指标数值 时间统一为毫秒
        detail: [{ // 详情 通常为资源列表 后续可能扩展其他类型
          url: 'http://www.cqzb86.com/pp/wy/hty/indexsj01.html',
          startTime: 0,
          endTime: 875.3339999821037,
          transferSize: 324,
          resourceSize: 0,
          statusCode: 301,
          mimeType: 'text/html',
          resourceType: 'Document',
          timeCost: 875.3339999821037,
        },
        ],
      },

    ],

};

