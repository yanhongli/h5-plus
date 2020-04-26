<template>
  <div class="components-charts-bar"></div>
</template>

<script>
  import echarts from "echarts";
  import numeral from "numeral";
  import cloneDeep from "lodash/cloneDeep";
  export default {
    name: "HorizontalBarChart",
    data() {
      return {
        chart: null,
        chartOption: null,
        chartData: this.data,
        yAxisData: [],
        yAxisDataCopy: [],
        seriesData: [],
      };
    },
    props: {
      data: Array,
      select: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        default: ""
      }
    },
    methods: {
      getChartData(){
        this.chartData.forEach(item => {
          this.seriesData.push(item.uv)
          this.yAxisData.push(item.depth)
          this.yAxisDataCopy.push(item.depth)
        })
      },
      resizeHandle() {
        this.chart && this.chart.resize();
      },

      drawChart() {
        const chart = echarts.init(this.$el);
        this.chart = chart;
        window.addEventListener("resize", this.resizeHandle.bind(this));

        const LINE_COLOR = "#A3D9E7";
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
          },
          grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            top: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            name: '访客量',
            axisLabel: {
              color: '#C7CCCD'
            }
          },
          yAxis: {
            type: 'category',
            data: this.yAxisData.reverse().map(item=>{ return item+'%'}),
            // y轴字体颜色
            axisLabel: {
              color: (value)=> {
                // return value === this.select ? '#000000' : '#C7CCCD';
                return '#C7CCCD';
              },
            }
          },
          series: [
            {
              name: '深度',
              type: 'bar',
              itemStyle: {
                normal: {
                  //这里是重点
                  color: LINE_COLOR
                },
                //鼠标悬停时：
                emphasis: {
                  label: {
                    color: '#7F7F7F',
                    fontWeight: 'bolder',

                  },
                  labelLine: {
                    width: '100%',
                  },
                  color: LINE_COLOR,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  textStyle: {
                    color: '#C7CCCD',
                    fontSize: '12',
                  }
                }
              },
              data: this.seriesData.reverse()
            }
          ],
        }

        this.chartOption = option;
        this.chart.setOption(option);
      }
    },
    mounted() {
      this.getChartData();
      this.drawChart();
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.resizeHandle);
    },
    watch: {
      data: "drawChart"
    }
  }
</script>

<style lang="scss" scoped>
  .chart{
    height: 389px;
  }
  .chart-x {
    height: 616px;
  }
</style>
