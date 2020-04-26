import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Layout from "./views/Layout.vue";
import store from "./store"

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router);

const router = new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [{
      path: "",
      component: Layout,
      children: [{
          path: "/",
          redirect: "/home"
        },
        {
          path: "/home",
          name: "",
          component: Home
        },
        {
          path: "sdk",
          name: " 监测事件管理",
          component: () => import("./views/SDK/Index.vue"),
          children: [{
              path: "",
              redirect: "/sdk/create"
            },
            {
              path: "/sdk/create",
              name: "创建监测事件",
              component: () => import("./views/SDK/Create.vue")
            },
            {
              path: "/sdk/event-list",
              name: "查看监测事件",
              component: () => import("./views/SDK/EventList.vue")
            }
          ]
        },
        {
          path: "performance",
          name: " 页面质量评分",
          component: () => import("./views/performance/Index.vue"),
          children: [{
              path: "",
              redirect: "/performance/list"
            },
            {
              path: "/performance/list",
              name: "页面检测列表",
              component: () => import("./views/performance/List.vue")
            },
            {
              path: "/performance/task/:id",
              name: "页面评分详情",
              component: () => import("./views/performance/Task.vue")
            }
          ]
        },
        {
          path: "/sdk/event-list/:id",
          name: "查看数据",
          component: () => import("./views/SDK/EventListItem.vue")
        },
        {
          path: "image",
          name: "画像分析",
          component: () => import("./views/image/index.vue"),
          children: [{
              path: "",
              redirect: "/image/area"
            },
            {
              name: "地域分析",
              path: "/image/area",
              component: () => import("./views/image/area.vue")
            },
            {
              path: "device",
              component: () => import("./views/image/Device.vue")
            }
          ]
        },
        {
          path: "/covernt",
          name: "转化分析",
          component: () => import("./views/covernt/Index.vue"),
          children: [{
              path: "",
              redirect: "/covernt/list"
            },
            {
              path: "/covernt/list",
              name: "转化明细",
              component: () => import("./views/covernt/CoverntList.vue")
            },
            {
              path: "/covernt/staytime",
              name: "浏览时长分析",
              component: () => import("./views/covernt/StayTime.vue")
            },
            {
              path: "/covernt/funnel",
              name: "转化漏斗",
              component: () => import("./views/covernt/Funnel.vue")
            },
            {
              path: "/covernt/depth",
              name: "浏览深度分析",
              component: () => import("./views/covernt/Depth.vue")
            },
            {
              path: "/covernt/track",
              name: "用户行为路径",
              component: () => import("./views/covernt/CoverntTrack.vue"),
              meta: {
                breadConfig: [{
                    name: "转化分析",
                    path: "/covernt"
                  },
                  {
                    name: "转化明细",
                    path: "/covernt/list"
                  },
                  {
                    name: "用户行为路径",
                    path: "/covernt/track"
                  }
                ]
              }
            }
          ]
        },
        {
          path: "action",
          name: "行为分析",
          component: () => import("./views/action/index.vue"),
          children: [{
              name: "点击热力图分析",
              path: "heatmap",
              component: () => import("./views/action/Heatmap.vue")
            },
            {
              name: "时段对比分析",
              path: "timerange",
              component: () => import("./views/action/Timerange.vue")
            },
            {
              name: "可视化深度分析",
              path: "depth",
              component: () => import("./views/action/Depth.vue")
            }
          ]
        },
        {
          path: "/account",
          name: "账户管理",
          component: () => import("./views/account/AccountList.vue")
        },
        {
          path: "/guide",
          name: "引导",
          component: () => import("./views/guide/Guide.vue")
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/login/Login.vue")
    },
    {
      path: "/fpwd",
      name: "fpwd",
      component: () => import("./views/findPassword/findPassword.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  store.commit('resetCurrentLandingPage')
  next()

})

export default router