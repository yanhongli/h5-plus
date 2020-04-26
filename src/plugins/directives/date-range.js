// import Vue from "vue";

// import isBefore from "date-fns/isBefore";
// import isAfter from "date-fns/isAfter";
// import differenceInDays from "date-fns/differenceInDays";
// import startOfYesterday from "date-fns/esm/startOfYesterday";
// import startOfYear from "date-fns/startOfYear";
// import endOfToday from "date-fns/endOfToday/index";

// const START_DATE = startOfYear(new Date().setFullYear(2019));
// const YESTERDAY = startOfYesterday();
// const TODAY = endOfToday();

// const defaultPickerOptions = {
//   shortcuts: [
//     {
//       text: "最近一周",
//       onClick(picker) {
//         const end = new Date();
//         const start = new Date();
//         start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
//         picker.$emit("pick", [start, end]);
//       }
//     }
//   ]
//   // disabledDate(date) {
//   //   return (
//   //     isAfter(date, TODAY) ||
//   //     isBefore(date, START_DATE) ||
//   //     (vm.checkedStartDate &&
//   //       Math.abs(differenceInDays(date, vm.checkedStartDate)) > 30)
//   //   );
//   // },
//   // onPick({ maxDate, minDate }) {
//   //   vm.checkedStartDate = maxDate || minDate;
//   // }
// };

// Vue.directive("custom-dates", (el, binding, vnode) => {
//   console.log(el, binding, vnode);
//   const dateRangePickerInstance = vnode.componentInstance;
//   dateRangePickerInstance.pickerOptions = defaultPickerOptions;
// });
