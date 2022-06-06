/*
 * @Author: your name
 * @Date: 2022-03-28 17:54:26
 * @LastEditTime: 2022-06-02 17:58:35
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\store\message.ts
 */
import { defineStore } from 'pinia';
import { userType, userInfo, msgType } from '@/views/mirandaIM/friendList/type';
import { flatten } from '@/utils/mineUtils';

interface state {
    userData: { [propName: string]: any } | userType;
    isContext: boolean;
    isHiddenAside: boolean;
    activeId: number | string;
    activeAccountInfo: userType;
    accounts: userType[];
    isLogin: boolean;
    contactList: [any[], any[]];
    chatList: msgType[];
}
interface WebMsgVo {
    id: string; // 用户id
    qrCode: string; // 二维码
    accountTo: string; // 自己微企账号
    accountGo: string; // 对方微企账号
    time: string; // 发送时间
    path: string; // 附件地址
    sendStatus: string; // 发送状态
    content: string; // 聊天内容
    dialogueId: string; // 对话唯一标识
}
interface receiveChatT {
    clientId: string;
    content: string;
    conversationId: string;
    msgType: '401' | '403' | '405';
    offLineNum: number;
    offLineNumTotal: number;
    sendTimeStamp: number;
    sendType: '0';
    senderId: number;
    senderNickName: string;
}

const message = defineStore({
    // 这里的id必须为唯一ID
    id: 'message',
    state: (): state => {
        return {
            userData: {} as userInfo, // 当前用户信息聊天数据
            isContext: false, // 隐藏消息列表
            isHiddenAside: false, // 隐藏侧边栏话术
            activeId: '', // 当前激活好友的id
            activeAccountInfo: {} as userType, // 当前激活子账号的信息
            accounts: [], // 子账号  length>0显示主聊天界面
            isLogin: false, // 打开二维码弹框
            contactList: [[], []], // 联系人
            chatList: [], // 当前窗口聊天记录
        };
    },
    // 等同于vuex的getter
    getters: {
        getContextObj: (state) => state.userData,
        getActiveId: (state) => state.activeId,
        getActiveAccountInfo: (state) => state.activeAccountInfo,
        getHiddenAside: (state) => state.isHiddenAside,
        getChatList: (state) => state.chatList,
    },
    // pinia 放弃了 mutations 只使用 actions
    actions: {
        // actions可以用async做成异步形式
        init() {
            this.userData = {};
            this.activeAccountInfo = {} as userType;
            this.activeId = '';
            this.chatList = [];
            this.isContext = false;
            this.contactList = [[], []];
        },
        // 清空除子账号外的所有数据
        clearData() {
            this.userData = {};
            this.activeId = '';
            this.chatList = [];
            this.isContext = false;
        },
        // 切换消息体
        setContextObj(item: userInfo) {
            this.chatList = [];
            this.isContext = true;
            this.userData = item;
            this.activeId = item.conversationId;
            this.msgTotal();
        },
        msgTotal() {
            this.accounts.forEach((item, index) => {
                if (item.id == this.activeAccountInfo.id) {
                    this.accounts[index].offNumTatal =
                        this.contactList[0] && this.contactList[0].length > 0
                            ? this.contactList[0].reduce((a, b) => a + b.offLineNum, 0)
                            : 0;
                }
            });
        },
        // 设置侧边栏话术的显示 隐藏
        setHiddenAside(is: boolean) {
            this.isHiddenAside = is;
        },
        // 设置联系人数据
        setContactList(arr: [[], []]) {
            this.contactList = arr;
            this.accounts.forEach((item) => {
                // 缓存联系人数据
                if (item.id == this.activeAccountInfo.id && !item.contactList) {
                    // eslint-disable-next-line no-param-reassign
                    item.contactList = arr;
                }
            });
        },
        // 切换子账号 当前聊天记录清除
        async setActiveAccountInfo(obj: userType) {
            this.init();
            this.activeAccountInfo = obj;
            if (obj.contactList) {
                this.contactList = obj.contactList;
            }
        },
        async addChatList(obj: msgType) {
            this.chatList.push(obj);
        },
        // 添加子账号数据
        addAccounts(arr: userType[]) {
            this.accounts = arr || [];
        },
        // 添加聊天记录
        async setChatList(arr: msgType[]) {
            console.log(arr);
            this.chatList.unshift(...arr);
        },
        // 添加新的聊天窗口
        addNewWindow(obj: any) {
            return new Promise((resolve) => {
                // 聊天历史窗口有
                const is = this.contactList[0].findIndex((item) => item.name == obj.name);
                const objData = is != -1 ? this.contactList[0].splice(is, 1)[0] : obj;
                this.contactList[0].unshift(objData);
                resolve(objData);
            });
        },
        delChatWindow(conversationId: string) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const dom = document.getElementById(`abc${conversationId}`)!;
            dom.className += ' animate__animated animate__backOutLeft';
            setTimeout(() => {
                this.contactList[0].forEach((item: userInfo, index) => {
                    if (item.conversationId == conversationId) {
                        this.contactList[0].splice(index, 1);
                    }
                });
                if (this.userData.conversationId == conversationId) {
                    this.isContext = false;
                }
                this.msgTotal();
            }, 500);
        },
        loginOut(wechatId: string | number) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const dom = document.getElementById(`account${wechatId}`)!;
            dom.className = 'animate__animated animate__bounceOut';
            setTimeout(() => {
                this.accounts = this.accounts.filter((item) => item.id != wechatId);
                if (wechatId != this.activeAccountInfo.id) return;
                this.init();
            }, 500);
        },
        // 接收聊天数据
        // eslint-disable-next-line default-param-last
        receiveChat(obj: receiveChatT, weChatId = '', cb: Function) {
            const is = this.contactList[0].findIndex((item) => item.conversationId == obj.conversationId);
            const objData: receiveChatT = is != -1 ? this.contactList[0].splice(is, 1)[0] : obj;
            flatten(this.contactList[1].map((item: any) => item.children)).forEach((item: userInfo) => {
                if (item.conversationId == objData.conversationId) {
                    this.contactList[0].unshift({
                        ...item,
                        offLineNum: this.activeId == obj.conversationId ? 0 : obj.offLineNum,
                        offLineMsg: { ...obj },
                    });
                }
            });
            // 在当前聊天窗口中
            if (this.activeId == obj.conversationId) {
                this.addChatList(obj);
                cb();
                return;
            }
            if (weChatId) {
                this.accounts.forEach((item, index) => {
                    if (item.id == weChatId) {
                        this.accounts[index].offNumTatal = obj.offLineNumTotal;
                    }
                });
            }
        },
        // 设置上传参数信息
        setUploadInfo(fileId: string | number, key: string, value: any) {
            this.chatList.forEach((item) => {
                if (item.fileId && item.fileId == fileId) {
                    // eslint-disable-next-line no-param-reassign
                    item[key] = value;
                }
            });
        },
        // 修改消息成功状态
        editMsg(obj: msgType) {
            if (this.chatList.some((item) => item.msgId == obj.msgId)) {
                this.chatList.forEach((item, index) => {
                    if (item.msgId == obj.msgId) {
                        this.chatList[index] = obj;
                        // this.chatList.splice(index, 1, obj)
                    }
                });
            } else {
                this.addChatList(obj);
            }
            this.userData.offLineMsg = { ...obj };
        },
    },
});

export default message;
