/*
 * @Author: your name
 * @Date: 2022-03-28 17:54:26
 * @LastEditTime: 2022-04-26 11:22:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\store\message.ts
 */
import { defineStore } from 'pinia';
import { userType } from "@/views/mirandaIM/friendList/type"

interface state {
    context: userType | {},
    isContext: boolean,
    isHiddenAside: boolean,
    activeId: number | string,
    accounts: any[],
    isLogin: boolean
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
            context: {}, // 消息内容
            isContext: false, // 隐藏消息列表
            isHiddenAside: false, // 隐藏侧边栏话术
            activeId: '',  // 当前激活好友的id
            accounts: [], // 子账号  length>0显示主聊天界面
            isLogin: true, // 打开二维码弹框
        };
    },
    // 等同于vuex的getter
    getters: {
        getContextObj: (state) => state.context,
        getActiveId: (state) => state.activeId,
        getHiddenAside: (state) => state.isHiddenAside,
    },
    // pinia 放弃了 mutations 只使用 actions
    actions: {
        // actions可以用async做成异步形式
        setContextObj(item: userType) {
            this.isContext = true
            this.context = item;
            this.activeId = item.id
        },
        // 设置侧边栏话术的显示 隐藏
        setHiddenAside(is: boolean) {
            this.isHiddenAside = is
        }
    },
});

export default message;