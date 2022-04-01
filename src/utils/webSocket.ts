/*
 * @Author: your name
 * @Date: 2022-03-26 09:44:16
 * @LastEditTime: 2022-04-01 10:27:51
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\utils\webSocket.ts
 */
/*
 * @Author: your name
 * @Date: 2021-12-13 11:20:08
 * @LastEditTime: 2021-12-22 09:14:44
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ChromeCtx\src\utils\webSocket.js
 */

import protobuf from "protobufjs"
import protoRoot from '@/proto/proto'



class WebSocketClass {
    lockReconnect: boolean

    localUrl: string

    wsUrl: string

    globalCallback: any

    ws: any

    userClose: boolean

    count: number

    constructor(name: string) {
        this.lockReconnect = false;
        this.localUrl = "ws://";
        this.wsUrl = "";
        this.globalCallback = null;
        this.userClose = false;
        this.count = 1;
        this.ws = null;
        this.createWebSocket(name);
    }


    createWebSocket(url: string) {
        // eslint-disable-next-line no-plusplus
        this.count++;
        this.wsUrl = url;
        try {
            this.ws = new WebSocket(this.localUrl + this.wsUrl);
            this.initEventHandle()
        } catch (e) {
            this.reconnect(url);
        }
    }

    // 初始化
    initEventHandle() {
        // 连接成功建立后响应
        console.log(this.ws);
        this.ws.onopen = () => {
            console.log("连接成功");
            // this.ws.send(`我是客户端,第${this.count}次连接`);
        };
        // 连接关闭后响应
        this.ws.onclose = () => {
            console.log("断开链接");
            if (!this.userClose) {
                this.reconnect(this.wsUrl); // 重连
            }
        };
        this.ws.onerror = () => {
            if (!this.userClose) {
                this.reconnect(this.wsUrl); // 重连
            }
        };
        this.ws.onmessage = (ev: any) => {
            this.getWebSocketMsg(this.globalCallback && this.globalCallback(ev));
        };
    }

    reconnect(url: string) {
        if (this.lockReconnect) return;
        this.lockReconnect = true; // 没连接上会一直重连，设置延迟避免请求过多
        setTimeout(() => {
            this.createWebSocket(url);
            this.lockReconnect = false;
        }, 10000);
    }

    // 发送消息
    webSocketSendMsg(msg: string, protoClass = '') {
        // 正常发送数据
        if (!protoClass) return this.ws.send(msg);
        // 转化二进制发送消息
        this.ws.send(this.transformRequest(protoClass)(msg))
    }

    // 接收消息
    getWebSocketMsg(callback: Function) {
        this.ws.onmessage = (ev: any) => {
            if (callback) {
                this.globalCallback = callback;
            } else {
                // eslint-disable-next-line no-param-reassign
                callback = this.globalCallback
            }
            // eslint-disable-next-line no-unused-expressions
            callback && callback(ev);
        };
    }

    // eslint-disable-next-line class-methods-use-this
    isArrayBuffer(obj: any) {
        return Object.prototype.toString.call(obj) === '[object ArrayBuffer]'
    }

    // 发送消息转换二进制
    // eslint-disable-next-line class-methods-use-this
    transformRequest(responseType: string) {
        const initProto = protoRoot.lookup(responseType)
        return (data: any) => {
            const aa = initProto.encode(initProto.create(data)).finish()
            return aa;
        }
    }

    // 响应数据解析
    transformResponse(responseType: string) {
        return (rawResponse: number | number[] | null | undefined) => {
            // 判断response是否是arrayBuffer
            if (rawResponse == null || !this.isArrayBuffer(rawResponse)) {
                return rawResponse
            }
            try {
                const buf = protobuf.util.newBuffer(rawResponse)
                // decode响应体
                const decodedResponse = protoRoot.lookup(responseType).decode(buf)
                if (decodedResponse.messageData && responseType) {
                    const model = protoRoot.lookup(responseType)
                    decodedResponse.messageData = model.decode(decodedResponse.messageData)
                }
                return decodedResponse
            } catch (err) {
                return err
            }
        }
    }

    closeSocket() {
        if (this.ws) {
            this.userClose = true;
            this.ws.close();
        }
    }
}

export default WebSocketClass;
