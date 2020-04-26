function convertTypes() {
  return {
    model: {
      value: "",
      label: "",
      error: ""
    },
    list: [{
        label: "页面访问",
        value: "1"
      },
      {
        label: "拨打电话",
        value: "2"
      },
      {
        label: "表单提交",
        value: "3"
      },
      {
        label: "有效咨询",
        value: "4"
      },
      {
        label: "微信复制",
        value: "5"
      },
      {
        label: "应用下载",
        value: "6"
      },
      {
        label: "订单",
        value: "9"
      },
      {
        label: "购买",
        value: "7"
      },
      {
        label: "其它",
        value: "8"
      }
    ]
  };
}
export function data() {
  return {
    baseInfo: {
      completed: false,
      eid: "",
      jt: {
        model: "0",
        list: [{
            value: "0",
            label: "JS部署"
          },
          {
            value: "1",
            label: "Xpath圈选"
          }
        ]
      },
      convertName: {
        value: "",
        error: ""
      },
      convertTypes: convertTypes(),
      landingPages: {
        model: {
          value: "",
          error: ""
        },
        list: []
      },
      landingPageUrl: "",
      dialog: {
        landingPage: {
          model: {
            title: "",
            url: {
              value: "",
              readonly: false,
              error: ""
            },
            name: {
              value: "",
              readonly: false,
              error: ""
            }
          },
          // rules: [{
          //   name: [{
          //       required: true,
          //       message: '落地页名称不能为空',
          //       trigger: 'blur'
          //     },
          //     {
          //       max: 50,
          //       message: '最多支持50个字段长度',
          //       trigger: 'blur'
          //     }
          //   ],
          //   url: [
          //     {
          //       required: true,
          //       message: '落地页URL不能为空',
          //       trigger: 'blur'
          //     }
          //   ]

          // }],
          visible: false
        },
        landingPageDel: {
          visible: false,
          model: ""
        }
      }
    },
    specInfo: {
      jsText: function (args) {
        return `<script type="text/javascript">\r\n    (function (win) {\r\n      var ns = document.createElement("script");ns.type = "text/javascript";ns.async = true;\r\n      ns.id= "_nfe_sps";\r\n      ns.src = "//163h5.nos-jd.163yun.com/h5/libs/sps.js";\r\n      win["_nfe_pid"]="${args.pid}";\r\n      win["_nfe_jt"]="${args.jt}";\r\n      win["_nfe_cc"] = "10000";\r\n      var f = document.getElementsByTagName("script")[0];\r\n      f.parentNode.insertBefore(ns,f);\r\n    })(window)\r\n  </script>\r\n`;
      },
      cjsText: function (ci, oi, oid) {
        let ciStr = JSON.stringify(ci),
          oiStr = JSON.stringify(oi) || "{}";
        return `_nfe.convert(${ciStr}, ${oiStr})//${oid}`;
      },
      website: '',
      screenShotUrl: '',
      convertTypes: convertTypes(),
      convertName: {
        value: "",
        error: ""
      },
      flags: [],
      tags: [],
      xpathSaveCompleted: false
    }
  };
}