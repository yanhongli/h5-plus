/**
 * 页面评分详情
 */
const scoreDetail = {
    fullpageLoadTime: {
        name: '整页加载时间',
        value: 1,
        desp: '减小整页加载时间，使低于8秒',
        score: 1,
        type: 'Page'
    },
    whiteScreenTime: {
        name: '白屏时间',
        value: 1,
        desp: '页面白屏时间达到 {value}秒，用户可能会较长时间无法打面，建议优化至 0.5 秒以下。',
        score: 0.5,
        type: 'Page'
    },
    firstMeaningFullPaintTime: {
        name: '首次有效渲染时间',
        value: 1,
        desp: '首次有效渲染时间达到 {value}秒，它可能导页面首屏内容展示较慢，建议优化至 0.8 秒以下。',
        score: 0.5,
        type: 'Page'
    },
    htmlSize: {
        name: 'HTML大小',
        value: 1,
        desp: '	体积达到 {value}MB，可能会导致访问缓慢，建议优化至 50KB 以下。',
        score: 0.5,
        type: 'Page'
    },
    pageSize: {
        name: '页面大小',
        value: 1,
        desp: '压缩 HTML 代码（包括其中所含的任何内嵌 JavaScript 和 CSS可以节省大量数据字节空间，并提高下载和解析的速度。',
        score: 0.5,
        type: 'Page'
    },
    pageLoadTime: {
        name: '页面加载时长',
        value: 1,
        desp: '加载时间超过 1.3 秒的页面资源有 {value}个，优化它们以提高页面响应速度。',
        score: 0.2,
        type: 'Page'
    },
    ajaxCount: {
        name: 'ajax数量',
        value: 1,
        desp: '页面 Ajax 请求数量达到 {value} 个，建议优化至 2 个以下。',
        score: 0.5,
        type: 'Ajax'
    },
    cookieResource: {
        name: 'cookie资源',
        value: 1,
        desp: '页面携带 Cookie 头的静态资源请求达 {value} 个，静资源请求不需要携带 Cookie 头，它会增加带宽资源消耗。',
        score: 0,
        type: 'Resource'
    },
    redirectCount: {
        name: '重定向',
        value: 1,
        desp: '页面存在重定向请求 {value} 个，它会增加带宽资源消耗增加页面请求时长，建议去除它们。',
        score: 0.5,
        type: 'Page'
    },
    pictureSize: {
        name: '图片体积',
        value: 1,
        desp: '图片体积超过 230 KB 的有 {value} 个，优化它们的大小可提高页面响应速度。',
        score: 0.2,
        type: 'Image'
    },
    domainCount: {
        name: '域名使用数量',
        value: 1,
        desp: '页面中域名使用数量为 {value} 个，建议减少至 5 个以内将有助于提高移动网络情况下访问速度。',
        score: 0.5,
        type: 'Page'
    },
    useGzip: {
        name: '使用压缩',
        value: 1,
        desp: '发现未启用gzip压缩的资源，影响页面加载速度，浪费流量',
        score: 0.2,
        type: 'Page'
    },
    httpCount: {
        name: '页面请求数量',
        value: 1,
        desp: '将多个资源合并为一个文件，以减少HTTP请求次数， 使低于 20个	',
        score: 0.1,
        type: 'Page'
    },
    nullContent: {
        name: '空内容',
        value: 1,
        desp: '检查、修复或删除返回内容为空的请求',
        score: 0,
        type: 'Page'
    },
    cssStyle: {
        name: '样式资源',
        value: 1,
        desp: '	将CSS样式放在页面的上方',
        score: 0,
        type: 'Css'
    },
    cssCompress: {
        name: '样式压缩',
        value: 1,
        desp: '发现可压缩的CSS文件',
        score: 0.5,
        type: 'Css'
    },
    jsCompress: {
        name: 'js压缩',
        value: 1,
        desp: '发现可压缩的JS文件',
        score: 0.5,
        type: '脚本'
    },
    errorRequest: {
        name: '错误的请求',
        value: 1,
        desp: '存在{value}个错误的请求，建议去除他们',
        score: 0,
        type: 'Page'
    },
    cssCount: {
        name: 'css数量',
        value: 1,
        desp: '减少css引用，尽量合并一个css',
        score: 1,
        type: 'Page'
    },
    domCount: {
        name: 'dom数量',
        value: 1,
        desp: '页面 DOM 数超过 1200 个，建议尽量减少它',
        score: 2,
        type: 'Page'
    }
}
export function getScoreInfo(item) {
    if(item.tagName in scoreDetail){
        let score = {...scoreDetail[item.tagName]};
        let despValue = item.value || '';
        if(['whiteScreenTime', 'firstMeaningFullPaintTime'].includes(item.tagName) && despValue){
            despValue = (despValue / 1000).toFixed(2);
        }else if(['htmlSize'].includes(item.tagName) && despValue){
            despValue = (despValue / 1000 / 1000).toFixed(2);
        }
        score.desp = score.desp.replace('{value}', despValue);
        score.value = item.value;
        score.oppositeValue = - item.value;
        score.percent = +((10 - item.score) * 10).toFixed(0);
        score.detail = item.detail;
        return score;
    }else{
        return {}
    }
}