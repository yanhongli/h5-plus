<template>
  <div class="views-covert-fun">
    <el-card>
      <div class="inputs">
        <label>落地页名称：</label>
        <page-select  class="search-input"/>
        <label for>操作系统：</label>
        <el-select v-model="currentOs" size="small" class="search-input" placeholder="全部" clearable>
          <el-option v-for="os in osList" :key="os.name" :label="os.name" :value="os.value"></el-option>
        </el-select>
        <label>地区：</label>
        <el-cascader
          class="search-input"
          @visible-change="openAreaSelectHandler"
          ref="areaSelect"
          :show-all-levels="false"
          v-model="currentArea"
          collapse-tags
          size="small"
          :options="areaList"
          placeholder="全部"
          :props="cascaderProps"
          clearable
        ></el-cascader>
        <label>日期：</label>
        <el-date-picker
          
          :clearable="false"
          style="width:210px;"
          type="daterange"
          v-model="dateRange"
          :pickerOptions="pickerOptions"
          align="right"
          placeholder="选择日期"
          size="small"
          @blur=" checkedStartDate = null"
          format="yyyy.MM.dd"
        ></el-date-picker>
        <el-button class="btn"  @click="getChartData" type="primary" style="margin-left:14px;" size="small" :disabled="loading"> 查询</el-button>
        <el-button class="btn" @click="exportPic" type="primary" style="margin-left:14px;" size="small"  :disabled="!chartData || loading"> 导出图片</el-button>
      </div>
      <!-- <div class="utils">
        <el-button @click="savePng">导出图片</el-button>
      </div>-->
      <div class="chart-warp">
        <Chart class="chart" :isAll="isAll" :chart-data="chartData" v-if="chartData" ref="chart" />
      </div>
    </el-card>
  </div>
</template>


<script>
import FunnelChart from "../../components/FunnelChart";
import PageSelect from "../../components/LandingPageSelect";
import { OS_LIST_WITHOUT_ALL } from "../../config/os";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import differenceInDays from "date-fns/differenceInDays";
import subDays from "date-fns/subDays";
import endOfToday from "date-fns/endOfToday";
import endOfYesterday from "date-fns/endOfYesterday";
import startOfYear from "date-fns/startOfYear";
import format from 'date-fns/format'
import { dateComponentShortcuts } from "../../config";
import { apiAreaList } from "../../plugins/api/area";
import { getFunnelData } from '../../plugins/api'
const TODAY = endOfToday();
const START_DATE = startOfYear(new Date().setFullYear(2019));
const ALL_AREA_ID = "$quanguo";
export default {
  components: { Chart: FunnelChart, PageSelect },
  computed: {
    landingPageId () {
        return this.$store.state.currentLandingPageId;
    },
    isAll() {
      return !this.currentOs && (this.currentArea.length === 0 || this.currentArea.length === 341)
    },
    currentLandingPage () {
      return this.$store.getters.currentLandingPage
    }
  },
  data() {
    const vm = this;
    return {
      loading: false,
      currentArea: [],
      cascaderProps: {
        emitPath: false,
        multiple: true,
        label: "name",
        children: "list",
        value: "code"
      },
      areaList: [],
      checkedStartDate: "",
      currentOs: "",
      osList: OS_LIST_WITHOUT_ALL,
      chartData: null,
      dateRange: [subDays(endOfYesterday(), 6), endOfYesterday()],
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
    async openAreaSelectHandler(isOpen) {
      if (isOpen) {
        await this.$nextTick();
        this.$refs.areaSelect.panel.$children[0].$children[0].$children[2].handleExpand();
      }
    },
    getAreaList() {
      apiAreaList().then(res => {
        res.unshift();
        this.areaList = [
          {
            name: "全部",
            code: ALL_AREA_ID,
            list: res
          }
        ];
      });
    },
    getChartData() {
      this.loading =true
      getFunnelData({
        landingPageId: this.landingPageId,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1],
        os: this.currentOs,
        province: '',
        city: this.currentArea.join(',')
      }).then(res => {
        this.chartData = null
        setTimeout(() => {
          if (res.rs && res.rs === 1) {
            this.$message.warning('暂无数据')
            this.chartData = null
            return
          }
          this.chartData = res
        }, 0);
      }).finally(() => {
        this.loading =false
      })
    },
    exportPic() {
      if (this.$refs.chart) {
        const landingPageName = this.currentLandingPage?this.currentLandingPage.name: ''
        const startTime = format(this.dateRange[0], 'yyyyMMdd')
        const endTime = format(this.dateRange[1], 'yyyyMMdd')
        const picName = `${landingPageName?landingPageName + '_': '' }流量漏斗_${startTime} 至 ${endTime}`
        this.$refs.chart.savePng(picName)
      }
    }
  },
  created() {
    this.getAreaList();
    this.getChartData();
  }
};
</script>

<style lang="scss">
.views-covert-fun{

.chart{
  margin-top:40px;
}
.inputs {
  // margin-top: 20px;
  margin-bottom: 15px;
  .search-input {
    width: 145px !important;
    .el-input__inner::-webkit-input-placeholder {
        color: #606266 !important;
    }
  }
  .btn{
    width:75px;
    margin-left:12px;
  }
  label {
    margin-left: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    &:first-child {
      margin-left: 0;
    }
  }
}
}
</style>