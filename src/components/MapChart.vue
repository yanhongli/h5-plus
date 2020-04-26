<template>
  <div class="map-chart">
    <h2 class="title">地域分析</h2>
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import "../assets/lib/china";
import echarts from "echarts";
import numeral from "numeral";

export default {
  props: ["data"],
  data() {
    return {
      echartsInstance: null
    };
  },
  methods: {
    drawChart() {
      const option = {
        geo: {
          label: { emphasis: { show: false } }
        },
        tooltip: {
          show: true,
          trigger: "item",
          formatter: (params, tick, callback) => {
            let title = params.seriesName;
            let str = `
                            <div style="font-size: 12px;">${title}</div>
                        `;
            let unitName = "";
            let formatStr = "";
            if (title.endsWith("率")) {
              unitName = "%";
            }
            if (title.includes("时长")) {
              formatStr = "0.1";
              unitName = "秒";
            }

            // 为了附加行内样式
            str += ` <div style="font-size: 14px;">${params.name}：${numeral(
              params.value
            ).format(formatStr)}${unitName}</div>`;
            return str;
          }
        },
        series: [
          {
            emphasis: { label: { show: true } },
            name: this.data.seriesName,
            map: "china",
            itemStyle: {
              label: {
                show: true
              },
              emphasis: {
                areaColor: "white"
                // shadowColor: "rgba(0, 0, 0, 0.2)"
                // shadowBlur: 5
              },
              borderColor: "#fff"
            },
            type: "map",
            roam: false,
            zoom: 1.2,
            label: {
              show: false
            },
            data: this.data.seriesData //[{ name: "北京", value: 233 }, { name: "黑龙江", value: 192 }]
          }
        ],
        visualMap: [
          {
            seriesIndex: 0,
            inverse: false,
            show: false,
            type: "continuous",
            orient: "vertical",
            itemWidth: 10,
            itemHeight: 50,
            text: ["高", "低"],
            // showLabel: true,
            min: 1,
            max: 200,
            inRange: {
              color: ["#cfe5f9", "#0d7fe3"]
            },
            textStyle: {
              color: "#bababa"
            },
            bottom: 30,
            left: "left"
          }
        ]
      };
      this.echartsInstance.setOption(option);
    }
  },
  mounted() {
    this.echartsInstance = echarts.init(this.$refs.chart);
    this.drawChart();
  },
  watch: {
    data: "drawChart"
  }
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  text-align: center;
  line-height: 20px;
  font-weight: 500;
  color: rgba(46, 48, 57, 1);
  margin: 20px 0;
}
.chart {
  height: 414px;
  width: 500px;
  margin: 0 auto;
  // border: 1px dashed #000;
}
</style>
