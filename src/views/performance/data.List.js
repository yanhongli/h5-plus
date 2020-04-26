/**
 * 详情列表公共字段
 */
export function commonColumnsOfDetailTable() {
    return [
        {
            id: "url",
            name: "页面地址",
            width: 180
        },
        {
            id: "name",
            name: "任务名称"
        },
        {
            id: "typeStr",
            name: "落地页类型"
        },
        {
            id: "netEnv",
            name: "模拟网络"
        },
        {
            id: "os",
            name: "模拟平台"
        },
        {
            id: "statusStr",
            name: "状态"
        },
        {
            id: "score",
            name: "分值"
        },
        {
            id: "createTime",
            name: "提交时间",
            width: 200
        }
    ];
}
export function pageAndOrder() {
    return {
        page: {
            size: 10,
            current: 1,
            total: 0
        }
    };
}
export function data(host) {
    return {
        loading: false,
        tableList: {
            columns: commonColumnsOfDetailTable(),
            rows: [],
            ...pageAndOrder()
        },
        newTaskDialog: {
            visible: false,
            reset: function () {
                let fields = ['pageUrl', 'pageName', 'os', 'net'];
                for (let f of fields) {
                    this[f].model = '';
                    this[f].error = '';
                }
            },
            validate: function () {
                let fields = ['pageUrl', 'os', 'net'];
                let succeed = true;
                for (let f of fields) {
                    if (!this[f].validate()) {
                        succeed = false;
                    };
                }
                return succeed;
            },
            pageUrl: {
                model: '',
                error: '',
                validate: function () {
                    if (this.model.length <= 0) {
                        this.error = "请填写落地页地址";
                        return false;
                    } 
                    else if(!/^(https?:)?\/\/(\w+\.){1,}\w+/.test(this.model)){
                        this.error = "请填写正确的URL格式";
                        return false;
                    }
                    else {
                        this.error = '';
                        return true;
                    }
                }
            },
            pageName: {
                model: '',
                error: ''
            },
            os: {
                model: '',
                error: '',
                validate: function () {
                    if (this.model === '') {
                        this.error = '请选择模拟平台';
                        return false;
                    } else {
                        this.error = '';
                        return true;
                    }
                },
                list: [
                    {
                        label: "iOS",
                        value: "iOS"
                    },
                    {
                        label: "Android",
                        value: "Android"
                    }
                ]
            },
            net: {
                model: '',
                error: '',
                validate: function () {
                    if (this.model === '') {
                        this.error = '请选择模拟网络环境';
                        return false;
                    } else {
                        this.error = '';
                        return true;
                    }
                },
                list: [
                    {
                        label: "3G",
                        value: "3G"
                    },
                    {
                        label: "4G",
                        value: "4G"
                    },
                    {
                        label: "WIFI",
                        value: "WIFI"
                    }
                ]
            }
        },
        listItemDialog: {
            visible: false,
            model: null
        }
    }
}