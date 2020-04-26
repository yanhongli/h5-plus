<template>
  <div class="views-stay-time">
    <el-card>
      <div class="clear page-select">
        <label>落地页名称：</label>
        <page-select class="input"></page-select>
        <!-- <el-select class="input" placeholder="请选择落地页" size="small" v-model="currentPageId">
          <el-option
            v-for="page in landingPages"
            :label="page.name"
            :key="page.id"
            :value="page.id"
          ></el-option>
        </el-select>-->
        <label>日期：</label>

        <el-date-picker
          :clearable="false"
          style="width:250px;"
          v-model="dateRanges"
          type="daterange"
          :pickerOptions="pickerOptions"
          align="right"
          placeholder="选择日期"
          size="small"
          class="input"
          format="yyyy.MM.dd"
          @blur=" checkedStartDate = null"
        ></el-date-picker>
        <el-button :disabled="loading" class="btn" size="small" type="primary" @click="getPageData(true)">查询</el-button>
      </div>

      <div class="clear"></div>
      <muliti-line-chart
        v-loading="loading" 
        class="chart"
        title="浏览时长的转化分析"
        :data="chartData"
        :dataZoom="{ start: 0, end: (300 / 1800) * 100 }"
      />
    </el-card>
    <el-card class="table-warp">
      <!-- {{ tableData }} -->
      <div class="clear">
        <el-popover ref="colums-popover" popper-class="colums-popover" :width="350">
          <el-row>
            <el-checkbox
              class="all"
              v-model="checkAllBasicColumns"
              :indeterminate="
                getIndeterminateStatus(
                  tableColumns.basicChecked,
                  tableColumns.basic
                )
              "
            >基础行为指标</el-checkbox>
          </el-row>
          <el-row>
            <el-checkbox-group v-model="tableColumns.basicChecked">
              <el-col :span="8" v-for="event in tableColumns.basic" :key="event">
                <el-checkbox :label="event"></el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
          <el-row>
            <el-checkbox
              :indeterminate="
                getIndeterminateStatus(
                  tableColumns.conversionChecked,
                  tableColumns.conversion
                )
              "
              class="all"
              v-model="checkAllConversionColums"
            >转化指标</el-checkbox>
          </el-row>
          <el-row>
            <el-checkbox-group v-model="tableColumns.conversionChecked">
              <el-col v-for="event in tableColumns.conversion" :key="event" :span="8">
                <el-checkbox :label="event"></el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
        </el-popover>
        <el-button size="mini" v-popover:colums-popover trigger="click" class="fr custom-columns">
          自定义列
          <i class="el-icon-caret-bottom"></i>
        </el-button>
        <el-button :disabled="loading" @click="exportCSV()" class="fr export" type="primary" size="mini">导出CSV</el-button>
      </div>
      <el-table v-loading="loading" class="table" :data="tableData" @sort-change="sortChangeHandler">
        <el-table-column label="落地页名称" prop="pageName"></el-table-column>
        <el-table-column label="平均停留时长" prop="intervalRange"></el-table-column>
        <el-table-column
          label="浏览量"
          sortable="custom"
          v-if="include('浏览量', tableColumns.basicChecked)"
          prop="pv"
        ></el-table-column>
        <el-table-column
          sortable="custom"
          label="访客量"
          v-if="include('访客量', tableColumns.basicChecked)"
          prop="uv"
        ></el-table-column>
        <el-table-column
          sortable="custom"
          label="重复访客量"
          v-if="include('重复访客量', tableColumns.basicChecked)"
          prop="ruv"
        ></el-table-column>
        <el-table-column
          label="重复访客率"
          sortable="custom"
          v-if="include('重复访客率', tableColumns.basicChecked)"
          prop="ruvRate"
        ></el-table-column>
        <el-table-column
          label="总转化量"
          sortable="custom"
          v-if="include('总转化量', tableColumns.conversionChecked)"
          prop="convertTotal"
        ></el-table-column>
        <el-table-column
          label="总转化率"
          sortable="custom"
          v-if="include('总转化率', tableColumns.conversionChecked)"
          prop="convertTotalRate"
        ></el-table-column>
        <el-table-column
          label="拨打电话"
          sortable="custom"
          v-if="include('拨打电话', tableColumns.conversionChecked)"
          prop="callPhone"
        ></el-table-column>
        <el-table-column
          label="表单提交"
          sortable="custom"
          v-if="include('表单提交', tableColumns.conversionChecked)"
          prop="formSubmit"
        ></el-table-column>
        <el-table-column
          label="订单"
          sortable="custom"
          v-if="include('订单', tableColumns.conversionChecked)"
          prop="orderNums"
        ></el-table-column>
        <el-table-column
          label="购买"
          sortable="custom"
          v-if="include('购买', tableColumns.conversionChecked)"
          prop="buyNums"
        ></el-table-column>
        <el-table-column
          label="有效咨询"
          sortable="custom"
          v-if="include('有效咨询', tableColumns.conversionChecked)"
          prop="effectiveConsultin"
        ></el-table-column>
        <el-table-column
          label="微信复制"
          sortable="custom"
          v-if="include('微信复制', tableColumns.conversionChecked)"
          prop="copyNums"
        ></el-table-column>
        <el-table-column
          label="应用下载"
          sortable="custom"
          v-if="include('应用下载', tableColumns.conversionChecked)"
          prop="downloadNums"
        ></el-table-column>
        <el-table-column
          label="其他"
          sortable="custom"
          v-if="include('其他', tableColumns.conversionChecked)"
          prop="others"
        ></el-table-column>
      </el-table>
      <div class="pager">
        <el-pagination
          @size-change="getPageData(false)"
          @current-change="getPageData(false)"
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

<script>
import MulitiLineChart from "../../components/MultiLineChart";
import PageSelect from "../../components/LandingPageSelect";
// import landPageMixin from "../../plugins/landingPageMixin";
import {
  getStayTimeData,
  exportStayTimeData,
  handlerAnalysisTableData
} from "../../plugins/api";
import { mapState } from "vuex";
import { dateComponentShortcuts } from "../../config";
import isAfter from "date-fns/isAfter";
import endOfToday from "date-fns/endofToday";
import startOfYear from "date-fns/startOfYear";
import isBefore from "date-fns/isBefore";
import differenceInDays from "date-fns/differenceInDays";
import { save, read } from "../../plugins/localStorage";
import subDays from "date-fns/subDays";
import format from "date-fns/format";
import kebabCase from "lodash/kebabCase";

const STAYTIME_LIST_BASIC_COLUMNS_KEY = "stayTImeListBasicColumnsKey";
const STAYTIME_LIST_CONVERNSION_COLUMNS_KEY =
  "stayTImeListConversionColumnsKey";

const TODAY = endOfToday();
const YESTERDAY = subDays(TODAY, 1);
const START_DATE = startOfYear(new Date().setFullYear(2019));

export default {
  components: {
    mulitiLineChart: MulitiLineChart,
    PageSelect
  },
  computed: {
    currentPageId: {
      get() {
        return this.$store.state.currentLandingPageId;
      },
      set(id) {
        this.$emit("change", id);
        this.$store.commit("setCurrentLandingPageId", id);
      }
    },
    checkAllBasicColumns: {
      get() {
        return (
          this.tableColumns.basicChecked.length ===
          this.tableColumns.basic.length
        );
      },
      set(checkAll) {
        this.tableColumns.basicChecked = checkAll
          ? [...this.tableColumns.basic]
          : [];
      }
    },
    checkAllConversionColums: {
      get() {
        return (
          this.tableColumns.conversionChecked.length ===
          this.tableColumns.conversion.length
        );
      },
      set(checkAll) {
        this.tableColumns.conversionChecked = checkAll
          ? [...this.tableColumns.conversion]
          : [];
      }
    }
  },
  // mixins: [landPageMixin],
  data() {
    const vm = this;
    return {
      loading: false,
      pageConfig: {
        current: 1,
        size: 10,
        total: 0
      },
      sortConfig: {
        dir: "",
        sort: ""
      },
      tableColumns: {
        basicChecked: ["浏览量", "访客量", "重复访客量", "重复访客率"],
        basic: ["浏览量", "访客量", "重复访客量", "重复访客率"],
        conversionChecked: ["总转化量", "总转化率"],
        conversion: [
          "总转化量",
          "总转化率",
          "拨打电话",
          "表单提交",
          "订单",
          "购买",
          "有效咨询",
          "微信复制",
          "应用下载",
          "其他"
        ]
      },
      tableData: [],
      dateRanges: [subDays(YESTERDAY, 6), YESTERDAY],
      checkedStartDate: null,
      chartData: {
        series: [],
        xaxisData: []
      },
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
      }
    };
  },
  methods: {
    /** 表格排序 */
    sortChangeHandler(column) {
      let { prop, order } = column;
      // const specialProps = ["ruvRate", "convertRate", "convertTotalRate"];
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
      this.getPageData(true);
    },
    getPageData(reset = false) {
      this.loading = true
      const params = {
        ...this.sortConfig,
        limit: this.pageConfig.size,
        current: this.pageConfig.current,
        landingPageId: this.currentPageId,
        startTime: this.dateRanges[0],
        endTime: this.dateRanges[1]
      };

      if (reset) {
        this.pageConfig.size = 10;
        this.pageConfig.current = 1;
      }

      getStayTimeData(params).then(res => {
        handlerAnalysisTableData(res.list);
        this.tableData = res.list || [];
        this.pageConfig.total = res.total;
        this.chartData = res.views || {
          xAxisData: [],
          seriesData: []
        };
      }).finally(res => {
        this.loading = false;
      })
    },

    exportCSV() {
      const params = {
        ...this.sortConfig,
        landingPageId: this.currentPageId,
        startTime: this.dateRanges[0],
        endTime: this.dateRanges[1]
      };

      exportStayTimeData(params);
    },

    getIndeterminateStatus(checkedList, List) {
      return checkedList.length > 0 && checkedList.length < List.length;
    },
    include(item, array) {
      return array.includes(item);
    }
  },
  watch: {
    "tableColumns.basicChecked"(value) {
      save(STAYTIME_LIST_BASIC_COLUMNS_KEY, value);
    },
    "tableColumns.conversionChecked"(value) {
      save(STAYTIME_LIST_CONVERNSION_COLUMNS_KEY, value);
    }
  },
  created() {
    this.tableColumns.basicChecked =
      read(STAYTIME_LIST_BASIC_COLUMNS_KEY) || this.tableColumns.basicChecked;
    this.tableColumns.conversionChecked =
      read(STAYTIME_LIST_CONVERNSION_COLUMNS_KEY) ||
      this.tableColumns.conversionChecked;
    this.getPageData();
  }
};
</script>

<style lang="scss">
@import "./stay-time.scss";
</style>
