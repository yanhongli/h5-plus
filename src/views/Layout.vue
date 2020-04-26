<template>
  <div class="test">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside class="aside" style="width:175px;padding:12px 0px;">
        <h1 class="main-logo"><img class="logo" src="../assets/images/logo.png" alt=""> <img class="text" src="../assets/images/text-yizhan.png" alt=""></h1>
        <div class="mask"></div>
        <Menu class="menu"></Menu>
      </el-aside>
      <el-main style="padding:0;">
        <!-- 头 -->
        <el-header class="header" height="80px;">
          <!-- <span class="title">
            <span v-for="(item, index) in breadConfigs" :key="item.path">
              <router-link :to="item.path" :class="{ 'not-first': index !== 0 }">{{ item.name }}</router-link>
              <span :key="item.path" v-if="index !== breadConfigs.length - 1">·</span>
            </span>
            <span class="under">
              <div class="line"></div>
            </span>
          </span>-->
          <div class="user fr">
            <!-- <div class="line fl"></div> -->
            <img class="avator" :src="userInfo.avatar" alt />
            <span class="name">{{ userInfo.name }}</span>
            <span class="logout" @click="logout()">
              退出
              <i class="el-icon-arrow-right"></i>
            </span>
          </div>
        </el-header>
        <!-- 主部分 -->
        <el-main class="content">
          <router-view></router-view>
        </el-main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Menu from "../components/Menu";
import { UserInfo, apiUCurrent, apiPRoutes, apiULogout } from "../plugins/api";

export default {
  components: {
    Menu
  },
  data() {
    return {
      breadConfigs: [],
      userInfo: UserInfo
    };
  },
  computed: {
    // userInfo: function() {
    //   return UserInfo;
    // }
  },
  watch: {
    $route(newRoute) {
      this.setBreadConfig(newRoute);
    }
  },
  methods: {
    setBreadConfig(route) {
      if (route.meta && route.meta.breadConfig) {
        this.breadConfigs = route.meta.breadConfig;
        return;
      }

      this.breadConfigs = (route.matched || [])
        .map(item => {
          return {
            name: item.name,
            path: item.path
          };
        })
        .filter(item => !!item.name);
      // function getBreadConfig(route) {
      //   let routes = [];
      //   if (route.name && route.path) {
      //     routes.push({
      //       name: route.name,
      //       path: route.path
      //     });
      //     if (route.parent) {
      //       routes = [...routes, ...getBreadConfig(route.parent)];
      //     }
      //   }
      //   return routes;
      // }
      // this.breadConfigs = getBreadConfig(route);
    },
    logout: function() {
      apiULogout().finally(() => {
        localStorage.removeItem("h5_token");
        this.$router.push("/login");
      });
    }
  },
  created() {
    // apiUCurrent();
    // apiPRoutes({}).then(e => {
    //   // if (
    //   //   this.$router.currentRoute.path != "/guide" &&
    //   //   !e.menus.some(m => m.to == this.$router.currentRoute.path)
    //   // ) {
    //   //   this.$router.push(e.homePage);
    //   // }
    // });
  },
  mounted() {
    this.setBreadConfig(this.$route);
  }
};
</script>

<style lang="scss" scoped>
$heiader-height: 50px;

.header {
  padding: 0 30px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 11px 6px rgba(0, 0, 0, 0.02);
  height: $heiader-height;
  .title {
    height: 100%;
    line-height: $heiader-height;
    font-weight: 600;
    color: rgba(46, 48, 57, 1);
    font-size: 14px;
    margin: 0;
    display: inline-block;
    position: relative;
    .under {
      display: inline-block;
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 5px;
      left: 0px;
      .line {
        height: 3px;
        background: rgba(0, 111, 208, 1);
      }
    }
  }
  .user {
    padding: 8px 0;
    height: 100%;
    display: flex;
    align-content: center;
    .avator {
      height: 100%;
      margin: 0 10px;
    }
    .name {
      display: inline-block;
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 34px;
    }
    .line {
      height: 100%;
      width: 1px;
      background: #eeeeee;
    }
    .logout {
      color: #0486fe;
      margin-left: 5px;
      cursor: pointer;
      line-height: 34px;
      i {
        font-weight: bold;
        position: relative;
        left: -4px;
      }
    }
  }
}
.aside {
  width: 175px;
  padding: 12px;
  background: linear-gradient(
    315deg,
    rgba(11, 157, 236, 1) 0%,
    rgba(0, 111, 208, 1) 100%
  );
  box-shadow: 0px 3px 16px 6px rgba(0, 0, 0, 0.01);
  height: 100vh;
  position: relative;
.main-logo{
  margin:15px 0 0;
  text-align: center;
  .logo{
    width:51px;
  }
  .text{
    width: 101px;
  }
}
  .menu {
    position: relative;
    z-index: 3;
  }
  .mask {
    z-index: 2;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 135px;
    height: 185px;
    background-image: url("../assets/images/aside-bg.png");
    background-size: 100% 100%;
  }
}
.content {
  padding: 10px 15px;
  height: calc(100vh - 50px);
}
</style>
