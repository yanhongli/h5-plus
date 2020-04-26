<template>
  <div class="main">
    <el-card>
      <el-row type="flex">
        <div class="el-col-24">
          <el-row type="flex" align="middle">
            <span class="page-mark-wapper">
              评分:
              <b class="page-mark">{{score}}</b>分
            </span>
            <el-rate v-model="scoreRate" disabled text-color="#ff9900"></el-rate>
            <el-button
              type="primary"
              size="small"
              @click="showRateDes = !showRateDes"
            >{{ showRateDes ? '收起' : '展开' }}计分说明</el-button>
          </el-row>
          <el-row v-if="showRateDes" class="mt-20" style="padding-left: 12px;">
            计分说明：分值标识页面可访问行情况
            <div class="rate-deses mt-20">
              <span class="des">0-2：堪忧</span>
              <span class="des bad">2-4：较差</span>
              <span class="des normal">4-6：一般</span>
              <span class="des good">6-8：较好</span>
              <span class="des better">8-10：非常好</span>
            </div>
          </el-row>
          <el-row class="unit-group mt-20">
            <Unit label="白屏时间" :value="summary.firstContentfulPaint | msToTime" unit="秒" />
            <Unit label="首资源时间" :value="summary.timeToFirstByte | msToTime" unit="秒" />
            <Unit label="有效渲染时间" :value="summary.firstMeaningfulPaint | msToTime" unit="秒" />
            <Unit label="页面加载时间" :value="summary.firstCpuIdle | msToTime" unit="秒" />
            <Unit label="网页总大小" :value="summary.totalByteWeight | byteToSize('mb', 2)" unit="MB" />
            <Unit label="DOM" :value="summary.domSize | numFormat" unit="个" />
            <Unit label="重定向数" :value="summary.redirects | numFormat" unit="个" />
          </el-row>
          <el-row>
            <label class="legend">统计信息</label>
            <el-row type="flex">
              <el-table :data="resourceMap.rows" border>
                <el-table-column
                  v-for="item in resourceMap.columns"
                  :key="item.id"
                  :prop="item.id"
                  :label="item.name"
                >
                  <template slot-scope="scope">
                    <template
                      v-if="scope.column.property === 'size'"
                    >{{scope.row[scope.column.property] | byteToSize('mb', 2)}}</template>
                    <template v-else>{{scope.row[scope.column.property]}}</template>
                  </template>
                </el-table-column>
              </el-table>
              <PieChart :data="resourceMap.chartData"></PieChart>
            </el-row>
          </el-row>
          <el-row>
            <label class="legend">加载最慢的十个资源</label>
            <el-row>
              <LineGraphic :data="slowResourceList.chartData" />
            </el-row>
          </el-row>
          <el-row>
            <label class="legend">扣分细则和改善建议</label>
            <el-row>
              <el-table :data="scoreDetail.rows" style="width: 100%" :row-class-name="getRowClass">
                <el-table-column label="改善建议" type="expand" width="100">
                  <template slot-scope="scope">
                    <template v-if="scope.row.detail.length">
                      <ul class="detail-info">
                        <li v-for="(d, index) in scope.row.detail" :key="index" class="detail-item">
                          <el-row type="flex" justify="space-between">
                            <div>
                              <span class="detail-item-link">{{d.url}}</span>
                            </div>
                            <div class="bar">
                              大小：{{d.totalBytes | byteToSize('mb', 2)}} MB
                              耗时：{{d.timeCost | msToTime}}秒
                            </div>
                          </el-row>
                        </li>
                      </ul>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="item in scoreDetail.columns"
                  :key="item.id"
                  :label="item.name"
                  :prop="item.id"
                  :width="item.width"
                >
                  <template slot-scope="scope">
                    <el-row v-if="scope.column.property == 'percent'" type="flex" align="middle">
                      <el-col :span="20">
                        <el-progress
                          :percentage="scope.row.percent"
                          :color="customColors"
                          :format="storeFormat"
                          :show-text="false"
                        ></el-progress>
                      </el-col>
                      <span
                        :class="{'score-good': scope.row.percent >= 90, 'score-bad': scope.row.percent < 90 }"
                      >{{storeFormat(scope.row.percent)}}</span>
                    </el-row>
                    <el-row v-else>{{scope.row[scope.column.property]}}</el-row>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-row>
        </div>
        <div class="ml-50 task-info">
          <el-row>
            <label>页面地址：</label>
          </el-row>
          <el-row class="mt-20">
            <a :href="task.url" class="link" target="_blank">{{task.url}}</a>
          </el-row>
          <el-row class="mt-20 gray">
            <label>落地页类型：</label>
            <span>{{task.typeStr}}</span>
          </el-row>
          <el-row class="mt-20 gray">
            <label>模拟网络环境：</label>
            <span>{{task.netEnv}}</span>
          </el-row>
          <el-row class="mt-20 gray">
            <label>模拟平台：</label>
            <span>{{task.os}}</span>
          </el-row>
          <el-row class="mt-20 gray">
            <label>提测时间：</label>
            <span>{{task.createTime}}</span>
          </el-row>
          <el-row class="mt-20 gray">
            <label>检测时间：</label>
            <span>{{task.createTime}}</span>
          </el-row>
          <el-row class="mt-20 gray">
            <label>状态：</label>
            <span>{{task.statusStr}}</span>
          </el-row>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Unit from "../../components/Unit";
import PieChart from "../../components/PieChart";
import LineGraphic from "../../components/LineGraphic";
import { apiScoreDetail } from "../../plugins/api";
import { data, MOCKDATA } from "./data.Task";
import { getScoreInfo } from "./pageLoadScores";
export default {
  components: {
    Unit,
    PieChart,
    LineGraphic
  },
  data: function() {
    return {
      ...data()
    };
  },
  methods: {
    storeFormat(p) {
      return ((p - 100) / 10).toString();
    },
    getScoreDetail() {
      apiScoreDetail({
        id: this.id
      }).then(e => {
        this.task = e;
        this.score = e.score;
        this.scoreRate = e.score / 2;
        let gradeDetail = JSON.parse(e.gradeDetail);
        this.setGradeDetail(gradeDetail);
      });
    },
    setGradeDetail(gradeDetail) {
      Object.assign(this.summary, gradeDetail.summary);
      this.resourceMap.chartData = {
        seriesData: gradeDetail.resourceMap
          .filter(e => e.resourceType !== "total")
          .map(e => ({ name: e.label, value: e.requestCount }))
      };
      this.resourceMap.rows.push(...gradeDetail.resourceMap);
      this.slowResourceList.chartData = {
        yAxisData: gradeDetail.slowResourceList.map(e => e.url),
        seriesData: gradeDetail.slowResourceList.map(e => ((e.timeCost || 0) / 1000).toFixed(2))
      };
      this.scoreDetail.rows.push(
        ...gradeDetail.scoreDetail.map(e => getScoreInfo(e))
      );
    },
    getRowClass(row) {
      if (row.row.detail.length == 0) {
        return "row-expand-cover";
      }
    }
  },
  mounted: function() {
    let id = this.$route.params["id"];
    this.id = id;
    this.getScoreDetail();
  }
};
</script>

<style lang="scss" scoped>
.main {
  font-size: 12px;
}
.unit-group > * {
  margin-right: 20px;

  &:last-of-type {
    margin-right: 0;
  }
}
.page-mark-wapper {
  border-left: 4px solid red;
  padding-left: 10px;
  padding-right: 20px;
  .page-mark {
    font-size: 18px;
    padding: 0 5px;
  }
}
.rate-deses {
  font-size: 12px;
  .des {
    padding: 0 30px;
    position: relative;
    &:not(:last-of-type):after {
      position: absolute;
      content: "|";
      left: 100%;
      bottom: 3px;
      color: black;
      font-size: 12px;
    }
    &.worse {
      color: #ad0e0e;
      font-size: 12px;
    }
    &.bad {
      color: #ef7f25;
      font-size: 14px;
    }
    &.normal {
      color: #4b0faa;
      font-size: 16px;
    }
    &.good {
      color: #0486fe;
      font-size: 18px;
    }
    &.better {
      color: #0cba02;
      font-size: 20px;
    }
  }
}
.legend {
  font-size: 14px;
  color: #ef7f25;
  display: block;
  border-bottom: 1px solid #ef7f25;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 12px 0;
}
.task-info {
  width: 250px;
  flex-shrink: 0;
  font-size: 12px;
  word-wrap: break-word;
  .link {
    color: #0486fe;
  }
}
.detail-item {
  margin-bottom: 10px;
  font-size: 12px;
  &:last-of-type {
    margin-bottom: 0;
  }
  .detail-item-link {
    color: #0486fe;
  }
}
.score-good {
  color: #53e000;
  padding-left: 2px;
}
.score-bad {
  color: #ef7f25;
  padding-left: 2px;
}
</style>
