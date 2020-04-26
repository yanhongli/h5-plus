<template>
  <ul class="menu">
    <li class="item" v-for="item in config" :key="item.text">
      <router-link
        active-class="active"
        ref="link"
        :to="item.to"
        v-if="item.to"
      >
        <img class="menu-icon" :src="ICONS[item.icon]" alt />
        {{ item.text }}
      </router-link>
      <a v-show="!item.to" @click="expand(item)">
        <img class="menu-icon" :src="ICONS[item.icon]" alt />
        {{ item.text }}
        <img
          src="../assets/images/tran.png"
          :class="{ 'to-right': !item.expand }"
          class="tran fr"
        />
      </a>
      <ul
        class="children"
        v-if="item.children && item.children.length > 0 && item.expand"
      >
        <li class="item" v-for="child in item.children" :key="child.text">
          <a v-if="item.text === '站点管理'" @click="goToH5Workbench(child.to)">
            <span>{{ child.text }}</span>
          </a>
          <router-link
            v-if="item.text !== '站点管理'"
            active-class="active"
            data-ref="menu"
            :to="child.to"
            ref="link"
          >
            <span>{{ child.text }}</span>
          </router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
const shujuIcon = require("../assets/images/menu-icon/shujugailan.png");
const siteManageIcon = require("../assets/images/menu-icon/zhandianguanli.png");
const eventIcon = require("../assets/images/menu-icon/jianceshijianguanli.png");
const converntIcon = require("../assets/images/menu-icon/zhuanhuafenxi.png");
const actionIcon = require("../assets/images/menu-icon/xingweifenxi.png");
const imageIcon = require("../assets/images/menu-icon/huaxiangfenxi.png");
const accountIcon = require("../assets/images/menu-icon/zhanghuguanli.png");
const performanceIcon = require("../assets/images/menu-icon/yemianzhiliangpingfen.png");
import { MENUS } from "../plugins/api";
const ICONS = {
  shujuIcon, // 数据概览
  siteManageIcon, // 站点管理
  eventIcon, // 监测事件管理
  converntIcon, // 转化分析
  actionIcon, // 行为分析
  imageIcon, // 画像分析
  accountIcon, // 账户管理
  performanceIcon //页面评分
};

function setExpand(config = [], fullPath) {
  config.forEach(menuItem => {
    if (!menuItem.children || menuItem.children.length === 0) {
      if (menuItem.to && fullPath.indexOf(menuItem.to) !== -1) {
        menuItem.expand = true;
        if (menuItem.parent) {
          menuItem.parent.expand = true;
        }
      }
    } else {
      menuItem.children.forEach(childItem => {
        childItem.parent = menuItem;
      });
      setExpand(menuItem.children, fullPath);
    }
  });
}

export default {
  data() {
    return {
      ICONS,
      config: MENUS
    };
  },
  methods: {
    expand(item) {
      this.config.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.expand = false;
        }
      });
      item.expand = !item.expand;
    },
    resetExpand() {},
    goToH5Workbench: function(route) {
      if (process.env.NODE_ENV === "development") {
        console.log(`?token=${localStorage["h5_token"]}`);
        alert(`当前开发模式下禁止自动跳转console中标有token
?token=${localStorage["h5_token"]}`);
        return;
      }
      const url = `${process.env.VUE_APP_H5_OLD_URL_ONLINE}?token=${localStorage["h5_token"]}#${route}`;
      location.href = url;
    }
  },
  watch: {
    config(val) {
      setTimeout(() => {
        const { fullPath } = this.$route;
        this.$nextTick().then(res => {
          setExpand(this.config, fullPath);
        });
      }, 300);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.menu {
  font-family: PingFangSC;
  width: 100%;
  a {
    // padding: 5px 0;

    font-weight: 500;
    color: white;
    display: inline-block;
    width: 100%;
    cursor: pointer;
    user-select: none;
    &.active,
    &:hover {
      // margin: 5px 0px;
      padding: 0;
      background: rgba(10, 100, 173, 1);
    }
    // &:hover {
    //   height: 100%;
    //   padding: 5px 0;
    //   margin: 0;
    //   background: rgba(30, 163, 255, 1);
    // }
    .tran {
      margin-right: 5px;
      font-size: 4px;
      transition: all 0.1s;
      transform: scale(0.5) translateY(25px);
      &.to-right {
        opacity: 0.5025;
        transform: scale(0.5) translateY(25px) rotate(-90deg);
      }
    }
  }
  .item {
    font-size: 14px;
    line-height: 40px;
    .menu-icon {
      margin-left: 20px;
      margin-right: 8px;
      width: 15px;
      position: relative;
      top: 2px;
      // height: 15px;
    }
    .children {
      .item {
        a {
          span {
            padding-left: 48px;
          }
        }
      }
    }
  }
}
</style>
