import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./plugins/numFormat";
import "./plugins/heatmap";
import { apiUCurrent, apiPRoutes } from "./plugins/api";
import qs from 'querystring'
// import "./plugins/directives";

Vue.config.productionTip = false;

window.inited = false

async function init() {
  // let queryTokenMatch = location.href.match(/token=([^&]+)/);
  // if(queryTokenMatch){
  //   localStorage["h5_token"] = queryTokenMatch[1];
  // }
  let vm = new Vue({
    router,
    store,
    render: h => h(App)
  });
  let qsJson = qs.parse(window.location.search.slice(1))
  // let queryTokenMatch = window.location.search
  // if (queryTokenMatch) {
  //   queryTokenMatch = queryTokenMatch.split('=')
  //   localStorage['h5_token'] = queryTokenMatch[1]
  // }
  if(qsJson) {
    let {rs, token, msg } = qsJson
    if(rs === 0){
      Vue.prototype.message.error(msg)
    }else if(token){
      localStorage['h5_token'] = token
    }
  }
  try {    
    if(!/\/(login|fpwd)/i.test(location.href)){
      if(localStorage["h5_token"] && localStorage["h5_token"] !== 'undefined') {
        await apiUCurrent();
        await store.dispatch("getLandingPages", true);      
        await apiPRoutes();
      }
    }
  } catch (error) {

  }
  finally {
    vm.$mount("#app");
    setTimeout(() => {
      window.inited = true
    }, 3000);
  }
}

window.__IS_DEV__ = process.env.NODE_ENV === "development";
init();
