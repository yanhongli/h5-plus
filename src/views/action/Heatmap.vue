<template>
  <div class="views-behavior-hatMap">
    <el-card class="hatMap-wrap" :class="{'hatMap-wrap-x': isIphoneX}" :body-style="{ height: '100%' }">
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
            @click="getHotMapData(true)"
        >生成
        </el-button>
      </div>
      
      <div class="hot-warp">
        <div class="left-box iphone-outer">
          <div class="m-warp" ref="wrap">
            <!--生成前-->
            <div v-if="before" class="tip-wrap">
              <div class="warning-ico">
                <img src="../../assets/images/init_icon.png" alt=""/>
              </div>
              您还没有生成落地页热力图
            </div>
            
            <!--生成中-->
            <div v-if="loading" class="tip-wrap">
              <div class="warning-ico">
                <img src="../../assets/images/loading_icon.png" alt=""/>
              </div>
              热力图正在生成中，请稍候…
            </div>
            
            <!--生成后没数据-->
            <div
                v-if="!loading && imgHeight && !hotMapData.length && over"
                class="tip-wrap"
            >
              <div class="warning-ico">
                <img src="../../assets/images/empty_icon.png" alt=""/>
              </div>
              该落地页目前还没有积累到热力图数据
            </div>
            
            <!--生成后有数据-->
            <div
                class="m-view scrollbar"
                v-if="!loading && imgHeight && hotMapData.length && over"
            >
              <heatmapjs-vue
                  :style="{
                  height: imgHeight + 'px',
                  backgroundImage: `url(${imgUrl})`,
                }"
                  class="hotMap-container"
                  :max="heatMapMax"
                  :min="heatMapToolTip"
                  :data="hotMapData"
              ></heatmapjs-vue>
            </div>
          </div>
        
        </div>
        <!-- left box end-->
        <div class="center-box">
          <el-slider v-model="slideValue"
                     :show-tooltip="over"
                     :format-tooltip="()=>heatMapToolTip"
                     :disabled="!over"
                     vertical
                     height="200px">
          </el-slider>
        </div>
        <!-- center box end-->
        <div class="right-box">
          <div class="tip-box">
            <h2><img src="../../assets/images/tips.svg" alt="" srcset=""> TIPS</h2>
            <div class="content">
              <p>您可通过调节纵向浮标查看当前落地页不同点击量的用户分布； </p>
              目前仅支持移动端热力图分布；
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
    import {mapState} from "vuex";
    import {getHeatMapData, screenShot} from "../../plugins/api";
    import { dateComponentShortcuts } from "../../config";
    import format from "date-fns/format";
    import isAfter from "date-fns/isAfter";
    import endOfToday from "date-fns/endofToday";
    import startOfYear from "date-fns/startOfYear";
    import isBefore from "date-fns/isBefore";
    import differenceInDays from "date-fns/differenceInDays";
    import subDays from "date-fns/subDays";
    import addDays from "date-fns/addDays";
    
    const TODAY = endOfToday();
    const YESTERDAY = subDays(TODAY, 1);
    const START_DATE = startOfYear(new Date().setFullYear(2019));
    const IMG_WIDTH = document.documentElement.clientHeight < 800 ? 185 : 229; // 小屏与大屏的宽度
    const IMG_WIDTH_REF = 375; //基准宽度
    export default {
        data() {
            const vm = this;
            return {
                dateRange: [subDays(YESTERDAY, 6), YESTERDAY],
                hotMapData: [], // 热图数据
                imgHeight: 0, // 图片高度
                imgUrl: "", // 图片url
                before: true, // 加载前
                loading: false, // 加载中
                over: false, //加载结束
                slideValue: 0,
                heatMapMax: 5,
                screenHeight: document.documentElement.clientHeight, // 屏幕高度
                cacheMaxNum: 80, // 缓存的最大个数
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
                ;
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
            heatMapToolTip() {
                const ratio = this.heatMapMax / 100;
                return Number((this.slideValue * ratio).toFixed(1));
            },
            isIphoneX() {
                return this.screenHeight > 800;
            }
        },
        mounted() {
            this.getScreenShot();
        },
        methods: {
            /*获取图片的高度*/
            setImg: function (imgUrl) {
                this.imgUrl = imgUrl;
                let img = new Image();
                img.src = this.imgUrl;
                img.onload = () => {
                    this.imgHeight = img.height;
                };
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

            /*获取热图的数据和生成图片*/
            getHotMapData() {
                this.slideValue = 0; // 滑杆重置
                this.before = false;
                this.loading = true;
                this.over = false;
                const params = {
                    landingPageId: this.currentPageId,
                    startTime: format(this.dateRange[0], "yyyy-MM-dd"),
                    endTime: format(this.dateRange[1], "yyyy-MM-dd")
                };

                Promise.all([getHeatMapData(params), this.getScreenShot()]).then(res => {
                    this.over = true;
                    this.loading = false;
                    this.hotMapData = res[0].map(e => ({
                        x: e.pageX * ( IMG_WIDTH/IMG_WIDTH_REF),
                        y: e.pageY * ( IMG_WIDTH/IMG_WIDTH_REF),
                        value: e.clickCount
                    }));
                    if (this.hotMapData.length) {
                        this.hotMapData.push({x: 0, y: 0, value: 0});
                    }
                    this.heatMapMax = Math.max(...this.hotMapData.map(e => e.value)) + 1;
                }).catch(() => {
                    this.loading = false;
                    this.$message.error('加载失败，请稍后重试');
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
  .views-behavior-hatMap {
    .hot-warp {
      display: flex;
      align-items: center;
      /*justify-content: center;*/
      margin-top: 23px;
      height: 85%;
      
      .left-box {
        /*flex: 1;*/
        flex-basis: 211px;
        margin-left: 154px;
      }
      
      .center-box {
        /*flex: 1;*/
        flex-basis: 50px;
        margin: 0 175px 0 50px;
      }
      
      .right-box {
        flex: 1;
        
        .tip-box {
          
          width: 325px;
          /*height: 139px;*/
          border-radius: 8px;
          border: 1px solid rgba(216, 220, 230, 1);
          color: rgba(74, 74, 74, 1);
          padding: 30px 23px;
          
          h2 {
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            margin: 0 0 10px;
            vertical-align: middle;
            
            img {
              position: relative;
              top: 2px;
            }
          }
          
          .content {
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            p{
              margin-bottom: 3px;
            }
          }
        }
      }
    }
    
    /*before*/
    .hatMap-wrap-x {
      .m-warp {
        background: url("../../assets/images/iPhoneX1.png") no-repeat;
        padding: 59px 15px 48px;
        height: 522px;
        width: 265px;
      }
      
      .iphone-outer {
        width: 293px;
      }
      
      .m-warp {
        .m-view {
          width: auto;
          height: 403px;
        }
      }
    }
    
    .hatMap-wrap {
      .el-card__body {
        height: 70% !important;
      }
      
      .inputs {
        margin-top: 0;
      }
      
      height: calc(100vh - 100px);
      min-height: 600px !important;
      
      
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
      margin-top: 20px;
      
      .search-input {
        width: 180px;
        margin-right: 30px;
      }
      
      label {
        margin-left: 30px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        
        &:first-child {
          margin-left: 0;
        }
      }
    }
    
    .mt-30px {
      margin-top: 30px;
    }
    
    .m-warp {
      background: url("../../assets/images/iPhone.png") no-repeat;
      /*background: url("../../assets/images/iPhoneX1.png") no-repeat;*/
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
        
        .hotMap-container {
          height: auto;
          position: relative !important;
          z-index: 3;
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
    }
  }
</style>
