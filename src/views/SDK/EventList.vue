<template>
  <div>
    <div class="main">
      <el-card>
        <el-row type="flex" class="inputs">
          <router-link active-class="active" to="/sdk/create">
            <el-button type="primary" size="small">
              <span>+</span>
              添加监测事件
            </el-button>
          </router-link>
          <section style="margin-left: auto">
            <el-select
              v-for="select in selects"
              :key="select.key"
              v-model="select.value"
              placeholder="请选择"
              class="search-input mr-10"
              size="small"
            >
              <el-option
                v-for="item in select.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              placeholder="落地页名称/事件名称"
              v-model="eventInput"
              class="search-input mr-10"
              size="small"
              maxlength="50"
            ></el-input>
            <el-date-picker
              :clearable="false"
              style="width:250px;margin-right:20px;"
              type="daterange"
              v-model="dateRange"
              :pickerOptions="pickerOptions"
              align="right"
              placeholder="选择日期"
              size="small"
              format="yyyy.MM.dd"
            ></el-date-picker>
            <el-button type="primary" @click="search()" class="mr-10 btn-n-width" size="small">查询</el-button>
          </section>          
        </el-row>
        <el-row>
          <CustomColumn :states="customStates" :groups="customGroups" @hidden="customHidden"></CustomColumn>
        </el-row>
        <div>
          <el-table :data="tableData" style="width: 100%">
            <template v-for="column in tableColumns">
              <el-table-column
                :key="column"
                :prop="column"
                :label="customStates[column].name"
                v-if="customStates[column].checked"
                :width="customStates[column].width"
                :min-width="customStates[column].minWidth"
              >
                <template slot-scope="scope" slot="header">
                  <div style="padding-left:25px;padding-right: 25px;">
                    {{ scope.column.label }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      placement="bottom"
                      v-if="scope.column.property == 'status'"
                      popper-class="c-tooltip"
                    >
                      <div slot="content">
                        未活跃：当前转化事件还没有收集到转化数据
                        <br />活跃：当前转化事件已收集到转化数据
                        <br />已删除：已删除的转化事件不能二次修改，但是数据可正常上报
                      </div>
                      <i class="icon-question"></i>
                    </el-tooltip>
                  </div>
                </template>
                <template slot-scope="scope">
                  <section style="padding-left: 20px;padding-right: 20px;">
                    <section
                      v-if="scope.column.property == 'conversionName'"
                      class="conversion-name"
                    >
                      <template v-if="conversionNameEdition.id == scope.row.id">
                        <input
                          type="text"
                          v-model="conversionNameEdition.value"
                          class="conversion-name-text"
                          maxlength="50"
                        />
                        <el-button
                          @click="cancelConversionName(scope.row)"
                          class="conversion-btn"
                          style="margin-left: 10px;"
                        >取 消</el-button>
                        <el-button
                          type="primary"
                          @click="saveConversionName(scope.row)"
                          class="conversion-btn"
                        >保 存</el-button>
                      </template>
                      <template v-else>
                        <span class="conversion-name-text">{{ scope.row.conversionName }}</span>
                        <i
                          class="el-icon-edit"
                          @click="editConversionName(scope.row)"
                          style="margin-left: 10px;vertical-align: super;"
                        ></i>
                      </template>
                    </section>
                    <section v-else-if="scope.column.property == 'status'">
                      <span
                        v-if="scope.row.status == '活跃'"
                        class="status active"
                      >{{ scope.row.status }}</span>
                      <span
                        v-else-if="scope.row.status == '未活跃'"
                        class="status unactive"
                      >{{ scope.row.status }}</span>
                      <span v-else class="status">
                        <span class="dot">·</span>
                        {{ scope.row.status }}
                      </span>
                    </section>
                    <section v-else-if="scope.column.property == 'operate'" class="op-link-group">
                      <span class="op-link" @click="seeConfigs(scope.row)">查看设置</span>
                      <span
                        :class="{
                        'op-link': true,
                        disabled: scope.row.status == '已删除'
                      }"
                        @click="del(scope.row)"
                      >删除</span>
                      <span class="op-link">
                        <router-link active-class="active" :to="'/sdk/event-list/' + scope.row.qs">
                          <span class="op-link">查看数据</span>
                        </router-link>
                      </span>
                    </section>
                    <section v-else class="text-ellipsis" :title="scope.row[scope.column.property]">
                      <template
                        v-if="
                        scope.column.property == 'browse' ||
                          scope.column.property == 'conversionAmount' ||
                          scope.column.property == 'visitor'
                      "
                      >{{ scope.row[scope.column.property] | numFormat }}</template>
                      <template v-else>{{ scope.row[scope.column.property] }}</template>
                    </section>
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
    </div>
    <el-dialog width="30%" :visible.sync="dialog.config.visible" center title="查看设置详情">
      <el-row type="flex" class="mb-10">
        <el-col :span="6" class="text-right text-black flex-shrink-0">
          <label class="text-ellipsis">事件ID：</label>
        </el-col>
        <span>{{ dialog.config.model.id }}</span>
      </el-row>
      <el-row type="flex" class="mb-10">
        <el-col :span="6" class="text-right text-black flex-shrink-0">
          <label>监测方式：</label>
        </el-col>
        <span class="text-ellipsis">{{ dialog.config.model.mode }}</span>
      </el-row>
      <el-row type="flex" class="mb-10">
        <el-col :span="6" class="text-right text-black flex-shrink-0">
          <label>事件名称：</label>
        </el-col>
        <span class="text-ellipsis">
          {{
          dialog.config.model.conversionName
          }}
        </span>
      </el-row>
      <el-row type="flex" class="mb-10">
        <el-col :span="6" class="text-right text-black flex-shrink-0">
          <label>监测类型：</label>
        </el-col>
        <span class="text-ellipsis">{{ dialog.config.model.mode }}</span>
      </el-row>
      <el-row type="flex" class="mb-10">
        <el-col :span="6" class="text-right text-black flex-shrink-0">
          <label>落地页ID：</label>
        </el-col>
        <span class="text-ellipsis">
          {{
          dialog.config.model.landingPageId
          }}
        </span>
      </el-row>
      <el-row type="flex" class="mb-10">
        <el-col :span="6" class="text-right text-black flex-shrink-0">
          <label>落地页名称：</label>
        </el-col>
        <span
          class="text-ellipsis"
          :title="dialog.config.model.landingPageName"
        >{{ dialog.config.model.landingPageName }}</span>
      </el-row>
      <el-row type="flex" class="mb-10">
        <el-col :span="6" class="text-right text-black flex-shrink-0">
          <label>落地页URL：</label>
        </el-col>
        <a
          :href="dialog.config.model.url"
          target="_blank"
          class="text-ellipsis light-blue"
          :title="dialog.config.model.url"
        >{{ dialog.config.model.url }}</a>
      </el-row>
      <el-row type="flex" class="mb-10" v-if="dialog.config.model.elementUrlList">
        <el-col :span="6" class="text-right text-black flex-shrink-0">
          <label>元素路径：</label>
        </el-col>
        <el-col>
          <div v-for="item in dialog.config.model.elementUrlList" :key="item">{{item}}</div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="dialog.config.visible = false" class="btn-n-width">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog width="30%" :visible.sync="dialog.del.visible" center title="删除落地页">
      <el-row type="flex" justify="center" align="middle">
        <span class="body-warning"></span>
        <span>该事件删除后，不能二次修改，您确定要删除？</span>
      </el-row>
      <div slot="footer">
        <el-button @click="dialog.del.visible = false" class="mr-30">取 消</el-button>
        <el-button type="primary" @click="dialogOk('del')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="30%" :visible.sync="dialog.eventName.visible" center title="修改事件名称">
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="4">
          <label>事件名称：</label>
        </el-col>
        <el-col>
          <el-input
            v-model="dialog.eventName.model.conversionName.value"
            placeholder="请输入事件名称"
            maxlength="50"
            show-word-limit
          ></el-input>
          <div class="validate-text">{{ dialog.eventName.model.conversionName.error }}</div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="dialog.eventName.visible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOk('eventName')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CustomColumn from "../../components/CustomColumn";
import { apiEMList, apiEMDelete, apiEMUpdate } from "../../plugins/api";
import { data } from "./data.EventList";
import format from "date-fns/format";
export default {
  components: {
    CustomColumn
  },
  data() {
    let _self = this;
    return {
      ...data(_self)
    };
  },
  methods: {
    customHidden: function() {
      let s = JSON.stringify(this.customStates);
      localStorage["eventListCustomStates"] = s;
    },
    seeConfigs: function(row) {
      this.dialog.config.visible = true;
      Object.assign(this.dialog.config.model, row);
    },
    del: function(row) {
      if (row.status == "活跃") {
        this.$message.error("该落地页下已有监测任务，不能删除。");
        return;
      }
      this.dialog.del.visible = true;
      this.dialog.del.model.id = row.id;
    },
    modifyName: function(row) {
      this.dialog.eventName.visible = true;
      this.dialog.eventName.model.conversionName.value = row.conversionName;
      this.dialog.eventName.model.id.value = row.id;
    },
    eMList: function() {
      let { selects, dateRange } = this;
      let mode = (selects.find(e => e.key == "mode") || { value: -1 }).value;
      let status = selects.find(e => e.key == "status").value;
      let args = {
        paramsName: this.eventInput,
        startTime: format(dateRange[0], "yyyy-MM-dd 00:00:00"),
        endTime: format(dateRange[1], "yyyy-MM-dd 23:59:59"),
        current: this.page.current,
        size: this.page.size
      };
      if (mode != -1) {
        args.mode = mode;
      }
      if (status != -1) {
        args.status = status;
      }
      apiEMList(args).then(rs => {
        this.tableData.length = 0;
        this.tableData.push(...rs.list);
        this.tableData.forEach(
          e => (
            (e.qs = `${e.landingPageId}-${e.conversionType}-${e.id}`),
            (e.createTime = format(
              new Date(e.createTime),
              "yyyy-MM-dd HH:mm:ss"
            ))
          )
        );
        this.page.total = rs.total;
      });
    },
    search: function() {
      this.eMList();
    },
    getTableData: function(c) {
      if (c) {
        this.page.current = 1;
      }
      this.eMList();
    },
    dialogOk: function(key) {
      let model = this.dialog[key].model;
      if (key === "del") {
        apiEMDelete(model.id).then(() => {
          this.$message.success("删除成功");
          this.eMList();
        });
        this.dialog[key].visible = false;
      }
    },
    editConversionName: function(row) {
      this.conversionNameEdition.id = row.id;
      this.conversionNameEdition.value = row.conversionName;
    },
    cancelConversionName: function(row) {
      this.conversionNameEdition.id = "";
    },
    saveConversionName: function(row) {
      if (this.conversionNameEdition.value.length <= 0) {
        this.$message.error("请输入事件名称"); 
        return;
      }
      this.conversionNameEdition.id = "";
      apiEMUpdate({
        id: row.id,
        conversionName: this.conversionNameEdition.value
      }).then(() => {
        row.conversionName = this.conversionNameEdition.value;
        this.$message.success("修改名称成功");
      });
    }
  },
  beforeMount: function() {
    Object.assign(
      this.customStates,
      JSON.parse(localStorage["eventListCustomStates"] || "{}")
    );
    this.customGroups.forEach(cg => {
      let checkedCount = cg.children.filter(e => this.customStates[e].checked).length;
      cg.isIndeterminate = checkedCount > 0 && checkedCount < cg.children.length;
    });
  },
  mounted: function() {
    this.eMList();
  }
};
</script>

<style lang="scss" scoped>
.main {
  .inputs {
    margin-top: 7px;
    margin-bottom: 20px;
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
.el-icon-edit {
  cursor: pointer;
  margin: 0 5px;
}
.conversion-name {
  white-space: nowrap;
  .el-icon-edit {
    visibility: hidden;
  }
}
.el-table__row:hover .conversion-name {
  .el-icon-edit {
    visibility: visible;
  }
}
.status {
  &.unactive {
    color: #e38d00;
  }
  &.active {
    color: #5fb600;
  }
  .dot {
    font-size: 26px;
    margin-right: 4px;
    vertical-align: sub;
  }
}
.conversion-name-text {
  width: 100px;
  padding: 0 2px;
  display: inline-block;
  border-radius: 2px;
  height: 22px;
  &[type="text"] {
    border: 1px solid rgba(232, 232, 232, 1);
  }
}
span.conversion-name-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.conversion-btn {
  width: 50px;
  height: 22px;
  border-radius: 2px;
  border: 1px solid rgba(182, 217, 252, 1);
  padding: 0;
  font-size: 12px;
}
</style>
