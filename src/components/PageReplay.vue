<template>
  <div class="brick-page-replay">
    <!-- <el-row>
      <el-col :span="2">滚动至:</el-col>
      <el-col :span="8">
        <el-input-number @change="scroll($event)" v-model="scrollTop"></el-input-number>
      </el-col>
    </el-row>-->
    <div class="controller" v-if="!empty">
      <a @click="play()" class="play" v-if="!playConfig.timer">
        <img src="../assets/images/play.png" alt />
      </a>
      <a @click="stop()" class="play" v-else>
        <img src="../assets/images/pause.png" alt />
      </a>
      <span class="time">{{ playedSecond }}</span>
      <el-progress
        v-if="showPrgress"
        :show-text="false"
        class="progress"
        :percentage="playPercentage"
      ></el-progress>
      <span class="time">{{ totalSecond }}</span>
    </div>

    <!-- <el-row>
      <el-col :span="2">
        <a @click="touchStart()">开始触摸</a>
      </el-col>
      <el-col :span="2">{{playConfig.timer? '播放中': '已停止'}}</el-col>
    </el-row>-->
    <div class="warp" ref="warp" :style="ifreamStyle">
      <template v-if="!empty">
        <iframe
          ref="iframe"
          name="h5page"
          class="show"
          frameborder="0"
          id="myiframe"
          :src="'/api/proxy?url=' + url"
        ></iframe>

        <!-- src="/api/proxy?url=http://10.234.138.58:8081" -->
        <div class="mask" id="client-mask">
          <a v-if="playConfig.timer" @click="stop()">
            <i class="el-icon-video-pause icon"></i>
          </a>
          <a v-if="!playConfig.timer" @click="play()">
            <i class="el-icon-video-play icon"></i>
          </a>
        </div>
      </template>
      <template v-else>
        <div class="empty">
          <img src="../assets/images/empty.png" alt />
          <p class="msg">暂无数据</p>
        </div>
      </template>
    </div>
  </div>
  <!--  -->
</template>

<script>
import startOfHour from "date-fns/startOfHour";
import format from "date-fns/format";
import addSeconds from "date-fns/addSeconds";
// import BScroll from '@better-scroll/core'
// import MouseWheel from '@better-scroll/mouse-wheel'
// import ScrollBar from '@better-scroll/scroll-bar'

// BScroll.use(ScrollBar)
// BScroll.use(MouseWheel)
export default {
  data() {
    return {
      showPrgress: true,
      iframeWindow: window,
      scrollTop: 0,
      pageData: [[]],
      touchPointElement: null,
      ifreamConfig: {
        width: 375,
        height: 667
      },
      playConfig: {
        startTime: 0,
        endTime: 0,
        currentTime: 0,
        isStop: true,
        timer: 0,
        frameTime: 100
      },
      timer: {
        click: 0
      }
    };
  },
  props: {
    empty: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ""
    },
    logs: {
      type: Array
    }
  },
  computed: {
    ifreamStyle() {
      return {
        width: this.ifreamConfig.width + "px",
        height: this.ifreamConfig.height + "px"
      };
    },
    /** 正在播放的秒数 */
    playedSecond() {
      try {
        const start = startOfHour(new Date());
        const seconds = Math.ceil(
          (this.playConfig.currentTime - this.playConfig.startTime) / 1000
        );
        return format(addSeconds(start, seconds), "mm:ss");
      } catch (error) {
        return "00:00";
      }
    },
    totalSecond() {
      const start = startOfHour(new Date());
      const seconds = Math.ceil(
        (this.playConfig.endTime - this.playConfig.startTime) / 1000
      );
      return format(addSeconds(start, seconds || 0), "mm:ss");
    },
    playPercentage() {
      const played = Math.max(
        this.playConfig.currentTime - this.playConfig.startTime,
        0
      );

      const all = this.playConfig.endTime - this.playConfig.startTime;

      return Math.min(Math.ceil((played / all) * 100), 100) || 0;
    },
    iframeDocument() {
      if (this.iframeWindow) {
        return this.iframeWindow.document;
      } else {
        return document;
      }
    }
  },
  watch: {
    empty() {},
    logs: {
      immediate: true,
      handler() {
        this.handlerData();
      }
    }
  },
  methods: {
    handlerData() {
      /**TODO: 目前时间不标准 手动设置时间  上线之前需要确认*/
      if (!this.logs) {
        return;
      }
      const data = [...this.logs];
      // data.forEach((item, index) => {
      //   item.request_time = item.request_time + index * 100;
      // });

      this.pageData = data;
      // const first = this.pageData[0];
      // const last = this.pageData[this.pageData.length - 1];
      // console.log(first, last, "fl");
      this.ifreamConfig.width = this.pageData[0].cw;
      this.ifreamConfig.height = this.pageData[0].ch;
      this.playConfig.startTime = this.pageData[0]["request_time"];
      this.playConfig.endTime = this.pageData[this.pageData.length - 1][
        "request_time"
      ];
      this.playConfig.currentTime = this.pageData[0]["request_time"];
    },

    renderIframe() {
      const currentTime = this.playConfig.currentTime;
      const nextTime = this.playConfig.currentTime + this.playConfig.frameTime;
      if (nextTime >= this.playConfig.endTime) {
        this.stop();
      }
      // 获取时间段内的动作
      const actions = this.pageData.filter(
        item =>
          item["request_time"] > currentTime && item["request_time"] <= nextTime
      );
      actions.forEach(item => {
        // 获取事件触发时间和当前播放时间差 延时播放
        const timeSpace = item["request_time"] - this.playConfig.currentTime;
        window.setTimeout(() => {
          if (item.ce && typeof item.ce === "string") {
            item.ce = JSON.parse(item.ce);
          }

          switch (item["dt"]) {
            case "scroll":
              // console.log(item["request_time"], "scroll");
              this.scroll(Number(item.st));
              break;
            case "ic":
              this.input(item);
              break;
            case "ts":
              // eslint-disable-next-line no-case-declarations

              this.touchStart(item);
              break;
            case "tm":
              // console.log(item["request_time"], "click");
              // eslint-disable-next-line no-case-declarations
              this.touchMoveTo(item);
              break;
            case "mousemove":
              this.touchMoveTo(item);
              break;
            case "te":
              this.touchEnd();
              break;
            case "click":
              this.click();
              break;
            default:
              break;
          }
        }, timeSpace);
      });
      this.playConfig.currentTime = nextTime;
    },
    getElementByXpath(path) {
      const xresult = this.iframeWindow.document.evaluate(
        path,
        this.iframeWindow.document,
        null,
        this.iframeWindow.XPathResult.ANY_TYPE,
        null
      );
      var xnodes = [];
      var xres;
      while ((xres = xresult.iterateNext())) {
        xnodes.push(xres);
      }

      return xnodes;
    },
    scroll(scrollTop, behavior = "smooth") {
      const scrollTopCom = Math.max(0, scrollTop - this.ifreamConfig.height);
      this.iframeWindow.scrollTo({
        top: scrollTopCom,
        behavior
      });
    },
    /** 触摸开始 */
    touchStart(item) {
      if (
        this.iframeWindow.document.activeElement &&
        this.iframeWindow.document.activeElement.name !== name
      ) {
        this.iframeWindow.$(this.iframeWindow.document.activeElement).blur();
      }
      if (!this.touchPointElement) {
        this.createPoint();
        this.touchMoveTo(item);
      } else {
        this.touchMoveTo(item);

        this.touchPointElement.hidden = false;
        this.touchPointElement.ontransitionend = () => {
          // this.touchPointElement.hidden = true
        };
      }
    },
    /** 触摸移动 */
    touchMoveTo(item) {
      if (item.ts && typeof item.ts === "string") {
        item.ts = JSON.parse(item.ts);
      }
      if (this.touchPointElement) {
        this.touchPointElement.style.left = item.ts.cx + "px";
        this.touchPointElement.style.top = item.ts.cy + "px";
      }
    },
    /** 触摸结束 */
    touchEnd() {
      if (this.touchPointElement) {
        // this.touchPointElement.ontransitionend = () => {
        setTimeout(() => {
          if (this.touchPointElement) {
            this.touchPointElement.hidden = true;
          }
        }, 1000);
        // }
      }
    },
    click() {
      if (this.timer.click) {
        window.clearTimeout(this.timer.click);
      }
      if (this.touchPointElement) {
        this.touchPointElement.style.background = "rgb(255, 186, 21, .5)";
        this.timer.click = window.setTimeout(() => {
          this.touchPointElement.style.background = "rgba(8, 139, 243, .5)";
          this.timer.click = null;
        }, 500);
      }
    },
    input(item) {
      if (item.ce) {
        const input = this.iframeWindow.$(this.getElementByXpath(item.ce.x));
        input[0].focus();
        input.val(item.ce.v + "");
      }
      // const selector = `input[name="${name}"]`;
      // const ele = this.iframeWindow.document.evaluate(
      //   item.ce.x,
      //   this.iframeWindow.document
      // );
      // const str = "//*/div[1]/img[1]";
      // const input = this.iframeWindow.$(selector);
    },
    createPoint() {
      const element = this.iframeDocument.createElement("div");
      element.className = "hand-pointer";
      document.querySelector("#client-mask").appendChild(element);
      this.touchPointElement = element;
    },

    resetWindow() {
      const iframe = document.querySelector("#myiframe");
      if (iframe) {
        this.iframeWindow = iframe.contentWindow;
      }
    },

    /** 从头开始播放 */
    play() {
      this.resetIframe();
      this.showPrgress = false;
      this.$nextTick().then(() => {
        this.showPrgress = true;
      });
      // this.handlerData();
      if (this.playConfig.timer) {
        return;
      }
      this.renderIframe();
      this.playConfig.timer = setInterval(() => {
        this.renderIframe();
      }, this.playConfig.frameTime);
    },
    /** 停止播放 */
    stop() {
      if (this.playConfig.timer) {
        window.clearInterval(this.playConfig.timer);
        this.playConfig.timer = null;
      }
      // this.resetIframe()
    },
    /** 重置iframe到最初状态 */
    resetIframe() {
      this.touchEnd();
      this.touchPointElement = null;
      this.playConfig.currentTime = this.playConfig.startTime;
      this.resetWindow();
      this.iframeWindow.location.reload();
      this.scroll(0, "instant");
    }
  },
  async created() {},
  mounted() {},
  beforeDestroy() {
    this.stop();
  }
};
</script>

<style lang="scss" scoped>
.brick-page-replay {
}

#replay-point {
}

.controller {
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: flex-start;
  .time {
    font-weight: 500;
    color: rgba(31, 31, 31, 1);
    font-size: 12px;
    &:first-of-type {
      margin-right: 5px;
    }
    flex: 0;
  }
  .play {
    margin-right: 5px;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .progress {
    width: 100%;
  }
}
.warp {
  margin-top: 35px;
  height: 667px;
  width: 385px;
  overflow: hidden;
  position: relative;
  z-index: 10;
  border: 1px solid #eee;
  iframe {
    z-index: 20;
    height: 100%;
    width: 100%;
  }
  .empty {
    text-align: center;
    img {
      width: 170px;
      margin-top: 110px;
    }
    .msg {
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
      font-size: 16px;
      margin-top: 30px;
    }
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    transition: all 0.3s;
    .icon {
      display: none;
      color: white;
    }
    &:hover {
      background: rgba($color: #000000, $alpha: 0.5);
      .icon {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 100px;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>

<style lang="scss">
.hand-pointer {
  width: 20px;
  height: 20px;
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
  transition: all 0.1s linear;
  border-radius: 50%;
  background: rgba(8, 139, 243, 0.5);
  transform: translate(-50%, -50%);
}
</style>
