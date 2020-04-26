<template>
  <div class="wrapper">
    <div class="label">{{label}}</div>
    <div>
      <span class="value">{{value}}</span>
      <span class="unit">({{unit}})</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["label", "value", "unit"]
};
</script>

<style lang="scss" scoped>
    .wrapper {
        display: inline-block;
        padding: 12px 15px;
        line-height: 24px;
        border: 1px solid #D8DCE6;
        border-radius:  4px; 
        font-size: 12px;
        .label{
          margin-bottom: 6px;
        }
        .value{
            color: #EF7F25;
            font-size: 20px;
            margin-right: 5px;
        }
    }
</style>