/*
 * @Author: your name
 * @Date: 2022-03-28 17:54:26
 * @LastEditTime: 2022-05-23 10:47:30
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\store\message.ts
 */
import { defineStore } from 'pinia';
import { userType, chatType } from "@/views/mirandaIM/friendList/type"


interface state {
    userData: userType | {},
    isContext: boolean,
    isHiddenAside: boolean,
    activeId: number | string,
    activeAccountInfo: userType,
    accounts: any[],
    isLogin: boolean
    contactList: [any[], any[]]
    chatList: chatType[]
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

const message = defineStore({
    // 这里的id必须为唯一ID
    id: 'message',
    state: (): state => {
        return {
            userData: {}, // 当前用户聊天数据
            isContext: false, // 隐藏消息列表
            isHiddenAside: false, // 隐藏侧边栏话术
            activeId: '',  // 当前激活好友的id
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
            this.userData = {}
            this.activeAccountInfo = {} as userType
            this.activeId = ''
            this.chatList = []
            this.isContext = false
            this.contactList = [[], []]

        },
        // 切换消息体
        setContextObj(item: userType) {
            this.chatList = []
            this.isContext = true
            this.userData = item;
            this.activeId = item.id ? item.id : item.conversationId
        },
        // 设置侧边栏话术的显示 隐藏
        setHiddenAside(is: boolean) {
            this.isHiddenAside = is
        },
        // 设置联系人数据
        setContactList(arr: [[], []]) {
            this.contactList = arr
        },
        // 切换子账号 当前聊天记录清除
        setActiveAccountInfo(obj: userType) {
            this.init()
            this.activeAccountInfo = obj
        },
        async addChatList(obj: chatType) {
            this.chatList.push(obj)
        },
        // 添加聊天记录
        async setChatList(arr: chatType[]) {
            console.log(arr);
            this.chatList.unshift(...arr)
        },
        // 添加新的聊天窗口
        addNewWindow(obj: any) {
            return new Promise((resolve) => {
                // 聊天历史窗口有
                const is = this.contactList[0].findIndex(item => item.name == obj.name)
                const objData = is != -1 ? this.contactList[0].splice(is, 1)[0] : obj
                this.contactList[0].unshift(objData)
                resolve(objData)
            })
        },
        // 设置上传参数信息
        setUploadInfo(fileId: string | number, key: string, value: any) {
            this.chatList.forEach(item => {
                if (item.fileId && item.fileId == fileId) {
                    // eslint-disable-next-line no-param-reassign
                    item[key] = value;
                }
            })
        }
    },
});

export default message;