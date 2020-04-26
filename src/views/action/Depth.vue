<template>
  <div class="views-behavior-deepMap">
    <el-card class="deepMap-wrap" :class="{'deepMap-wrap-x': isIphoneX}" :body-style="{ height: '100%' }">
      <div class="inputs">
        <label>落地页：</label>
        <el-select
          placeholder="落地页名称："
          size="small"
          v-model="currentPageId"
          class="search-input"
        >
          <el-option
            v-for="page in landingPages"
            :key="page.id"
            :label="page.name"
            :value="page.id"
          ></el-option>
        </el-select>

        <label>日期：</label>
        <el-date-picker
          class="search-input"
          :clearable="false"
          style="width: 250px;"
          type="daterange"
          v-model="dateRange"
          align="left"
          placeholder="选择日期"
          size="small"
          format="yyyy.MM.dd"
          :pickerOptions="pickerOptions"
        ></el-date-picker>

        <el-button
          size="small"
          style="width: 90px;"
          type="primary"
          :loading="loading"
          @click="getDeepChartData(true)"
        >生成
        </el-button>
        <el-button
          size="small"
          class="download"
          type="primary"
          :disabled="!chartData.length"
          @click="download()"
        >导出图片
        </el-button>
      </div>
      <div class="charts-container">
        <div class="left-box iphone-outer">
          <div class="m-warp" ref="wrap">
            <!--生成前-->
            <div v-if="before" class="tip-wrap">
              <div class="warning-ico">
                <img src="../../assets/images/init_icon.png" alt=""/>
              </div>
              您还没有生成落地页深度图
            </div>
            <!--生成中-->
            <div v-if="loading" class="tip-wrap">
              <div class="warning-ico">
                <img src="../../assets/images/loading_icon.png" alt=""/>
              </div>
              深度图正在生成中，请稍候…
            </div>
            <!--生成后没数据-->
            <div v-if="!loading && imgHeight && !chartData.length && over" class="tip-wrap">
              <div class="warning-ico">
                <img src="../../assets/images/empty_icon.png" alt=""/>
              </div>
              该落地页目前还没有积累到深度图数据
            </div>
            <!--生成后有数据-->
            <div class="m-view scrollbar" v-if="!loading && imgHeight && chartData.length && over" @scroll="scrollGet($event)">
              <div :style="{height: imgHeight + 'px',backgroundImage: `url(${imgUrl})`}" class="deepMap-container"></div>
            </div>
          </div>
        </div>
        <div class="center-box">
          <img src="../../assets/images/arrow.png" alt="">
        </div>
        <div class="right-box">
          <div class="header-tip">
            <span class="header-title">落地页浏览深度</span>
          </div>
          <div v-if="before" class="no-chart">
            您还没有生成落地页深度图
          </div>
          <div v-if="loading" class="no-chart">
            深度图正在生成中，请稍候…
          </div>
          <div v-if="!loading && imgHeight && !chartData.length && over" class="no-chart">
            该落地页目前还没有积累到深度图数据
          </div>
          <horizontal-bar-chart class="chart" :class="{'chart-x': isIphoneX}" title="浏览深度的转化分析" :data="chartData" :select="selectName" v-if="!loading && imgHeight && chartData.length && over" ref="chart"/>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import HorizontalBarChart from "../../components/HorizontalBarChart";
  import {mapState} from "vuex";
  import subDays from "date-fns/subDays";
  import {dateComponentShortcuts} from "../../config";
  import format from "date-fns/format";
  import isAfter from "date-fns/isAfter";
  import isBefore from "date-fns/isBefore";
  import endOfToday from "date-fns/endofToday";
  import startOfYear from "date-fns/startOfYear";
  import {getDepthChartData, screenShot} from "../../plugins/api";
  import * as $ from 'jquery';
  import echarts from "echarts";
  const TODAY = endOfToday();
  const YESTERDAY = subDays(TODAY, 1);
  const START_DATE = startOfYear(new Date().setFullYear(2019));
  const IMG_WIDTH = document.documentElement.clientHeight < 800 ? 185 : 294; // 小屏与大屏的宽度
  export default {
    name: "depth",
    components: {
      horizontalBarChart: HorizontalBarChart,
    },
    data() {
      return{
        chartData: [],
        chartDataCopy: [],
        chart: '',
        selectName: '', // chart选中的name
        dateRange: [subDays(YESTERDAY, 6), YESTERDAY],
        screenHeight: document.documentElement.clientHeight, // 屏幕高度
        cacheMaxNum: 80, // 缓存的最大个数
        before: true, // 加载前
        loading: false, // 加载结束
        over: false, //判断加载完成
        imgHeight: 0, // 图片高度
        imgUrl: "", // 图片url'
        deep: '', // 深度百分比
        pickerOptions: {
          shortcuts: dateComponentShortcuts,
          disabledDate(date) {
            return (
              isAfter(date, TODAY) ||
              isBefore(date, START_DATE)
            );
          },
        },
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
      landingPages: {
        get() {
          return this.$store.state.landingPages;
        },
        set(arr) {
          this.$store.commit("setLandingPages", arr);
        }
      },
      isIphoneX() {
        return this.screenHeight > 800;
      },
      pageHeight(){
        // return this.imgHeight-(this.imgHeight*this.deep/100);
        if(this.isIphoneX) {
          return this.imgHeight-521;
        } else {
          return this.imgHeight-328;
        }

      },
    },
    mounted() {
      this.getScreenShot();
      $('#page').scroll(this.scroll)

    },
    methods: {
      /*获取截屏*/
      getScreenShot() {
        return new Promise((resolve, reject) => {
          const updateTime = this.landingPages.filter(e => e.id === this.currentPageId)[0].updateTime;
          const storageList = JSON.parse(localStorage.getItem('SCREENSHOT_IMG')) || [];
          const curKey = `${this.currentPageId}_${IMG_WIDTH}`;
          // 本地是否已存在
          const isHasKey = storageList.map(e => e.key).includes(curKey);
          //落地页是否有更新
          const isUpdateTime = isHasKey && (storageList.filter(e => e.key === curKey)[0]['updateTime'] !== updateTime);
          if (isUpdateTime) {
            const index = storageList.findIndex(e => e.key === curKey);
            storageList.splice(index, 1);
          }
          if (!isHasKey || isUpdateTime) {
            /*开始截屏*/
            screenShot(this.screenShotParams()).then(rs => {
              if (storageList.length > this.cacheMaxNum) {
                storageList.shift();
              }
              storageList.push({key: curKey, url: rs.onlineUrl, updateTime: updateTime});
              this.setImg(rs.onlineUrl);
              localStorage.setItem('SCREENSHOT_IMG', JSON.stringify(storageList));
              resolve('success');
            }).catch(() => reject('error'))
          } else {
            resolve('success');
            this.setImg(storageList.filter(e => e.key === curKey)[0]['url']);
          }
        })
      },
      /*截图参数*/
      screenShotParams() {
        const currentUrl = this.landingPages.filter(
          e => e.id === this.currentPageId
        )[0].url;
        return {
          url: currentUrl,
          width: IMG_WIDTH
        };
      },
      /*获取图片的高度*/
      setImg: function (imgUrl) {
        this.imgUrl = imgUrl;
        let img = new Image();
        img.src = this.imgUrl;
        img.onload = () => {
          this.imgHeight = img.height;
        };
      },
      /*获取热图的数据和生成图片*/
      getDeepChartData() {
        this.before = false;
        this.loading = true;
        this.over = false;
        this.getScreenShot().then((res)=>{
          const params = {
            landingPageId: this.currentPageId,
            height: this.imgHeight,
            startTime: format(this.dateRange[0], "yyyy-MM-dd"),
            endTime: format(this.dateRange[1], "yyyy-MM-dd"),
          };
          // TODO 去掉请求 写测试数据
          getDepthChartData(params).then(res => {
            this.chartData = this.cutByHeight(res);
            this.chartDataCopy = Object.assign([], this.chartData);
            this.over = true;
            this.loading = false;
            setTimeout(()=>{
              this.chart = echarts.init(this.$refs.chart.$el);
              this.bindChartEvent()
            }, 200)
          })

        })


      },
      cutByHeight(res) {
        const chartArr = [];
        if(this.imgHeight <= 1000){
          this.deep = 50;
        } else if (this.imgHeight > 1000 && this.imgHeight <= 2000){
          this.deep = 25;
        } else if (this.imgHeight > 2000 && this.imgHeight <= 3000){
          this.deep = 15;
        }else if (this.imgHeight > 3000 && this.imgHeight <= 5000){
          this.deep = 10;
        }else if (this.imgHeight > 5000){
          this.deep = 5;
        }
        for(let i=0; i < res.length; i++){
          if(res[i].depth >= this.deep) {
            // res[i].uv = i
            chartArr.push(res[i])
          }
        }
        return chartArr;
      },
      scrollGet (e) {
        const scroolTop = e.target.scrollTop;
        // console.log('滚动高度:', scroolTop)
        const percent = scroolTop/this.pageHeight*100;
        // console.log('百分比:', percent);
        // console.log('pageHeight:', this.pageHeight);
        this.chartDataCopy.unshift({depth: this.chartDataCopy[0].depth-5,  uv: 0});
        // console.log(this.chartData, chartDataCopy)
        for (var i=0; i<this.chartDataCopy.length;i++) {
          this.chartDataCopy[i].select = false;
          this.chart.dispatchAction({
            type: 'downplay',
            // 可选，数据的 名称
            name: this.chartDataCopy[i].depth+'%'
          })
        }
        for (var i=0; i<this.chartDataCopy.length-1;i++){
          if(percent<=this.chartDataCopy[i+1].depth && percent > this.chartDataCopy[i].depth){
            this.selectName = this.chartDataCopy[i+1].depth+'%';
            this.chartDataCopy[i+1].select = true;
            this.chart.dispatchAction({
              type: 'highlight',
              // 可选，数据的 名称
              name: this.chartDataCopy[i+1].depth+'%'
            })

          }
        }
      },
      bindChartEvent(){
        this.chart.on('click', params=>{
          var scroolTop = (parseInt(params.name)*this.pageHeight)/100;
          $('.m-view').animate({scrollTop: scroolTop}, 1000)
        });
        // this.chart.on('mouseover',e=>{
        //
        //   if(e.name !== this.selectName){
        //
        //     this.chart.dispatchAction({type: 'downplay', name: this.selectName  });
        //
        //   }
        //
        // });
        this.chart.on('mouseout',e=>{
          this.chart.dispatchAction({type: 'highlight',name: this.selectName});

        });
      },
      download() {
        const url = this.chart.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff',
          type: 'png'
        });
        // 创建标签
        var oA = document.createElement("a");
        // 设置下载名称
        const name = this.landingPages.filter(e => e.id === this.currentPageId)[0].name;
        const startTime = format(this.dateRange[0], "yyyyMMdd");
        const endTime = format(this.dateRange[1], "yyyyMMdd");
        oA.download = `${name}_可视化深度分析_${startTime} 至 ${endTime}`;
        // 设置地址以及文件类型
        oA.href = url;
        document.body.appendChild(oA);
        // 触发下载事件
        oA.click();
        // 移除标签
        oA.remove();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .views-behavior-deepMap {
    .charts-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 23px;
      height: 85%;

      .left-box {
        /*flex: 1;*/
        flex-basis: 211px;
      }
      .center-box {
        /*flex: 1;*/
        flex-basis: 50px;
        margin: 0 68px;
      }
    }
    /*before*/
    .deepMap-wrap-x {
      .m-warp {
        background: url("../../assets/images/iPhoneX.png") no-repeat;
        padding: 76px 20px 77px;
        height: 674px;
        width: 334px;
        margin-top: 59px;
      }

      .iphone-outer {
        width: 362px;
      }

      .m-warp {
        .m-view {
          width: auto;
          height: 521px;
        }
      }
      .right-box {
        /*flex: 1;*/
        border: 1px solid #D8DFE4;
        flex-basis: 594px;
        height: 683px;
        margin-top: 59px;
        .header-tip{
          padding: 25px;
          text-align: center;
          border-bottom: 1px solid #D8DFE4;
        }
        .no-chart{
          height: 616px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .deepMap-wrap {
      height: calc(100vh - 100px);
      min-height: 600px !important;
      .el-card__body {
        height: 70% !important;
      }
    }
    .scrollbar {
      overflow: auto;
    }

    .scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background: transparent;
    }

    .scrollbar::-webkit-scrollbar-thumb {
      background: #d1d4da;
      border-radius: 10px;
    }

    .my-30px {
      margin-top: 3%;
      margin-bottom: 30px;
    }

    .iphone-outer {
      width: 231px;
    }

    .inputs {
      margin: 0px 0px;

      .search-input {
        width: 180px;
        margin-right: 37px;
      }

      label {
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;

        &:first-child {
          margin-left: 0;
        }
      }
      .download{
        width: 92px;
        margin-top: -8px;
        margin-right: 44px;
        margin-left: 37px;
      }
    }

    .mt-30px {
      margin-top: 30px;
    }

    .m-warp {
      background: url("../../assets/images/iPhone.png") no-repeat;
      /*background: url("../../assets/images/iPhoneX.png") no-repeat;*/
      position: relative;
      padding: 48px 13px 48px;
      height: 425px;
      width: 211px;

      .tip-wrap {
        position: absolute;
        left: 50%;
        top: 50%;
        color: #c0c4cc;
        transform: translate(-50%, -50%);
        font-size: 12px;
        line-height: 22px;
        text-align: center;

        .warning-ico {
          text-align: center;
          font-size: 30px;
        }

        .loading-size {
          font-size: 20px;
          text-align: center;
          margin-bottom: 15px;
        }

        .yellow {
          color: chocolate;
        }
      }

      .m-view {
        width: 191px;
        height: 328px;
        overflow: hidden;
        overflow-y: auto;

        img {
          height: auto;
          width: 191px;
          position: relative;
          z-index: 2;
        }

        .deepMap-container {
          height: auto;
          position: relative !important;
          z-index: 3;
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
    }
    .right-box {
      /*flex: 1;*/
      border: 1px solid #D8DFE4;
      flex-basis: 375px;
      height: 431px;
      .header-tip{
        padding: 16px;
        text-align: center;
        border-bottom: 1px solid #D8DFE4;
      }
      .no-chart{
        height: 389px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #c0c4cc;
      }
    }
  }
</style>
