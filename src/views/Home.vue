<template>
  <div class="home views-home">
    <!-- 数据指标概览 -->
    <div class="clear page-select">
      <el-card class="lightpoint" :class="{expanded: !showLightPoint}">
        <template slot="header">
          亮点功能推荐
          <a class="fr expand" v-if="showLightPoint" @click="showLightPoint = false">收起</a>
          <a class="fr expand" v-else @click="showLightPoint = true">展开</a>
        </template>
        <div class="content clear">
          <div class="item">
            <p class="name">用户行为轨迹</p>
            <router-link to="/covernt/list" class="link">
              <img src="../assets/images/trace.gif" class="preview" />
            </router-link>
          </div>
          <div class="item">
            <p class="name">页面质量检测</p>
            <router-link to="/performance/list" class="link">
              <img src="../assets/images/source-detail.png" class="preview" />
            </router-link>
          </div>
          <div class="item">
            <p class="name">转化漏斗</p>
            <router-link to="/covernt/funnel" class="link">
              <img src="../assets/images/funnel.png" class="preview" />
            </router-link>
          </div>
        </div>
      </el-card>
      <page-select @change="init" class="fr"></page-select>
      <!-- <el-select
        @change="init"
        class="fr"
        placeholder="请选择落地页"
        size="small"
        v-model="currentPageId"
      >
        <el-option v-for="page in landingPages" :label="page.name" :key="page.id" :value="page.id"></el-option>
      </el-select>-->
    </div>
    <el-card header="今日数据概览" class="today-date">
      <div class="anyalis" type="flex" justify="space-around">
        <div class="item">
          <img class="fl" src="../assets/images/pv.png" />
          <div class="fl text">
            <p class="label">浏览量</p>
            <p class="num">{{ todayData.browse | numFormat }}</p>
          </div>
        </div>
        <div class="item">
          <img class="fl" src="../assets/images/uv.png" />
          <div class="fl text">
            <p class="label">访客量</p>
            <p class="num">{{ todayData.visitor | numFormat }}</p>
          </div>
        </div>
        <div class="item">
          <img class="fl" src="../assets/images/convert.png" />
          <div class="fl text">
            <p class="label">转化量</p>
            <p class="num">{{ todayData.conversionAmount | numFormat }}</p>
          </div>
        </div>
        <div class="item">
          <img class="fl" src="../assets/images/convert-percent.png" />
          <div class="fl text">
            <div class="label">
              转化率
              <el-tooltip effect="dark" placement="right" popper-class="c-tooltip">
                <div slot="content">计算公式：转化量/浏览量</div>
                <i class="icon-question"></i>
              </el-tooltip>
            </div>
            <p class="num">{{ todayData.conversionRate | numFormat("0.1") }}%</p>
          </div>
        </div>
        <div class="item">
          <img class="fl" src="../assets/images/stay.png" />
          <div class="fl text">
            <p class="label">平均停留时长</p>
            <p class="num">{{ todayData.averageResidenceTime | numFormat("0.1") }}s</p>
          </div>
        </div>
        <div class="item">
          <img class="fl" src="../assets/images/jump-out.png" />
          <div class="fl text">
            <div class="label">
              跳出率
              <el-tooltip effect="dark" placement="left" popper-class="c-tooltip">
                <div slot="content">用户停留时长小于等于2秒算一次跳出，计算公式：跳出量/浏览量</div>
                <i class="icon-question"></i>
              </el-tooltip>
            </div>
            <p class="num">{{ todayData.bounceRate | numFormat("0.1") }}%</p>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 趋势分析 -->
    <el-card header="趋势分析" class="trend-analysis">
      <div class="labels clear">
        <div class="fl">
          <label>指标:&nbsp;</label>
          <el-select
            style="width:140px;margin-left:10px;"
            @change="getChartData"
            placeholder="维度"
            size="small"
            v-model="currentDimension"
          >
            <el-option
              v-for="page in dimensions"
              :label="page.text"
              :key="page.value"
              :value="page"
            ></el-option>
          </el-select>
        </div>
        <div class="fr">
          <el-date-picker
            align="right"
            :clearable="false"
            style="width:250px;"
            v-model="query.dateRanges"
            type="daterange"
            :pickerOptions="pickerOptions"
            placeholder="选择日期"
            size="small"
            format="yyyy.MM.dd"
            @blur=" checkedStartDate = null"
            @change="getChartData"
          ></el-date-picker>
        </div>
        <div class="fr dates">
          <a
            @click="setQueryDates(dateRanges.dates)"
            :class="{ active: isSameRange(dateRanges.dates) }"
            v-for="dateRanges in defaultDates"
            :key="dateRanges.text"
          >{{ dateRanges.text }}</a>
        </div>
      </div>

      <LineChart :data="chartData" :xFormatter="xLabelFormatter" />
    </el-card>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import LineChart from "../components/LineChart";
import PageSelect from "../components/LandingPageSelect";
import { getTodayData, getTrendData } from "../plugins/api";
import { mapState } from "vuex";
// import startOfTomorrow from 'date-fns/startOfTomorrow'
import endOfToday from "date-fns/endOfToday/index";
import startOfYear from "date-fns/startOfYear";
import isBefore from "date-fns/isBefore";
import isAfter from "date-fns/isAfter";
import differenceInDays from "date-fns/differenceInDays";
import addDays from "date-fns/addDays";
import isSameDay from "date-fns/isSameDay";
import format from "date-fns/format";
import { dateComponentShortcuts, defaultDateRanges } from "../config/index";
import findIndex from "lodash/findIndex";
import endOfYesterday from "date-fns/endOfYesterday";
import isSameHour from "date-fns/isSameHour";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import addHours from "date-fns/addHours";
import subMinutes from "date-fns/subMinutes";
const TODAY = endOfToday();
/** 起始日期2019年初 */
const START_DATE = startOfYear(new Date().setFullYear(2019));
const HOUR_XLABEL_FORMATTER = value => (value || "").slice(0, 5);

export default {
  name: "home",
  data() {
    const vm = this;
    return {
      showLightPoint: true,

      xLabelFormatter: HOUR_XLABEL_FORMATTER,

      currentDimension: {
        text: "浏览量",
        value: "browse"
      },
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
      defaultDates: defaultDateRanges,
      checkedStartDate: null,
      todayData: {},
      query: {
        dateRanges: [TODAY, TODAY]
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
      },
      chartData: []
    };
  },
  computed: {
    currentPageId: {
      get() {
        return this.$store.state.currentLandingPageId;
      },
      set(id) {
        this.$store.commit("setCurrentLandingPageId", id);
      }
    }
  },
  components: {
    LineChart,
    PageSelect
    // HelloWorld
  },
  methods: {
    /**
     * 是否为已经选择的日期
     * @param dates {Array<Date>} 日期
     */
    isSameRange(dates) {
      if (
        isSameDay(this.query.dateRanges[0], dates[0]) &&
        isSameDay(this.query.dateRanges[1], dates[1])
      ) {
        return true;
      }
    },
    setQueryDates(dates) {
      this.query.dateRanges = [...dates];
      this.getChartData();
    },
    getTOdayData() {
      getTodayData(this.currentPageId).then(res => {
        this.todayData = res || {};
      });
    },
    getChartData() {
      const formatStr = "yyyy-MM-dd";
      const timeFormatStr = "HH:mm";

      getTrendData({
        landingPageId: this.currentPageId,
        startTime: format(
          startOfDay(this.query.dateRanges[0]),
          "yyyy-MM-dd HH:mm:ss"
        ),
        endTime: format(
          endOfDay(this.query.dateRanges[1]),
          "yyyy-MM-dd HH:mm:ss"
        )
      }).then(res => {
        const getDataFromDate = currentDate => {
          const index = findIndex(res || [], item => {
            return isSameDay(currentDate, new Date(item.createTime));
          });
          if (index !== -1) {
            return res[index];
          } else {
            return {
              id: 1,
              dataType: 0,
              conversionId: 11,
              landingPageId: 8,
              status: 1,
              browse: 0,
              visitor: 0,
              conversionAmount: 0,
              conversionRate: 0,
              averageResidenceTime: 0,
              bounceRate: 0,
              createTime: currentDate
            };
          }
        };
        const [startDate, endDate] = this.query.dateRanges;
        const startDateStr = format(this.query.dateRanges[0], formatStr);
        const endDateStr = format(this.query.dateRanges[1], formatStr);
        const dates = [];
        let seriesData = [];
        if (
          startDateStr !== endDateStr ||
          (startDateStr !== format(new Date(), formatStr) &&
            startDateStr !== format(endOfYesterday(), formatStr))
        ) {
          this.xLabelFormatter = null;
          /** 如果起始结束不为同一天,不为今天也不为昨天 按照日期显示 */
          let nextDate = startDate;
          while (!isSameDay(endDate, nextDate)) {
            dates.push(format(nextDate, formatStr));
            seriesData.push(getDataFromDate(nextDate));
            nextDate = addDays(nextDate, 1);
          }
          dates.push(format(endDate, formatStr));
          seriesData.push(getDataFromDate(nextDate));
        } else {
          /** 如果为同一天,按照小时显示 */
          this.xLabelFormatter = HOUR_XLABEL_FORMATTER;
          const startHour = startOfDay(startDate);
          let currentHour = addHours(startHour, 0);
          let endHour = addHours(startHour, 24);
          while (!isSameHour(currentHour, endHour)) {
            const endTime = subMinutes(addHours(currentHour, 1), 1);

            dates.push(
              `${format(currentHour, timeFormatStr)}-${format(
                endTime,
                timeFormatStr
              )}`
            );

            const index = findIndex(res, item => {
              return isSameHour(new Date(item.createTime), currentHour);
            });

            if (index !== -1) {
              console.log(currentHour, res[index].conversionAmount, 'now')
              seriesData.push(res[index]);
            } else {
              seriesData.push({
                id: 1,
                dataType: 0,
                conversionId: 11,
                landingPageId: 8,
                status: 1,
                browse: 0,
                visitor: 0,
                conversionAmount: 0,
                conversionRate: 0,
                averageResidenceTime: 0,
                bounceRate: 0,
                createTime: format(currentHour, timeFormatStr)
              });
            }
            currentHour = addHours(currentHour, 1);
          }
          /** 按照小时显示 */
        }

        seriesData = seriesData.map(
          item => item[this.currentDimension.value] || 0
        );

        const xAxisData = dates;
        this.chartData = {
          seriesName: this.currentDimension.text,
          seriesData,
          xAxisData
        };
      });
    },
    init() {
      this.getChartData();
      this.getTOdayData();
    }
  },
  created() {
    // if (!this.currentPageId && window.__IS_DEV__) {
    //   return this.$message.warning("当前用户下不存在落地页");
    // }
    this.init();
  }
};
</script>

<style lang="scss">
.views-home {
  .el-card__header {
    padding: 12px 0px;
    height: 45px;
    font-size: 14px;
    margin: 0 20px;
  }
  .el-card__body {
    padding: 12px 20px;
  }
}
</style>

<style lang="scss">
.home {
  .expanded {
    .el-card__body {
      display: none;
    }
  }
  .lightpoint {
    margin: 15px 0;
    .expand {
      color: #858585;
      &:hover {
        color: #1890ff;
      }
    }

    .content {
      margin-bottom: 5px;
      display: flex;
      .item {
        // float: left;
        flex: 1 140px;
        // margin-right: 140px;
        &:last-child {
          margin-right: 0;
        }
        p.name {
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
          margin-top: 0px;
          color: #858585;
        }
        .link {
          display: flex;
          width: 338px;
          height: 324px;
          background: rgba(254, 254, 254, 1);
          box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
          padding: 0 13px;
          overflow: hidden;
          align-items: center;
          &:hover {
            box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.27);
          }
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .today-date {
    margin-top: 10px;
  }
  .anyalis {
    padding: 0;
    display: flex;
    justify-content: space-between;
    .item {
      margin: 0;
      display: flex;
      align-items: center;
      width: 155px;
      &:nth-child(1) img:hover {
        box-shadow: 0px 10px 20px 1px #f7ddb1;
      }
      &:nth-child(2) img:hover {
        box-shadow: 0px 10px 20px 1px #f8c4c4;
      }
      &:nth-child(3) img:hover {
        box-shadow: 0px 10px 20px 1px #b6e2c3;
      }
      &:nth-child(4) img:hover {
        box-shadow: 0px 10px 20px 1px #dec8f4;
      }
      &:nth-child(5) img:hover {
        box-shadow: 0px 10px 20px 1px #c7d8eb;
      }
      &:nth-child(6) img:hover {
        box-shadow: 0px 10px 20px 1px #bce8e1;
      }

      img {
        transition: all 0.2s;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        &:hover {
          transform: translateY(-4px);
        }
      }
      .text {
        margin-left: 15px;
        p {
          margin: 0;
        }
        .label {
          font-size: 14px;
          color: rgba(133, 133, 133, 1);
          font-weight: 500;
        }
        .num {
          margin-top: 13px;
          font-size: 16px;
          color: rgba(36, 46, 66, 1);
          font-weight: 600;
        }
      }
    }
  }
  .trend-analysis {
    margin-top: 10px;
    .labels {
      margin-bottom: 10px;
      label {
        font-weight: 400;
        color: rgba(133, 133, 133, 1);
        font-size: 14px;
      }
      .dates {
        a {
          margin-right: 10px;
          font-size: 14px;
          font-weight: 400;
          line-height: 30px;
          color: #858585;
          &.active {
            color: rgba(84, 154, 234, 1);
          }
        }
      }
    }
  }
}
</style>
