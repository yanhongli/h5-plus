<template>
  <div class="wrapper"></div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["data"],
  data: function() {
    return {
      chart: null
    };
  },
  methods: {
    draw: function() {
      this.chart = echarts.init(this.$el);
      this.chart.setOption({
        color: ["#8EC9EB"],
        legend: {
          data: ["高度(km)与气温(°C)变化关系"]
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b} : {c}"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "1%",
          top: "0",
          containLabel: true
        },
        xAxis: {
          type: "value",
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: "{value}"
          }
        },
        yAxis: {
          type: "category",
          axisLine: { onZero: false },
          axisLabel: {
            formatter: function(value){
                if(value.toString().length > 20) {
                    return value.toString().substring(0, 20) + "...";
                }
                return value;
            }
          },
          boundaryGap: true,
          data: this.data.yAxisData
          //["http://www.baidu.com", "http://www.baidu.com", "http://www.baidu.com", "http://www.baidu.com", "http://www.baidu.com", "http://www.baidu.com", "http://www.baidu.com", "http://www.baidu.com", "http://www.baidu.com"]
        },
        series: [
          {
            // name: "",
            type: "bar",
            smooth: true,
            barCategoryGap: 25,
            label: {
            normal: {
                show: true,
                lineHeight: 30,
                // width: 80,
                // height: 30,
                position: ['101%', '-5'],
                distance: 1,
                formatter: function(d){
                    return d.data;
                },
                rich: {
                    d: {
                        color: '#3CDDCF',
                    },
                    a: {
                        color: '#fff',
                        align: 'center',
                    },
                    b: {
                        width: 1,
                        height: 30,
                        borderWidth: 1,
                        borderColor: '#234e6c',
                        align: 'left'
                    },
                }
            }
        },
            lineStyle: {
              width: 3,
              shadowColor: "rgba(0,0,0,0.4)",
              shadowBlur: 10,
              shadowOffsetY: 10
            },
            data: this.data.seriesData
            //[15, 50, 56.5, 46.5, 22.1, 2.5, 27.7, 55.7, 76.5]
          }
        ]
      });
    }
  },
  beforeDestroy: function() {},
  mounted: function() {
      this.draw();
  },
  watch: {
    data: "draw"
  }
};
</script>

<style lang="scss" scoped>
    .wrapper{
        height: 500px;
    }
</style>
