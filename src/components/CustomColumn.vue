<template>
  <el-popover
    placement="bottom"
    width="357"
    trigger="click"
    v-model="visible"
    @hide="hide"
  >
    <div class="columns-popover">
      <div v-for="group in groups" :key="group.key">
        <el-row>
          <el-checkbox
            @change="change(group)"
            v-model="states[group.key].checked"
            :indeterminate="group.isIndeterminate"
          >
            <span class="group-title">{{ states[group.key].name }}</span>
          </el-checkbox>
        </el-row>
        <el-row>
          <el-col :span="8" v-for="child in group.children" :key="child">
            <el-checkbox
              v-model="states[child].checked"
              @change="change(child, group)"
            >
              <span class="group-item-title">{{ states[child].name }}</span>
            </el-checkbox>
          </el-col>
        </el-row>
      </div>
      <!-- <el-row type="flex" justify="right" class="ctrl-container">
        <el-button type="primary" size="small" @click="ok">确定</el-button>
        <el-button type="danger" size="small" @click="cancel">取消</el-button>
      </el-row> -->
    </div>
    <el-button trigger="click" size="small" class="fr btn-n-width" slot="reference">
      自定义列
      <i
        :class="{
          'el-icon-caret-bottom': !visible,
          'el-icon-caret-top': visible
        }"
      ></i>
    </el-button>
  </el-popover>
</template>

<script>
export default {
  props: ["states", "groups", "confirm", "hidden"],
  data() {
    return {
      visible: false,
      //需要还原初始态么
      restore: false
    };
  },
  methods: {
    change: function(cur, parent) {
      if (cur.children) {
        cur.children.forEach(e => {
          this.states[e].checked = this.states[cur.key].checked;
        });
        let checkedCount = cur.children.filter(e => this.states[e].checked).length;
        cur.isIndeterminate = checkedCount > 0 && checkedCount < cur.children.length;
      }
      if (parent) {
        this.states[parent.key].checked = parent.children.every(
          e => this.states[e].checked
        );
        let checkedCount = parent.children.filter(e => this.states[e].checked).length;
        parent.isIndeterminate = checkedCount > 0 && checkedCount < parent.children.length;
      }
    },
    hide: function() {
      this.$emit("hidden");
    },
    ok: function() {},
    cancel: function() {}
  }
};
</script>

<style lang="scss" scoped>
.columns-popover {
  padding: 6px;
  .el-checkbox {
    margin-bottom: 10px;
    .group-title {
      font-weight: bolder;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
    .group-item-title {
      color: #797979;
    }
  }
}
</style>
