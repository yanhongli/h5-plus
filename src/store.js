import Vue from "vue";
import Vuex from "vuex";
import {
  getLandingPages
} from "./plugins/api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    landingPages: [],
    currentLandingPageId: null
  },
  getters: {
    currentLandingPage (state) {
      return state.landingPages.find(item => item.id === state.currentLandingPageId)
    }
  },
  mutations: {
    setLandingPages(state, {
      pages,
      reset
    }) {

      if (window.__IS_DEV__) {
        pages = pages.slice(0 , 10)
      }

      state.landingPages = pages;
      if (reset && pages.length > 0) {
        state.currentLandingPageId = pages[0].id;
      }
    },
    resetCurrentLandingPage(state) {
      if (state.landingPages.length > 0) {
        state.currentLandingPageId = state.landingPages[0].id;
      }
    },
    setCurrentLandingPageId(state, id) {
      state.currentLandingPageId = id;
    }
  },
  actions: {
    getLandingPages(context, reset) {
      return getLandingPages().then(res => {
        context.commit("setLandingPages", {
          reset,
          pages: res
        });
      });
    }
  }
});
