import Vue from "vue";

import numeral from "numeral";
import numFormat from "vue-filter-number-format";

// 数字过滤器
// docs: https://github.com/dmackca/vue-filter-number-format
Vue.filter("numFormat", numFormat(numeral));

Vue.filter("byteToSize", function(value, unit = 'kb', fixed = 0){
    let u = unit.toLowerCase();
    let rv = value;
    switch (u) {
        case 'kb':
            rv = value / 1000;
            break;
        case 'mb':
            rv = value / 1024 / 1000;
            break;
        case 'gb':
            rv = value / 1024 / 1024 / 1000;
            break;
    }
    return isNaN(rv) ? value : Number(rv.toFixed(fixed));
});
Vue.filter("msToTime", function(value, unit = 's', fixed = 2){
    let u = unit.toLowerCase();
    let rv = value;
    switch (u) {
        case 's':
            rv = value / 1000;
            break;
        case 'm':
            rv = value / 60 / 1000;
            break;
        case 'h':
            rv = value / 60 / 60 / 1000;
            break;
    }
    return isNaN(rv) ? value : Number(rv.toFixed(fixed));
});
