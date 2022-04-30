/*
 * @Author: your name
 * @Date: 2022-03-28 17:54:26
 * @LastEditTime: 2022-04-29 15:42:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\store\message.ts
 */
import { defineStore } from 'pinia';
import { userType } from "@/views/mirandaIM/friendList/type"

interface state {
    userData: userType | {},
    isContext: boolean,
    isHiddenAside: boolean,
    activeId: number | string,
    activeAccountId: number | string,
    accounts: any[],
    isLogin: boolean
    contactList: any[]
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
            activeAccountId: "", // 当前激活子账号的id
            accounts: ['1688852050093582'], // 子账号  length>0显示主聊天界面
            isLogin: false, // 打开二维码弹框
            contactList: [[], [], []] // 联系人
        };
    },
    // 等同于vuex的getter
    getters: {
        getContextObj: (state) => state.userData,
        getActiveId: (state) => state.activeId,
        getHiddenAside: (state) => state.isHiddenAside,
    },
    // pinia 放弃了 mutations 只使用 actions
    actions: {
        // actions可以用async做成异步形式
        setContextObj(item: userType) {
            this.isContext = true
            this.userData = item;
            this.activeId = item.id ? item.id : item.conversationId
        },
        // 设置侧边栏话术的显示 隐藏
        setHiddenAside(is: boolean) {
            this.isHiddenAside = is
        },
        // 设置联系人数据
        setContactList(arr: [[], [], []]) {
            this.contactList = arr
        }
    },
});

export default message;