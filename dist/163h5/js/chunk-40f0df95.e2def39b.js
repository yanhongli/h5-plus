(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-40f0df95"],{"11b6":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"views-behavior-hatMap"},[n("el-card",{staticClass:"hatMap-wrap",class:{"hatMap-wrap-x":t.isIphoneX},attrs:{"body-style":{height:"100%"}}},[n("div",{staticClass:"inputs"},[n("label",[t._v("落地页：")]),n("el-select",{staticClass:"search-input",attrs:{placeholder:"落地页名称：",size:"small"},model:{value:t.currentPageId,callback:function(e){t.currentPageId=e},expression:"currentPageId"}},t._l(t.landingPages,(function(t){return n("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})})),1),n("label",[t._v("日期：")]),n("el-date-picker",{staticClass:"search-input",staticStyle:{width:"250px"},attrs:{clearable:!1,type:"daterange",align:"left",placeholder:"选择日期",size:"small",format:"yyyy.MM.dd",pickerOptions:t.pickerOptions},model:{value:t.dateRange,callback:function(e){t.dateRange=e},expression:"dateRange"}}),n("el-button",{staticStyle:{width:"90px"},attrs:{size:"small",type:"primary",loading:t.loading},on:{click:function(e){return t.getHotMapData(!0)}}},[t._v("生成\n      ")])],1),n("div",{staticClass:"hot-warp"},[n("div",{staticClass:"left-box iphone-outer"},[n("div",{ref:"wrap",staticClass:"m-warp"},[t.before?n("div",{staticClass:"tip-wrap"},[n("div",{staticClass:"warning-ico"},[n("img",{attrs:{src:a("a8f4"),alt:""}})]),t._v("\n            您还没有生成落地页热力图\n          ")]):t._e(),t.loading?n("div",{staticClass:"tip-wrap"},[n("div",{staticClass:"warning-ico"},[n("img",{attrs:{src:a("ec06"),alt:""}})]),t._v("\n            热力图正在生成中，请稍候…\n          ")]):t._e(),!t.loading&&t.imgHeight&&!t.hotMapData.length&&t.over?n("div",{staticClass:"tip-wrap"},[n("div",{staticClass:"warning-ico"},[n("img",{attrs:{src:a("a0f4"),alt:""}})]),t._v("\n            该落地页目前还没有积累到热力图数据\n          ")]):t._e(),!t.loading&&t.imgHeight&&t.hotMapData.length&&t.over?n("div",{staticClass:"m-view scrollbar"},[n("heatmapjs-vue",{staticClass:"hotMap-container",style:{height:t.imgHeight+"px",backgroundImage:"url("+t.imgUrl+")"},attrs:{max:t.heatMapMax,min:t.heatMapToolTip,data:t.hotMapData}})],1):t._e()])]),n("div",{staticClass:"center-box"},[n("el-slider",{attrs:{"show-tooltip":t.over,"format-tooltip":function(){return t.heatMapToolTip},disabled:!t.over,vertical:"",height:"200px"},model:{value:t.slideValue,callback:function(e){t.slideValue=e},expression:"slideValue"}})],1),n("div",{staticClass:"right-box"},[n("div",{staticClass:"tip-box"},[n("h2",[n("img",{attrs:{src:a("268c"),alt:"",srcset:""}}),t._v(" TIPS")]),n("div",{staticClass:"content"},[n("p",[t._v("您可通过调节纵向浮标查看当前落地页不同点击量的用户分布； ")]),t._v("\n            目前仅支持移动端热力图分布；\n          ")])])])])])],1)},r=[],i=(a("8e6e"),a("456d"),a("75fc")),s=(a("ac6a"),a("5df3"),a("20d6"),a("6762"),a("2fdb"),a("c5f6"),a("bd86")),c=a("2f62"),o=a("23ae"),l=a("f121"),u=a("b166"),d=a("1212"),h=a("96fd"),g=a("d6e9"),p=a("7677"),m=a("5dea");function f(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function A(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?f(a,!0).forEach((function(e){Object(s["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):f(a).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var b=Object(h["a"])(),v=Object(m["a"])(b,1),w=Object(g["a"])((new Date).setFullYear(2019)),M=document.documentElement.clientHeight<800?185:229,y=375,C={data:function(){return{dateRange:[Object(m["a"])(v,6),v],hotMapData:[],imgHeight:0,imgUrl:"",before:!0,loading:!1,over:!1,slideValue:0,heatMapMax:5,screenHeight:document.documentElement.clientHeight,cacheMaxNum:80,pickerOptions:{shortcuts:l["a"],disabledDate:function(t){return Object(d["a"])(t,b)||Object(p["a"])(t,w)}}}},computed:A({},Object(c["b"])(["landingPages"]),{currentPageId:{get:function(){return this.$store.state.currentLandingPageId},set:function(t){this.$store.commit("setCurrentLandingPageId",t)}},landingPages:{get:function(){return this.$store.state.landingPages},set:function(t){this.$store.commit("setLandingPages",t)}},heatMapToolTip:function(){var t=this.heatMapMax/100;return Number((this.slideValue*t).toFixed(1))},isIphoneX:function(){return this.screenHeight>800}}),mounted:function(){this.getScreenShot()},methods:{setImg:function(t){var e=this;this.imgUrl=t;var a=new Image;a.src=this.imgUrl,a.onload=function(){e.imgHeight=a.height}},screenShotParams:function(){var t=this,e=this.landingPages.filter((function(e){return e.id===t.currentPageId}))[0].url;return{url:e,width:M}},getScreenShot:function(){var t=this;return new Promise((function(e,a){var n=t.landingPages.filter((function(e){return e.id===t.currentPageId}))[0].updateTime,r=JSON.parse(localStorage.getItem("SCREENSHOT_IMG"))||[],i="".concat(t.currentPageId,"_").concat(M),s=r.map((function(t){return t.key})).includes(i),c=s&&r.filter((function(t){return t.key===i}))[0]["updateTime"]!==n;if(c){var l=r.findIndex((function(t){return t.key===i}));r.splice(l,1)}!s||c?Object(o["ib"])(t.screenShotParams()).then((function(a){r.length>t.cacheMaxNum&&r.shift(),r.push({key:i,url:a.onlineUrl,updateTime:n}),t.setImg(a.onlineUrl),localStorage.setItem("SCREENSHOT_IMG",JSON.stringify(r)),e("success")})).catch((function(){return a("error")})):(e("success"),t.setImg(r.filter((function(t){return t.key===i}))[0]["url"]))}))},getHotMapData:function(){var t=this;this.slideValue=0,this.before=!1,this.loading=!0,this.over=!1;var e={landingPageId:this.currentPageId,startTime:Object(u["a"])(this.dateRange[0],"yyyy-MM-dd"),endTime:Object(u["a"])(this.dateRange[1],"yyyy-MM-dd")};Promise.all([Object(o["ab"])(e),this.getScreenShot()]).then((function(e){t.over=!0,t.loading=!1,t.hotMapData=e[0].map((function(t){return{x:t.pageX*(M/y),y:t.pageY*(M/y),value:t.clickCount}})),t.hotMapData.length&&t.hotMapData.push({x:0,y:0,value:0}),t.heatMapMax=Math.max.apply(Math,Object(i["a"])(t.hotMapData.map((function(t){return t.value}))))+1})).catch((function(){t.loading=!1,t.$message.error("加载失败，请稍后重试")}))}}},P=C,O=(a("a740"),a("2877")),x=Object(O["a"])(P,n,r,!1,null,"436820a3",null);e["default"]=x.exports},"20d6":function(t,e,a){"use strict";var n=a("5ca1"),r=a("0a49")(6),i="findIndex",s=!0;i in[]&&Array(1)[i]((function(){s=!1})),n(n.P+n.F*s,"Array",{findIndex:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),a("9c6c")(i)},"268c":function(t,e,a){t.exports=a.p+"163h5/img/tips.7a865d9b.svg"},"5df3":function(t,e,a){"use strict";var n=a("02f4")(!0);a("01f9")(String,"String",(function(t){this._t=String(t),this._i=0}),(function(){var t,e=this._t,a=this._i;return a>=e.length?{value:void 0,done:!0}:(t=n(e,a),this._i+=t.length,{value:t,done:!1})}))},"96fd":function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));var n=a("a622");function r(){return Object(n["a"])(Date.now())}},"9ea2":function(t,e,a){},a0f4:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAABhBAMAAAAemCM/AAAAHlBMVEX////8/Pzn5+f39/fv7+/f39/Jycm7u7uZmZmpqalV7NFNAAAEGUlEQVRYw+2YsXPbNhTGyUhNVqFQL6vzTKrtJhq4a7NZIHzumMKC0mw92abirec7k/baVja1pdfmZP23fQ+kLGewSGhpBz8tuuP98D0+PLwPUhA8x3P8pyHS3dlvVovezvCP5d3u8E/lfPe03y7Guyu/XGoHM7YDHOrUwXLUmlCQCkFa4ZEdVWsMW7PGGp1qLUTfWotYpzUb9MHGNpJaa6Ughkl2olsnHShkrUFlpQHjYnWWtq54B2IMGzllBYOiGCethbtgDL7quFZ+fyo8tukFONpUyoPinc/Wfk0s0pGOIohnXnB4gLlS3paU3xdeMCNlrJjZZ7jTs9nMAw4RTjljCVapP+xkWe4BM9aPWK+qr+whnL3zEGb9N4xVhygNvGHMuIL7o6CbZ9mvm4dJM8xqmA+D7mp189tmH4btYeq2siw/1Y+4ahwqX7DBC4T/qlblyiZ+E+klwn87Vqp47DmKXpULB3ekOjpPPOG35ZxgrgAmJyLxg78rT+//CPp0us5FMvSDP5aj+z8lqCjOToTwnODXd73rOWDS2VQI7gd37n/nH+cAapLtCyH8hLvlP0DwgIR96/VVOYVfbiHOnLAfzI8XBmFkz4RIxbDVuXoY/h9uAeFJlqcS6ebuDBmv6FAi+Bngw12Wn0kpavfaziYVjWYHcH0J8P3dLNcSQyRbfDZ8mAWc9bAhjTH3JoaLRTFOXbAtcCephCkkTVCw5WeYXCyunLAUbMvJCLH9kOOM8wOSNfGgnNrsYjGWqUbh0TblEJuXJcQqU8Xk1maz2V2WkllLfLSl3olwOZM912En2awo5+haWmr3MGRPKiPNJZqFRbeKcYlJVhTnizGhOq0HVO9JWOCkwkCriskpMek8IrvUG/gJaYIVUc4k8XaQofBU65awjO068Bu9cB6t4WQrHHKxZslhDbEkHLWAsakrZVML4wuTMH4ULdAIP84bzbUoDJKK2EizbdVmBAtxVLMTYq9IlKSV3m/yGVHVu2Kx0oWBCJSKIqRHTQ4nJNGyShqrdYVkFVF02ARz7o68rNnCoG6E4ngrUsNGb3V5Y3dXSV8BTWyiUbnXCHOac7gnA2KXSGHeNd1szK7eBGPSN1NwQSzAfgtXr+Fvkc1hEw3FrmFOBXfwcgqP47DNbYS7ih0Xy6X5Am4a+DWcEnxzU2T2Md7OIF3nHy9XeXGqYljzkYdJ/bBaFdlheGDcJMMl9r3gZXFGl0+nbcC88YNzV19ZKZtDD/j1ygmTU9IsjWHoBed7a4925uFzG3m9vNxYmLJm7HXxW+492jxlT7yunJeb+28vDNWeF/yzO1/UqdQ0odcFrOtIzrmDQ79f3DQTKprwwEs4lFXSidhBOeC1cpIw5v9vAVuzCZXb+58G9mAv/uxzPMf/IP4FsR9Yf2X/Sc4AAAAASUVORK5CYII="},a740:function(t,e,a){"use strict";var n=a("9ea2"),r=a.n(n);r.a},a8f4:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAABhBAMAAAAemCM/AAAAJ1BMVEX////6+vr19fXT09P9/f3u7u7o6OjAwMDa2trh4eHJycm1tbWamprwir9nAAAEtklEQVRYw+2Yz2/jRBTHk5W5d4wb0dva2qzo3lD2R5pyiNMpEtw2MOHHrWUzSsRxJbyK98JGXdxygmq9MeWyBMhiemLFWqpzZUHq/FG8N3acivyyDYJLv06r8UiffD3Pz++NUyhc6lL/n+g/YIuj6rXc8GtC/JrfObRe5YaVn9hBfrjMPsgfsd1y/oAVzGY9N3uFlflaXvjD0A+/z2tsh2EYXM0H74SoyDrz2j+T8BmsWjGzwAqltGFLOLypXN83MsCm+malUgtqQWj/bD84tj7Xshirn9hWcP8G/Hv2NLCtLzJGulMb3nvPsqxn74x6jzKHq6gVdgD+Qdncz5VmO71e72beDHvd90eZYRrrhu/7b8Xj1LFuMVSz+S3APxqGoaqEkJQLL7Y45+12ix3VarWtsiGlpny8GggDzk4gv142QUhfzQC3QN8JIV4xaa2nrSnr17tIc/Y2wL+zchnx5t20ZU9edqt9KsbiZXzVKeEiwC4smbceCjtyBmuWrpwVGevKgPGx2Ba/MWldZiwV3EAYrHl3LE4Alvcc/lLdq13GBo6UOP9K/BkNn7BU9V8pcX5ckRLn2+JFpY96zHkqGG5wP4LHfyAsdbvd3iusznAFVluJ4fME3oIAUmKuoq9w3onhhyKBKwCT1Y/HLu92KkOpU/GLeDEc+rWhX3FdrpvmqhJc8txjvyZ1KkbiLBrWXM+7C84ryuhmt9sf+v4Qjm1hARyND113TwMtLyFdzzvyJe2PEIarwPGW532z1JliSDzPA7NIIhC9ePjc856A8cKIwa0wyS7A/gX4bAq78NV4bX/nlTp2M5MQs+Q5gwlrjQMRxtZDz/E0SjWNEjpb4QsKQedNZ9AfRbJsEYxFYMkT3xkcXtMQn8mzoq4VTOn8keP0eyhrZI3PbehWMBrBKTwde+hszqSZopK6KZ3hgToCDo6eFQYBNBwcwWnVcb4GcI6zQlSJkgYY3IlZy7akevgF1nPHebTIWTUI4uvw+N2x5ul+v3+wwFnVdUhdom1U+85oPuxUtzSMtlafdVZ16dxqy9LJO3jVEC7AHrjRVIstaFsNaU2IKosl6ksgAxt1y2iyMjaOBTWQqjrUZnRmEz0NJjpI5ubCitmAyzbgwqcwNCo7kJ9by2Gqmeisa3Q9XjLnJ7Yt0TB8PJni82GqYRc1CC1hp5Cfk2gXFgYAt+LJuaUbMlMuWgd4ok8xYKizZGruFhj3e6qhG6quldyJPO/Qk3KnmgubaI29UCt5MQHHjNxFzrSB3tqGt0xLnMGbXIDjvOKrYJl1GG59w0m034z0cTJzuDb/PoPAWAV4cBh/Js6dZGoBjMKQXXSeo7XCokVTAhHb6CeaOA+qE22tLdrYQ4qC9RuVRO1o92a8n8xU15btNgl5dwo7g0j9VfC0R1aW6PaKHql0lsD3Vr6bkFhQmAg84ESXe15CUm18lUjRSb0+nfrvfqmYKuMrO02WrmFzy8ArJsGqAsImQrBH1GnKtwQFczxiMc6mJumUsCwpgEZ3KpuzEqc0spKmGZwlDGUFraUztsbUa24Y8atU4kzTr1kxjWmwszrjnkqX3vrUWcmUXlqcJKaks/8yFOWmQguX+pf0F5jP22C7IcXoAAAAAElFTkSuQmCC"},ec06:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAABhBAMAAAAemCM/AAAAJFBMVEX////z8/PHx8e/v7/8/PzV1dW6urrw8PC2trbk5OSwsLCCgoLAMZa5AAADgUlEQVRYw+2Yv2/TQBTHXXSItYeCLEbOGIkRn/B8RoeijnXrljAhLFkWm6Hl5A1RYR2Z2kCJYEVIpews+ed47+wmahviszdQvo0SD/n4+3759FLHWWuttf5jCYeI/vC3Xy96w7dms3e94Ruz34Pe8M3ZSX/YmdGD/vBd2t9ZqoHsDQ/9EekNb/lJ3yEh8gnzN/tmLG8z/1j0ZOWEsQYWXYN2nJixXWmuZUdaEBIzf1/UQXSkiSMZ8xPgHOPejSURwp8FJEAIqdMmdTVEO73BGEtGQhIyr1lET7ACFkkQFrMkmW6Cc1NuQsvPyFrQIvb9ZK8KBnIuWp40V00h/36T134Scx76yYW2h+VpfTUVRJCVA7DFEo9zvoB3aVlfjNQBdEGIFdHLOE5Dzh836OImI6UURCxWOYutHTCewwtNAYY6OqucnQgGlPOXyRXrfRfgA7F6buRpDBULgsu2/qgAVhUtvboTI8z4laBPlNHqR50U9bcUddVCU1XYwBu0cFGFC9+nc/pN87l6yCLqUpR5L2hjWOxtm8+WQ3noUuNs3oE2Usr7iMG31IvQK85GbpkeqbItaKhXUSxxvhPqfaUmLcfaxlJn+jYcf1SHRy1djtxlORdfMv1ePW+ByXB5zg8yrXfO25zdpc5lnuVa6zYYZ+SaszrMwFnrqv0MuyaP53mmcz3+bgvDIx1wOFLCDFVlejweH1nCHgMy4Dw1bAbO2hpu2DQMszCFG+S5PtPWzoGJmWeNsa46OAceCwybZuANxlAubR82WPPQZGzYLjkD63lY6ZqvNPbZ2tnzAsNi4AjrLq0CZ0i5xutO6bMOsHEG2xDxvALnV3YwFJs19bpIGnSuLVsFbfZCAGu2hs8q6/H0cDZDFASdGzi1dYZq83o0UdrQH2ydsc88DOEFVatZ/VPYwRydeYqRpxUeBWfQ6futC+T8ecYHI4WC5dgopH+07eHEPYWMGQ+wVTxD54zDUVDBX+s+KxFm7GFB3YmZTHwscLKr8SPZthBKNUFWDmREP2UYeDr6OsmqSn9oX8Pk4BPsj4NBFMloyKaq9HAHew1RH9vsn08ZuxcBAHSEx68cwNUzfc9uXy+Tg2bhw3tAAvB6mliuz1LMF8fIsCjr/bmxvCTrtZ3I61q5NF52vggctmbS0RkW9UWeXX8lXa4MBCxIhx8bpFa/n4Tr/7qs9e/rD1pKsv3pw8XNAAAAAElFTkSuQmCC"}}]);