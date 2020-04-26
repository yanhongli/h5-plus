<template>
  <el-select placeholder="请选择落地页" size="small" v-model="currentPageId">
    <el-option v-for="page in landingPages" :label="page.name" :key="page.id" :value="page.id"></el-option>
  </el-select>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["landingPages"]),
    currentPageId: {
      get() {
        return this.$store.state.currentLandingPageId;
      },
      set(id) {
        this.$store.commit("setCurrentLandingPageId", id);
        this.$emit("change", id);
      }
    }
  }
};
</script>