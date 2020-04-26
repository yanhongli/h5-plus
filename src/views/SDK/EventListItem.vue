<template>
  <div>
    <div class="main">
      <el-card>
        <el-row type="flex" class="inputs">
          <div v-for="select in selects" :key="select.key">
            <label>{{ select.name }}：</label>
            <el-select
              v-model="select.value"
              placeholder="请选择"
              class="search-input mr-30"
              size="small"
              @change="selectChange(select.key)"
            >
              <el-option
                v-for="item in select.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>
            <label>日期：</label>
            <el-date-picker
              :clearable="false"
              style="width:250px;"
              type="daterange"
              v-model="dateRange"
              :pickerOptions="pickerOptions"
              align="right"
              placeholder="选择日期"
              size="small"
              format="yyyy.MM.dd"
              class="mr-30"
            ></el-date-picker>
          </div>
          <el-button type="primary" @click="search()" size="small">查询</el-button>
        </el-row>

        <LineChart :data="chartData" />
      </el-card>
      <el-card style="margin-top: 20px;">
        <el-row type="flex" justify="end">
          <el-button type="primary" size="small" @click="eMExport()">导出CSV</el-button>
        </el-row>
        <el-table :data="tableData" style="width: 100%" @sort-change="sortChange">
          <template v-for="column in tableColumns">
            <el-table-column
              :key="column"
              :prop="column"
              :label="customStates[column].name"
              :sortable="customStates[column].sortable"
            >
              <template slot-scope="scope">
                <template
                  v-if="
                    scope.column.property == 'browse' ||
                      scope.column.property == 'conversionAmount' ||
                      scope.column.property == 'visitor'
                  "
                >{{ scope.row[scope.column.property] | numFormat }}</template>
                <template v-else>{{ scope.row[scope.column.property] }}</template>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div class="mt-20">
          <el-pagination
            @size-change="getTableData(true)"
            @current-change="getTableData(false)"
            :page-sizes="[10, 20, 50, 100]"
            :page-size.sync="page.size"
            :current-page.sync="page.current"
            layout="total, sizes, jumper,pager"
            :total="page.total"
          ></el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import LineChart from "../../components/LineChart";
import { data, timesSpan } from "./data.EventListItem";
import format from "date-fns/format";
import {
  apiEMSelectDetail,
  apiEMSelectDetailTable,
  apiLPList,
  apiEMDropDown,
  apiEMExport
} from "../../plugins/api";
export default {
  components: {
    LineChart
  },
  data() {
    let _self = this;
    return {
      ...data(_self)
    };
  },
  methods: {
    getSearchCondition: function() {
      let args = {
        landingPageId: this.selects.find(e => e.key === "landingPageName")
          .value,
        id: this.selects.find(e => e.key === "eventList").value,
        conversionType: this.selects.find(e => e.key === "eventType").value,
        startTime: format(this.dateRange[0], "yyyy-MM-dd 00:00:00"),
        endTime: format(this.dateRange[1], "yyyy-MM-dd 23:59:59"),
        current: this.page.current,
        size: this.page.size
      };
      return args;
    },
    eMSelectDetail: function() {
      let condition = this.getSearchCondition();
      apiEMSelectDetail(condition).then(r => {
        let seriesName = "转化量";
        let seriesData = [],
          xAxisData = [...r.list.map(e => e.createTimeStr)];
        if (this.selects.find(e => e.key === "eventType").value == "1") {
          seriesName = "浏览量";
          seriesData.push(...r.list.map(e => e.browse));
        } else {
          seriesData.push(...r.list.map(e => e.conversionAmount));
        }
        if (seriesData.length <= 0) {
          let st = new Date(condition.startTime),
            et = new Date(condition.endTime);
          xAxisData = timesSpan(st, et);
          xAxisData.forEach(() => seriesData.push(0));
        }
        //图标使用
        this.chartData = {
          seriesName: seriesName,
          seriesData: seriesData,
          xAxisData: xAxisData
        };
      });
    },
    eMSelectDetailTable: function() {
      let args = Object.assign({}, this.getSearchCondition(), this.order);
      apiEMSelectDetailTable(args).then(r => {
        this.tableData.length = 0;
        this.tableData.push(...r.list);
        // this.tableData.forEach(
        //   e => (e.createTime = format(new Date(e.createTime), "yyyy-MM-dd"))
        // );
        this.page.total = r.total;
      });
    },
    search: function() {
      this.page.current = 1;
      this.eMSelectDetail();
      this.eMSelectDetailTable();
    },
    getTableData: function(c) {
      if (c) this.page.current = 1;
      this.eMSelectDetailTable();
    },
    eMDropDown: function(cid) {
      apiEMDropDown({
        landingPageId: this.selects.find(e => e.key === "landingPageName").value
      }).then(r => {
        let select = this.selects.find(e => e.key === "eventList");
        select.list.length = 0;
        select.list.push(
          ...r.map(s => {
            return { label: s.conversionName, value: s.id.toString() };
          })
        );
        select.value = cid || select.list[0].value;
      });
    },
    selectChange: function(key) {
      if (key === "landingPageName") {
        this.eMDropDown();
      }
    },
    eMExport: function() {
      apiEMExport(this.getSearchCondition());
    },
    sortChange: function(a) {
      this.page.current = 1;
      this.order.sort = a.prop;
      Object.assign(this.order, {
        sort: a.prop,
        dir: (a.order || "").replace("ending", "")
      });
      this.eMSelectDetailTable();
    }
  },
  mounted: function() {
    let ids = this.$route.params["id"].split("-");
    let [lpid, ct, cid] = ids;
    this.selects.find(e => e.key === "landingPageName").value = lpid;
    this.selects.find(e => e.key === "eventList").value = cid;
    this.selects.find(e => e.key === "eventType").value = ct;
    apiLPList().then(r => {
      let lPNSelect = this.selects.find(e => e.key === "landingPageName");
      lPNSelect.list.push(
        ...r.map(s => {
          return { label: s.name, value: s.id.toString() };
        })
      );
      this.eMSelectDetail();
      this.eMSelectDetailTable();
    });
    this.eMDropDown(cid);
  }
};
</script>
<style lang="scss" scoped>
.main {
  .inputs {
    margin-top: 7px;
    flex-wrap: wrap;
    >*{
      margin-bottom: 15px;
    }
    .search-input {
      width: 180px;
    }
    label {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
    }
  }
  .table {
    margin-top: 65px;
  }
}
</style>
