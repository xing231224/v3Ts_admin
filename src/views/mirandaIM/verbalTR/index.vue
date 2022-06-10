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
            <div class="juz"><el-button size="small" type="warning" @click="sendScenariosFn">发送话术</el-button></div>
        </div>
        <div class="juz" @click="closeVerbal()">
            <i-teenyicons-double-caret-left-outline class="wh_16" />
        </div>
    </div>
    <div style="--el-color-primary: #f39c12">
        <el-tabs v-model="activeName" stretch class="demo-tabs">
            <el-tab-pane label="公司话术" name="first">
                <div class="verbal_Tree">
                    <el-input v-model="input2" class="verbal_search" placeholder="Please Input" :prefix-icon="Search" />
                    <el-radio-group v-model="radioId" class="el_verbal_Tree">
                        <el-radio v-for="item in scenariosList" :key="item.id" :label="item.id">{{
                            item.name
                        }}</el-radio>
                    </el-radio-group>
                </div>
            </el-tab-pane>
            <el-tab-pane label="我的话术" name="second">Config</el-tab-pane>
        </el-tabs>
    </div>
    <el-dialog v-model="dialogVisible" title="发送话术" width="60%" class="dialogVisible" @close="handleClose">
        <el-tabs v-model="activeWeChat" tab-position="left" class="demo-tabs">
            <el-tab-pane label="内部联系人" name="internal">
                <Transfer ref="internal" :data="wechatList.internal" :history-data="wechatList.internalCache" />
            </el-tab-pane>
            <el-tab-pane label="外部联系人" name="external"
                ><Transfer ref="external" :data="wechatList.external" :history-data="wechatList.externalCache" />
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="warning" @click="send()">发送</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElLoading } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import Store from '@/store/message';
import { sendScenarios } from '@/api/modules/operationMang/verbalTrickPush';
import { sreachScenarios } from '@/api/modules/operationMang/operationword';
import { getWechatList } from '@/api/modules/mrrandaIM';
import Transfer from './transfer.vue';

const {
    proxy: { $tips },
    proxy,
} = getCurrentInstance() as any;

const myMessage = Store();
const state = reactive({
    activeName: 'first',
    activeWeChat: 'internal',
    input2: '',
    scenariosList: [] as { id: number; name: string; isCheckbox: boolean }[],
    radioId: '',
    dialogVisible: false,
    wechatList: {} as { internal: any[]; external: any[]; internalCache: any[]; externalCache: any[] },
});
const getScenarios = () => {
    sreachScenarios({}).then((res) => {
        state.scenariosList = res.data.data.map((item: any) => {
            return {
                ...item,
                isCheckbox: false,
            };
        });
    });
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
    const ids = proxy.$refs[state.activeWeChat].state.selectList.map((item: { id: string }) => item.id);
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
            // state.dialogVisible = false;
        } else {
            $tips('error', res.data.msg);
            loadingInstance.close();
        }
    });
};
watch(
    () => myMessage.activeAccountInfo,
    (n) => {
        getWechatList(n.id).then((res) => {
            state.wechatList = res.data.data;
        });
    },
);
onMounted(() => {
    getScenarios();
});
const { activeName, input2, scenariosList, radioId, dialogVisible, wechatList, activeWeChat } = toRefs(state);
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
</style>
