<template>
    <el-container>
        <el-header height="auto" style="font-size: 12px; border-bottom: 1px solid #e5e7eb">
            <div class="flex">
                <span class="juz">开启知识库自动应答</span>
                <span class="juz mr-5">
                    <i-ph-question-thin />
                </span>
                <el-switch
                    v-model="isValue"
                    size="large"
                    :disabled="disabled"
                    style="--el-switch-on-color: #e6a23c"
                    :before-change="beforeSwitch"
                    @change="changeSwitch"
                />
                <span class="juz ml-5 mr-2">岗位:</span>
                <div class="juz">
                    <el-select
                        v-model="state.stationId"
                        :disabled="disabled"
                        size="small"
                        placeholder="请选择岗位"
                        @change="changeStation"
                    >
                        <el-option v-for="item in options_station" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </div>
            </div>
        </el-header>
        <el-container>
            <el-aside :width="myMessage.activeAccountInfo.id ? '380px' : '130px'" class="aside">
                <FriendList />
            </el-aside>
            <el-main class="main">
                <Content v-if="isContentMess" ref="chatContent" />
                <div v-else class="svg_message juz">
                    <svg-icon name="messagechahua" />
                </div>
            </el-main>
            <el-aside :width="isHidden ? '0px' : '300px'" class="aside">
                <VerbalTrickVue ref="verbalTrick" />
            </el-aside>
        </el-container>
    </el-container>
    <WeCahtLogin v-if="myMessage.isLogin" v-model="myMessage.isLogin" :src="imgBase64" @handle-close="handleClose" />
    <el-dialog
        v-if="dialogVisible"
        v-model="dialogVisible"
        :title="msgType == '403' ? '查看视频' : '查看图片'"
        width="40%"
        top="4vh"
        @close="handleClose"
    >
        <template v-if="msgType == '403'">
            <div class="flex-center">
                <video id="upvideo" :src="fileUrl" style="width: 50%; height: 100%" controls>
                    您的浏览器不支持视频播放
                </video>
            </div>
        </template>
        <template v-else>
            <img :src="fileUrl" />
        </template>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="downFile(fileUrl, msgType == '403' ? '视频.mp4' : '图片.png')"
                    >下载
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElLoading } from 'element-plus';
import FriendList from './friendList/index.vue';
import Content from './content/index.vue';
import VerbalTrickVue from './verbalTR/index.vue';
import WeCahtLogin from './weChatLogin/index.vue';
import Store from '@/store/message';
import { downFile } from '@/utils/mineUtils';
import WebSocketClass from '@/utils/webSocket';
import userStore from '@/store/user';
import { getStation } from '@/api/modules/controlConsole/stationMan';

const {
    proxy: { $tips },
} = getCurrentInstance() as any;
// const $websocket = new WebSocketClass('192.168.3.241:18888');
const $websocket = new WebSocketClass('124.71.190.1:18888');
const myMessage = Store();
const state = reactive({
    isValue: false,
    disabled: false,
    dialogVisible: false,
    isHidden: false,
    stationId: '',
    dataList: [[], []] as [any[], any[]],
    isContentMess: false,
    contacts: [] as any[],
    imgBase64: '',
    isChatList: false,
    isContacts: false,
    loading: null as unknown as { close: Function } | null,
    msgType: '',
    options_station: [] as { id: number; name: string }[],
});
const fileUrl = ref('');
const chatContent = ref();
const verbalTrick = ref();
const handleClose = () => {
    state.imgBase64 = '';
    state.msgType = '';
};
const changeStation = (val: number) => {
    if (!myMessage.activeAccountInfo.id) return;
    $websocket.webSocketSendMsg({
        status: '18',
        state: val,
        data: {},
    });
};
const beforeSwitch = () => {
    if (!state.stationId) {
        $tips('warning', '未选择岗位！！！');
        return false;
    }
    return true;
};
const changeSwitch = (val: any) => {
    if (!myMessage.activeAccountInfo.id) return;
    $websocket.webSocketSendMsg({
        status: '14',
        state: val ? 1 : 2,
        data: {},
    });
};
const openDialog = (bool: boolean, url: string, msgType: string) => {
    state.dialogVisible = bool;
    fileUrl.value = url;
    //  403视频  402图片
    state.msgType = msgType;
};
const clearLoading = () => {
    /* eslint-disable no-unused-expressions */
    state.loading && state.loading.close();
    state.loading = null;
};
// 时间排序
const sortTime = (arr: any[]): any[] => {
    return arr.sort((a, b) => b.offLineMsg.sendTimeStamp - a.offLineMsg.sendTimeStamp);
};
// 子账号第一次执行 获取好友列表
watch(
    () => state.contacts,
    (n) => {
        if (n.length == 3) {
            state.isContacts = true;
        }
    },
    { deep: true },
);
watch([() => state.isChatList, () => state.isContacts], (n) => {
    if (n.every((item) => item)) {
        clearLoading();
        myMessage.setContactList(state.dataList as [[], []]);
    }
});
const loading = (loading: { close: () => void }, bool = false) => {
    if (bool) {
        state.loading = loading;
        return;
    }
    // 状态层清空数据
    myMessage.clearData();
    myMessage.setContactList([[], []]);
    state.contacts = [];
    state.dataList = [[], []];
    state.isContacts = false;
    state.isChatList = false;
    state.loading = loading;
};

// 传递 数据到所有子类组件
provide('openDialog', openDialog);
provide('websocket', $websocket);
// 接收组件的loading 方法
provide('loading', loading);
provide('clearLoading', clearLoading);

// 接收所有后端返回的消息
$websocket.getWebSocketMsg((obj: any) => {
    console.log(obj.data);
    // 接收消息
    if (obj.status.length == 3 && obj.status[0] == '4') {
        if (obj.data.fileSize > 20971520) {
            verbalTrick.value.getGigFileList();
        }
        myMessage.receiveChat(obj.data, obj.weChatId, () => {
            setTimeout(() => {
                chatContent.value.setScrollHeight();
            }, 500);
        });
        return;
    }
    // 退出登录
    if (obj.status == '5') {
        myMessage.loginOut(obj.weChatId);
        $tips('success', `${obj.msg}!!!`);
        return;
    }
    if (obj.weChatId && obj.weChatId != myMessage.activeAccountInfo.id) return;
    switch (obj.status) {
        // 消息发送成功
        case '4':
            myMessage.editMsg(obj.data, obj.weChatId);
            // 添加消息 滚动条位置
            nextTick(() => {
                chatContent.value?.setScrollHeight();
            });
            break;
        // 当前窗口聊天记录
        case '6':
            // 添加聊天记录进列表
            if (obj.data.length == 0) {
                $tips('warning', '暂无更多消息！！！');
                clearLoading();
                // 通知子组件不再发送消息
                chatContent.value.chatStatus(false);
                return;
            }
            myMessage.setChatList(obj.data);
            /* eslint-disable no-case-declarations */
            const firstChil = document.querySelector('.message')?.firstElementChild as HTMLElement;
            const top = firstChil ? firstChil.offsetTop * obj.data.length * 2 : 0;
            setTimeout(() => {
                chatContent.value.setScrollHeight(top);
                setTimeout(clearLoading, 300);
            }, 50);

            break;
        //  外部联系人
        case '7':
            state.contacts[1] = { title: '外部联系人', children: obj.data };
            break;
        // 内部联系人
        case '8':
            state.contacts[0] = { title: '内部联系人', children: obj.data };
            break;
        // 群聊
        case '9':
            state.contacts[2] = { title: '群聊', children: obj.data };
            break;
        // 子账号
        case '10':
            myMessage.addAccounts(obj.data);
            break;
        // 聊天列表
        case '11':
            state.dataList[0] = sortTime(obj.data);
            state.isChatList = true;
            break;
        case '17':
            // if (obj.state == 200) {
            ['7', '8', '9', '11'].forEach((item) => {
                $websocket.webSocketSendMsg({
                    status: item,
                    data: { userId: `${userStore().userId}`, wechatId: obj.weChatId },
                });
            });
            // }
            break;
        case '18':
            if (obj.state == 200) {
                $tips('success', '修改成功！！！');
            }
            break;
        // 获取base64二维码
        case '101':
            // eslint-disable-next-line no-return-assign
            if (obj.state == 100) return (myMessage.isLogin = false);
            state.imgBase64 = `data:image/png;base64,${obj.data.qrCode}`;
            clearLoading();
            break;
        // 扫码登录结果
        case '102':
            const loadings = ElLoading.service({
                lock: true,
                text: '登录成功,数据加载中...',
                background: 'rgba(0, 0, 0, 0.7)',
                target: '.login-dialog',
            });
            loading(loadings, true);
            break;
        case '106':
            clearLoading();
            $websocket.webSocketSendMsg({ status: '10' });
            myMessage.isLogin = false;
            $tips('success', obj.msg);
            break;
        // 通知文件更新状态
        case '590':
            if (obj.state == 200) {
                $tips('success', obj.msg);
                verbalTrick.value.getGigFileList();
            } else {
                $tips('warning', obj.msg);
            }
            break;
        default:
            break;
    }
});

watchEffect(() => {
    state.isContentMess = computed(() => myMessage.$state.isContext).value;
    state.isHidden = computed(() => myMessage.getHiddenAside).value;
    state.dataList[1] = state.contacts;
    state.disabled = !myMessage.activeAccountInfo.id;
    state.isValue = myMessage.activeAccountInfo.open == '1';
    state.stationId = myMessage.activeAccountInfo.position || '';
});
onMounted(() => {
    setTimeout(() => {
        // 发送请求接收子账号的数据
        $websocket.webSocketSendMsg({ status: '10' });
    }, 800);
});
onActivated(() => {
    getStation().then((res) => {
        state.options_station = res.data.data;
    });
});
const { isValue, dialogVisible, isHidden, isContentMess, imgBase64, msgType, disabled, options_station } =
    toRefs(state);
</script>

<style lang="scss" scoped>
.main {
    padding: 0;
    border: 1px solid #e5e7eb;
    border-top: 0;

    .svg_message {
        width: 100%;
        height: 100%;

        svg {
            width: 60%;
            height: 60%;
            margin: auto;
        }
    }

    .aside {
        overflow: hidden;
        transition: width 0.6s;
    }
}

.mr-5 {
    margin-right: 5px;
    font-size: 12px;
}
</style>
