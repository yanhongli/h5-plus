<template>
  <div class="components-charts-line"></div>
</template>

<script>
import echarts from "echarts";
import numeral from "numeral";
import cloneDeep from "lodash/cloneDeep";
import format from "date-fns/format";
export default {
  data() {
    return {
      chart: null,
      chartOption: null,
      title: ""
    };
  },
  props: {
    data: {
      xAxisData: [],
      seriesData: []
    },
    dataZoom: {
      type: Object,
      default: () => ({
        start: 0,
        end: 100
      })
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
      const legend = {
        top: 0,
        orient: "horizontal",
        align: "left",
        textStyle: {}
      };
      const option = {
        animation: false,
        legend,
        grid: {
          borderWidth: 0,
          borderColor: "#ccc",
          top: 70,
          left: 35,
          right: 35,
          bottom: 25,
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: [],
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
          // eslint-disable-next-line no-unused-vars
          formatter: (params, tick, callback) => {
            let str = `
                            <div style="font-size:12px;">${this.title}</div>
                        `;
            const resveParams = params.reverse().forEach((item, index) => {
              const reverseData = [...this.data].reverse();
              const currentSeries = reverseData[index]["series"][0];
              let unitName = "";
              let formatStr = "";
              let value = item.axisValue;

              if (this.title.endsWith("率")) {
                unitName = "%";
                formatStr = "0.1";
              }
              if (this.title.includes("时长")) {
                formatStr = "0.1";
                unitName = "秒";
              }

              let stackStr = "";
              /** 按小时显示 */
              if (currentSeries.stack) {
                stackStr = currentSeries.stack + " ";
                value = value.slice(0, 5) + " ";
                // console.log(stackStr, item)
              }

              // 为了附加行内样式
              str += ` <div style="font-size: 14px;">${stackStr}${value}：${numeral(
                item.data
              ).format(formatStr)}${unitName}</div>`;
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
        series: []
      };

      const xAxisTpl = {
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
          show: false
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
        data: this.data.xaxisData
        // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      };

      const seriesTpl = {
        name: "",
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
      };

      // if (!this.data.series || this.data.series.length === 0) {
      //   return;
      // }

      this.data.forEach((item, index) => {
        const series = cloneDeep(seriesTpl);
        const xAxis = cloneDeep(xAxisTpl);

        if (index !== 0) {
          // series.lineStyle.color = "#F0166D";
          // series.itemStyle.color = "#F0166D";
        }

        Object.assign(series, item["series"][0], { xAxisIndex: index });
        Object.assign(xAxis, { data: item.xaxisData });

        // legend.data.push({
        //   name: format(new Date(xAxis.data[0]), 'yyyy.MM.dd') + '-' + format(new Date(xAxis.data[xAxis.data.length - 1]), 'yyyy.MM.dd')
        // })
        this.title = series.name;
        // console.log(series)
        //  series.name = xAxis.data[0]
        try {
          series.name =
            format(new Date(xAxis.data[0]), "yyyy.MM.dd") +
            "-" +
            format(new Date(xAxis.data[xAxis.data.length - 1]), "yyyy.MM.dd");
        } catch (error) {
          series.name = format(new Date(series.stack), "yyyy.MM.dd");
        }

        if (index === 1) {
          xAxis.show = true;
          // series.lineStyle.type = "dashed";
          series.lineStyle.color = "#F0166D";
          series.itemStyle.color = "#F0166D";

          series.areaStyle.normal = {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(240,22,109, 0.35)"
              },
              {
                offset: 0.85,
                color: "rgba(240,22,109, 0)"
              }
            ])
          };
        }
        // console.log(xAxis)

        // yLabel.name = item.name;
        // tpl.yAxisIndex = index;
        option.series.push(series);
        option.xAxis.push(xAxis);
        // option.yAxis.push(yLabel);
      });
      // option.legend = {data: legends, top: 0}

      this.chartOption = option;

      if (__IS_DEV__) {
        console.log("chartoption", option);
      }
      chart.setOption(option, true);
    }
  },

  watch: {
    data() {
      this.$nextTick().then(() => {
        this.drawChart();
      });
    }
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
  height: 320px;
}
</style>
