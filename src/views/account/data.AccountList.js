export function data() {
  return {
    dialog: {
      account: {
        visible: false,
        model: {
          title: "新建用户",
          id: "",
          name: {
            value: "",
            error: ""
          },
          account: {
            value: "",
            readonly: false,
            error: ""
          },
          email: {
            value: "",
            error: ""
          },
          role: {
            value: "",
            error: "",
            readonly: false
          }
        }
      }
    },
    roles: [],
    adminRole: "",
    page: {
      size: 10,
      current: 1,
      total: 0
    },
    tableData: [],
    tableColumns: [
      "name",
      "account",
      "roleName",
      "createTime",
      "lastLoginTime",
      "operate"
    ],
    tableRowCanDelete: false,
    customStates: {
      name: {
        name: "昵称",
        checked: true,
        tempChecked: true
      },
      account: {
        name: "用户名",
        checked: true,
        tempChecked: true
      },
      roleName: {
        name: "角色",
        checked: true,
        tempChecked: true
      },
      createTime: {
        name: "添加时间",
        checked: true,
        tempChecked: true
      },
      lastLoginTime: {
        name: "最后一次登录时间",
        checked: true,
        tempChecked: true
      },

      operate: {
        name: "操作",
        checked: true,
        tempChecked: true
      }
    }
  };
}
