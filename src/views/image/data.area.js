import { data as dataFromEventList } from "../SDK/data.EventList";
import { quantification, commonColumnsOfDetailTable, pageAndOrder } from "./data.Device";

function createTab(typeIndex) {
    let columns = [{ id: "province", name: "省份" }],
        type = "按省份";
    if (typeIndex === "0") {
        columns.push({ id: "city", name: "城市" });
        type = "按城市";
    }
    return {
        label: type,
        name: typeIndex,
        columns: [
            ...columns,
            ...commonColumnsOfDetailTable()
        ],
        rows: [],
        ...pageAndOrder()
    }
}

export function data(host) {
    let dataFromEventListData = dataFromEventList(host);
    return {
        loading: false,
        pickerOptions: dataFromEventListData.pickerOptions,
        dateRange: dataFromEventListData.dateRange,
        landingPages: {
            model: "",
            list: []
        },
        quantification: quantification(),
        charts: {},
        tabIndex: "0",
        tabs: [createTab("0"), createTab("1")],
        topTabIndex: "0",
        topCityValue: 1,
        topProvinceValue: 1,
        topTabs: [{ label: "城市", name: "0", rows: [] }, { label: "省份", name: "1", maxValue: 1, rows: [] }]
    };
}

export const MOCKDATA = {
    topCities: [
        { name: "北京", value: 513540 }, 
        { name: "天津", value: 413540 }, 
        { name: "石家庄", value: 341354 }, 
        { name: "济源", value: 220354 }, 
        { name: "保定", value: 212354 }, 
        { name: "新乡", value: 121354 }, 
        { name: "郑州", value: 111354 }, 
        { name: "太原", value: 109354 }, 
        { name: "烟台", value: 8354 }, 
        { name: "漯河", value: 7354 }
    ],
    topProvinces: [
        { name: "河南", value: 30 }
    ]
}