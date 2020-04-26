<template>
  <div class="views-actgion-time-range">
    <el-card>
      <div class="inputs">
        <label for>落地页：</label>
        <page-select class="select landingpage"></page-select>
        <label>指标：&nbsp;</label>
        <el-select
          placeholder="请选择指标"
          size="small"
          class="select dimension"
          v-model="currentDimension"
        >
          <el-option
            v-for="(page, index) in dimensions"
            :label="page.text"
            :key="page.value"
            :value="index"
          ></el-option>
        </el-select>

        <label>日期：</label>
        <el-date-picker
          class="date-picker"
          @change="dateChangeHandler"
          :clearable="false"
          v-model="dateRanges"
          type="daterange"
          :pickerOptions="pickerOptions"
          align="right"
          placeholder="选择日期"
          size="small"
          @blur=" checkedStartDate = null"
          format="yyyy.MM.dd"
        ></el-date-picker>
        <el-checkbox class="checkbox" v-model="diff" size="small">对比</el-checkbox>
        <!-- <label v-if="diff">日期：</label> -->

        <el-date-picker
          class="date-picker"
          v-if="diff"
          :clearable="false"
          v-model="dateRanges1"
          type="daterange"
          :pickerOptions="pickerOptions1"
          align="right"
          placeholder="选择日期"
          size="small"
          format="yyyy.MM.dd"
          @blur=" checkedStartDate1 = null"
          @change="secondDateChangeHandler"
        ></el-date-picker>
        <el-button
          :disabled="loading"
          type="primary"
          size="small"
          class="btn"
          @click="getData(true)"
        >查询</el-button>

        <div class="info">
          <i class="el-icon-warning-outline"></i>
          分小时仅提供最近一个月的数据查询
        </div>

        <line-chart
          v-loading="loading"
          :xFormatter="xlabelFormatter"
          v-if="chartData"
          :data="chartData"
        />
      </div>
    </el-card>
    <el-card class="table-warp">
      <div class="btns clear">
        <el-button
          size="small"
          @click="exportCSV()"
          type="primary"
          class="fr"
          :disabled="loading"
          s
        >导出CSV</el-button>
      </div>
      <el-table
        :data="tableData"
        class="table"
        @sort-change="sortChangeHandler"
        v-loading="loading"
      >
        <el-table-column prop="staTime" label="日期/时间" width="100"></el-table-column>
        <el-table-column prop="pageName" label="落地页名称"></el-table-column>
        <el-table-column prop="pv" sortable="custom" label="浏览量"></el-table-column>
        <el-table-column prop="uv" sortable="custom" label="访客量"></el-table-column>
        <el-table-column prop="ruv" width="120" sortable="custom" label="重复访客量"></el-table-column>
        <el-table-column prop="ruvRate" width="120" sortable="custom" label="重复访客率"></el-table-column>
        <el-table-column prop="converts" sortable="custom" label="转化量"></el-table-column>
        <el-table-column prop="convertRate" sortable="custom" label="转化率"></el-table-column>
        <el-table-column prop="stayTimeAvg" sortable="custom" label="平均停留时长" width="120"></el-table-column>
        <el-table-column prop="bounce" sortable="custom" label="跳出量"></el-table-column>
        <el-table-column prop="bounceRate" sortable="custom" label="跳出率"></el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          @size-change="getData(false)"
          @current-change="getData(false)"
          :page-sizes="[10, 20, 50, 100]"
          :page-size.sync="pageConfig.size"
          :current-page.sync="pageConfig.current"
          layout="total, sizes, jumper,pager"
          :total="pageConfig.total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script lang="javascript">
import { mapState } from "vuex";
import PageSelect from "../../components/LandingPageSelect";
import { dateComponentShortcuts } from "../../config";
import isAfter from "date-fns/isAfter";
import endOfToday from "date-fns/endofToday";
import startOfYear from "date-fns/startOfYear";
import isBefore from "date-fns/isBefore";
import differenceInDays from "date-fns/differenceInDays";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import {
  getTimeRangeDiffData,
  exportTimeRangeCSV
} from "../../plugins/api/index";
import DoubleAxisLineChart from "../../components/DoubleXaxisLineChart";
import kebabCase from "lodash/kebabCase";
import { handlerAnalysisTableData } from "../../plugins/api";
import { startOfToday } from "date-fns";

const TODAY = endOfToday();
const YESTERDAY = subDays(TODAY, 1);
const START_DATE = startOfYear(new Date().setFullYear(2019));
const DEFAULT_XLABEL_FORMATTER = str => {
  return str.slice(11);
};

export default {
  components: { lineChart: DoubleAxisLineChart, PageSelect },
  computed: {
    ...mapState(["landingPages"]),
    currentPageId: {
      get() {
        return this.$store.state.currentLandingPageId;
      },
      set(id) {
        this.$store.commit("setCurrentLandingPageId", id);
      }
    }
  },
  data() {
    const vm = this;
    return {
      loading: false,
      sortConfig: {
        dir: "",
        sort: ""
      },
      pageConfig: {
        current: 1,
        size: 10,
        total: 0
      },
      xlabelFormatter: null,
      tableData: [],
      chartData: undefined,
      diff: true,
      checkedStartDate: null,
      checkedStartDate1: null,
      dateRanges: [subDays(YESTERDAY, 6), YESTERDAY],
      dateRanges1: [subDays(YESTERDAY, 13), subDays(YESTERDAY, 7)],
      currentDimension: 0,
      dimensions: [
        {
          text: "浏览量",
          value: "browse"
        },
        {
          text: "访客量",
          value: "visitor"
        },
        {
          text: "转化量",
          value: "conversionAmount"
        },
        {
          text: "转化率",
          value: "conversionRate"
        },
        {
          text: "平均停留时长",
          value: "averageResidenceTime"
        },
        {
          text: "跳出率",
          value: "bounceRate"
        }
      ],
      pickerOptions: {
        shortcuts: dateComponentShortcuts,
        disabledDate(date) {
          return (
            isAfter(date, TODAY) ||
            isBefore(date, START_DATE) ||
            (vm.checkedStartDate &&
              Math.abs(differenceInDays(date, vm.checkedStartDate)) > 89)
          );
        },
        onPick({ maxDate, minDate }) {
          if (maxDate && minDate) {
            vm.checkedStartDate = null;
          } else {
            vm.checkedStartDate = maxDate || minDate;
          }
        }
      },
      pickerOptions1: {
        shortcuts: dateComponentShortcuts,
        disabledDate(date) {
          return (
            isAfter(date, TODAY) ||
            isBefore(date, START_DATE) ||
            (vm.checkedStartDate &&
              Math.abs(differenceInDays(date, vm.checkedStartDate1)) > 89)
          );
        },
        onPick({ maxDate, minDate }) {
          if (maxDate && minDate) {
            vm.checkedStartDate1 = null;
          } else {
            vm.checkedStartDate1 = maxDate || minDate;
          }
        }
      }
    };
  },
  methods: {
    /** 表格排序 */
    sortChangeHandler(column) {
      let { prop, order } = column;
      // const specialProps = [
      //   "ruvRate",
      //   "convertRate",
      //   "convertTotalRate",
      //   "bounceRate"
      // ];
      // if (!specialProps.includes(prop)) {
      //   prop = "t." + kebabCase(prop).replace(/-/g, "_");
      // }
      if (order) {
        this.sortConfig.sort = prop;
        this.sortConfig.dir = order === "ascending" ? "ASC" : "DESC";
      } else {
        this.sortConfig.sort = "";
        this.sortConfig.dir = "";
      }
      this.getData(true);
    },

    exportCSV() {
      const params = {
        landingPageId: this.currentPageId,
        quota: this.currentDimension,
        startTime: this.dateRanges[0],
        endTime: this.dateRanges[1],
        sort: this.sortConfig.sort,
        dir: this.sortConfig.dir
      };
      if (this.diff) {
        params.startTime1 = this.dateRanges1[0];
        params.endTime1 = this.dateRanges1[1];
      }
      exportTimeRangeCSV(params);
    },

    dateChangeHandler() {
      const [start, end] = this.dateRanges;
      const dateCount = Math.abs(differenceInDays(end, start));

      const nextStart = subDays(start, dateCount + 1);
      const nextEnd = subDays(end, dateCount + 1);
      this.dateRanges1 = [nextStart, nextEnd];
      this.checkedStartDate1 = null;
    },

    /** 第二个日期变化时触发 自动修正日期到时段与1相同 */
    secondDateChangeHandler() {
      const [start, end] = this.dateRanges;
      const dateCount = Math.abs(differenceInDays(end, start));
      let start1 = this.dateRanges1[0];
      let end1 = addDays(start1, dateCount);
      if (isAfter(end1, endOfToday())) {
        end1 = endOfToday();
        start1 = subDays(end1, dateCount);
      }
      this.dateRanges1 = [start1, end1];
    },

    getData(reset = false) {
      this.loading = true;
      const params = {
        current: this.pageConfig.current,
        limit: 10,
        landingPageId: this.currentPageId,
        quota: this.currentDimension,
        startTime: this.dateRanges[0],
        endTime: this.dateRanges[1],
        sort: this.sortConfig.sort,
        dir: this.sortConfig.dir
      };
      if (this.diff) {
        params.startTime1 = this.dateRanges1[0];
        params.endTime1 = this.dateRanges1[1];
      }
      getTimeRangeDiffData(params)
        .then(res => {
          if (reset) {
            this.pageConfig.current = 1;
          }
          res.list = handlerAnalysisTableData(res.list);
          this.tableData = res.list;
          this.chartData = res.views;
          this.pageConfig.total = res.total;
        })
        .finally(res => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss">
.views-actgion-time-range {
  .info {
    i {
      font-size: 16px;
    }
    margin-top: 10px;
    color: #909399;
    font-size: 12px;
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  .inputs {
    $margin-right: 20px;
    label {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
    }
    .checkbox {
      margin-right: $margin-right;
    }
    .select {
      margin-right: $margin-right;
      &.landingpage {
        width: 130px;
      }
      &.dimension {
        width: 100px;
      }
    }
    .date-picker {
      margin-right: $margin-right;
      width: 210px;
    }
    .btn {
      width: 70px;
    }
  }
  .table-warp {
    margin-top: 10px;
    .table {
      margin-top: 15px;
    }
    .pager {
      margin-top: 15px;
    }
  }
}
</style>
