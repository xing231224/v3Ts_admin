<!--
 * @Author: your name
 * @Date: 2022-03-24 17:26:53
 * @LastEditTime: 2022-06-02 17:27:16
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\friendList.vue
-->
<template>
    <!-- vue3页面 -->
    <div style="--el-color-primary: #f39c12" class="flex">
        <div class="box-card" style="text-align: center; z-index: 99">
            <el-tooltip content="添加子账号" placement="bottom" effect="light">
                <el-button type="warning" style="margin-bottom: 10px" :icon="CirclePlus" circle @click="addUser" />
            </el-tooltip>
            <List :lists="needList[0]" :active="'first'" />
        </div>
        <div
            v-show="messageStore.activeAccountInfo.id"
            class="chat_list"
            style="height: 100%; flex: 1; overflow: hidden"
        >
            <!-- <div style="text-align: center; margin: 12px 0 0">
                <el-tooltip content="刷新" placement="bottom" effect="light">
                    <el-button type="warning" :icon="Loading" :loading="isLoading" circle @click="reflush" />
                </el-tooltip>
            </div> -->
            <div style="padding: 12px 10px">
                <el-autocomplete
                    v-model="input2"
                    :fetch-suggestions="querySearch"
                    style="width: 100%"
                    :prefix-icon="Search"
                    :trigger-on-focus="false"
                    clearable
                    class="input-round"
                    placeholder="Please Input"
                    @select="handleSelect"
                >
                    <template #default="{ item }">
                        <div class="value">{{ item.name }}</div>
                    </template>
                </el-autocomplete>
            </div>
            <el-tabs v-model="activeName" stretch class="demo-tabs" :before-leave="beforeLeave">
                <el-tab-pane v-for="(item, index) in tabsList" :key="item.name" :name="item.name">
                    <template #label>
                        <!-- <div v-if="item.name == 'second'">
                            <el-badge class="badge" :hidden="!messNum" :value="messNum">{{
                                item.label + `(${needList[index]?.length})`
                            }}</el-badge>
                        </div> -->
                        <span>{{ item.label }}</span>
                    </template>
                    <List ref="contacts" :lists="needList[index]" :active="activeName" @handover="handover" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Search, CirclePlus, Loading } from '@element-plus/icons-vue';
import { ElLoading } from 'element-plus';
import List from './list.vue';
import Store from '@/store/message';
import { flatten } from '@/utils/mineUtils';
import { userType } from './type';
import WebSocketClass from '@/utils/webSocket';

const {
    proxy: { $tips },
    proxy,
} = getCurrentInstance() as any;

const messageStore = Store();
const state = reactive({
    activeName: 'second',
    input2: '',
    isLoading: false,
    tabsList: [
        {
            label: '聊天列表',
            name: 'second',
        },
        {
            label: '联系人',
            name: 'third',
        },
    ],
    needList: [[], []] as [any[], any[]],
});
const $websocket = inject('websocket') as WebSocketClass;
const loadingFn = inject('loading') as Function;
// 刷新
const reflush = () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: '.el-tabs__content',
    });
    // 清空聊天窗口数据
    loadingFn(loading);
    // state.isLoading = true;
    // 向后端获取联系人数据
    ['7', '8', '9', '11'].forEach((item) => {
        $websocket.webSocketSendMsg({
            status: item,
            data: { wechatId: messageStore.activeAccountInfo.id, reflush: '1' },
        });
    });
};
const beforeLeave = () => {
    if (!messageStore.activeAccountInfo.id) {
        $tips('warning', '未选择微企账号！！！');
        return false;
    }
};
const handover = (str: string) => {
    state.activeName = str;
};

// 多账号添加
const addUser = () => {
    // 最多添加五个子账号
    if (messageStore.accounts.length == 5) return;
    messageStore.isLogin = true;
};

// 创建联系人搜索 过滤
const createFilter = (queryString: string) => {
    return (restaurant: userType) => restaurant.name.indexOf(queryString) != -1;
};
// 联系人搜索
const querySearch = (queryString: string, cb: any) => {
    const arr = flatten(state.needList[1].map((item: any) => item.children));
    const results = queryString !== ' ' ? arr.filter(createFilter(queryString)) : arr;
    // call callback function to return suggestions
    cb(results);
};
const handleSelect = (item: any) => proxy.$refs.contacts[0].openNewWindow(item);
watchEffect(() => {
    // 状态层获取列表数据
    state.needList = computed(() => messageStore.contactList).value;
});

const { input2, tabsList, needList, activeName, isLoading } = toRefs(state);
</script>

<style lang="scss" scoped>
.box-card {
    width: 130px;
    border-top: none;
    border-left: none;
    padding: 12px 0;
    box-shadow: 0px 0px 10px 0px rgba(51, 51, 51, 0.5);
}

.input-round {
    &::v-deep(input) {
        border-radius: 20px;
    }
}

.demo-tabs {
    &::v-deep(.el-tabs__nav-wrap::after) {
        background-color: #fff;
    }
}
.badge {
    &::v-deep(.el-badge__content) {
        top: 10px;
    }
}
</style>
