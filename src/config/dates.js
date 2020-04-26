// import startOfYear from "date-fns/startOfYear";
import subDays from "date-fns/subDays";
import endOfToday from "date-fns/endOfToday/index";
import startOfYesterday from "date-fns/esm/startOfYesterday";
// import startOfYear from "date-fns/startOfYear";

const TODAY = endOfToday();
/** 起始日期2019年初 */
// const START_DATE = startOfYear(new Date().setFullYear(2019));
const YESTERDAY = startOfYesterday();

/** 最近7天30天不包括今天 */
export const defaultDateRanges = [
  {
    text: "今天",
    dates: [TODAY, TODAY]
  },
  {
    text: "昨天",
    dates: [YESTERDAY, YESTERDAY]
  },
  {
    text: "最近7天",
    dates: [subDays(YESTERDAY, 6), YESTERDAY]
  },
  {
    text: "最近30天",
    dates: [subDays(YESTERDAY, 29), YESTERDAY]
  }
];

export const dateComponentShortcuts = defaultDateRanges.map(item => ({
  text: item.text,
  onClick(picker) {
    const dates = item.dates;
    picker.$emit("pick", [dates[0], dates[1]]);
  }
}));
