<template>
  <div class="main page-sdk-create">
    <el-row class="gray f-12">为了方便您能充分收集页面转化数据，请您及时为您的界面创建监测事件</el-row>
    <section>
      <el-row type="flex" align="middle">
        <span class="row-badge" :class="{ disabled: baseInfo.completed }">1</span>
        <span class="f-16">设置基础信息</span>
      </el-row>
      <el-card>
        <div>
          <el-row class="f-15">选择监测方式</el-row>
          <el-row type="flex" align="middle">
            <label class="row-label">监测方式：</label>
            <el-radio-group v-model="baseInfo.jt.model" size="small" :disabled="baseInfo.completed">
              <el-radio-button
                :label="item.value"
                v-for="item in baseInfo.jt.list"
                :key="item.label"
              >{{ item.label }}</el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row type="flex" align="middle">
            <label>落地页信息</label>
            <div class="gray f-12">&nbsp;请填写实际监测需要选择对应的落地页，以便按照落地页维度查看相关数据报表</div>
          </el-row>
          <el-row type="flex" align="middle">
            <label class="row-label">落地页名称：</label>
            <div class="el-input">
              <el-select
                v-model="baseInfo.landingPages.model.value"
                placeholder="请选择"
                size="small"
                class="el-input"
                @change="landingPageChange()"
                :disabled="baseInfo.completed"
              >
                <el-option
                  v-for="item in baseInfo.landingPages.list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <el-row type="flex" justify="space-between">
                    <span>{{ item.name + "(ID：" + item.id + ")" }}</span>
                    <span>
                      <i class="el-icon-edit mr-10" title="编辑" @click="landingPage(item)"></i>
                      <i class="el-icon-delete" title="删除" @click="landingPageDel(item)"></i>
                    </span>
                  </el-row>
                </el-option>
              </el-select>
              <div class="validate-text">{{ baseInfo.landingPages.model.error }}</div>
            </div>
            <a
              href="javascript:void(0)"
              style="margin-left: 5px;"
              class="light-blue"
              @click="landingPage()"
              v-if="!baseInfo.completed"
            >添加</a>
          </el-row>
          <el-row type="flex" align="middle">
            <label class="row-label">落地页URL：</label>
            <el-input v-model="baseInfo.landingPageUrl" placeholder size="small" :disabled="true"></el-input>
          </el-row>
          <el-row type="flex" align="middle" v-if="baseInfo.jt.model == '1'">
            <label class="row-label"></label>
            <span class="gray f-12">该URL必须是手机端打开的最终地址，存在跳转的URL无法识别。</span>
          </el-row>
        </div>
        <div>
          <template v-if="baseInfo.jt.model == '0'">
            <el-row class="f-15">设置转化信息</el-row>
            <el-row type="flex" align="middle">
              <label class="row-label">转化名称：</label>
              <div class="el-input">
                <el-input
                  show-word-limit
                  v-model="baseInfo.convertName.value"
                  placeholder="请使用不同的转化名称，以便区分不同的转化类型"
                  size="small"
                  :disabled="baseInfo.completed"
                  maxlength="50"
                  class="input-show-count"
                  @blur="convertNameValidate('baseInfo')"
                ></el-input>
                <div class="validate-text">{{ baseInfo.convertName.error }}</div>
              </div>
            </el-row>
            <el-row type="flex" align="middle">
              <label class="row-label">转化类型：</label>
              <div class="el-input">
                <el-select
                  v-model="baseInfo.convertTypes.model.value"
                  placeholder="请选择"
                  size="small"
                  class="el-input"
                  :disabled="baseInfo.completed"
                  @change="convertTypesChange('baseInfo')"
                >
                  <el-option
                    v-for="item in baseInfo.convertTypes.list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div class="validate-text">{{ baseInfo.convertTypes.model.error }}</div>
              </div>
            </el-row>
          </template>
          <div :hidden="baseInfo.completed">
            <el-button
              type="primary"
              size="small"
              class="btn-n-width mr-50 ml-50"
              @click="submitBaseInfo()"
            >提交</el-button>
            <router-link active-class="active" to="/sdk/event-list">
              <el-button size="small" class="btn-n-width">取消</el-button>
            </router-link>
          </div>
        </div>
      </el-card>
    </section>
    <section style="margin-top: 20px;">
      <el-row type="flex" align="middle">
        <span class="row-badge" :class="{ disabled: !baseInfo.completed }">2</span>
        <span class="f-16">{{ baseInfo.jt.model == "0" ? "获取JS代码" : "圈选转化元素" }}</span>
      </el-row>
      <el-card
        style="padding-bottom: 50px;position: relative;min-height: 600px;"
        v-if="baseInfo.completed"
      >
        <template v-if="baseInfo.jt.model == '0'">
          <el-row type="flex">
            <span class="gray f-12">请按照如下要求在您的H5页面正确部署转化追踪代码，代码包含基础代码和转化代码两部分</span>
          </el-row>
          <el-row type="flex">
            <span>基础代码：请复制粘贴该代码与网页代码的&lt;head&gt;与&lt;/head&gt;之间</span>
          </el-row>
          <el-row type="flex">
            <pre class="gray code-container">{{ jsText }}</pre>
          </el-row>
          <template v-if="baseInfo.convertTypes.model.value != '1'">
            <el-row>
              <span>转化代码：请复制并粘贴该代码至转化行为中</span>
            </el-row>
            <el-row type="flex">
              <pre class="gray code-container">{{ cjsText }}</pre>
            </el-row>
          </template>
          <el-row>
            <el-button
              type="primary"
              size="small"
              class="btn-n-width ml-50 mr-50"
              @click="eMDownloadJS()"
            >下载代码</el-button>
            <router-link active-class="active" to="/sdk/event-list">
              <el-button
                type="primary"
                size="small"
                class="btn-n-width"
                style="width: 146px;"
              >返回监测事件列表</el-button>
            </router-link>
          </el-row>
        </template>
        <template v-if="baseInfo.jt.model == '1'">
          <div class="xpath">
            <XPathSelector
              :flags="specInfo.flags"
              :tags="specInfo.tags"
              :url="specInfo.screenShotUrl"
              :showTags="showXpathTags"
              :disabled="specInfo.xpathSaveCompleted"
            />
          </div>
          <el-row class="f-15">设置转化信息</el-row>
          <el-row type="flex" align="middle">
            <label class="row-label">转化名称：</label>
            <div class="el-input">
              <el-input
              show-word-limit
                v-model="specInfo.convertName.value"
                placeholder="请使用不同的转化名称，以便区分不同的转化类型"
                size="small"
                maxlength="50"
                @blur="convertNameValidate('specInfo')"
              ></el-input>
              <div class="validate-text">{{ specInfo.convertName.error }}</div>
            </div>
          </el-row>
          <el-row type="flex" align="middle">
            <label class="row-label">转化类型：</label>
            <div class="el-input">
              <el-select
                v-model="specInfo.convertTypes.model.value"
                placeholder="请选择"
                size="small"
                class="el-input"
                @change="convertTypesChange('specInfo')"
              >
                <el-option
                  v-for="item in specInfo.convertTypes.list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div class="validate-text">{{ specInfo.convertTypes.model.error }}</div>
            </div>
          </el-row>
          <!-- 页面访问的时候无需显示转化类型 -->
          <el-row type="flex" v-show="showXpathTags">
            <label class="row-label">元素路径：</label>
            <div style="width: 600px;max-height: 300px;overflow:auto;">
              <el-row type="flex" align="middle" v-for="flag in specInfo.flags" :key="flag.xpath">
                <el-input v-model="flag.xpath" :disabled="true" class="mr-10"></el-input>
                <a v-if="!specInfo.xpathSaveCompleted" class="xpath-del" @click="delXpathItem(flag.xpath)">删除</a>
              </el-row>
            </div>
          </el-row>
          <el-row v-if="specInfo.xpathSaveCompleted">
            <div class="gray f-12">
              <i class="el-icon-warning"></i>
              <span>每个落地页会有唯一的Xpath基础代码，请及时下载并完成部署</span>
              <a @click="eMDownloadJS()" class="light-blue">下载基础代码</a>
            </div>
          </el-row>
          <el-row>
            <a @click="xpathGoback()" class="light-blue">返回上一步</a>
            <router-link active-class="active" to="/sdk/event-list" style="margin-left:30px;">
              <el-button
                type="primary"
                size="small"
                class="btn-n-width"
                style="width: 146px;"
              >返回监测事件列表</el-button>
            </router-link>
            <el-button
              type="primary"
              size="small"
              style="margin: 0 30px;"
              @click="submitSpecInfo()"
              v-if="!specInfo.xpathSaveCompleted"
            >保存</el-button>
          </el-row>
        </template>
      </el-card>
    </section>
    <!-- 新增/修改落地页弹窗 -->
    <el-dialog
      width="30%"
      :visible.sync="baseInfo.dialog.landingPage.visible"
      center
      :title="baseInfo.dialog.landingPage.model.title"
      custom-class="mw-600"
    >
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="5">
          <label>落地页名称：</label>
        </el-col>
        <el-col>
          <el-input
            v-model="baseInfo.dialog.landingPage.model.name.value"
            placeholder="请输入落地页名称"
            :disabled="baseInfo.dialog.landingPage.model.name.readonly"
            show-word-limit
            maxlength="50"
            class="input-show-count"
            @blur="landingPageNameValidate()"
          ></el-input>
          <div class="validate-text">{{ baseInfo.dialog.landingPage.model.name.error }}</div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="5">
          <label>落地页URL：</label>
        </el-col>
        <el-col>
          <el-input
          show-word-limit
          class=" input-show-count-2"
            v-model="baseInfo.dialog.landingPage.model.url.value"
            placeholder="请输入落地页URL"
            :disabled="baseInfo.dialog.landingPage.model.url.readonly"
            maxlength="2048"
            @blur="landingPageUrlValidate()"
          ></el-input>
          <div class="validate-text">{{ baseInfo.dialog.landingPage.model.url.error }}</div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button
          @click="baseInfo.dialog.landingPage.visible = false"
          class="btn-n-width mr-20"
        >取 消</el-button>
        <el-button type="primary" @click="landingPageOk()" class="btn-n-width">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="30%"
      :visible.sync="baseInfo.dialog.landingPageDel.visible"
      center
      title="删除落地页"
    >
      <el-row type="flex" justify="center" align="middle">
        <span class="body-warning"></span>
        <span>确定删除此落地页?</span>
      </el-row>
      <div slot="footer">
        <el-button @click="baseInfo.dialog.landingPageDel.visible = false">取 消</el-button>
        <el-button type="primary" @click="landingPageDelOk()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { data } from "./data.Create";
import XPathSelector from "../../components/XPathSelector";
import {
  apiLPAdd,
  apiLPList,
  apiLPUpdate,
  apiLPDelete,
  apiEMAdd,
  apiEMDownloadJS,
  screenShot4xpath,
  getNameisUniq
} from "../../plugins/api";
export default {
  components: { XPathSelector },
  data: function() {
    return {
      ...data(),
    };
  },
  computed: {
    showXpathTags () {
      return this.specInfo.convertTypes.model.value != 1
    },
    jsText: function() {
      return this.specInfo.jsText({
        pid: this.baseInfo.landingPages.model.value,
        jt: this.baseInfo.jt.model
      });
    },
    cjsText: function() {
      return this.specInfo.cjsText(
        {
          id: this.baseInfo.eid,
          tid: this.baseInfo.convertTypes.model.value
        },
        "",
        this.baseInfo.convertTypes.model.label
      );
    }
  },
  methods: {
    landingPage: function(lp) {
      let title = "新建落地页",
        id = "",
        name = { value: "", readonly: false, error: "" },
        url = { value: "", readonly: false, error: "" },
        model = this.baseInfo.dialog.landingPage.model;
      if (lp) {
        title = "修改落地页";
        name.value = lp.name;
        url.value = lp.url;
        id = lp.id;
        url.readonly = true;
      }
      Object.assign(model, { title, name, url, id });
      this.baseInfo.dialog.landingPage.visible = true;
    },
    landingPageNameValidate: async function() {
      console.log('check')
      let landingPageModel = this.baseInfo.dialog.landingPage.model;
      if (landingPageModel.name.value.length === 0) {
        landingPageModel.name.error = "落地页名称不能为空";
      } else if (landingPageModel.name.value.length > 50) {
        landingPageModel.name.error = "最多支持50个字段长度";
      } else {
        const nameIsExist = await getNameisUniq(landingPageModel.name.value)
        if (nameIsExist) {
          landingPageModel.name.error = "落地页名称已存在";
        } else {
          landingPageModel.name.error = "";
        }
      }
    },
    landingPageUrlValidate: function() {
      let landingPageModel = this.baseInfo.dialog.landingPage.model;
      if (landingPageModel.url.value.length === 0) {
        landingPageModel.url.error = "落地页URL不能为空";
      } else if (
        !/^(https?:)?\/\/(\w+\.){1,}\w+/.test(landingPageModel.url.value)
      ) {
        landingPageModel.url.error = "请输入正确的URL地址";
      } else {
        landingPageModel.url.error = "";
      }
    },
    landingPageOk: async function() {
      let landingPageModel = this.baseInfo.dialog.landingPage.model;
      await this.landingPageNameValidate();
      this.landingPageUrlValidate();
      if (landingPageModel.name.error || landingPageModel.url.error) return;
      if (landingPageModel.id) {
        apiLPUpdate({
          id: landingPageModel.id,
          name: landingPageModel.name.value,
          url: landingPageModel.url.value
        }).then(() => {
          this.baseInfo.dialog.landingPage.visible = false;
          this.$message({
            message: "落地页修改成功",
            type: "success"
          });
          let index = this.baseInfo.landingPages.list.findIndex(
            e => e.id == landingPageModel.id
          );
          if (index > -1) {
            Object.assign(this.baseInfo.landingPages.list[index], {
              name: landingPageModel.name.value,
              url: landingPageModel.url.value
            });
            this.landingPageChange();
          }
        });
        return;
      }
      apiLPAdd({
        url: landingPageModel.url.value,
        name: landingPageModel.name.value
      })
        .then(rs => {
          this.baseInfo.dialog.landingPage.visible = false;
          this.$message({
            message: "落地页创建成功",
            type: "success"
          });
          apiLPList().then(r => {
            this.baseInfo.landingPages.list.length = 0;
            this.baseInfo.landingPages.list.push(...r);
          });
        })
        .finally(res => {
          this.$store.dispatch("getLandingPages");
        });
    },
    landingPageDelOk: function() {
      let lp = this.baseInfo.dialog.landingPageDel.model;
      this.baseInfo.dialog.landingPageDel.visible = false;
      apiLPDelete({ id: lp.id })
        .then(() => {
          let index = this.baseInfo.landingPages.list.findIndex(e => e == lp);
          if (index > -1) {
            if (this.baseInfo.landingPages.model.value === lp.id)
              this.baseInfo.landingPages.model.value = null;
            this.baseInfo.landingPages.list.splice(index, 1);
          } else {
            this.baseInfo.landingPageUrl = "";
          }
          this.$message({
            message: "落地页删除成功",
            type: "success"
          });
        })
        .catch(r => {
          this.$message({
            message: r.message
          });
        })
        .finally(res => {
          this.$store.dispatch("getLandingPages");
        });
    },
    landingPageDel: function(lp) {
      if (!lp.deleteFlag) {
        this.$message({
          message: "落地页已经被监控事件使用，不能删除"
        });
        return;
      }
      this.baseInfo.dialog.landingPageDel.visible = true;
      this.baseInfo.dialog.landingPageDel.model = lp;
    },
    landingPageChange: function() {
      let landingPages = this.baseInfo.landingPages;
      let index = landingPages.list.findIndex(
        e => e.id == landingPages.model.value
      );
      if (index > -1) {
        this.baseInfo.landingPageUrl = landingPages.list[index].url;
      } else {
        this.baseInfo.landingPageUrl = "";
      }
      this.landingPagesModelValidate();
    },
    landingPagesModelValidate: function() {
      if (!this.baseInfo.landingPages.model.value) {
        this.baseInfo.landingPages.model.error = "请选择落地页";
      } else {
        this.baseInfo.landingPages.model.error = "";
      }
    },
    convertNameValidate: function(module) {
      if (this[module].convertName.value.length == 0) {
        this[module].convertName.error = "请填写转化名称";
      } else {
        this[module].convertName.error = "";
      }
    },
    convertTypesValidate: function(module) {
      if (this[module].convertTypes.model.value.length == 0) {
        this[module].convertTypes.model.error = "请选择转化类型";
      } else {
        this[module].convertTypes.model.error = "";
      }
    },
    sreenShot: function() {
      screenShot4xpath({ url: this.specInfo.website })
        .then(e => {
          this.specInfo.screenShotUrl = e.imgUrl;
          this.specInfo.tags.push(...e.elements);
        })
        .catch(e => {
          this.$message.error(e);
        });
    },
    submitBaseInfo: function() {
      this.landingPagesModelValidate();
      if (!this.baseInfo.landingPages.model.error) {
        if (this.baseInfo.jt.model == "0") {
          this.convertNameValidate("baseInfo");
          this.convertTypesValidate("baseInfo");
          if (
            !this.baseInfo.convertTypes.model.error &&
            !this.baseInfo.convertName.error
          ) {
            apiEMAdd({
              mode: this.baseInfo.jt.model,
              conversionName: this.baseInfo.convertName.value,
              conversionType: this.baseInfo.convertTypes.model.value,
              landingPageId: this.baseInfo.landingPages.model.value
            }).then(r => {
              this.baseInfo.completed = true;
              this.baseInfo.eid = r;
            });
          }
        } else {
          this.baseInfo.completed = true;
          this.specInfo.website = this.baseInfo.landingPages.list.find(
            e => e.id == this.baseInfo.landingPages.model.value
          ).url;
          this.sreenShot();
        }
      }
    },
    submitSpecInfo: function() {
      this.convertNameValidate("specInfo");
      this.convertTypesValidate("specInfo");
      if (
        !this.specInfo.convertTypes.model.error &&
        !this.specInfo.convertName.error
      ) {
        if (this.specInfo.flags.length <= 0) {
          this.$message.warning("请圈选元素");
          return;
        }
        apiEMAdd({
          mode: this.baseInfo.jt.model,
          conversionName: this.specInfo.convertName.value,
          conversionType: this.specInfo.convertTypes.model.value,
          landingPageId: this.baseInfo.landingPages.model.value,
          elementUrls: this.specInfo.flags.map(e => e.xpath).join(";")
        }).then(r => {
          this.$message.success("保存成功");
          this.specInfo.xpathSaveCompleted = true;
          this.baseInfo.eid = r;
        });
      }
    },
    eMDownloadJS: function() {
      apiEMDownloadJS({
        id: this.baseInfo.eid,
        js: this.jsText,
        cjs:
          this.baseInfo.convertTypes.model.value != "1" &&
          this.baseInfo.jt.model == "0"
            ? this.cjsText
            : ""
      });
    },
    convertTypesChange: function(module) {
      this[module].convertTypes.model.label = this[
        module
      ].convertTypes.list.find(
        e => e.value == this[module].convertTypes.model.value
      ).label;
      this.convertTypesValidate(module);
    },
    delXpathItem: function(xpath) {
      let i = this.specInfo.flags.findIndex(e => e.xpath == xpath);
      if (i > -1) {
        this.specInfo.flags.splice(i, 1);
      }
    },
    xpathGoback: function() {
      this.baseInfo.completed = false;
      Object.assign(this.specInfo.convertName, { value: "", error: "" });
      Object.assign(this.specInfo.convertTypes.model, {
        value: "",
        label: "",
        error: ""
      });
      Object.assign(this.specInfo, {
        website: "",
        screenShotUrl: "",
        flags: [],
        tags: [],
        xpathSaveCompleted: false
      });
    }
  },
  mounted: function() {
    apiLPList().then(r => {
      this.baseInfo.landingPages.list.length = 0;
      this.baseInfo.landingPages.model.value = null;
      this.baseInfo.landingPages.list.push(...r);
    });
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-input {
  max-width: 408px;
}
.row-label {
  width: 100px;
  text-align: right;
  color: black !important;
  font-size: 14px;
}
.row-badge {
  width: 40px;
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: #409eff;
  border-radius: 200px;
  color: white;
  margin-right: 18px;
  border: 2px solid transparent;
  &.disabled {
    background: transparent;
    border-color: rgba(172, 172, 172, 1);
    color: #acacac;
  }
}
.desp {
  margin-left: 20px;
  font-size: 12px;
}
.code-container {
  border-radius: 4px;
  border: 1px solid rgba(216, 220, 230, 1);
  min-width: 630px;
  padding: 14px 10px;
  margin: 0;
}
.xpath {
  position: absolute;
  left: 830px;
  z-index: 100;
}
.xpath-del {
  color: blue;
  cursor: pointer;
}
</style>
<style lang="scss">
.page-sdk-create{
  .input-show-count{
    input{
      padding-right: 50px !important;
    }
  }
  .input-show-count-2{
    input{
      padding-right: 80px !important;
    }
  }
}
</style>