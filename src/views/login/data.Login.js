// export const TENANTCODE = "796644";
export const TENANTCODE = process.env.VUE_APP_LOGIN_CODE;
console.log(TENANTCODE);
export function data() {
  return {
    platform: {
      model: "3",
      list: [{
          label: "易效用户",
          value: "3"
        },
        {
          label: "H5数据分析用户",
          value: "0"
        }
      ]
    },
    userName: {
      value: "",
      error: ""
    },
    pwd: {
      value: "",
      error: ""
    },
    vscode: {
      value: "",
      error: ""
    },
    vscodeUrl: "",
    tenantCode: TENANTCODE,
    relUserId: "",
    way: {
      //平台注册用户
      h5: 0,
      //业务平台跳转
      pt: 2,
      //业务平台用户
      yx: 3
    },
    source: {
      //平台来源
      h5: 2,
      //易效
      yx: 1
    },
    getSourceByWay: function () {
      return this.platform.model != "0" ? this.source.yx : this.source.h5;
    },
    userAgreement: {
      value: true,
      error: ""
    },
    corpEmail: "@corp.netease.com"
  };
}