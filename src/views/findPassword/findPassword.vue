<template>
  <div>
    <el-row class="page" type="flex" justify="center" align="middle">
      <el-card class="card">
        <el-steps :active="steps.model" finish-status="success" align-center>
          <el-step :title="item" v-for="item in steps.list" :key="item"></el-step>
        </el-steps>
        <section class="step-content" v-if="steps.model == 0">
          <!-- <div class="c-row">
            <el-row type="flex">
              <el-col :span="6">
                <label class="label">平台来源：</label>
              </el-col>
              <el-col>
                <el-radio-group v-model="stepsContent[0].platform.model">
                  <el-radio
                    v-for="item in stepsContent[0].platform.list"
                    :key="item.vaue"
                    :label="item.value"
                  >{{ item.label }}</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
          </div> -->
          <div class="c-row">
            <el-row type="flex" align="middle">
              <el-col :span="6">
                <label class="label">用户名：</label>
              </el-col>
              <el-col>
                <el-input v-model="stepsContent[0].account.value" @blur="accountValidate()"></el-input>
                <div class="validate-text">{{ stepsContent[0].account.error }}</div>
              </el-col>
            </el-row>
          </div>
          <div class="c-row">
            <el-row type="flex" align="middle">
              <el-col :span="6">
                <label class="label">联系邮箱：</label>
              </el-col>
              <el-col>
                <el-input v-model="stepsContent[0].email.value" @blur="emailValidate()"></el-input>
                <div class="validate-text">{{ stepsContent[0].email.error }}</div>
              </el-col>
            </el-row>
          </div>
          <div class="c-row">
            <el-row type="flex" align="middle">
              <el-col :span="6">
                <label class="label">验证码：</label>
              </el-col>
              <el-col>
                <el-row type="flex">
                  <el-col>
                    <el-input
                      v-model="stepsContent[0].vscode.value"
                      @blur="vscodeValidate()"
                      placeholder="6位验证码"
                      maxlength="6"
                    ></el-input>
                    <div class="validate-text">{{ stepsContent[0].vscode.error }}</div>
                  </el-col>
                  <el-button
                    :disabled="stepsContent[0].timer.count > 0"
                    @click="obtainVscode()"
                    style="margin-left: 15px;"
                  >
                    {{
                    stepsContent[0].timer.count == -1
                    ? "获取验证码"
                    : stepsContent[0].timer.count == 0
                    ? "重新获取"
                    : "重新获取" + stepsContent[0].timer.count + "s"
                    }}
                  </el-button>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="c-row">
            <el-button type="primary" style="width: 100%;" @click="emailBackNext()">下一步</el-button>
          </div>
        </section>
        <section class="step-content" v-if="steps.model == 1">
          <div class="c-row">
            <el-row type="flex" align="middle">
              <el-col :span="6">
                <label class="label">新密码：</label>
              </el-col>
              <el-col>
                <el-input v-model="stepsContent[1].pwd.value" type="password" @blur="pwdValidate()"></el-input>
                <div class="validate-text">{{ stepsContent[1].pwd.error }}</div>
              </el-col>
            </el-row>
          </div>
          <div class="c-row">
            <el-row type="flex" align="middle">
              <el-col :span="6">
                <label class="label">确认密码：</label>
              </el-col>
              <el-col>
                <el-input
                  v-model="stepsContent[1].cpwd.value"
                  type="password"
                  @blur="cpwdValidate()"
                ></el-input>
                <div class="validate-text">{{ stepsContent[1].cpwd.error }}</div>
              </el-col>
            </el-row>
          </div>
          <div class="c-row">
            <el-button type="primary" style="width: 100%;" @click="resetPwdNext()">下一步</el-button>
          </div>
        </section>
        <section class="step-content" v-if="steps.model == 2">
          <div class="c-row">恭喜您，密码重置成功</div>
          <div class="c-row">{{ stepsContent[2].timer.count }}秒后自动跳转到登录页面</div>
          <div class="c-row">
            <el-button type="primary" style="width: 100%;" @click="goToLogin()">立即登录</el-button>
          </div>
        </section>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { data, EmailReg, ComplexPwdReg } from "./data.findPassword";
import { TENANTCODE } from "../login/data.Login";
import {
  apiUSendCode,
  apiUUpdatePassword,
  apiUCheckCode
} from "../../plugins/api";
export default {
  data: function() {
    return {
      ...data()
    };
  },
  methods: {
    accountValidate: function() {
      if (this.stepsContent[0].platform.model == "0") return true;
      let account = this.stepsContent[0].account;
      if (account.value.length <= 0) {
        account.error = "不能为空";
      } else {
        account.error = "";
      }
      return !account.error;
    },
    emailValidate: function() {
      let email = this.stepsContent[0].email;
      if (email.value.length <= 0) {
        email.error = "不能为空";
      } else if (!EmailReg.test(email.value)) {
        email.error = "请填写有效的邮箱格式";
      } else {
        email.error = "";
      }
      return !email.error;
    },
    vscodeValidate: function() {
      let vscode = this.stepsContent[0].vscode;
      if (vscode.value.length <= 0) {
        vscode.error = "不能为空";
      } else {
        vscode.error = "";
      }
      return !vscode.error;
    },
    next: function() {
      this.steps.model++;
      if (this.steps.model == 2) {
        this.autoToLogin();
      }
    },
    emailBackNext: function() {
      if (this.emailValidate() && this.vscodeValidate()) {
        let [s0] = this.stepsContent;
        clearInterval(s0.timer.id);
        s0.timer.count = -1;
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        apiUCheckCode({
          email: s0.email.value,
          code: s0.vscode.value
        })
          .then(() => {
            this.next();
          })
          .catch(msg => {
            this.$message.error(msg);
          })
          .finally(() => {
            loading.close();
          });
      }
    },
    pwdValidate: function() {
      let pwd = this.stepsContent[1].pwd;
      if (pwd.value.length <= 0) {
        pwd.error = "不能为空";
      } else if (pwd.value.length < 8 || pwd.value.length > 16) {
        pwd.error = "密码长度需为8~16位";
      } else if (!ComplexPwdReg.test(pwd.value)) {
        pwd.error = "必须包含数字、字母、符号中的任意两种组合，字母区分大小写";
      } else {
        pwd.error = "";
      }
      return !pwd.error;
    },
    cpwdValidate: function() {
      let cpwd = this.stepsContent[1].cpwd,
        pwd = this.stepsContent[1].pwd;
      if (cpwd.value.length <= 0) {
        cpwd.error = "不能为空";
      } else if (cpwd.value !== pwd.value) {
        cpwd.error = "确认密码需与新密码保持一致";
      } else {
        cpwd.error = "";
      }
      return !cpwd.error;
    },
    resetPwdNext: function() {
      if (this.pwdValidate() && this.cpwdValidate()) {
        let pwd = this.stepsContent[1].pwd;
        let s0 = this.stepsContent[0];
        apiUUpdatePassword({
          code: s0.vscode.value,
          account: s0.account.value,
          email: s0.email.value,
          source: s0.getSource(),
          password: pwd.value,
          tenantCode: TENANTCODE,
        })
          .then(() => {
            this.next();
          })
          .catch(msg => {
            this.$message.error(msg);
          });
      }
    },
    obtainVscode: function() {
      if (this.emailValidate()) {
        let [s0] = this.stepsContent;
        apiUSendCode({
          email: s0.email.value,
          tenantCode: TENANTCODE,
          source: s0.getSource(),
          account: s0.account.value
        })
          .then(() => {
            this.$message.info("已发送验证码，请登录邮箱查看");
          })
          .catch(msg => {
            this.$message.error(msg);
          });
        s0.timer.count = 60;
        s0.timer.id = setInterval(() => {
          s0.timer.count--;
          if (s0.timer.count <= 0) clearInterval(s0.timer.id);
        }, 1000);
      }
    },
    autoToLogin() {
      let [, , s2] = this.stepsContent;
      s2.timer.id = setInterval(() => {
        s2.timer.count--;
        if (s2.timer.count <= 0) {
          this.goToLogin();
        }
      }, 1000);
    },
    goToLogin() {
      clearInterval(this.stepsContent[2].timer.id);
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: url("../../assets/images/login-topic.png") no-repeat 20% center,
    url("../../assets/images/login-bg.png") no-repeat left top;
}
.card {
  width: 450px;
  padding: 10px;
}
.label {
  width: 80px;
  flex-shrink: 0;
}
.step-content {
  margin: 20px auto;
}
</style>
