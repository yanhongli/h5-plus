<template>
  <div>
    <el-row class="page" type="flex" justify="end" align="middle">
      <el-card class="form" v-show="pre">
        <h2 @click.ctrl.shift="pre=false">系统更新中，请18:00后使用。。。</h2>
      </el-card>
      <el-card class="form" v-show="!pre">
        <div class="c-row text-center">
          <span class="form-title">登录平台</span>
        </div>
        <!-- <div class="c-row">请先选择您的身份</div>
        <div class="c-row">
          <el-radio-group v-model="platform.model" @change="platformChange()">
            <el-radio
              v-for="item in platform.list"
              :key="item.vaue"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </div> -->
        <div class="c-row">
          <el-row type="flex" align="middle">
            <el-col>
              <el-input
                v-model="userName.value"
                placeholder="请输入用户名"
                @blur="userNameValidate()"
                clearable
              ></el-input>
              <div class="validate-text">{{ userName.error }}</div>
            </el-col>
            <el-col :span="10" v-if="platform.model == '0'" style="margin-left: 15px;">
              <span>{{ corpEmail }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="c-row">
          <el-row>
            <el-col>
              <el-input
                v-model="pwd.value"
                placeholder="请输入密码"
                type="password"
                clearable
                @blur="pwdValidate()"
              ></el-input>
              <div class="validate-text">{{ pwd.error }}</div>
            </el-col>
          </el-row>
        </div>
        <div class="c-row">
          <el-row type="flex">
            <el-col :span="8">
              <el-input
                v-model="vscode.value"
                maxlength="4"
                placeholder="请输入验证码"
                @blur="vscodeValidate()"
              />
              <div class="validate-text">{{ vscode.error }}</div>
            </el-col>
            <el-col>
              <img :src="vscodeUrl" class="vscode-img" alt="验证码" />
              <span class="vscode-change" @click="changeVscode()">换一张</span>
            </el-col>
          </el-row>
        </div>
        <div class="c-row">
          <el-button :loading="loading" type="primary" style="width: 100%;" @click="login()">登录</el-button>
        </div>
        <div class="c-row">
          <el-row type="flex" justify="space-between">
            <router-link to="/fpwd" target="_blank" class="light-blue">忘记密码</router-link>
            <span>
              使用
              <a
                href="/H5Data/openId/toOpenIdLogin"
                class="light-blue"
                style="margin: 0 5px;"
              >openid</a>
              快速登录
            </span>
          </el-row>
        </div>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { data } from "./data.Login";
import {
  apiUGetVerifyCode,
  apiU2Login,
  apiUH5WGetVerifyCode,
  apiUH5WLogin,
  getH5WUrl,
  getH5WUrlForNew,
  apiUCurrent,
  apiPRoutes,
  UserInfo,
  apiEMCheck
} from "../../plugins/api";
export default {
  data: function() {
    return {
      loading: false,
      ...data(),
      pre: false
    };
  },
  methods: {
    changeVscode: function() {
      // if (this.platform.model == "0") {
      this.vscodeUrl = apiUGetVerifyCode();
      // } else {
      // this.vscodeUrl = apiUH5WGetVerifyCode();
      // }
    },
    userNameValidate: function() {
      if (this.userName.value.length <= 0) {
        this.userName.error = "用户名不能为空";
      } else {
        this.userName.error = "";
      }
      return !this.userName.error;
    },
    pwdValidate: function() {
      if (this.pwd.value.length <= 0) {
        this.pwd.error = "密码不能为空";
      } else {
        this.pwd.error = "";
      }
      return !this.pwd.error;
    },
    vscodeValidate: function() {
      if (this.vscode.value.length <= 0) {
        this.vscode.error = "验证码不能为空";
      } else {
        this.vscode.error = "";
      }
      return !this.vscode.error;
    },
    userAgreementValidate: function() {
      if (!this.userAgreement.value) {
        this.userAgreement.error = "请勾选用户协议";
      } else {
        this.userAgreement.error = "";
      }
      return !this.userAgreement.error;
    },
    platformChange: function() {
      this.changeVscode();
    },
    login: function() {
      if (
        this.userNameValidate() &&
        this.pwdValidate() &&
        this.vscodeValidate() &&
        this.userAgreementValidate()
      ) {
        // if (this.platform.model == "0") {
        this.loading = true
        apiU2Login({
          account:
            this.userName.value +
            (this.platform.model == "0" ? this.corpEmail : ""),
          password: this.pwd.value,
          code: this.vscode.value,
          way: this.platform.model,
          source: this.getSourceByWay(),
          tenantCode: this.tenantCode
        })
          .then(e => {
            localStorage["h5_token"] = e.token;
            //如果是易效用户，跳转到伊人建站
            if (this.platform.model == "1") {
              location.href = getH5WUrlForNew(e.token);
            } else {
              apiUCurrent()
              .then(() => {
                return apiPRoutes()
              })
              .then(r => {
                  return this.$store.dispatch("getLandingPages", true)
                  .then(res => {
                    const temp = window.location.href.split("?");
                    if (temp.length > 1) {
                      const queryString = temp[1].split("#/");
                      window.history.pushState(null, null, temp[0]);
                    }
                  });
                })
                .then(apiEMCheck)
                .then(
                  c => {
                      if (UserInfo.M_ADD_EVENT_VIEW && c !== true) {
                        return this.$router.push("/guide");
                      } else {
                        if (
                          this.$router.currentRoute.path != "/guide"
                          // !r.menus.some(
                          //   m => m.to == this.$router.currentRoute.path
                          // )
                        ) {
                          return this.$router.push('/');
                        }
                      }
                    }
                )
            }
          })
          .catch(msg => {
            this.$message.error(msg);
            this.changeVscode();
            this.$nextTick().then(res => {
              this.loading = false
            })
          })
      }
      //  else {
      //   apiUH5WLogin({
      //     name: this.userName.value,
      //     password: this.pwd.value,
      //     authCode: this.vscode.value
      //   })
      //     .then(e => {
      //       location.href = getH5WUrl(e.uid);
      //     })
      //     .catch(msg => {
      //       this.$message.error(msg);
      //       this.changeVscode();
      //     });
      // }
      // }
    }
  },
  mounted: function() {
    this.changeVscode();
    let msg = this.$route.query["msg"];
    if (msg) {
      this.$message.error(msg);
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
.vscode-change {
  cursor: pointer;
  font-size: 12px;
}
.form {
  width: 400px;
  margin: 0 150px;
}
.form-title {
  font-size: 18px;
}
.vscode-img {
  width: 100px;
  max-height: 100%;
  margin: 0 15px;
  height: 39px;
  width: 100px;
}
.user-agreement {
  line-height: 20px;
}
</style>
