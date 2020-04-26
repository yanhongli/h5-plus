import { data as dataFromLogin } from "../login/data.Login";
export const EmailReg = new RegExp(/^\w+@[a-z0-9]+(\.[a-z0-9]+){1,}$/);
export const CorpEmailReg = new RegExp(/^\w+@corp\.netease\.com$/i);
export const ComplexPwdReg = new RegExp(
  /((?=.*[a-z])(?=.*\d)|(?=.*[a-z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))/
);
export function data() {
  let dataLogin = dataFromLogin();
  return {
    steps: {
      model: 0,
      list: ["邮箱找回", "重置密码", "完成"]
    },
    stepsContent: [
      {
        account: {
          value: "",
          error: ""
        },
        email: {
          value: "",
          error: ""
        },
        vscode: {
          value: "",
          error: "",
          info: ""
        },
        timer: {
          id: "",
          count: -1
        },
        platform: dataLogin.platform,
        getSource: function() {
          return dataLogin.getSourceByWay();
        }
      },
      {
        opwd: {
          value: "",
          error: ""
        },
        pwd: {
          value: "",
          error: ""
        },
        cpwd: {
          value: "",
          error: ""
        }
      },
      {
        timer: {
          id: "",
          count: 5
        }
      }
    ]
  };
}
