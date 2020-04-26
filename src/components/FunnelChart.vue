<template>
  <div class="views-covert-fun">
      <!-- <el-button @click="savePng">导出图片</el-button> -->
    <div id="draw-shapes" :style="{width:chartWidth}"></div>
  </div>
</template>


<script>
import * as PIXI from "pixi.js-legacy";
import * as PixiFlters from 'pixi-filters'
import canvasUtil from "../plugins/canvasUtil";

// PIXI.Renderer.create = function create (options) {
//     if (isWebGLSupported()) {
//         return new PIXI.Renderer(options);
//     }
//     throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.');
// };

const { Graphics, Text, TextStyle } = PIXI;

const DATA_FILEDS = [
  "uvTotal",
  "uvEffective",
  "vp0",
  "vp1",
  "vp2",
  "convertNum"
];

// 常亮声明
// 画布宽高
let CHART_WIDTH = 800;
let X_CENTER = 460;
const CHART_HEIGHT = 600;
// 网格横线Y轴高度
const GIRD_TOPS = [50, 155, 235, 345, 400, 455, 560];
// 图标颜色
const COLORS = [0x9999ff, 0x99ccff, 0xb7dbf0, 0xc6e3f0, 0xdfeff0, 0x83ffb3];

export default {
  props: {
    chartData: {
      required: true
    },
    isAll: {
      default: false
    }
  },
  data() {
    return {
      app: null,
      canvasInstace: null,
      titles: [],
      dataGraphics: []
    };
  },
  computed: {
    chartWidth() {
      return CHART_WIDTH;
    },
    unit() {
      return 500 / this.chartData.uvTotal.current;
    }
  },
  methods: {
    initChart() {
      const containerEle = document.querySelector("#draw-shapes");

      CHART_WIDTH = containerEle.offsetWidth - 20;
      X_CENTER = 450;
      if (this.app) {
        app.destroy();
      }
      const app = new PIXI.Application({
      
        // forceCanvas: true,
        transparent: false,
        clearBeforeRender: true,
        width: CHART_WIDTH,
        height: CHART_HEIGHT,
        antialias: true,
        resolution: 2,
        backgroundColor: 0xffffff
      });
      app.render()
      // 防止字体模糊
      app.view.style.height = CHART_HEIGHT + "px";
      app.view.style.width = CHART_WIDTH + "px";
      const backgroundGrahics = new Graphics();
      backgroundGrahics.beginFill(0xffffff);
      backgroundGrahics.drawRect(-5, -5, CHART_WIDTH + 10, CHART_HEIGHT + 10);
      backgroundGrahics.endFill();
      app.stage.addChild(backgroundGrahics);
      this.app = app;

    },
    renderData() {
      const fileds = ["uvEffective", "vp0", "vp1", "vp2", "convertNum"];
      /** 计算坐标点 */
      const polygonPaths = [[-250, 0, 250, 0]];
      fileds.forEach((filed, index) => {
        const data = this.getDataFrormChartData(filed);
        const rightX = (data / 2) * this.unit;
        const leftX = (data / 2) * -this.unit;
        let y = GIRD_TOPS[index + 1] - GIRD_TOPS[index];
        const lastPolygonPaths = polygonPaths[index];
        const currentPolygonPaths = [];
        polygonPaths[index + 1] = currentPolygonPaths;
        if (!lastPolygonPaths) {
          lastPolygonPaths[index] = [];
        }
        // 最后一个要特殊处理背景图
        if (index === fileds.length - 1) {
          // const y =
          //   GIRD_TOPS[GIRD_TOPS.length - 1] - GIRD_TOPS[GIRD_TOPS.length - 2];
          // const warpRightX =
          //   (rightX / y) * (GIRD_TOPS[GIRD_TOPS.length - 1] - GIRD_TOPS[0]);
          // const warpLeftX = -warpRightX;
          // const graphics = new Graphics();
          // graphics.beginFill(0xcccccc, 0.2);
          // graphics.drawPolygon([
          //   warpLeftX,
          //   0,
          //   warpRightX,
          //   0,
          //   0,
          //   GIRD_TOPS[GIRD_TOPS.length - 1] - GIRD_TOPS[0]
          // ]);
          const graphics = new Graphics();
          graphics.beginFill(0xcccccc, 0.2);
          graphics.drawPolygon([
            0,
            0,
            X_CENTER * 2,
            0,
            X_CENTER,
            GIRD_TOPS[GIRD_TOPS.length - 1] - GIRD_TOPS[0]
          ]);
          graphics.endFill();
          graphics.y = GIRD_TOPS[0]
          this.app.stage.addChild(graphics);
        }
        lastPolygonPaths.push(rightX, y, leftX, y);
        currentPolygonPaths.push(leftX, 0, rightX, 0);
      });
      /** 绘图 */
      const dataGraphics = []
      polygonPaths.forEach((points, index) => {
        if (points.length != 8) {
          /** 最后一个图形为四边形 非三角形 */
          points.push(0, 105);
        }
        const graphics = new Graphics();
        graphics.beginFill(COLORS[index]);
        graphics.drawPolygon(points);
        graphics.x = X_CENTER;
        graphics.y = GIRD_TOPS[index];
        graphics.endFill();
        this.app.stage.addChild(graphics);
        graphics.interactive = true;
        dataGraphics.push(graphics)

      });
      dataGraphics.forEach((graphics, index) => {
        graphics.on("pointerover", () => {
          const  dropShadowFilter = new PixiFlters.DropShadowFilter();
          dropShadowFilter.alpha = 1;
          dropShadowFilter.rotation = 90;
          dropShadowFilter.color = 0xaaaaaa
          dropShadowFilter.blur = 5;
          dropShadowFilter.distance = 5;
          graphics.filters = [dropShadowFilter]

        const text = this.titles[index]
          graphics.scale.set(1.01, 1.005);
          text.style = {...text.style, fill: 'black', fontWeight: 700}
          });
        graphics.on("pointerout", () => {
          graphics.filters = []

        const text = this.titles[index]

          graphics.scale.set(1, 1);
          text.style = {...text.style, fill: '#333333', fontWeight: 500}
        });
      })
      this.dataGraphics = dataGraphics
    },
    drawGird() {
      const tops = GIRD_TOPS;
      const app = this.app;
      const { Graphics } = PIXI;

      tops.forEach(topNum => {
        let line = new Graphics();
        line.lineStyle(2, 0xeeeeee, 1);
        line.moveTo(0, 0);
        line.lineTo(CHART_WIDTH, 0);
        line.y = topNum;
        app.stage.addChild(line);
      });
    },
    drawText() {
      /** 左上角提示 */
      const infoContaniner = new PIXI.Container()
      const text = new PIXI.Text('此处的不同浏览深度的访客，仅包含有效访客用户。')
      text.style = {...text.style, fill: 0x909399, fontSize: 12}
      const base = new PIXI.BaseTexture.from(
        require("../assets/images/warning.png")
      );
      const texture = new PIXI.Texture(base);
      const sprite = new PIXI.Sprite(texture);
      sprite.y = -2
      sprite.width = 18
      sprite.height = 18

      text.x = 20
      infoContaniner.y = 25

      infoContaniner.addChild(sprite)
      infoContaniner.addChild(text)

      infoContaniner.setParent(this.app.stage)

      /** 漏斗上的文字 */
      const titles = ["总访客", "有效访客", "浏\n览", "深", "度", "转化"];
      const prectentTitles = ["5%-50%", "50%-75%", "75%-100%"];
      const textTitles = []
      titles.forEach((title, index) => {
        const style = new TextStyle({
          //   fontFamily: "Arial",
          fontWeight: 500,
          fontSize: 14,
          fill: "#333333",
          //   lineHeight:55,
          //   wordWrap: true,
          //   wordWrapWidth: 25,
          //   breakWords: true,
          //   stroke: "#ff3300",
          //   strokeThickness: 4,
          dropShadow: false,
          dropShadowColor: "#666666",
          dropShadowBlur: 4
          //   dropShadowAngle: Math.PI / 6,
          //   dropShadowDistance: 6
        });
        const text = new Text(title, style);
        text.x = X_CENTER - text.width / 2;
        text.y = GIRD_TOPS[index] - text.height / 2;
        const lastGirdTop = (GIRD_TOPS[index + 1] - GIRD_TOPS[index]) / 2;
        if (GIRD_TOPS[index + 1]) {
          text.y = text.y + lastGirdTop;
        }
        /** 需要添加有效访客的弹窗 */
        if (index === 1) {
          const base = new PIXI.BaseTexture.from(
            require("../assets/images/question.png")
          );
          const texture = new PIXI.Texture(base);
          let sprite = new PIXI.Sprite(texture);
          sprite.interactive = true;
          sprite.cursor = "pointer";


          sprite.height = 18;
          sprite.width = 18;
          sprite.cursor;
          sprite.x = text.x + text.width;
          sprite.y = text.y;
          this.app.stage.addChild(sprite);

            const infoColor =  0x333333
            const padding = 10
            const infoText = new Text('用户进入界面后，停留时长大于2秒被定义为有效访客。\n计算公式：总访客-跳出访客。',
            new TextStyle({
                fontSize: 12,
                fill: 0x333333,
                lineHeight:20
            }))
            infoText.x = padding /2 + 1
            infoText.y = padding /2 + 1
            const infoWarp = new Graphics()
            infoWarp.beginFill(0xffffff, 0.9)
            infoWarp.lineStyle(1, 0xD8DCE6, 1)
            infoWarp.drawRoundedRect(0,0,infoText.width + padding, infoText.height + padding, 5)
            const  dropShadowFilter = new PixiFlters.DropShadowFilter();
            dropShadowFilter.alpha = 0.3;
            dropShadowFilter.color = 0x666666
            dropShadowFilter.blur = 5;
            dropShadowFilter.distance = 0;
            infoWarp.filters = [dropShadowFilter]
            infoWarp.endFill()
            const infoContainer = new PIXI.Container()

            infoContainer.addChild(infoWarp)
            infoContainer.addChild(infoText)
            infoContainer.x = sprite.x + 20
            infoContainer.y = sprite.y

            const stage = this.app.stage

                      sprite.on("pointerover", function() {
            infoContainer.setParent(stage)

          });
          sprite.on("pointerout", function() {
            stage.removeChild(infoContainer)
          });
            
        }
        /** 浏览深度部分 */
        if (index >= 2 && index <= 4) {
          const precentTextStyle = new TextStyle({
            fontSize: 12,
            fill: 0x999999
          });
          const precentText = new Text(
            prectentTitles[index - 2],
            precentTextStyle
          );
          precentText.y =
            GIRD_TOPS[index] - precentText.height / 2 + lastGirdTop;
          precentText.x = 95;
          this.app.stage.addChild(precentText);
        }
        /** 浏览二字需要纵向排版 */
        if (index === 2) {
          text.style = {
            ...text.style,
            lineHeight: 55
          };
          text.y = text.y - 15;
        }
        textTitles.push(text)
        this.app.stage.addChild(text);
      });
      this.titles = textTitles
      const textStyle = new TextStyle({
        fontFamily: "Arial",
        fontSize: 14
        //   fill: "0x000000",
        //   fill: "white",
      });
      /** 右侧的文字 */
      const text1 = new Text("该维度统计", textStyle);
      const text2 = new Text("页面全部", textStyle);
      text1.y = 15
      text2.y = 15
      text1.x = -text1.width/2
      text2.x = -text2.width/2
      const currentDataContainer = new PIXI.Container();
      const totalDataContainer = new PIXI.Container();
      currentDataContainer.addChild(text1);
      totalDataContainer.addChild(text2);

      currentDataContainer.setParent(this.app.stage);
      totalDataContainer.setParent(this.app.stage);
      if (this.isAll) {
        currentDataContainer.visible = false
      }
      totalDataContainer.x = CHART_WIDTH - totalDataContainer.width;
      currentDataContainer.x =
        CHART_WIDTH -
        totalDataContainer.width -
        currentDataContainer.width -
        20;
      DATA_FILEDS.forEach((filed, index) => {
        const currentFiledText = new Text(
          this.getDataFrormChartData(filed),
          textStyle
        );
        const totalFiledText = new Text(
          this.getDataFrormChartData(filed, false),
          textStyle
        );
        const tops = [...GIRD_TOPS];
        let y = tops[index];
        if (tops[index + 1]) {
          y = y + (tops[index + 1] - tops[index]) / 2;
        }
        currentFiledText.x = -currentFiledText.width/2
        totalFiledText.x = -totalFiledText.width/2
        currentFiledText.y = y - currentFiledText.height / 2;
        totalFiledText.y = y - totalFiledText.height / 2;
        currentDataContainer.addChild(currentFiledText);
        totalDataContainer.addChild(totalFiledText);
      });
    },
    drawCount() {},
    savePng(name = "转化漏斗") {
      requestAnimationFrame(() => {
        const image = this.app.renderer.plugins.extract.canvas(this.app.stage);
        canvasUtil.exportCanvasAsPNG(image,name);
      });
    },
    getDataFrormChartData(filed, isCurrent = true) {
      const dataWarp = this.chartData[filed];
      return dataWarp[isCurrent ? "current" : "all"];
    }
  },
  mounted() {
    this.initChart();
    // this.app.loader
    //     .add("questionIcon", "./public/img/uv.png")
    //     .load(() => {
    //         });
    this.drawGird();
    this.renderData();
    this.drawText();
    this.drawCount();
      const containerEle = document.querySelector("#draw-shapes");
      this.app.stage.interactive = false;
      containerEle.innerHTML = "";
      containerEle.appendChild(this.app.view);
    // this.draw();
  },
  beforeCreate() {},
  destroyed () {
    setTimeout(() => {
      this.app.destroy()
    }, 500)
  }
};
</script>

<style lang="scss" scoped>
#draw-shapes {
  display: flex;
  justify-content: center;
}
</style>