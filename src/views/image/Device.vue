<template>
  <div>
    <div class="main">
      <el-card>
        <el-row type="flex" class="inputs">
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
        <el-row  v-loading="loading">
          <el-tabs v-model="tabIndex" @tab-click="tabClick">
            <el-tab-pane :label="tab.label" :name="tab.name" v-for="tab in tabs" :key="tab.name">
              <el-row type="flex">
                <el-radio-group
                  v-model="tab.quantification.model"
                  @change="quantificationChange(tab)"
                >
                  <el-radio
                    v-for="item in tab.quantification.list"
                    :key="item.value"
                    :label="item.value"
                  >{{ item.label }}</el-radio>
                </el-radio-group>
              </el-row>
              <el-row type="flex" style="margin-top: 20px;" justify="center">
                <div class="chart-region">
                  <div class="chart-title">{{tab.charts.titleText}}</div>
                  <template v-if="tab.charts.seriesData.length <= 0">
                    <div class="text-center mt-50">
                      <img src="../../assets/images/init_icon_1.png" alt />
                      <div class="mt-10 data-none">暂无数据</div>
                    </div>
                  </template>
                  <template v-else>
                    <PieChart :data="tab.charts"></PieChart>
                  </template>
                </div>
                <div class="top-list">
                  <div class="legend">{{ tab.tops.legend }}</div>
                  <el-table :data="tab.tops.rows">
                    <el-table-column label="序号" type="index"></el-table-column>
                    <el-table-column
                      v-for="item in tab.tops.columns"
                      :key="item.id"
                      :prop="item.id"
                      :label="item.name"
                      :sortable="item.sortable"
                      :width="item.width"
                    >
                      <template slot-scope="scope">
                        <template
                          v-if="item.numberFormat"
                        >{{ scope.row[item.id] | numFormat(item.fixedFormat) }}</template>
                        <template v-else>{{ scope.row[item.id] }}</template>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-row>
              <el-row type="flex" justify="end">
                <el-button :disabled="loading" type="primary" size="small" @click="exportCSV()">导出CSV</el-button>
              </el-row>
              <el-row>
                <el-table v-loading="loading" :data="tab.details.rows" @sort-change="sortChange">
                  <el-table-column
                    v-for="item in tab.details.columns"
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
                <div class="mt-20">
                  <el-pagination
                    @size-change="getTableData(true)"
                    @current-change="getTableData(false)"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size.sync="tab.details.page.size"
                    :current-page.sync="tab.details.page.current"
                    layout="total, sizes, jumper,pager"
                    :total="tab.details.page.total"
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
import { data } from "./data.Device";
import {
  apiEList,
  apiETopList,
  apiEViews,
  apiLPList,
  apiEExport
} from "../../plugins/api";
import PieChart from "../../components/PieChart";
import format from "date-fns/format";
export default {
  components: {
    PieChart
  },
  data: function() {
    return {
      ...data(this)
    };
  },
  methods: {
    tabClick: function() {
      let { tab } = this.getCondition();
      if (!tab.visited) {
        this.search();
      }
    },
    quantificationChange: function() {
      this.eViews();
      this.eTopList();
    },
    search: function() {
      this.loading = true;
      this.tabs.forEach(e => (e.visited = false));
      Promise.all([
        this.eViews(),
        this.eTopList(),
        this.getTableData(true)
      ]).finally(res => {
        this.loading = false;
      });
    },
    sortChange: function(a) {
      let { page, order } = this.getCondition();
      page.current = 1;
      Object.assign(order, {
        sort: a.prop,
        dir: (a.order || "").replace("ending", "")
      });
      this.eList();
    },
    eList: function() {
      let { condition, page, rows, tab } = this.getCondition();
      tab.visited = true;
      return apiEList(condition).then(e => {
        page.total = e.total;
        rows.length = 0;
        rows.push(...e.list);
      });
    },
    eTopList: function() {
      let {
        topRows,
        condition,
        quantification,
        topColumns
      } = this.getCondition();
      topColumns.find(e => e.id == "quotaValue").name = quantification.label;
      return apiETopList(condition).then(e => {
        topRows.length = 0;
        topRows.push(...(Array.isArray(e) ? e : []));
      });
    },
    eViews: function() {
      let { charts, condition, tab, quantification } = this.getCondition();
      tab.tops.legend = `${tab.label + quantification.label}TOP排行`;
      return apiEViews(condition).then(e => {
        this.setChart(tab, quantification, e.seriesData || []);
      });
    },
    getTableData: function(c) {
      let { page } = this.getCondition();
      if (c) {
        page.current = 1;
      }
      return this.eList();
    },
    getCondition: function() {
      let tab = this.tabs.find(e => e.name == this.tabIndex);
      let quantification = tab.quantification.list.find(
        e => e.value == tab.quantification.model
      );
      let { rows: topRows, columns: topColumns } = tab.tops;
      let { page, rows, order } = tab.details;
      let args = {
        current: page.current,
        limit: page.size,
        landingPageId: this.landingPages.model,
        sort: order.sort,
        dir: order.dir.replace("ending", ""),
        quota: quantification.value,
        type: this.tabIndex,
        startTime: format(this.dateRange[0], "yyyy-MM-dd"),
        endTime: format(this.dateRange[1], "yyyy-MM-dd")
      };
      return {
        tab,
        quantification,
        page,
        rows,
        topRows,
        topColumns,
        order,
        charts: tab.charts,
        condition: args
      };
    },
    setChart: function(tab, quantification, seriesData) {
      let chartData = {
        titleText: `${tab.label + quantification.label}分布`,
        seriesName: quantification.label,
        seriesData: [...seriesData]
      };
      tab.charts = chartData;
    },
    exportCSV: function() {
      apiEExport(this.getCondition().condition);
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
.main {
  .inputs {
    margin: 7px 0 20px;
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
  .chart-region {
    min-height: 420px;
    min-width: 220px;
  }
  .chart-title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(46, 48, 57, 1);
    line-height: 20px;
    text-align: center;
  }
  .top-list {
    flex-shrink: 0;
    margin-left: 160px;
    .legend {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;
      text-align: center;
      margin-bottom: 14px;
    }
  }
}
</style>
