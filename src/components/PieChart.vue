<template>
  <div class="host"></div>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      chart: null
    };
  },
  props: {
    data: {
      titleText: "",
      seriesName: "",
      legendData: [],
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
      const option = {
        title: {
          text: this.data.titleText,
          show: false,
          x: "center",
          textStyle: {
            fontSize: "14",
            fontweight: "500",
            color: "rgba(46,48,57,1)",
            lineHeight: "20"
          }
        },
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            name: this.data.seriesName,
            data: this.data.seriesData,
            label: {
              formatter: "{b} \n\n {d}%"
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      chart.setOption(option);
      this.chart.resize();
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
    window.addEventListener("resize", this.resizeHandle.bind(this));
  }
};
</script>

<style lang="scss" scoped>
.host {
  height: 400px;
  width: 400px;
}
</style>
