<template>
    <div class="verbal_header flex-sb">
        <div class="flex-sa" style="flex: 0.5">
            <!-- <div class="juz active">
                <i-ph-folder-notch-open class="wh_30" />
            </div>
            <div class="juz">
                <i-icon-park-outline-people-speak class="wh_16" />
            </div>
            <div class="juz">
                <i-gis-search-attribtues class="wh_16" />
            </div> -->
            <div class="juz">
                <el-button size="small" type="warning" :icon="Position" @click="sendScenariosFn">发送话术</el-button>
            </div>
        </div>
        <div class="juz" @click="closeVerbal()">
            <i-teenyicons-double-caret-left-outline class="wh_16" />
        </div>
    </div>
    <div style="--el-color-primary: #f39c12">
        <el-tabs v-model="activeName" stretch :before-leave="beforeLeave" class="demo-tabs">
            <el-tab-pane label="公司话术" name="first">
                <div class="verbal_Tree">
                    <el-input v-model="input2" class="verbal_search" placeholder="Please Input" :prefix-icon="Search" />
                    <el-radio-group v-model="radioId" class="el_verbal_Tree">
                        <el-radio v-for="item in scenariosList" :key="item.id" :label="item.id">{{
                            item.name
                        }}</el-radio>
                    </el-radio-group>
                    <div v-show="scenariosList.length == 0" class="flex-col" style="height: 100%; margin-top: 60px">
                        <!-- <span style="font-size: 160px">
                            <svg-icon name="undraw_no_data_re_kwbl" style="margin: 0 auto"></svg-icon>
                        </span>
                        <h2 style="text-align: center; font-size: 24px; font-weight: 600; margin: 10px 0">暂无</h2> -->
                        <el-empty description="空" />
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="大文件列表" name="second">
                <div class="big_file_list">
                    <el-scrollbar :min-size="10">
                        <div v-for="item in bigFileList" :key="item.fileId" class="big_file_item">
                            <div class="juz">
                                <el-button v-if="item.url" size="small" @click="downFile(item.url, item.fileName)"
                                    >下载
                                </el-button>
                                <template v-else>
                                    <el-button v-if="!item.downType" size="small" @click="requestDate(item)"
                                        >请求数据
                                    </el-button>
                                    <el-popconfirm
                                        v-if="item.downType == 1"
                                        confirm-button-text="是"
                                        cancel-button-text="否"
                                        :icon="InfoFilled"
                                        icon-color="#626AEF"
                                        title="是否重新请求数据?"
                                        @confirm="confirmEvent(item)"
                                    >
                                        <template #reference>
                                            <el-button size="small">准备数据中</el-button>
                                        </template>
                                    </el-popconfirm>
                                </template>
                            </div>
                            <div class="flex-col">
                                <span class="file_name">{{ item.fileName }}</span>
                                <span class="file_name">{{
                                    parseTime(item.sendTimeStamp, `{y}/{m}/{d} {h}:{i}`)
                                }}</span>
                            </div>
                        </div>
                        <!-- 暂无数据 -->
                        <div v-show="bigFileList.length == 0" class="flex-col" style="height: 100%; margin-top: 60px">
                            <!-- <span style="font-size: 160px">
                                <svg-icon name="undraw_no_data_re_kwbl" style="margin: 0 auto"></svg-icon>
                            </span>
                            <h2 style="text-align: center; font-size: 24px; font-weight: 600; margin: 10px 0">暂无</h2> -->
                            <el-empty description="空" />
                        </div>
                    </el-scrollbar>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
    <el-dialog v-model="dialogVisible" title="发送话术" width="60%" class="dialogVisible" @close="handleClose">
        <el-tabs v-model="activeWeChat" tab-position="left" class="demo-tabs">
            <el-tab-pane label="内部联系人" name="internal">
                <Transfer ref="internal" :data="wechatList.internal" :history-data="wechatList.internalCache" />
            </el-tab-pane>
            <el-tab-pane label="外部联系人" name="external">
                <Transfer ref="external" :data="wechatList.external" :history-data="wechatList.externalCache" />
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">关闭</el-button>
                <el-button type="warning" @click="send()">发送</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElLoading } from 'element-plus';
import { Search, Position, InfoFilled } from '@element-plus/icons-vue';
import { TabPanelName } from 'element-plus/lib/components';
import Store from '@/store/message';
import { sendScenarios } from '@/api/modules/operationMang/verbalTrickPush';
import { sreachScenarios, getBigFile } from '@/api/modules/operationMang/operationword';
import { getWechatList } from '@/api/modules/mrrandaIM';
import Transfer from './transfer.vue';
import { downFile, parseTime } from '@/utils/mineUtils';
import WebSocketClass from '@/utils/webSocket';

const {
    proxy: { $tips },
    proxy,
} = getCurrentInstance() as any;
const $websocket = inject('websocket') as WebSocketClass;
const myMessage = Store();
const state = reactive({
    activeName: 'first',
    activeWeChat: 'internal',
    input2: '',
    scenariosList: [] as { id: number; name: string; isCheckbox: boolean }[],
    radioId: '',
    dialogVisible: false,
    wechatList: {} as { internal: any[]; external: any[]; internalCache: any[]; externalCache: any[] },
    bigFileList: [] as {
        fileId: string;
        fileName: string;
        url: string;
        downType: number | null;
        sendTimeStamp: string;
    }[],
});
const getScenarios = () => {
    sreachScenarios({ status: '1' }).then((res) => {
        state.scenariosList = res.data.data.map((item: any) => {
            return {
                ...item,
                isCheckbox: false,
            };
        });
    });
};

// 获取大文件列表
const getGigFileList = (conversationId = myMessage.activeId) => {
    getBigFile({ wechatId: myMessage.activeAccountInfo.id, conversationId }).then((res) => {
        state.bigFileList = res.data.data;
    });
};
const requestDate = (item: any) => {
    $websocket.webSocketSendMsg({
        status: '15',
        data: { ...item },
    });
};
const confirmEvent = (item: any) => requestDate(item);

const beforeLeave = (activeName: TabPanelName) => {
    if (activeName == 'second') {
        if (!myMessage.activeId) {
            $tips('warning', '请先选择聊天窗口');
            return false;
        }
        getGigFileList(myMessage.activeId);
    }
};
const handleClose = () => {
    state.dialogVisible = false;
};
const sendScenariosFn = () => {
    if (!myMessage.activeAccountInfo.id) return $tips('warning', '请先选择子账号！！！');
    if (!state.radioId) return $tips('warning', '请先选择话术！！！');
    state.dialogVisible = true;
};
const closeVerbal = () => {
    myMessage.setHiddenAside(true);
};
const send = () => {
    const ids = proxy.$refs[state.activeWeChat].state.selectList.map(
        (item: { conversationId: string }) => item.conversationId,
    );
    if (ids.length == 0) return $tips('warning', '请选择需要发送的好友！');
    const loadingInstance = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.dialogVisible') as HTMLElement,
    });
    const type = state.activeWeChat == 'internal' ? 1 : 2;
    sendScenarios({ scenarios: state.radioId, ids, type, wechatId: myMessage.activeAccountInfo.id }).then((res) => {
        if (res.data.status == 200) {
            $tips('success', res.data.msg);
            loadingInstance.close();
            state.dialogVisible = false;
        } else {
            $tips('error', res.data.msg);
            loadingInstance.close();
        }
    });
};

watch(
    () => myMessage.activeAccountInfo,
    (n) => {
        state.wechatList = {
            internal: [],
            external: [],
            internalCache: [],
            externalCache: [],
        };
        getWechatList(n.id).then((res) => {
            state.wechatList = res.data.data;
        });
    },
);
watch(
    () => myMessage.activeId,
    (n) => {
        // eslint-disable-next-line no-return-assign
        if (!n) return (state.activeName = 'first');
        getGigFileList(n);
    },
);
onMounted(() => {
    getScenarios();
});
defineExpose({
    getGigFileList,
});
const { activeName, input2, scenariosList, radioId, dialogVisible, wechatList, activeWeChat, bigFileList } =
    toRefs(state);
</script>

<style lang="scss" scoped>
.verbal_header {
    padding: 10px 20px;
    border-bottom: 1px solid #e5e7eb;
    height: 45px;

    .active {
        color: #f39c12;
    }

    .juz {
        cursor: pointer;
    }

    .wh_30 {
        width: 30px;
        height: 30px;
    }

    .wh_16 {
        width: 16px;
        height: 16px;

        &:hover {
            color: #f39c12;
        }
    }
}

.el_verbal_Tree {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.verbal_Tree {
    padding: 0 20px;

    .verbal_search {
        margin-bottom: 10px;
    }
}

.big_file_list {
    height: calc(100vh - 240px);

    .big_file_item {
        display: flex;
        border-bottom: 1px solid #e5e7eb;
        padding: 15px 10px 10px;
        font-size: 12px;
        color: #444444;

        .file_name {
            display: inline-block;
            max-width: 190px;
            margin-left: 10px;
            white-space: nowrap;
            /*2.溢出部分隐藏起来*/
            overflow: hidden;
            /*3.文字溢出的时候用省略号来显示*/
            text-overflow: ellipsis;
        }
    }
}
</style>
