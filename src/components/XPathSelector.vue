<template>
  <div class="xpath-selector">
    <div class="img-target-container">
      <template v-if="!url">
        <div
          v-loading="true"
          element-loading-text="页面渲染预计需要3-5分钟，请耐心等待"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 1)"
          class="loading"
        ></div>
      </template>
      <template v-if="url">
        <div
          v-show="showTags"
          v-for="(flag, i) in flags"
          :key="flag.xpath"
          class="flag"
          :style="flag.style"
        >元素{{i + 1}}</div>
        <img class="img-target" :width="imgWidth" :src="url" @click="imgTargetClick" />
      </template>
    </div>
  </div>
</template>

<script>
import { screenShot4xpath } from "../plugins/api";
export default {
  props: ["url", "flags", "tags", "showTags", "disabled"],
  data: function() {
    return {
      imgWidth: 211,
      imgActuralWidth: 375,
      scaleX: 0.563 // 211 / 375
    };
  },
  methods: {
    imgTargetClick: function(e) {
      if (this.disabled) return
      let { offsetX, offsetY } = e;
      let ele = this.hitDectect(offsetX, offsetY);
      let eleStyle = {
        left: ele.left * this.scaleX + "px",
        top: ele.top * this.scaleX + "px",
        width: ele.width * this.scaleX + "px",
        height: ele.height * this.scaleX + "px"
      };
      this.flags.push({ style: eleStyle, xpath: ele.xpath });
    },
    hitDectect: function(x, y) {
      //筛选出命中的元素集合
      let fe = this.tags.filter(
        e =>
          e.left * this.scaleX < x &&
          x < (e.left + e.width) * this.scaleX &&
          e.top * this.scaleX < y &&
          y < (e.top + e.height) * this.scaleX
      );
      //根据返回的json数据可以观察出 fe集合最后一项即是命中的唯一目标元素
      let ce = fe[fe.length - 1];
      // console.log(x, y, ce);
      return ce;
    }
  }
};
</script>

<style lang="scss" scoped>
.xpath-selector {
  background: url("../assets/images/iPhone.png") no-repeat;
  background-size: contain;
  padding: 55px 15px;
}
.img-target-container {
  overflow: scroll;
  width: 211px;
  height: 374px;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
}
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.flag {
  position: absolute;
  border: rgb(7, 187, 70) dashed 2px;
  color: blue;
  font-size: 12px;
  text-align: right;
  padding-right: 4px;
  &:hover{
    border-color: mix(rgb(3, 245, 88), red);
    font-weight: bold;
  }
}
</style>