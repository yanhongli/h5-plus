<template>
  <div class="main">
    <el-card>
      <el-row type="flex" class="inputs">
        <el-button type="primary" size="small" @click="addAccount">
          <span>+</span>
          添加用户
        </el-button>
      </el-row>
      <div>
        <el-table :data="tableData" style="width: 100%">
          <template v-for="column in tableColumns">
            <el-table-column
              :key="column"
              :prop="column"
              :label="customStates[column].name"
              v-if="customStates[column].checked"
            >
              <template slot-scope="scope">
                <section
                  v-if="scope.column.property == 'operate'"
                  class="op-link-group"
                >
                  <span class="op-link" @click="edit(scope.row)">修改</span>
                  <span
                    class="op-link"
                    :class="{
                      'op-link': true,
                      disabled:
                        scope.row.id === userInfo.id
                    }"
                    @click="del(scope.row)"
                    >删除</span
                  >
                </section>
                <section
                  v-else
                  class="text-ellipsis"
                  :title="scope.row[scope.column.property]"
                >
                  {{ scope.row[scope.column.property] }}
                </section>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div class="mt-20">
          <el-pagination
            @size-change="getTableData(true)"
            @current-change="getTableData(false)"
            :page-sizes="[10, 20, 50, 100]"
            :page-size.sync="page.size"
            :current-page.sync="page.current"
            layout="total, sizes, jumper,pager"
            :total="page.total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog
      width="30%"
      :visible.sync="dialog.account.visible"
      center
      :title="dialog.account.model.title"
      custom-class="mw-600"
    >
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="5">
          <label>昵称：</label>
        </el-col>
        <el-col>
          <el-input
            v-model="dialog.account.model.name.value"
            placeholder="请输入昵称"
            maxlength="50"
            @blur="nameValidate()"
          ></el-input>
          <div class="validate-text">
            {{ dialog.account.model.name.error }}
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="5">
          <label>用户名：</label>
        </el-col>
        <el-col>
          <el-input
            v-model="dialog.account.model.account.value"
            placeholder="请输入用户名"
            :disabled="dialog.account.model.account.readonly"
            show-word-limit
            maxlength="32"
            @blur="accountValidate()"
          ></el-input>
          <div class="validate-text">
            {{ dialog.account.model.account.error }}
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="5">
          <label>联系邮箱：</label>
        </el-col>
        <el-col>
          <el-input
            v-model="dialog.account.model.email.value"
            placeholder="请输入联系邮箱"
            :disabled="dialog.account.model.email.readonly"
            show-word-limit
            maxlength="300"
            @blur="emailValidate()"
          ></el-input>
          <div class="validate-text">
            {{ dialog.account.model.email.error }}
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="5">
          <label>角色：</label>
        </el-col>
        <el-col>
          <el-select
            v-model="dialog.account.model.role.value"
            placeholder="请选择"
            class="search-input mr-10"
            size="small"
            multiple
            :disabled="dialog.account.model.role.readonly"
            @change="roleValidate()"
          >
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
          <div class="validate-text">
            {{ dialog.account.model.role.error }}
          </div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="dialog.account.visible = false" class="btn-n-width mr-50">取 消</el-button>
        <el-button type="primary" @click="accountOk()" class="btn-n-width">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { data } from "./data.AccountList";
import { EmailReg } from "../findPassword/data.findPassword";
import {
  apiUList,
  apiRRoleList,
  apiUEdit,
  apiURemove,
  UserInfo
} from "../../plugins/api";
export default {
  data: function() {
    return {
      ...data(),
      userInfo: UserInfo
    };
  },
  methods: {
    accountOk: function() {
      if (this.nameValidate() && this.emailValidate() && this.roleValidate() && this.accountValidate()) {
        let account = this.dialog.account;
        apiUEdit({
          id: account.model.id,
          name: account.model.name.value,
          realName: account.model.name.value,
          email: account.model.email.value,
          account: account.model.account.value,
          roleId: account.model.role.value.join(",")
        })
          .then(() => {
            this.getTableData(true);
            account.visible = false;
            this.$message.info(account.model.id ? "修改成功" : "新建成功");
          })
          .catch(e => {
            this.$message.error(e);
          });
      }
    },
    addAccount: function() {
      let account = this.dialog.account;
      account.model.id = "";
      Object.assign(account.model.name, { value: "", error: "" });
      Object.assign(account.model.account, {
        value: "",
        error: "",
        readonly: false
      });
      Object.assign(account.model.email, {
        value: "",
        error: "",
      });
      Object.assign(account.model.role, {
        value: "",
        error: "",
        readonly: false
      });
      account.model.title = "新建用户";
      this.roleLimitOfRelation();
      account.visible = true;
    },
    nameValidate: function() {
      let name = this.dialog.account.model.name;
      if (name.value.length <= 0) {
        name.error = "不能为空";
      } else {
        name.error = "";
      }
      return !name.error;
    },
    accountValidate: function() {
      let account = this.dialog.account.model.account;
      if (account.value.length <= 0) {
        account.error = "不能为空";
      }else {
        account.error = "";
      }
      return !account.error;
    },
    emailValidate: function() {
      let email = this.dialog.account.model.email;
      if (email.value.length <= 0) {
        email.error = "不能为空";
      } else if (!EmailReg.test(email.value)) {
        email.error = "请填写有效的邮箱格式";
      } else {
        email.error = "";
      }
      return !email.error;
    },
    roleLimitOfRelation: function() {
      let role = this.dialog.account.model.role;
      if (role.value.length <= 0) {
        this.roles.forEach(e => (e.disabled = false));
      } else {
        let admin = this.adminRole;
        if (admin && role.value.some(e => e == admin.value)) {
          this.roles.forEach(e => {
            if (e.value != admin.value) {
              e.disabled = true;
            }
          });
        } else {
          admin.disabled = true;
          this.roles.forEach(e => {
            if (e.value != admin.value) {
              e.disabled = false;
            }
          });
        }
      }
    },
    roleValidate: function() {
      let role = this.dialog.account.model.role;
      if (role.value.length <= 0) {
        role.error = "请选择角色";
      } else {
        role.error = "";
      }
      this.roleLimitOfRelation();
      return !role.error;
    },
    uList: function() {
      let conditions = {
        current: this.page.current,
        size: this.page.size,
        // source: 2
      };
      apiUList(conditions).then(e => {
        this.tableData.length = 0;
        this.tableData.push(...e.records);
        this.page.total = e.total;
        this.tableRowCanDelete = e.isDelete;
      });
    },
    rRoleList: function() {
      apiRRoleList({}).then(e => {
        this.roles.push(
          ...e.map(ei => ({ label: ei.roleName, roleAlias: ei.roleAlias , value: ei.id.toString() }))
        );
        this.adminRole = this.roles.find(e => e.roleAlias == "ROLE_MANAGER") || {};
      });
    },
    getTableData: function(reset) {
      if (reset) this.page.current = 1;
      this.uList();
    },
    edit: function(row) {
      let account = this.dialog.account;
      account.model.id = row.id;
      Object.assign(account.model.name, { value: row.name, error: "" });
      Object.assign(account.model.account, {
        value: row.account,
        error: "",
        readonly: true
      });
      Object.assign(account.model.email, {
        value: row.email,
        error: "",
      });
      let roleIds = row.roleId.split(",");
      Object.assign(account.model.role, {
        value: roleIds,
        error: "",
        readonly:
          !this.tableRowCanDelete &&
          roleIds.some(e => e == this.adminRole.value)
      });
      account.model.title = "修改用户";
      this.roleLimitOfRelation();
      account.visible = true;
    },
    del: function(row) {
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        apiURemove({ ids: row.id }).then(() => {
          this.getTableData(true);
          this.$message.info("删除成功");
        });
      });
    }
  },
  mounted: function() {
    this.uList();
    this.rRoleList();
  }
};
</script>
<style lang="scss" scoped>
.main {
  .el-row {
    margin-bottom: 20px;
  }
  .inputs {
    margin-top: 7px;
    flex-wrap: wrap;
    .search-input {
      width: 180px;
    }
    label {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
    }
  }
  .table {
    margin-top: 65px;
  }
}
.op-link-group {
  .op-link {
    color: #1890FF;
    padding: 0 5px;
    cursor: pointer;
    user-select: none;
    font-size: 12px;
    &:not(:last-of-type) {
      border-right: 1px solid #dbdbdb;
    }
    &.disabled {
      color: #c0c4cc;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}
</style>
