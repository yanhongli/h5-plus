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
      }
    }
  }
};
