<template>
  <div>
    <div class="main">
      <el-card>
        <el-row type="flex" class="inputs" align="middle">
          <div>
            <label>落地页：</label>
            <el-select
              v-model="landingPages.model"
              placeholder="请选择"
              class="search-input mr-30"
              size="small"
            >
              <el-option
                v-for="item in landingPages.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="mr-30">
            <label>指标：</label>
            <el-radio-group v-model="quantification.model">
              <el-radio
                v-for="item in quantification.list"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </div>
          <div>
            <label>日期：</label>
            <el-date-picker
              :clearable="false"
              style="width:250px;"
              type="daterange"
              v-model="dateRange"
              :pickerOptions="pickerOptions"
              align="right"
              placeholder="选择日期"
              size="small"
              format="yyyy.MM.dd"
              class="mr-30"
            ></el-date-picker>
            <el-button :disabled="loading" type="primary" @click="search()" class="mr-10 btn-n-width" size="small">查询</el-button>
          </div>
        </el-row>
        <el-row type="flex">
          <el-col class="area-map" v-loading="loading">
            <map-chart :data="charts"></map-chart>
          </el-col>
          <el-col class="area-tops">
            <div class="title">省份/城市TOP10排名</div>
            <el-tabs v-model="topTabIndex" @tab-click="topTabClick">
              <el-tab-pane
                :label="tab.label"
                :name="tab.name"
                v-for="tab in topTabs"
                :key="tab.name"
              >
                <ul v-loading="loading">
                  <template v-if="tab.rows.length > 0">
                    <li v-for="row in tab.rows" :key="row.code">
                      <el-row type="flex" class="top-row" align="middle">
                        <span class="label">{{row.name}}</span>
                        <div class="percent" :style="{'width': row.width}"></div>
                        <span class="value">{{row.value | numFormat}}</span>
                      </el-row>
                    </li>
                  </template>
                  <template v-else>
                    <li>
                      <el-row class="top-row data-none">暂无数据</el-row>
                    </li>
                  </template>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="mt-10">
        <el-row>
          <el-button type="primary" size="small" @click="exportCSV()" class="export-csv">导出CSV</el-button>
          <el-tabs v-model="tabIndex" @tab-click="tabClick">
            <el-tab-pane :label="tab.label" :name="tab.name" v-for="tab in tabs" :key="tab.name">
              <el-row>
                <el-table v-loading="loading" :data="tab.rows" @sort-change="sortChange">
                  <el-table-column
                    v-for="item in tab.columns"
                    :key="item.id"
                    :prop="item.id"
                    :label="item.name"
                    :sortable="item.sortable"
                    :width="item.width"
                  >
                    <template slot-scope="scope">
                      <template
                        v-if="item.numberFormat"
                      >{{ scope.row[item.id] | numFormat(item.fixedFormat) }}{{item.unit}}</template>
                      <template v-else>{{ scope.row[item.id] }}</template>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="page">
                  <el-pagination
                    @size-change="getTableData(true)"
                    @current-change="getTableData(false)"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size.sync="tab.page.size"
                    :current-page.sync="tab.page.current"
                    layout="total, sizes, jumper,pager"
                    :total="tab.page.total"
                  ></el-pagination>
                </div>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import MapChart from "../../components/MapChart";
import { data, MOCKDATA } from "./data.area";
import {
  apiAList,
  apiATopList,
  apiAViews,
  apiLPList,
  apiAExport
} from "../../plugins/api";
import format from "date-fns/format";
export default {
  components: { MapChart },
  data: function() {
    return {
      ...data(this)
    };
  },
  methods: {
    tabClick: function() {
      this.aList();
    },
    topTabClick: function() {
      this.aTopList();
    },
    aList: function() {
      let { condition, page, rows } = this.getCondition();
      return apiAList(condition).then(e => {
        page.total = e.total;
        rows.length = 0;
        rows.push(...e.list);
      });
    },
    aTopList: function() {
      let { condition, topTab } = this.getCondition();
      topTab.rows.length = 0;
      return apiATopList(
        Object.assign({}, condition, { groupQuota: condition.topGroupQuota })
      ).then(e => {
        topTab.rows.length = 0;
        let maxValue = Math.max(...e.map(x => x.value), 1);
        let maxWidth = 100;
        e.forEach(
          x => (x.width = Math.round(x.value * maxWidth) / maxValue + "px")
        );
        topTab.rows.push(...e);
      });
    },
    aViews: function() {
      let { condition, page, rows, quantification } = this.getCondition();
      return apiAViews(condition).then(e => {
        // e.forEach(x => x.value = Math.random() * 10000);
        this.charts = {
          seriesName: quantification.label,
          seriesData: [...e, { name: "南海诸岛", value: 0 }]
        };
      });
    },
    search: function() {
      this.loading = true;
      Promise.all([
        this.aViews(),
        this.aTopList(),
        this.getTableData(true),
      ]).finally(res => {
        this.loading = false;
      })
    },
    getTableData: function(c) {
      let { page } = this.getCondition();
      if (c) {
        page.current = 1;
      }
      return this.aList();
    },
    getCondition: function() {
      let tab = this.tabs.find(e => e.name == this.tabIndex),
        topTab = this.topTabs.find(e => e.name == this.topTabIndex);
      let quantification = this.quantification.list.find(
        e => e.value == this.quantification.model
      );
      let { page, rows, order } = tab;
      let args = {
        current: page.current,
        limit: page.size,
        landingPageId: this.landingPages.model,
        sort: order.sort,
        dir: order.dir,
        quota: quantification.value,
        groupQuota: this.tabIndex,
        startTime: format(this.dateRange[0], "yyyy-MM-dd"),
        endTime: format(this.dateRange[1], "yyyy-MM-dd"),
        topGroupQuota: this.topTabIndex
      };
      return {
        tab,
        topTab,
        quantification,
        page,
        rows,
        order,
        condition: args
      };
    },
    exportCSV: function() {
      apiAExport(this.getCondition().condition);
    },
    sortChange: function(a) {
      let { page, order } = this.getCondition();
      page.current = 1;
      Object.assign(order, {
        sort: a.prop,
        dir: (a.order || "").replace("ending", "")
      });
      this.aList();
    }
  },
  mounted: function() {
    apiLPList().then(e => {
      this.landingPages.list.length = 0;
      this.landingPages.list.push(
        ...e.map(x => ({ label: x.name, value: x.id }))
      );
      this.landingPages.model = this.landingPages.list[0].value;
      this.search();
    });
  }
};
</script>
<style lang="scss" scoped>
.inputs{
  margin-top: 7px;
}
.top-row {
  margin-bottom: 13px;
  .label,
  .value {
    font-size: 12px;
  }
  .percent {
    background: linear-gradient(90deg, white, #1583e4);
    border-radius: 5px;
    height: 6px;
    margin: 0 12px;
  }
}
.el-tabs__header {
  display: inline-block;
}
.area-map {
  width: 700px;
  flex-shrink: 0;
}
.area-tops {
  padding: 50px;
  .title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
    margin-bottom: 14px;
  }
}
.export-csv {
  position: absolute;
  right: 0;
  z-index: 10;
}
</style>
