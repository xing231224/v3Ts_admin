<!--
 * @Author: your name
 * @Date: 2022-03-25 09:45:11
 * @LastEditTime: 2022-05-19 11:17:24
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
            :unique-opened="false"
            mode="vertical"
            active-text-color="#F39C12"
        >
            <template v-for="item in lists" :key="item.title">
                <el-sub-menu :index="item.title">
                    <template #title>
                        <span>{{ item.title }}</span>
                    </template>
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
                            <span style="margin-left: 10px; font-size: 12px" :title="row.name">{{ row.name }}</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
            </template>
        </el-menu>
    </template>
    <ul v-else class="friend_list">
        <el-scrollbar ref="scroll" :min-size="10">
            <!-- 子账号 -->
            <template v-if="active == 'first'">
                <li
                    v-for="item in accounts"
                    :key="item.id"
                    class="list_li"
                    :class="item.id == activeAccountInfo.id ? `flex-sb active` : `flex-sb`"
                    @click="select(item)"
                >
                    <el-badge :value="item.offLineNum">
                        <el-avatar shape="square" size="small" style="display: block" :src="item.avatorUrl" />
                    </el-badge>
                    <span class="juz account_name" :title="item.name">{{ item.name }}</span>
                </li>
            </template>
            <!-- 聊天列表 -->
            <template v-if="active == 'second'">
                <li
                    v-for="item in lists"
                    :id="`abc${item.id}`"
                    :key="item.id ? item.id : item.conversationId"
                    class="list_li"
                    :class="(item.id ? item.id : item.conversationId) == activeId ? `flex active` : `flex`"
                    @click="openMessage(item)"
                    @contextmenu="openContextmenu($event)"
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
                        <p>{{ item.offLineMsg?.content }}</p>
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
import Store from '@/store/message';
import { userType } from './type';
import userStore from '@/store/user';
import { timeDispose } from '@/utils/mineUtils';

const scroll = ref<InstanceType<typeof ElScrollbar>>();
const {
    proxy: { $websocket },
} = getCurrentInstance() as any;
defineProps({
    // eslint-disable-next-line vue/require-default-prop
    lists: Array as () => userType[],
    active: {
        type: String,
        default: '',
    },
});
const emit = defineEmits(['handover']);
const myMessage = Store();
const myuserStore = userStore();
const activeId = ref('') as any;
const state = reactive({
    activeAccountInfo: {} as userType,
    menu: {
        show: false,
        x: 0,
        y: 0,
    },
});
// 切换消息体
const openMessage = (item: any) => {
    if (activeId.value == item.id) return;
    // eslint-disable-next-line no-param-reassign
    item.offLineNum = 0;
    myMessage.setContextObj(item);
    // 获取历史消息
    $websocket.webSocketSendMsg({ key: '', status: '6', data: { userId: `${myuserStore.userId}` } });
};
// 右键菜单
const openContextmenu = (e: MouseEvent) => {
    e.preventDefault();
    state.menu = {
        show: true,
        x: e.x,
        y: e.y,
    };
};

// 删除聊天
const delChat = () => {
    state.menu.show = false;
};
// 打开新的聊天窗口
const openNewWindow = (row: any) => {
    scroll.value?.setScrollTop(0);
    emit('handover', 'second');
    myMessage.addNewWindow(row).then((res) => {
        openMessage(res);
    });
};
// 切换多账号id
const select = (item: any) => {
    if (state.activeAccountInfo.id == item.id) return;
    myMessage.setActiveAccountInfo(item);
    $websocket.webSocketSendMsg({ key: '', status: '7', data: { userId: `${myuserStore.userId}` } });
    $websocket.webSocketSendMsg({ key: '', status: '8', data: { userId: `${myuserStore.userId}` } });
    $websocket.webSocketSendMsg({ key: '', status: '9', data: { userId: `${myuserStore.userId}` } });
    $websocket.webSocketSendMsg({ key: '', status: '11', data: { userId: `${myuserStore.userId}` } });
};
const accounts = computed(() => myMessage.accounts);
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
        width: 65px;
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
