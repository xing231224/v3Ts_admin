/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-bitwise */

import { ElNotification } from 'element-plus';
import $protobuf from '@/proto/proto';
import { randomKey } from '@/utils/mineUtils';
import userStore from '@/store/user';
import message from '@/store/message';
import { getUserId } from '@/api/modules/login';

const { protobuf, protoRoot } = $protobuf;

interface msgType {
    key?: string;
    status: string;
    weChatId?: string | number;
    data?: any;
}

function initData(db: Function) {
    const obj = {
        key: randomKey(),
        status: '0',
        data: {},
    };
    getUserId().then((res) => {
        userStore().setUserId(res.data.data);
        obj.data = { userId: `${res.data.data}` };
        // eslint-disable-next-line no-unused-expressions
        db && db(obj);
    });
}
class WebSocketClass {
    lockReconnect: boolean;

    lockRetry: boolean;

    localUrl: string;

    wsUrl: string;

    globalCallback: any;

    ws: any;

    userClose: boolean;

    count: number;

    constructor(name: string) {
        this.lockReconnect = false;
        this.lockRetry = false;
        this.localUrl = 'ws://';
        this.wsUrl = '';
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
            this.initEventHandle();
        } catch (e) {
            this.reconnect(url);
        }
    }

    // 初始化
    initEventHandle() {
        // 连接成功建立后响应
        this.ws.onopen = () => {
            ElNotification({
                message: 'WebSocket链接成功!!!',
                type: 'success',
            });
            // this.ws.send(`我是客户端,第${this.count}次连接`);
            initData((obj: any) => {
                if (!obj) return;
                this.webSocketSendMsg(obj, 'MessageRequest');
            });
        };
        // 连接关闭后响应
        this.ws.onclose = () => {
            ElNotification({
                message: 'WebSocket断开链接!!!',
                type: 'error',
            });
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

    // 链接心跳
    reconnect(url: string) {
        if (this.lockReconnect) return;
        this.lockReconnect = true; // 没连接上会一直重连，设置延迟避免请求过多
        setTimeout(() => {
            this.createWebSocket(url);
            this.lockReconnect = false;
        }, 10000);
    }

    // 消息重发
    retry(msg: msgType) {
        // eslint-disable-next-line no-useless-return
        if (this.lockRetry) return;
        this.lockRetry = true;
        setTimeout(() => {
            this.webSocketSendMsg(msg);
            this.lockRetry = false;
        }, 1000);
    }

    // 发送消息
    webSocketSendMsg(msg: msgType, protoClass = 'MessageRequest') {
        // 正常发送数据
        if (!protoClass) return this.ws.send(msg);
        // msg.data = typeof msg.data == 'string' ? msg.data : JSON.stringify(msg.data) // data转JSON
        // 后端所需要的参数key
        msg.key = randomKey();
        if (message().activeAccountInfo.id && msg.status !== '1' && msg.status !== '0') {
            msg.weChatId = message().activeAccountInfo.id;
            msg.data.wechatId = message().activeAccountInfo.id;
        }
        console.log('发送的消息==>', { ...msg });
        msg.data = this.byteArray(JSON.stringify({ userId: userStore().userId, ...msg.data })); // 字符串转byte
        this.ws.send(this.transformRequest(protoClass)(msg)); // 转化二进制发送消息
        this.lockRetry = false;
        // if (msg.status == '0') {
        //     // 一秒后 消息重发
        //     setTimeout(() => {
        //         this.retry(msg)
        //     }, 1000)
        // }
    }

    // 接收消息
    getWebSocketMsg(callback: Function) {
        this.ws.onmessage = (ev: any) => {
            if (callback) {
                this.globalCallback = callback;
            } else {
                callback = this.globalCallback;
            }
            this.lockRetry = true;
            // 返回结果是Blob 解码
            if (this.isBlob(ev.data)) {
                ev.data.arrayBuffer().then((res: number | number[] | null | undefined) => {
                    const obj = this.transformResponse('MessageRequest')(res);
                    console.log('接收的消息====》', obj);
                    if (obj.data.length > 0) {
                        obj.data = JSON.parse(this.byteToString(obj.data)); // byte数组转字符串
                    }
                    if (obj.state == 100) {
                        ElNotification({
                            title: 'Error',
                            message: obj.msg,
                            type: 'error',
                        });
                    }
                    // eslint-disable-next-line no-unused-expressions
                    callback && callback(obj);
                });
            } else {
                // 正常返回
                // eslint-disable-next-line no-unused-expressions
                callback && callback(ev);
            }
        };
    }

    // eslint-disable-next-line class-methods-use-this
    isArrayBuffer(obj: ArrayBuffer | any) {
        return Object.prototype.toString.call(obj) === '[object ArrayBuffer]';
    }

    // eslint-disable-next-line class-methods-use-this
    isBlob(obj: Blob | any) {
        return Object.prototype.toString.call(obj) === '[object Blob]';
    }

    // 将字符串转换为byte数组
    // eslint-disable-next-line class-methods-use-this
    byteArray(message: string) {
        const bytesArr = this.stringToByte(message);
        const bytes = new Uint8Array(bytesArr.length);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = bytesArr[i];
        }
        return bytes;
    }

    // 将字符串转为 Array byte数组
    // eslint-disable-next-line class-methods-use-this
    stringToByte(str: string) {
        const bytes = [];
        let len;
        let c;

        // eslint-disable-next-line prefer-const
        len = str.length;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10ffff) {
                bytes.push(((c >> 18) & 0x07) | 0xf0);
                bytes.push(((c >> 12) & 0x3f) | 0x80);
                bytes.push(((c >> 6) & 0x3f) | 0x80);
                bytes.push((c & 0x3f) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00ffff) {
                bytes.push(((c >> 12) & 0x0f) | 0xe0);
                bytes.push(((c >> 6) & 0x3f) | 0x80);
                bytes.push((c & 0x3f) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007ff) {
                bytes.push(((c >> 6) & 0x1f) | 0xc0);
                bytes.push((c & 0x3f) | 0x80);
            } else {
                bytes.push(c & 0xff);
            }
        }
        return bytes;
    }

    // byte数组转字符串
    byteToString(arr: any[]) {
        if (typeof arr === 'string') {
            return arr;
        }
        let str = '';
        // eslint-disable-next-line no-underscore-dangle
        const _arr = arr;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < _arr.length; i++) {
            const one = _arr[i].toString(2);
            const v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                const bytesLength = v[0].length;
                let store = _arr[i].toString(2).slice(7 - bytesLength);
                // eslint-disable-next-line no-plusplus
                for (let st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }

    // 发送消息转换二进制
    // eslint-disable-next-line class-methods-use-this
    transformRequest(responseType: string) {
        const initProto = protoRoot.lookup(responseType);
        return (data: any) => {
            return initProto.encode(initProto.create(data)).finish();
        };
    }

    // 响应数据解析
    transformResponse(responseType: string) {
        return (rawResponse: number | number[] | null | undefined) => {
            // 判断response是否是arrayBuffer
            if (rawResponse == null || !this.isArrayBuffer(rawResponse)) {
                return rawResponse;
            }
            try {
                const buf = protobuf.util.newBuffer(rawResponse);
                // decode响应体
                const decodedResponse = protoRoot.lookup(responseType).decode(buf);
                if (decodedResponse.messageData && responseType) {
                    const model = protoRoot.lookup(responseType);
                    decodedResponse.messageData = model.decode(decodedResponse.messageData);
                }
                return decodedResponse;
            } catch (err) {
                return err;
            }
        };
    }

    closeSocket() {
        if (this.ws) {
            this.userClose = true;
            this.ws.close();
        }
    }
}

export default WebSocketClass;
