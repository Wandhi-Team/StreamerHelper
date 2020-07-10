const infoJson = require("../../../templates/info.json");
import { getHuyaSteam } from "./message";
import { getRoomArrInfo } from "../../util/utils";
import { HuyaStreamInfo } from "type/getHuya";
import getHuya from "./getHuyaStreamUrl";
let onlineMap = new Map()
//0 不在线 1 在线
let pool: any = []
let huyaRoomIds = getRoomArrInfo(infoJson.streamerInfo)
const timer = setInterval(() => {
    for (let huyaRoomId of huyaRoomIds) {
        getHuya(huyaRoomId.roomLink).then((stream: HuyaStreamInfo) => {
            if (onlineMap.get(huyaRoomId.roomLink) != 1) {
                onlineMap.set(huyaRoomId.roomLink, 1)
                pool.push(stream)
            }
        }).catch(() => {
            onlineMap.set(huyaRoomId.roomLink, 0)
        });
    }
    if (pool.length >= 1) {
        getHuyaSteam(pool.pop())
    }
}, 5000);
process.on("SIGINT", () => {
    console.log("接收到退出指令，清除定时器\n等待上传完成后，进程自动退出")
    clearInterval(timer)
})