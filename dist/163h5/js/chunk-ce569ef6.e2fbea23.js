(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ce569ef6"],{"06d0":function(e,t,a){"use strict";var s=a("58f8"),r=a.n(s);r.a},"16b9":function(e,t,a){"use strict";var s=a("abcf"),r=a.n(s);r.a},"351b":function(e,t,a){"use strict";var s=a("45731"),r=a.n(s);r.a},45731:function(e,t,a){},"494e":function(e,t,a){},"58f8":function(e,t,a){},"748a":function(e,t,a){"use strict";var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"host"})},r=[],n=a("313e"),i=a.n(n),o={data:function(){return{chart:null}},props:{data:{titleText:"",seriesName:"",legendData:[],seriesData:[]},xFormatter:null},methods:{resizeHandle:function(){this.chart&&this.chart.resize()},drawChart:function(){var e=i.a.init(this.$el);this.chart=e;var t={title:{text:this.data.titleText,show:!1,x:"center",textStyle:{fontSize:"14",fontweight:"500",color:"rgba(46,48,57,1)",lineHeight:"20"}},tooltip:{trigger:"item"},series:[{type:"pie",radius:"55%",center:["50%","60%"],name:this.data.seriesName,data:this.data.seriesData,label:{formatter:"{b} \n\n {d}%"},itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]};e.setOption(t),this.chart.resize()}},watch:{data:"drawChart"},beforeDestroy:function(){window.removeEventListener("resize",this.resizeHandle)},mounted:function(){this.drawChart(),window.addEventListener("resize",this.resizeHandle.bind(this))}},l=o,c=(a("dc53"),a("2877")),u=Object(c["a"])(l,s,r,!1,null,"57cfd9e4",null);t["a"]=u.exports},"83b8":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"main"},[a("el-card",[a("el-row",{attrs:{type:"flex"}},[a("div",{staticClass:"el-col-24"},[a("el-row",{attrs:{type:"flex",align:"middle"}},[a("span",{staticClass:"page-mark-wapper"},[e._v("\n            评分:\n            "),a("b",{staticClass:"page-mark"},[e._v(e._s(e.score))]),e._v("分\n          ")]),a("el-rate",{attrs:{disabled:"","text-color":"#ff9900"},model:{value:e.scoreRate,callback:function(t){e.scoreRate=t},expression:"scoreRate"}}),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(t){e.showRateDes=!e.showRateDes}}},[e._v(e._s(e.showRateDes?"收起":"展开")+"计分说明")])],1),e.showRateDes?a("el-row",{staticClass:"mt-20",staticStyle:{"padding-left":"12px"}},[e._v("\n          计分说明：分值标识页面可访问行情况\n          "),a("div",{staticClass:"rate-deses mt-20"},[a("span",{staticClass:"des"},[e._v("0-2：堪忧")]),a("span",{staticClass:"des bad"},[e._v("2-4：较差")]),a("span",{staticClass:"des normal"},[e._v("4-6：一般")]),a("span",{staticClass:"des good"},[e._v("6-8：较好")]),a("span",{staticClass:"des better"},[e._v("8-10：非常好")])])]):e._e(),a("el-row",{staticClass:"unit-group mt-20"},[a("Unit",{attrs:{label:"白屏时间",value:e._f("msToTime")(e.summary.firstContentfulPaint),unit:"秒"}}),a("Unit",{attrs:{label:"首资源时间",value:e._f("msToTime")(e.summary.timeToFirstByte),unit:"秒"}}),a("Unit",{attrs:{label:"有效渲染时间",value:e._f("msToTime")(e.summary.firstMeaningfulPaint),unit:"秒"}}),a("Unit",{attrs:{label:"页面加载时间",value:e._f("msToTime")(e.summary.firstCpuIdle),unit:"秒"}}),a("Unit",{attrs:{label:"网页总大小",value:e._f("byteToSize")(e.summary.totalByteWeight,"mb",2),unit:"MB"}}),a("Unit",{attrs:{label:"DOM",value:e._f("numFormat")(e.summary.domSize),unit:"个"}}),a("Unit",{attrs:{label:"重定向数",value:e._f("numFormat")(e.summary.redirects),unit:"个"}})],1),a("el-row",[a("label",{staticClass:"legend"},[e._v("统计信息")]),a("el-row",{attrs:{type:"flex"}},[a("el-table",{attrs:{data:e.resourceMap.rows,border:""}},e._l(e.resourceMap.columns,(function(t){return a("el-table-column",{key:t.id,attrs:{prop:t.id,label:t.name},scopedSlots:e._u([{key:"default",fn:function(t){return["size"===t.column.property?[e._v(e._s(e._f("byteToSize")(t.row[t.column.property],"mb",2)))]:[e._v(e._s(t.row[t.column.property]))]]}}],null,!0)})})),1),a("PieChart",{attrs:{data:e.resourceMap.chartData}})],1)],1),a("el-row",[a("label",{staticClass:"legend"},[e._v("加载最慢的十个资源")]),a("el-row",[a("LineGraphic",{attrs:{data:e.slowResourceList.chartData}})],1)],1),a("el-row",[a("label",{staticClass:"legend"},[e._v("扣分细则和改善建议")]),a("el-row",[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.scoreDetail.rows,"row-class-name":e.getRowClass}},[a("el-table-column",{attrs:{label:"改善建议",type:"expand",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.detail.length?[a("ul",{staticClass:"detail-info"},e._l(t.row.detail,(function(t,s){return a("li",{key:s,staticClass:"detail-item"},[a("el-row",{attrs:{type:"flex",justify:"space-between"}},[a("div",[a("span",{staticClass:"detail-item-link"},[e._v(e._s(t.url))])]),a("div",{staticClass:"bar"},[e._v("\n                            大小："+e._s(e._f("byteToSize")(t.totalBytes,"mb",2))+" MB\n                            耗时："+e._s(e._f("msToTime")(t.timeCost))+"秒\n                          ")])])],1)})),0)]:e._e()]}}])}),e._l(e.scoreDetail.columns,(function(t){return a("el-table-column",{key:t.id,attrs:{label:t.name,prop:t.id,width:t.width},scopedSlots:e._u([{key:"default",fn:function(t){return["percent"==t.column.property?a("el-row",{attrs:{type:"flex",align:"middle"}},[a("el-col",{attrs:{span:20}},[a("el-progress",{attrs:{percentage:t.row.percent,color:e.customColors,format:e.storeFormat,"show-text":!1}})],1),a("span",{class:{"score-good":t.row.percent>=90,"score-bad":t.row.percent<90}},[e._v(e._s(e.storeFormat(t.row.percent)))])],1):a("el-row",[e._v(e._s(t.row[t.column.property]))])]}}],null,!0)})}))],2)],1)],1)],1),a("div",{staticClass:"ml-50 task-info"},[a("el-row",[a("label",[e._v("页面地址：")])]),a("el-row",{staticClass:"mt-20"},[a("a",{staticClass:"link",attrs:{href:e.task.url,target:"_blank"}},[e._v(e._s(e.task.url))])]),a("el-row",{staticClass:"mt-20 gray"},[a("label",[e._v("落地页类型：")]),a("span",[e._v(e._s(e.task.typeStr))])]),a("el-row",{staticClass:"mt-20 gray"},[a("label",[e._v("模拟网络环境：")]),a("span",[e._v(e._s(e.task.netEnv))])]),a("el-row",{staticClass:"mt-20 gray"},[a("label",[e._v("模拟平台：")]),a("span",[e._v(e._s(e.task.os))])]),a("el-row",{staticClass:"mt-20 gray"},[a("label",[e._v("提测时间：")]),a("span",[e._v(e._s(e.task.createTime))])]),a("el-row",{staticClass:"mt-20 gray"},[a("label",[e._v("检测时间：")]),a("span",[e._v(e._s(e.task.createTime))])]),a("el-row",{staticClass:"mt-20 gray"},[a("label",[e._v("状态：")]),a("span",[e._v(e._s(e.task.statusStr))])])],1)])],1)],1)},r=[],n=(a("8e6e"),a("ac6a"),a("456d"),a("75fc")),i=(a("6b54"),a("bd86")),o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"wrapper"},[a("div",{staticClass:"label"},[e._v(e._s(e.label))]),a("div",[a("span",{staticClass:"value"},[e._v(e._s(e.value))]),a("span",{staticClass:"unit"},[e._v("("+e._s(e.unit)+")")])])])},l=[],c={props:["label","value","unit"]},u=c,p=(a("06d0"),a("2877")),d=Object(p["a"])(u,o,l,!1,null,"e4c85020",null),m=d.exports,f=a("748a"),v=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"wrapper"})},h=[],b=a("313e"),y=a.n(b),w={props:["data"],data:function(){return{chart:null}},methods:{draw:function(){this.chart=y.a.init(this.$el),this.chart.setOption({color:["#8EC9EB"],legend:{data:["高度(km)与气温(°C)变化关系"]},tooltip:{trigger:"axis",formatter:"{b} : {c}"},grid:{left:"3%",right:"4%",bottom:"1%",top:"0",containLabel:!0},xAxis:{type:"value",splitLine:{show:!1},axisLabel:{formatter:"{value}"}},yAxis:{type:"category",axisLine:{onZero:!1},axisLabel:{formatter:function(e){return e.toString().length>20?e.toString().substring(0,20)+"...":e}},boundaryGap:!0,data:this.data.yAxisData},series:[{type:"bar",smooth:!0,barCategoryGap:25,label:{normal:{show:!0,lineHeight:30,position:["101%","-5"],distance:1,formatter:function(e){return e.data},rich:{d:{color:"#3CDDCF"},a:{color:"#fff",align:"center"},b:{width:1,height:30,borderWidth:1,borderColor:"#234e6c",align:"left"}}}},lineStyle:{width:3,shadowColor:"rgba(0,0,0,0.4)",shadowBlur:10,shadowOffsetY:10},data:this.data.seriesData}]})}},beforeDestroy:function(){},mounted:function(){this.draw()},watch:{data:"draw"}},g=w,_=(a("16b9"),Object(p["a"])(g,v,h,!1,null,"2c69488e",null)),C=_.exports,O=a("23ae");function D(){return{id:"",score:0,scoreRate:0,showRateDes:!0,task:{},summary:{firstContentfulPaint:0,timeToFirstByte:0,firstMeaningfulPaint:0,firstCpuIdle:0,totalByteWeight:0,domSize:0,redirects:0},resourceMap:{columns:[{id:"label",name:"资源统计类型"},{id:"size",name:"大小（MB）"},{id:"requestCount",name:"数量（个）"}],rows:[],chartData:{seriesData:[]}},slowResourceList:{chartData:{yAxisData:[],seriesData:[]}},customColors:[{color:"#EF7F25",percentage:89},{color:"#53E000",percentage:100}],scoreDetail:{columns:[{id:"name",name:"评分项",width:150},{id:"percent",name:"评分结果（扣分分值）",width:200},{id:"desp",name:"扣分原因"}],rows:[]}}}a("a481"),a("6762"),a("2fdb");function S(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,s)}return a}function x(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?S(a,!0).forEach((function(t){Object(i["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):S(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var P={fullpageLoadTime:{name:"整页加载时间",value:1,desp:"减小整页加载时间，使低于8秒",score:1,type:"Page"},whiteScreenTime:{name:"白屏时间",value:1,desp:"页面白屏时间达到 {value}秒，用户可能会较长时间无法打面，建议优化至 0.5 秒以下。",score:.5,type:"Page"},firstMeaningFullPaintTime:{name:"首次有效渲染时间",value:1,desp:"首次有效渲染时间达到 {value}秒，它可能导页面首屏内容展示较慢，建议优化至 0.8 秒以下。",score:.5,type:"Page"},htmlSize:{name:"HTML大小",value:1,desp:"\t体积达到 {value}MB，可能会导致访问缓慢，建议优化至 50KB 以下。",score:.5,type:"Page"},pageSize:{name:"页面大小",value:1,desp:"压缩 HTML 代码（包括其中所含的任何内嵌 JavaScript 和 CSS可以节省大量数据字节空间，并提高下载和解析的速度。",score:.5,type:"Page"},pageLoadTime:{name:"页面加载时长",value:1,desp:"加载时间超过 1.3 秒的页面资源有 {value}个，优化它们以提高页面响应速度。",score:.2,type:"Page"},ajaxCount:{name:"ajax数量",value:1,desp:"页面 Ajax 请求数量达到 {value} 个，建议优化至 2 个以下。",score:.5,type:"Ajax"},cookieResource:{name:"cookie资源",value:1,desp:"页面携带 Cookie 头的静态资源请求达 {value} 个，静资源请求不需要携带 Cookie 头，它会增加带宽资源消耗。",score:0,type:"Resource"},redirectCount:{name:"重定向",value:1,desp:"页面存在重定向请求 {value} 个，它会增加带宽资源消耗增加页面请求时长，建议去除它们。",score:.5,type:"Page"},pictureSize:{name:"图片体积",value:1,desp:"图片体积超过 230 KB 的有 {value} 个，优化它们的大小可提高页面响应速度。",score:.2,type:"Image"},domainCount:{name:"域名使用数量",value:1,desp:"页面中域名使用数量为 {value} 个，建议减少至 5 个以内将有助于提高移动网络情况下访问速度。",score:.5,type:"Page"},useGzip:{name:"使用压缩",value:1,desp:"发现未启用gzip压缩的资源，影响页面加载速度，浪费流量",score:.2,type:"Page"},httpCount:{name:"页面请求数量",value:1,desp:"将多个资源合并为一个文件，以减少HTTP请求次数， 使低于 20个\t",score:.1,type:"Page"},nullContent:{name:"空内容",value:1,desp:"检查、修复或删除返回内容为空的请求",score:0,type:"Page"},cssStyle:{name:"样式资源",value:1,desp:"\t将CSS样式放在页面的上方",score:0,type:"Css"},cssCompress:{name:"样式压缩",value:1,desp:"发现可压缩的CSS文件",score:.5,type:"Css"},jsCompress:{name:"js压缩",value:1,desp:"发现可压缩的JS文件",score:.5,type:"脚本"},errorRequest:{name:"错误的请求",value:1,desp:"存在{value}个错误的请求，建议去除他们",score:0,type:"Page"},cssCount:{name:"css数量",value:1,desp:"减少css引用，尽量合并一个css",score:1,type:"Page"},domCount:{name:"dom数量",value:1,desp:"页面 DOM 数超过 1200 个，建议尽量减少它",score:2,type:"Page"}};function j(e){if(e.tagName in P){var t=x({},P[e.tagName]),a=e.value||"";return["whiteScreenTime","firstMeaningFullPaintTime"].includes(e.tagName)&&a?a=(a/1e3).toFixed(2):["htmlSize"].includes(e.tagName)&&a&&(a=(a/1e3/1e3).toFixed(2)),t.desp=t.desp.replace("{value}",a),t.value=e.value,t.oppositeValue=-e.value,t.percent=+(10*(10-e.score)).toFixed(0),t.detail=e.detail,t}return{}}function k(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,s)}return a}function T(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?k(a,!0).forEach((function(t){Object(i["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):k(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var z={components:{Unit:m,PieChart:f["a"],LineGraphic:C},data:function(){return T({},D())},methods:{storeFormat:function(e){return((e-100)/10).toString()},getScoreDetail:function(){var e=this;Object(O["C"])({id:this.id}).then((function(t){e.task=t,e.score=t.score,e.scoreRate=t.score/2;var a=JSON.parse(t.gradeDetail);e.setGradeDetail(a)}))},setGradeDetail:function(e){var t,a;Object.assign(this.summary,e.summary),this.resourceMap.chartData={seriesData:e.resourceMap.filter((function(e){return"total"!==e.resourceType})).map((function(e){return{name:e.label,value:e.requestCount}}))},(t=this.resourceMap.rows).push.apply(t,Object(n["a"])(e.resourceMap)),this.slowResourceList.chartData={yAxisData:e.slowResourceList.map((function(e){return e.url})),seriesData:e.slowResourceList.map((function(e){return((e.timeCost||0)/1e3).toFixed(2)}))},(a=this.scoreDetail.rows).push.apply(a,Object(n["a"])(e.scoreDetail.map((function(e){return j(e)}))))},getRowClass:function(e){if(0==e.row.detail.length)return"row-expand-cover"}},mounted:function(){var e=this.$route.params["id"];this.id=e,this.getScoreDetail()}},M=z,R=(a("351b"),Object(p["a"])(M,s,r,!1,null,"01293b75",null));t["default"]=R.exports},abcf:function(e,t,a){},dc53:function(e,t,a){"use strict";var s=a("494e"),r=a.n(s);r.a}}]);