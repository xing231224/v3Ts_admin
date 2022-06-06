<!--
 * @Author: your name
 * @Date: 2022-03-25 09:45:11
 * @LastEditTime: 2022-06-02 16:54:29
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\friendList\list.vue
-->
<template>
    <!-- vue3页面 -->
    <!-- 联系人 -->
    <template v-if="active == 'third'">
        <el-menu
            class="el-menu-vertical-demo"
            style="height: calc(100vh - 250px)"
            unique-opened
            mode="vertical"
            active-text-color="#F39C12"
        >
            <template v-for="item in lists" :key="item.title">
                <el-sub-menu :index="item.title">
                    <template #title>
                        <span>{{ item.title }}</span>
                    </template>
                    <el-scrollbar :height="500" :min-size="10">
                        <el-menu-item-group v-for="row in item.children" :key="row.indexId">
                            <el-menu-item :index="row.indexId" @click="openNewWindow(row)">
                                <el-badge :hidden="!row.offLineNum" :value="row.offLineNum" class="juz">
                                    <el-avatar
                                        shape="square"
                                        style="display: block"
                                        :src="
                                            row.avatorUrl
                                                ? row.avatorUrl
                                                : 'https://imgsa.baidu.com/forum/pic/item/023b5bb5c9ea15ce85b34b6eb1003af33a87b27c.jpg'
                                        "
                                    />
                                </el-badge>
                                <span
                                    style="margin-left: 10px; font-size: 12px"
                                    class="account_name"
                                    :title="row.name"
                                    >{{ row.name }}</span
                                >
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-scrollbar>
                </el-sub-menu>
            </template>
        </el-menu>
    </template>
    <ul v-else class="friend_list">
        <el-scrollbar ref="scroll" :min-size="10">
            <!-- 子账号 -->
            <template v-if="active == 'first'">
                <li v-for="item in accounts" :id="`account${item.id}`" :key="item.id" @click="select(item)">
                    <el-popover placement="left" popper-class="accounts_tip" trigger="hover">
                        <div style="text-align: right">
                            <el-button size="small" type="warning" @click="loginOutAccoun(item)">退出子账号</el-button>
                        </div>
                        <template #reference>
                            <div
                                class="list_li"
                                :class="item.id == activeAccountInfo.id ? `flex-sb active` : `flex-sb`"
                            >
                                <el-badge :hidden="!item.offNumTatal" :value="item.offNumTatal">
                                    <el-avatar
                                        shape="square"
                                        size="small"
                                        style="display: block"
                                        :src="item.avatorUrl"
                                    />
                                </el-badge>
                                <span class="juz account_name" :title="item.name">{{ item.name }}</span>
                            </div>
                        </template>
                    </el-popover>
                </li>
            </template>
            <!-- 聊天列表 -->
            <template v-if="active == 'second'">
                <li
                    v-for="item in lists"
                    :id="`abc${item.conversationId}`"
                    :key="item.conversationId"
                    class="list_li"
                    :class="item.conversationId == activeId ? `flex active` : `flex`"
                    @click="openMessage(item)"
                    @contextmenu="openContextmenu($event, item)"
                >
                    <el-badge :hidden="!item.offLineNum" :value="item.offLineNum" class="juz">
                        <el-avatar
                            shape="square"
                            style="display: block"
                            :src="
                                item.avatorUrl
                                    ? item.avatorUrl
                                    : 'https://imgsa.baidu.com/forum/pic/item/023b5bb5c9ea15ce85b34b6eb1003af33a87b27c.jpg'
                            "
                        />
                    </el-badge>
                    <div class="flex-col">
                        <div class="flex-sb">
                            <span class="nickname" :title="item.name">{{ item.name }}</span>
                            <span v-if="item.offLineMsg?.sendTimeStamp">{{
                                timeDispose(item.offLineMsg?.sendTimeStamp)
                            }}</span>
                        </div>
                        <p v-if="item.offLineMsg?.msgType == '401'" class="nickname">
                            {{ item.offLineMsg?.content }}
                        </p>
                        <p v-else-if="item.offLineMsg?.msgType == '408'">[表情]</p>
                        <p v-else>
                            {{
                                isVideo(item.offLineMsg?.content) == 'img'
                                    ? '[图片]'
                                    : isVideo(item.offLineMsg?.content) == 'video'
                                    ? '[视频]'
                                    : isVideo(item.offLineMsg?.content) == 'text'
                                    ? item.offLineMsg?.content
                                    : '[文件]'
                            }}
                        </p>
                    </div>
                </li>
            </template>
        </el-scrollbar>
    </ul>
    <ul v-if="active == 'second' && menu.show" class="contextmenu" :style="`top: ${menu.y}px;left:${menu.x}px;`">
        <li @click="delChat">删除该聊天</li>
        <li>测试</li>
        <li>测试</li>
        <li>测试</li>
        <li>测试</li>
    </ul>
</template>

<script setup lang="ts">
// import tx from "../../../assets/age1f-rzq97.png"
import type { ElScrollbar } from 'element-plus';
import { ElLoading } from 'element-plus';
import Store from '@/store/message';
import { userType, userInfo } from './type';
import userStore from '@/store/user';
import { timeDispose, isVideo } from '@/utils/mineUtils';
import WebSocketClass from '@/utils/webSocket';

const scroll = ref<InstanceType<typeof ElScrollbar>>();
const $websocket = inject('websocket') as WebSocketClass;
defineProps({
    // eslint-disable-next-line vue/require-default-prop
    lists: Array as () => userInfo[],
    active: {
        type: String,
        default: '',
    },
});
const emit = defineEmits(['handover']);
const myMessage = Store();
const myuserStore = userStore();
const activeId = ref('') as any;
const loadingFn = inject('loading') as Function;

const state = reactive({
    activeAccountInfo: {} as userType,
    activeMenu: {} as userInfo,
    menu: {
        show: false,
        x: 0,
        y: 0,
    },
});
// 切换消息体
const openMessage = (item: any) => {
    if (activeId.value == item.conversationId) return;
    // eslint-disable-next-line no-param-reassign
    item.offLineNum = 0;
    myMessage.setContextObj(item);
    // 获取历史消息
    $websocket.webSocketSendMsg({
        status: '6',
        data: {
            weChatId: item.weChatId,
            conversationId: item.conversationId,
        },
    });
};
// 右键菜单
const openContextmenu = (e: MouseEvent, item: userInfo) => {
    e.preventDefault();
    state.activeMenu = item;
    state.menu = {
        show: true,
        x: e.x,
        y: e.y,
    };
};
// 删除聊天
const delChat = () => {
    $websocket.webSocketSendMsg({
        status: '13',
        data: { conversationId: state.activeMenu.conversationId, wechatId: state.activeMenu.offLineMsg?.senderId },
    });
    myMessage.delChatWindow(state.activeMenu.conversationId);
    state.menu.show = false;
};
// 打开新的聊天窗口 添加到聊天列表当中
const openNewWindow = (row: any) => {
    // eslint-disable-next-line no-param-reassign
    row.offLineMsg = {
        sendTimeStamp: new Date().getTime(),
        msgType: '401',
    };
    scroll.value?.setScrollTop(0);
    emit('handover', 'second');
    myMessage.addNewWindow(row).then((res) => {
        openMessage(res);
    });
};
// 退出子账号
const loginOutAccoun = (row: userType) => {
    $websocket.webSocketSendMsg({ status: '5', data: { wechatId: row.id } });
};
// 获取子账号数据
const accounts = computed(() => myMessage.accounts);
// 切换多账号id
const select = (row: any) => {
    if (state.activeAccountInfo.id == row.id) return;
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: '.chat_list',
    });
    loadingFn(loading);
    myMessage.setActiveAccountInfo(row);
    if (row.contactList) return;
    // 向后端获取联系人数据
    ['7', '8', '9', '11'].forEach((item) => {
        $websocket.webSocketSendMsg({ status: item, data: { userId: `${myuserStore.userId}`, wechatId: row.id } });
    });
};

watchEffect(() => {
    activeId.value = computed(() => myMessage.getActiveId).value;
    state.activeAccountInfo = computed(() => myMessage.getActiveAccountInfo).value;
});
onMounted(() => {
    document.addEventListener('click', (e: Event) => {
        if (!((e.target as HTMLElement).parentElement?.getAttribute('class') == 'contextmenu')) {
            state.menu.show = (e.target as HTMLElement).parentElement?.getAttribute('class') == 'contextmenu';
        }
    });
});
defineExpose({
    openNewWindow,
});
const { activeAccountInfo, menu } = toRefs(state);
</script>

<style lang="scss" scoped>
.account_name {
    white-space: nowrap;
    /*2.溢出部分隐藏起来*/
    overflow: hidden;
    /*3.文字溢出的时候用省略号来显示*/
    text-overflow: ellipsis;
}
.friend_list {
    height: calc(100vh - 250px);
    list-style: none;
    background-color: #fff;
    margin: 0px;
    padding: 0px 0px;

    .list_li {
        // margin: 0 0 5px;
        border-bottom: 1px solid #e5e7eb;
        padding: 15px 10px 10px;
        font-size: 12px;
        color: #444444;
        cursor: pointer;
        border-left: 2px solid transparent;

        .account_name {
            white-space: nowrap;
            /*2.溢出部分隐藏起来*/
            overflow: hidden;
            /*3.文字溢出的时候用省略号来显示*/
            text-overflow: ellipsis;
        }

        &:hover {
            background-color: #f7f7f7;
            color: #f39c12;
            border-color: #f39c12;

            a {
                color: #f39c12;
            }
        }

        a {
            color: #000;
            display: inline-block;
            width: 100%;
            height: 100%;
        }

        &.active {
            background-color: #f7f7f7;
            color: #f39c12;
            border-color: #f39c12;

            a {
                color: #f39c12;
            }
        }

        .flex-col {
            flex: 1;
            margin-left: 20px;
            justify-content: space-between;
        }
    }

    .nickname {
        width: 100px;
        white-space: nowrap;
        /*2.溢出部分隐藏起来*/
        overflow: hidden;
        /*3.文字溢出的时候用省略号来显示*/
        text-overflow: ellipsis;
    }
}
.contextmenu {
    position: fixed;
    width: 200px;
    background-color: #fff;
    z-index: 999;
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
    li {
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        padding: 10px;
        &:hover {
            background-color: #ecf5ff;
        }
    }
}
</style>
