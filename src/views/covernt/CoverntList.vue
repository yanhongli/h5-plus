<template>
  <div class="views-covernt-list">
    <!-- <router-link to="/covernt/track">去往转化明细</router-link> -->

    <div class="main">
      <el-card>
        <div class="inputs">
          <label>落地页名称：</label>
          <page-select style="width:160px;"></page-select>
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
            @blur=" checkedStartDate = null"
            format="yyyy.MM.dd"
          ></el-date-picker>
          <el-button
          :disabled="loading"
            class="btn"
            size="small"
            style="width:90px;"
            type="primary"
            @click="getTableData(true)"
          >查询</el-button>
          <el-button
            size="small"
            class="btn"
            style="width:90px;"
            type="primary"
            @click="exportCSV"
          >导出CSV</el-button>
        </div>
        <div class="inputs">
          <el-popover ref="colums-popover" popper-class="colums-popover" :width="350">
            <el-row>
              <el-checkbox
                :indeterminate="isIndeterminateEvent"
                class="all"
                v-model="checkAllEvent"
              >事件信息</el-checkbox>
            </el-row>
            <el-row>
              <el-checkbox-group v-model="checkedEventColums">
                <el-col :span="8" v-for="event in tableColums.events" :key="event">
                  <el-checkbox :label="event"></el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-row>
            <el-row>
              <el-checkbox
                :indeterminate="isIndeterminateInfo"
                class="all"
                v-model="checkAllUserInfo"
              >基础指标</el-checkbox>
            </el-row>
            <el-row>
              <el-checkbox-group v-model="checkedInfoColums">
                <el-col v-for="event in tableColums.info" :key="event" :span="8">
                  <el-checkbox :label="event"></el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-row>
          </el-popover>
          <el-button
            v-popover:colums-popover
            trigger="click"
            size="small"
            class="fr"
            style="width:90px;margin-left:20px;"
          >
            自定义列
            <i class="el-icon-caret-bottom"></i>
          </el-button>
        </div>

        <div class="table">
          <el-table v-loading="loading" :data="tableData" v-if="showTable" @sort-change="sortChangeHandler">
            <el-table-column prop="conversionEvent" label="用户编号">
              <template slot-scope="scope">
                <a>{{ scope.$index + pageLimit * (pageStart - 1) + 1 }}</a>
              </template>
            </el-table-column>
            <el-table-column
              v-if="inclued(checkedEventColums, '转化类型')"
              prop="conversionType"
              label="转化类型"
            >
              <!-- <template slot="header">
                <el-select
                  size="mini"
                  :clearable="!!currentConversionType"
                  @change="tableHeadSelectCommonHandler"
                  v-model="currentConversionType"
                  class="thead-select"
                >
                  <el-option
                    v-for="type in conversionTypes"
                    :label="type.name"
                    :value="type.id"
                    :key="type.id"
                  ></el-option>
                </el-select>
              </template>-->
            </el-table-column>
            <el-table-column
              v-if="inclued(checkedEventColums, '转化状态')"
              prop="conversionStatusStr"
              label="转化状态"
              width="140"
            >
              <template slot="header">
                <el-select
                  class="thead-select"
                  :clearable="conversionStatusSelectClearable"
                  @change="tableHeadSelectCommonHandler"
                  v-model="currentConversionStatus"
                  size="mini"
                >
                  <el-option
                    v-for="status in conversionStatus"
                    :label="status.name"
                    :value="status.id"
                    :key="status.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              v-if="inclued(checkedInfoColums, '转化详情')"
              prop="conversionDetails"
              label="转化详情"
              width="100"
            >
              <template slot-scope="scope" slot="header">
                <div>
                  {{ scope.column.label }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="bottom"
                    popper-class="c-tooltip"
                  >
                    <div slot="content">仅体现用户填写的姓名、手机号内容</div>
                    <i class="icon-question"></i>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="inclued(checkedInfoColums, 'UID')" prop="uid" label="UID"></el-table-column>
            <el-table-column
              v-if="inclued(checkedInfoColums, '停留时长')"
              label="停留时长"
              prop="stayTime"
              width="130"
              sortable="custom"
            >
              <!-- <template slot="header">
                <el-select
                  :clearable="stayTimeConfig.currentValueIndex !== 0"
                  size="mini"
                  class="thead-select"
                  @change="stayTImeChangeHandler"
                  v-model="stayTimeConfig.currentValueIndex"
                >
                  <el-option
                    v-for="(item, index) in stayTimeList"
                    :key="item.name"
                    :label="item.name"
                    :value="index"
                  ></el-option>
                </el-select>
              </template>-->
              <template slot-scope="scope">{{ scope.row.stayTime | numFormat("0.1") }}</template>
            </el-table-column>
            <el-table-column
              sortable="custom"
              v-if="inclued(checkedInfoColums, '访问深度')"
              label="访问深度"
              prop="pageDepth"
              width="130"
            >
              <!-- <template slot="header">
                <el-select
                  :clearable="depthConfig.currentValueIndex !== 0"
                  class="thead-select"
                  size="mini"
                  @change="depthChangeHandler"
                  v-model="depthConfig.currentValueIndex"
                >
                  <el-option
                    v-for="(item, index) in depthList"
                    :key="item.name"
                    :label="item.name"
                    :value="index"
                  ></el-option>
                </el-select>
              </template>-->
              <template slot-scope="scope">{{ scope.row.pageDepth | numFormat("0.1") }}%</template>
            </el-table-column>
            <el-table-column v-if="inclued(checkedInfoColums, '地域')" prop="region" label="地域"></el-table-column>
            <el-table-column v-if="inclued(checkedInfoColums, 'IP')" prop="ip" label="IP"></el-table-column>
            <el-table-column
              v-if="inclued(checkedInfoColums, '操作系统')"
              prop="os"
              label="操作系统"
              width="140"
            >
              <template slot="header">
                <el-select
                  v-model="currentOs"
                  @change="tableHeadSelectCommonHandler"
                  size="mini"
                  class="thead-select"
                >
                  <el-option v-for="os in osList" :key="os.name" :label="os.name" :value="os.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="用户路径" fixed="right">
              <template slot-scope="scope">
                <div class="user-trace">
                  <router-link
                    :to="{
                    path: '/covernt/track',
                    query: {
                      uid: scope.row.uid,
                      id: scope.row.id,
                      pageId: scope.row.landingPageId,
                      pageUrl: getCurrentPageUrl(scope.row.landingPageId)
                    }
                  }"
                    class="link"
                  >
                    查看行为路径
                    <img
                      class="mouse-hover fade"
                      src="../../assets/images/mouseclick.png"
                      v-if="scope.$index === 0 && showPointer"
                    />
                  </router-link>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="page">
            <el-pagination
              @size-change="getTableData(false)"
              @current-change="getTableData(false)"
              :page-sizes="[10, 20, 50, 100]"
              :page-size.sync="pageLimit"
              :current-page.sync="pageStart"
              layout="total, sizes, jumper,pager"
              :total="pageTotal"
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PageSelect from "../../components/LandingPageSelect";
import {
  getConversionTypes,
  getConversionStatusSync,
  getConversionList,
  exportConversionListCSV
} from "../../plugins/api";
import format from "date-fns/format";
import isBefore from "date-fns/isBefore";
import endOfYesterday from "date-fns/endOfYesterday";
import isAfter from "date-fns/isAfter";
import differenceInDays from "date-fns/differenceInDays";
import endOfToday from "date-fns/endOfToday/index";
import startOfYear from "date-fns/startOfYear";
import subDays from "date-fns/subDays";
import { dateComponentShortcuts } from "../../config";
import { save, read } from "../../plugins/localStorage";
import { stayTimeConfig, depthConfigList } from "./coverntListConfig";
import isNumber from "lodash/isNumber";
import kebabCase from "lodash/kebabCase";
import { OS_LIST } from "../../config/os";
const COVERNT_LIST_INFO_COLUMN_KEY = "coverntListInfoColums";
const COVERNT_LIST_EVENT_COLUMN_KEY = "coverntListEventColums";

const TODAY = endOfToday();
/** 起始日期2019年初 */
const START_DATE = startOfYear(new Date().setFullYear(2019));

export default {
  components: { PageSelect },
  data() {
    const vm = this;
    return {
      loading: false,
      showPointer: true,
      sortConfig: {
        sort: "",
        dir: ""
      },
      /** 操作系统 */
      osList: OS_LIST,
      currentOs: "",
      showTable: true,
      rules: {
        number: [
          {
            type: "integer",
            message: "请输入数字"
          },
          {
            type: "integer",
            min: 0,
            message: "请输入大于等于0的数字"
          }
        ]
      },
      depathRules: {
        number: [
          {
            type: "number",
            min: 0,
            message: "请输入大于等于0的数字"
          },
          {
            type: "number",
            max: 100,
            message: "请输入小于等于100的数字"
          }
        ]
      },
      /** 转化类型 */
      conversionTypes: [],
      currentConversionType: "",
      /** 转化状态 */
      conversionStatus: getConversionStatusSync(),
      currentConversionStatus: "",

      /** 停留时长配置 */
      stayTimeConfig: {
        currentValueIndex: 0
      },

      /** 页面深度配置 */
      depthConfig: {
        currentValueIndex: 0
      },

      stayTimeList: stayTimeConfig,
      depthList: depthConfigList,

      dateRange: [subDays(endOfYesterday(), 6), endOfYesterday()],

      pageStart: 1,
      pageLimit: 10,
      pageTotal: 0,

      tableData: [],
      /** 已选择的事件和用户信息列 */
      checkedEventColums: ["转化类型", "转化状态"],
      checkedInfoColums: [
        "转化详情",
        "停留时长",
        "访问深度",
        "地域",
        "IP",
        "操作系统"
      ],

      /** 表格自定义列 */
      tableColums: {
        events: ["转化类型", "转化状态"],
        info: [
          "转化详情",
          "UID",
          "停留时长",
          "访问深度",
          "地域",
          "IP",
          "操作系统"
        ]
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
          vm.checkedStartDate = maxDate || minDate;
        }
      }
    };
  },
  methods: {
    sortChangeHandler(column) {
      let { prop, order } = column;
      // const specialProps = ["ruvRate", "convertRate", "convertTotalRate"];
      // if (!specialProps.includes(prop)) {
      //   prop = "t." + kebabCase(prop).replace(/-/g, "_");
      // }
      prop = kebabCase(prop).replace(/-/g, "_");
      if (order) {
        this.sortConfig.sort = prop;
        this.sortConfig.dir = order === "ascending" ? "ASC" : "DESC";
      } else {
        this.sortConfig.sort = "";
        this.sortConfig.dir = "";
      }
      this.getTableData(true);
    },

    tableHeadSelectCommonHandler() {
      this.reRenderTable().then(res => {
        this.getTableData(true);
      });
    },
    exportCSV() {
      exportConversionListCSV(this.getParams());
    },

    reRenderTable() {
      this.showTable = false;
      return this.$nextTick().then(() => {
        this.showTable = true;
      });
    },

    stayTImeChangeHandler() {
      if (!this.stayTimeConfig.currentValueIndex) {
        this.stayTimeConfig.currentValueIndex = 0;
      }
      this.reRenderTable().then(() => {
        this.getTableData(true);
      });
    },

    depthChangeHandler() {
      if (!this.depthConfig.currentValueIndex) {
        this.depthConfig.currentValueIndex = 0;
      }
      this.reRenderTable().then(() => {
        this.getTableData(true);
      });
    },

    inclued(array, item) {
      return array.includes(item);
    },
    getConversionTypes() {
      getConversionTypes().then(res => {
        res.unshift({
          name: "转化类型",
          id: ""
        });
        this.conversionTypes = res;
        this.reRenderTable();
      });
    },
    pointerAnimate() {
      this.showPointer = true;
      const timer = setTimeout(() => {
        this.showPointer = false;
      }, 6000);
    },
    getParams() {
      let osParam = this.currentOs ? "= " + "@'" + this.currentOs + "'" : "";

      const stayTimeValue = this.stayTimeList[
        this.stayTimeConfig.currentValueIndex || 0
      ].value;

      const depthValue = this.depthList[this.depthConfig.currentValueIndex || 0]
        .value;

      let stayTimeParam = "";
      let depthParam = "";
      if (!stayTimeValue) {
        stayTimeParam = "";
      } else if (stayTimeValue.max) {
        stayTimeParam = `between@ ${stayTimeValue.min} and ${stayTimeValue.max}`;
      } else {
        stayTimeParam = `>@${stayTimeValue.min}`;
      }

      if (!depthValue) {
        depthParam = "";
      } else if (depthValue.max) {
        depthParam = `between@ ${depthValue.min / 100} and ${depthValue.max /
          100}`;
      } else {
        depthParam = `>@${depthValue.min / 100}`;
      }

      if (this.currentOs === "其他") {
        osParam = `not in @ ('iOS', 'Android')`;
      }

      return {
        ...this.sortConfig,
        current: this.pageStart,
        limit: this.pageLimit,
        landingPageId: this.currentPageId,
        conversionTypeId: this.currentConversionType,
        conversionStatus: this.currentConversionStatus,
        startTime: format(this.dateRange[0], "yyyy-MM-dd"),
        endTime: format(this.dateRange[1], "yyyy-MM-dd"),
        stayTimeCdt: stayTimeParam,
        pageDepthCdt: depthParam,
        osCdt: osParam
      };
    },

    getCurrentPageUrl(id) {
      const res = this.landingPages.find(item => item.id === id);
      if (res) {
        return res.url;
      }
    },

    getTableData(reset = false) {
      this.loading = true;
      if (reset) {
        this.pageStart = 1;
      }

      getConversionList(this.getParams()).then(res => {
        res.list.forEach(item => {
          item.pageDepth = item.pageDepth * 100;
          item.conversionEvent = item.conversionEvent || "--";
          item.conversionType = item.conversionType || "--";
        });
        this.tableData = res.list;
        // this.tableData = [{}];
        this.pageTotal = res.total;
      }).finally(res => {
        this.loading = false;
        this.$nextTick(res => {
          this.pointerAnimate();
        });
      })
    }
  },
  computed: {
    ...mapState(["landingPages"]),
    currentPageId: {
      get() {
        return this.$store.state.currentLandingPageId;
      },
      set(id) {
        this.$store.commit("setCurrentLandingPageId", id);
      }
    },
    checkAllEvent: {
      get() {
        return (
          this.checkedEventColums.length === this.tableColums.events.length
        );
      },
      set(all) {
        if (all) {
          this.checkedEventColums = [...this.tableColums.events];
        } else {
          this.checkedEventColums = [];
        }
      }
    },
    isIndeterminateEvent() {
      return (
        this.checkedEventColums.length > 0 &&
        this.checkedEventColums.length < this.tableColums.events.length
      );
    },
    checkAllUserInfo: {
      get() {
        return this.checkedInfoColums.length === this.tableColums.info.length;
      },
      set(all) {
        if (all) {
          this.checkedInfoColums = [...this.tableColums.info];
        } else {
          this.checkedInfoColums = [];
        }
      }
    },
    isIndeterminateInfo() {
      return (
        this.checkedInfoColums.length > 0 &&
        this.checkedInfoColums.length < this.tableColums.info.length
      );
    },
    conversionStatusSelectClearable() {
      return isNumber(-this.currentConversionStatus);
    }
  },
  watch: {
    checkedInfoColums(value) {
      save(COVERNT_LIST_INFO_COLUMN_KEY, value);
    },
    checkedEventColums(value) {
      save(COVERNT_LIST_EVENT_COLUMN_KEY, value);
    }
  },
  async created() {
    await this.getConversionTypes();
    await this.getTableData();
    this.checkedInfoColums =
      read(COVERNT_LIST_INFO_COLUMN_KEY) || this.checkedInfoColums;
    this.checkedEventColums =
      read(COVERNT_LIST_EVENT_COLUMN_KEY) || this.checkedEventColums;
  }
};
</script>

<style lang="scss" scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.fade {
  -webkit-animation: fadeIn 2s 2s infinite;
  animation: fadeIn 2s 2s infinite;
}
.main {
  .inputs {
    // margin-top: 20px;
    margin-bottom: 15px;
    .search-input {
      width: 180px;
    }
    label {
      margin-left: 15px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .table {
    margin-top: 65px;
    .fack-select {
      width: 100%;
      cursor: pointer;
      .el-icon-arrow-down {
        position: relative;
        left: -3px;
      }
      .el-icon-circle-close {
        display: none;
        position: relative;
        left: -8px;
      }
      &:hover {
        .el-icon-arrow-down {
          display: none;
        }
        .el-icon-circle-close {
          display: inherit;
        }
      }
    }
    .link {
      color: #1890ff;
    }
  }
  .page {
    margin-top: 20px;
  }
}
</style>
<style lang="scss">
// .el-table {
//   .el-select .el-input .el-select__caret {
//     position: relative;
//     left: -4px;
//   }
// }
.views-covernt-list {
  .cell {
    overflow: visible;
    .user-trace {
      position: relative;
      .mouse-hover {
        position: absolute;
        right: 0px;
        top: 7px;
        z-index: 10;
      }
    }
  }
}
.colums-popover {
  .el-checkbox {
    margin-top: 10px;
    &.all {
      .el-checkbox__label {
        color: rgba(0, 0, 0, 0.85);
        // font-weight: 600;
      }
    }
  }
}
.views-covernt-list {
  .inputs {
    .btn {
      margin-left: 30px;
    }
  }
  .thead-select {
    position: relative;
    margin: 0 10px;
    top: 0px;
    padding: 0;
    .el-input {
      padding: 0;
    }
    .el-input__icon {
      position: relative;
      left: -3px;
      top: -2px;
    }
  }
}
.condition-custom {
  // .el-dialog__header {
  //   display: none;
  // }
  .el-dialog__close.el-icon-close {
    display: none;
  }
  .el-dialog__body {
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(216, 220, 230, 1);
    // padding: 0;
    border-radius: 5px;
    .btns {
      margin-top: 10px;
      margin-bottom: 10px;
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
