import http from "../http";
import qs from "qs";
const URLS = {
    scoreList: '/page/score/list',
    scoreAddTask: '/page/score/addTask',
    scoreDelete: '/page/score/delete',
    scoreDetail: '/page/score/detail'
}

export function apiScoreList(args) {
    return http.get(URLS.scoreList + "?" + qs.stringify(args));
}
export function apiScoreAddTask(args) {
    return http.post(URLS.scoreAddTask, args);
}
export function apiScoreDelete(args) {
    return http.post(URLS.scoreDelete, args);
}
export function apiScoreDetail(args) {
    return http.get(URLS.scoreDetail + "?" + qs.stringify(args));
}