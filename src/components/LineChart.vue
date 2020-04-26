<template>
  <div class="components-charts-line"></div>
</template>

<script>
import echarts from "echarts";
import numeral from "numeral";

export default {
  data() {
    return {
      chart: null
    };
  },
  props: {
    data: {
      seriesName: "",
      xAxisData: [],
      seriesData: []
    },
    xFormatter: null
  },
  methods: {
    resizeHandle() {
      this.chart && this.chart.resize();
    },

    drawChart() {
      const chart = echarts.init(this.$el);
      this.chart = chart;
      window.addEventListener("resize", this.resizeHandle.bind(this));

      const LINE_COLOR = " #E5E5F0";
      // const colorWithOpacity = ["rgba(6,186,239,0.2)", "rgba(16,94,227,0.2)"];

      const option = {
        animation: false,
        grid: {
          borderWidth: 0,
          borderColor: "#ccc",
          top: 10,
          left: 35,
          right: 35,
          bottom: 40,
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: [
          {
            splitNumber: 5,
            type: "category",
            axisLine: {
              lineStyle: {
                color: LINE_COLOR
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: LINE_COLOR
              }
            },
            boundaryGap: false, // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
            // 刻度的小线
            axisTick: {
              show: true
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              inside: false,
              margin: 10,
              textStyle: {
                color: "#666666",
                fontWeight: "normal",
                fontSize: "12"
              },
              formatter: this.xFormatter
            },
            data: this.data.xAxisData
            // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          }
        ],
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: LINE_COLOR
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: LINE_COLOR
            }
          },
          axisLabel: {
            showMaxLabel: false,
            // inside: true,
            margin: 30,
            align: "left",
            // verticalAlign: "bottom",
            textStyle: {
              color: "#666666",
              fontWeight: "normal",
              fontSize: "12"
            }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line", // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {
              opacity: 0
            }
          },
          // formatter: '{b}<br />{a0}: {c0}%<br />{a1}: {c1}%<br />',
          // eslint-disable-next-line no-unused-vars
          formatter: (params, tick, callback) => {
            let title = params[0].name;
            let str = `
                            <div style="font-size: 12px;">${title}</div>
                        `;
            params.forEach(item => {
              let unitName = "";
              let formatStr = "";
              if (item.seriesName.endsWith("率")) {
                unitName = "%";
              }
              if (item.seriesName.includes("时长")) {
                formatStr = "0.1";
                unitName = "秒";
              }

              // 为了附加行内样式
              str += ` <div style="font-size: 14px;">${
                item.seriesName
              }：${numeral(item.data).format(formatStr)}${unitName}</div>`;
            });
            return str;
          },
          backgroundColor: "rgba(0,0,0,0.7)", // 背景
          padding: [10, 20], // 内边距
          extraCssText: `
                    color:rgba(36,46,66,1);
                    font-size:14px;
                    text-align: left;
                    background: rgba(255,255,255,1);
                    box-shadow:0px 2px 10px 0px rgba(207,217,223,1);
                    border-radius: 5px;` // 添加阴影
        },
        series: [
          {
            name: this.data.seriesName,
            symbolSize: 9, // 标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10[ default: 4 ]
            // symbol: "circle", // 标记的图形。ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
            smooth: true, // 是否平滑曲线显示
            showSymbol: true, // 是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示
            // data: [820, 1532, 901, 934, 1990, 1330, 1320],
            data: this.data.seriesData,
            type: "line",
            lineStyle: {
              color: "#0582DB",
              opacity: 1,
              // shadowBlur: 5,
              // shadowOffsetX: 0,
              // shadowOffsetY: 10,
              width: 2,
              type: "solid"
            },
            itemStyle: {
              color: "#0582DB"
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(13,151,231, 0.35)"
                  },
                  {
                    offset: 0.85,
                    color: "rgba(13,151,231, 0)"
                  }
                ])
              }
            }
          }
        ]
      };
      chart.setOption(option);
    }
  },

  watch: {
    data: "drawChart"
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandle);
  },

  mounted() {
    this.drawChart();
  }
};
</script>

<style lang="scss" scoped>
.components-charts-line {
  height: 300px;
}
</style>
