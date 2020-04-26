<template>
  <div class="main">
    <el-card>
      <el-row class="gray f-12">
        页面质量评分帮您检测指定地址中页面在不同网络环境中的可访问性，并给出可访问性计分与改善建议。
        <br />
        <br />-高分值：表示该页面用户访问时，流畅度体验度更佳，可以带来更高的转化率。
        <br />
        <br />-较低分值：您可以根据页面给出的改善建议，优化您的页面以便提高分值。
        <br />
        <br />
      </el-row>
      <el-row type="flex" class="inputs">
        <el-button type="primary" size="small" @click="openNewTaskDialog()">
          <span>+</span>
          新建检测任务
        </el-button>
      </el-row>
      <el-row>
        <el-table :data="tableList.rows" v-loading="loadings">
          <el-table-column
            v-for="item in tableList.columns"
            :key="item.id"
            :prop="item.id"
            :label="item.name"
            :width="item.width"
          >
            <template slot-scope="scope">
              <template
                v-if="scope.column.property == 'score'"
              >{{scope.row['statusStr'] === '已完成' ? scope.row.score : '--'}}</template>
              <template v-else><span class="text-ellipsis" :title="scope.row[item.id]">{{ scope.row[item.id] }}</span></template>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header">操作</template>
            <template slot-scope="scope">
              <div class="op-link-group">
                <router-link
                  v-if="scope.row['statusStr'] === '已完成'"
                  :to="'/performance/task/' + scope.row.id"
                >
                  <span class="op-link">查看</span>
                </router-link>
                <span v-else class="op-link disabled">查看</span>
                <!-- <a class="op-link">查看</a> -->
                <a class="op-link" @click="openListItemDialog(scope.row)">删除</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-20">
          <el-pagination
            @size-change="getTableData(true)"
            @current-change="getTableData(false)"
            :page-sizes="[10, 20, 50, 100]"
            :page-size.sync="tableList.page.size"
            :current-page.sync="tableList.page.current"
            layout="total, sizes, jumper,pager"
            :total="tableList.page.total"
          ></el-pagination>
        </div>
      </el-row>
    </el-card>
    <el-dialog
      width="30%"
      :visible.sync="newTaskDialog.visible"
      center
      title="新建检测任务"
      custom-class="mw-600"
    >
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="5">
          <label>落地页地址：</label>
        </el-col>
        <el-col>
          <el-input
            v-model="newTaskDialog.pageUrl.model"
            placeholder="请输入落地页地址"
            class="input-show-count"
            @blur="pageUrlBlur()"
            size="small"
            maxlength="2048"
          ></el-input>
          <div class="validate-text">{{ newTaskDialog.pageUrl.error }}</div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" class="mt-20">
        <el-col :span="5">
          <label>任务名称：</label>
        </el-col>
        <el-col>
          <el-input
            v-model="newTaskDialog.pageName.model"
            placeholder="仅用于管理后续的快速查找，可不填"
            class="input-show-count"
            size="small"
            maxlength="50"
          ></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" class="mt-20">
        <el-col :span="5">
          <label>网络环境：</label>
        </el-col>
        <el-col>
          <el-radio-group v-model="newTaskDialog.net.model" @change="netChange()" size="small">
            <el-radio-button
              :label="item.value"
              :key="item.value"
              v-for="item in newTaskDialog.net.list"
            >{{item.label}}</el-radio-button>
          </el-radio-group>
          <div class="validate-text">{{ newTaskDialog.net.error }}</div>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" class="mt-20">
        <el-col :span="5">
          <label>操作系统：</label>
        </el-col>
        <el-col>
          <el-radio-group v-model="newTaskDialog.os.model" @change="osChange()" size="small">
            <el-radio-button
              :label="item.value"
              :key="item.value"
              v-for="item in newTaskDialog.os.list"
            >{{item.label}}</el-radio-button>
          </el-radio-group>
          <div class="validate-text">{{ newTaskDialog.os.error }}</div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="newTaskDialog.visible = false" class="btn-n-width mr-20">取 消</el-button>
        <el-button type="primary" @click="newTaskSave()" class="btn-n-width">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog width="30%" :visible.sync="listItemDialog.visible" center title="删除检测任务">
      <el-row type="flex" justify="center" align="middle">
        <span class="body-warning"></span>
        <span>确定删除此任务?</span>
      </el-row>
      <div slot="footer">
        <el-button @click="listItemDialog.visible = false" class="mr-30">取 消</el-button>
        <el-button type="primary" @click="listItemDialogOk()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { data } from "./data.List";

import {
  apiScoreList,
  apiScoreAddTask,
  apiScoreDelete
} from "../../plugins/api";
export default {
  data: function() {
    return {
      ...data()
    };
  },
  methods: {
    getTableData: function(c) {
      this.loading = true;
      if (c) {
        this.tableList.page.current = 1;
      }
      apiScoreList({
        current: this.tableList.page.current,
        limit: this.tableList.page.size
      }).then(r => {
        this.tableList.page.total = r.total;
        this.tableList.rows.length = 0;
        this.tableList.rows.push(...r.list);
      })
      .finally(res => {
        this.loading = false;
      })
    },
    pageUrlBlur: function() {
      this.newTaskDialog.pageUrl.validate();
    },
    netChange: function() {
      this.newTaskDialog.net.validate();
    },
    osChange: function() {
      this.newTaskDialog.os.validate();
    },
    openNewTaskDialog: function() {
      this.newTaskDialog.visible = true;
      this.newTaskDialog.reset();
    },
    newTaskSave: function() {
      if (this.newTaskDialog.validate()) {
        let task = this.newTaskDialog;
        this.newTaskDialog.visible = false;
        apiScoreAddTask({
          url: task.pageUrl.model,
          name: task.pageName.model,
          os: task.os.model,
          netEnv: task.net.model
        })
          .then(e => {
            this.getTableData(true);
            this.$message.success("创建成功");
          })
          .catch(e => {
            this.$message.error(e);
          });
      }
    },
    openListItemDialog: function(listItem) {
      this.listItemDialog.visible = true;
      this.listItemDialog.model = listItem;
    },
    listItemDialogOk: function() {
      this.listItemDialog.visible = false;
      console.log(this.listItemDialog.model.id);
      apiScoreDelete({
        id: this.listItemDialog.model.id
      })
        .then(e => {
          this.getTableData(true);
          this.$message.success("删除成功");
        })
        .catch(msg => {
          this.$message.error(msg);
        });
    }
  },
  created: function() {
    this.getTableData(true);
  }
};
</script>

<style lang="scss" scoped>
.main {
  .inputs {
    margin-top: 7px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
}
</style>
