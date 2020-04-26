<template>
  <div class="guide">
    <div v-if="index == 0" @click="next(0)" class="step one" title="下一步" style="cursor:pointer;"></div>
    <div v-if="index == 1" @click="next(1)" class="step two" title="下一步" style="cursor:pointer;"></div>
    <div v-if="index == 2" @click="next(2, true)" class="step three" title="下一步" style="cursor:pointer;"></div>
  </div>
</template>
<script>
import { data } from "./data.Guide";
export default {
  data: function() {
    return {
      ...data()
    };
  },
  methods: {
    next: function(i, end) {
      if(end){
        this.$router.push("/sdk/create");
        return;
      }
      this.index = i + 1;
    }
  },
  mounted: function() {}
};
</script>
<style lang="scss" scoped>
.guide {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: white;
  .step {
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;
    &.one {
      background-image: url("../../assets/images/guide/1.png");
    }
    &.two {
      background-image: url("../../assets/images/guide/2.png");
    }
    &.three {
      background-image: url("../../assets/images/guide/3.png");
    }
  }
}
</style>
