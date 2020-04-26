import http from "../../plugins/http";
export function screenShot(args) {
    return http.post('/api/screenshot', args,{
        timeout: 25000
    });
}
export function screenShot4xpath(args) {
    args.useUA = true
    return http.post('/api/screenshot4xpath', args, {
        timeout: 25000
    })
}
