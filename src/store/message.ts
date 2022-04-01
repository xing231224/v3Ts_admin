/*
 * @Author: your name
 * @Date: 2022-03-28 17:54:26
 * @LastEditTime: 2022-03-29 11:22:02
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
    activeId: number | string
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
        setHiddenAside(is: boolean) {
            this.isHiddenAside = is
        }
    },
});

export default message;