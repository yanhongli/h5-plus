<template>
  <div class="views-covernt-track">
    <el-card header="用户路径行为">
      <div class="inputs">
        <label>落地页:</label>
        <el-select disabled class="input" size="small" v-model="currentPageId">
          <el-option
            v-for="page in landingPages"
            :key="page.id"
            :label="page.name"
            :value="page.id"
          ></el-option>
        </el-select>
        <label>用户UID:</label>
        <el-input disabled class="input uid" size="small" v-model="query.uid"></el-input>
        <!-- <el-button type="primary" size="small" @click="getDetail()">生成</el-button> -->
      </div>

      <div class="container">
        <PageReplay
          class="replay"
          :url="currentPageUrl"
          :empty="!conversionDetail"
          :logs="conversionDetail.trackLogs"
        ></PageReplay>
        <table cellspacing="0" class="info-table" style="border-collapse:collapse;">
          <thead>
            <tr>
              <th colspan="2">用户身份信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>姓名</td>
                           <td>{{ conversionDetail.name || "--" }}</td>

            </tr>
            <tr>
              <td>手机号</td>
                           <td>{{ conversionDetail.mobile || "--" }}</td>

            </tr>
            <tr>
              <td>IP</td>
              <td>{{ conversionDetail.ip || "--" }}</td>
            </tr>
            <tr>
              <td>访问时间</td>
              <td>{{ conversionDetail.vistedTime || "--" }}</td>
            </tr>

            <tr>
              <td>停留时长</td>
              <td>
                {{
                conversionDetail.stayTime
                ? conversionDetail.stayTime + "秒"
                : "--"

                }}
              </td>
            </tr>
            <tr>
              <td>访问深度</td>
              <td>
                {{
                conversionDetail.pageDepth
                ? ((conversionDetail.pageDepth * 100) | numFormat) + "%"
                : "--"
                }}
              </td>
            </tr>
            <tr>
              <td>操作系统</td>
              <td>{{ conversionDetail.os || "--" }}</td>
            </tr>
            <tr>
              <td>运营商</td>
              <td>{{ conversionDetail.operator || "--" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
import PageReplay from "../../components/PageReplay";
import { mapState } from "vuex";
import { getConversionDetail } from "../../plugins/api";
import format from "date-fns/format";

export default {
  components: { PageReplay },
  computed: {
    ...mapState(["landingPages"]),

    currentPageId: {
      get() {
        return this.$store.state.currentLandingPageId;
      },
      set(id) {
        this.$store.commit("setCurrentLandingPageId", id);
      }
    },
    currentPageUrl() {
      const res = this.landingPages.find(
        item => item.id === this.currentPageId
      );
      console.log(res);
      if (res) {
        return res.url;
      } else {
        return "";
      }
    }
  },
  data() {
    return {
      query: {
        uid: null,
        id: null
      },
      conversionDetail: {}
    };
  },
  methods: {
    getDetail() {
      getConversionDetail({
        id: this.query.id
      }).then(res => {
        console.log(res);
        if (res && res.vistedTime) {
          res.vistedTime = format(
            new Date(res.vistedTime),
            "yyyy-MM-dd hh:MM:ss"
          );
        }
        res = res || {};
        this.conversionDetail = res;
      });
    }
  },
  created() {
    const { uid, id, pageId } = this.$route.query;
    this.currentPageId = parseInt(pageId);
    this.query.uid = uid;
    this.query.id = parseInt(id);
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.views-covernt-track {
  label {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    margin-right: 10px;
  }
  .input {
    margin-right: 60px;
    width: 170px;
    &.uid {
      width: 265px;
    }
  }
  .replay {
    margin-top: 40px;
  }
  .container {
    display: flex;
    justify-content: space-around;
    .info-table {
      margin-top: 100px;
      border: 1px solid rgba(194, 204, 213, 1);
      width: 400px;
      th {
        // background: rgba(232, 244, 255, 1);
         background: rgba(250, 250, 250, 1);
      }
      tr {
        $td-height: 35px;
        height: $td-height;
        line-height: $td-height;
        td {
          border: 1px solid rgba(194, 204, 213, 1);
          font-size: 16px;
          color: rgba(89, 89, 89, 1);
          padding: 0 45px;
          font-size: 12px

        }
        td:first-child {
          width: 160px;
          text-align: center;

        }
      }
    }
  }
}
</style>
