<template>
    <el-container class="content">
        <el-header height="auto" class="flex-sb" style="padding: 0; border-bottom: 1px solid #e5e7eb">
            <p>{{ contentMess.name }}</p>
            <div v-if="isHidden" class="juz" style="margin-right: 10px; cursor: pointer" @click="openVerbal()">
                <i-teenyicons-double-caret-right-outline class="wh_16" />
            </div>
        </el-header>
        <el-main class="el-main content_warp">
            <el-scrollbar ref="scroll" :min-size="10" @scroll="scrollFn">
                <div v-show="isMore" style="text-align: center; font-size: 12px">
                    加载更多
                    <el-icon class="is-loading">
                        <Loading />
                    </el-icon>
                </div>
                <ul class="message flex-col">
                    <template v-for="item in chatList" :key="item.sendTimeStamp">
                        <li :class="item.sendType == '0' ? 'opposite' : 'me'">
                            <div :class="item.sendType == '0' ? 'flex' : 'avatar_info'" style="margin-bottom: 4px">
                                <el-avatar
                                    shape="square"
                                    :size="20"
                                    style="display: block"
                                    :src="
                                        item.sendType == '0'
                                            ? item.conversationId[0] == 'R'
                                                ? filterAvatar(item.senderId)
                                                : contentMess.avatorUrl
                                            : myMessage.activeAccountInfo.avatorUrl
                                    "
                                />
                                <template v-if="item.telType == 1">
                                    <el-tag size="small" style="margin-right: 10px; padding: 0 2px" type="danger"
                                        >话术</el-tag
                                    >
                                </template>
                                <template v-else-if="item.telType == 2">
                                    <el-tag size="small" style="margin-right: 10px; padding: 0 2px" type="success"
                                        >知识库</el-tag
                                    >
                                </template>
                                <span class="juz" :style="`margin:0 ${item.telType == 1 ? '5px' : '10px'}`">{{
                                    item.sendType == '0'
                                        ? item.conversationId[0] == 'R'
                                            ? item.senderNickName
                                            : contentMess.name
                                        : myMessage.activeAccountInfo.name
                                }}</span>
                                <span class="juz">{{ parseTime(item.sendTimeStamp, `{y}/{m}/{d} {h}:{i}`) }}</span>
                            </div>
                            <div :class="`content-text ${item.sendType == '0' ? 'opposite_content' : 'me_content'} `">
                                <!-- 文本 -->
                                <div v-if="item.msgType == '401'" class="flex" style="background-color: #fff">
                                    <div v-if="item.ack" style="display: flex; align-items: end; padding: 0 5px">
                                        <el-icon v-if="item.ack == '0'" class="is-loading">
                                            <Loading style="width: 14px; height: 14px" />
                                        </el-icon>
                                        <CircleCheck v-else style="width: 14px; height: 14px" color="green" />
                                    </div>
                                    <div
                                        :style="`padding: 4px 15px; background-color: ${
                                            item.sendType == '0' ? '#e9e9e9' : '#cbe5fe'
                                        }; border-radius: 4px`"
                                        v-html="parsingEmoji(item.content)"
                                    ></div>
                                </div>
                                <!-- 文件 -->
                                <div
                                    v-else-if="
                                        item.msgType == '405' ||
                                        item.msgType == '402' ||
                                        item.msgType == '403' ||
                                        item.msgType == '408'
                                    "
                                    class="flex"
                                    style="background-color: #fff"
                                >
                                    <div v-if="item.ack" style="display: flex; align-items: end; padding: 0 5px">
                                        <template
                                            v-if="
                                                (item.fileIds && item.filePercent !== 100 && item.filePercent !== 0) ||
                                                item.ack == '0'
                                            "
                                        >
                                            <el-progress
                                                :percentage="item.filePercent"
                                                type="circle"
                                                :stroke-width="2"
                                                :width="14"
                                                :status="
                                                    item.isUpload && item.filePercent == 100 ? 'success' : 'exception'
                                                "
                                                :show-text="false"
                                                :color="colors"
                                                style="display: flex; align-items: end; padding: 0 5px"
                                            />
                                        </template>
                                        <template v-else>
                                            <CircleCheck
                                                v-if="(item.isUpload && item.filePercent == 100) || item.ack == '1'"
                                                style="width: 14px; height: 14px"
                                                color="green"
                                            />
                                            <CircleClose
                                                v-if="
                                                    item.fileIds && item.isUpload == false && item.filePercent !== 100
                                                "
                                                style="width: 14px; height: 14px"
                                                color="red"
                                            />
                                        </template>
                                    </div>
                                    <!-- 图片 -->
                                    <template v-if="item.msgType == '402' || item.msgType == '408'">
                                        <viewer :options="{ navbar: false, title: false }" rebuild :images="[item.url]">
                                            <img :src="item.url" width="175" style="cursor: pointer" alt="" />
                                        </viewer>
                                    </template>
                                    <!-- <img
                                        v-if="item.msgType == '402' || item.msgType == '408'"
                                        width="175"
                                        style="cursor: pointer"
                                        :src="item.url"
                                        @click="item.msgType == '408' ? null : playVideo(true, item.url, item.msgType)"
                                    /> -->
                                    <template v-else-if="item.msgType == '405'">
                                        <div
                                            class="file-content"
                                            @click="item.url ? downFile(item.url, item.fileName) : null"
                                        >
                                            <div class="flex">
                                                <span
                                                    class="juz"
                                                    style="word-wrap: break-word; word-break: break-all"
                                                    >{{ item.fileName }}</span
                                                >
                                                <div class="juz" style="margin: 0 4px">
                                                    <img
                                                        width="35"
                                                        style="transform: scale(1.5)"
                                                        :src="getSuffix(item.fileName).icoURL"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <p class="flex-sb">
                                                <span>{{ getfilesize(item.fileSize) }}</span>
                                                <span v-if="!item.url" style="color: red">注:在大文件列表下载</span>
                                            </p>
                                        </div>
                                    </template>
                                    <!-- 视频 -->
                                    <template v-else-if="item.msgType == '403'">
                                        <div class="video-content" @click="playVideo(true, item.url, item.msgType)">
                                            <video :src="item.url"></video>
                                            <span>
                                                <i-ph-play-circle-thin />
                                            </span>
                                        </div>
                                    </template>
                                </div>
                                <!-- 语音 -->
                                <template v-else-if="item.msgType == '404'">
                                    <PlayAduio :url="item.url" :is-play="false" :keys="item.sendTimeStamp" />
                                </template>
                            </div>
                        </li>
                    </template>
                </ul>
            </el-scrollbar>
        </el-main>
        <el-footer height="200px" class="footer">
            <inputInfoVue @success-send="setScrollHeight" />
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { Loading, CircleCheck, CircleClose } from '@element-plus/icons-vue';
import type { ElScrollbar } from 'element-plus';
import inputInfoVue from './inputInfo.vue';
import Store from '@/store/message';
import { parsingEmoji } from '@/utils/emjoymethod';
import { parseTime, getSuffix, getfilesize, downFile } from '@/utils/mineUtils';
import WebSocketClass from '@/utils/webSocket';

const $websocket = inject('websocket') as WebSocketClass;

const colors = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#1989fa', percentage: 60 },
    { color: '#6f7ad3', percentage: 80 },
    { color: '#5cb87a', percentage: 100 },
];
const myMessage = Store();
const scroll = ref<InstanceType<typeof ElScrollbar>>();
const state = reactive({
    isHidden: false,
    contentMess: {} as any,
    chatList: [] as any,
    scrollTop: 0,
    isMore: true,
});
const openVerbal = () => {
    myMessage.setHiddenAside(false);
};
// 获取file信息以及上传进度 上传 成功 之后的url
// const getProgress = (filePercent: number) => {
//     console.log(filePercent, 11111);
// };
// const successUpload = (obj: { file: File; fileURL: string }) => {
//     console.log(obj);
// };
const setScrollHeight = (number = 0) => {
    const content_warp = document.getElementsByClassName('content_warp')[0];
    // 默认到底部
    nextTick(() => {
        if (content_warp) {
            scroll.value?.setScrollTop(
                number || ((scroll.value.resize$ as HTMLElement).clientHeight - content_warp.clientHeight) * 2,
            );
        }
    });
};
const scrollFn = (obj: { scrollTop: number }) => {
    state.scrollTop = obj.scrollTop;
    // 拉取历史消息
    if (obj.scrollTop == 0 && state.chatList.length > 0) {
        $websocket.webSocketSendMsg({
            status: '6',
            data: {
                conversationId: state.contentMess.conversationId,
                sendTimeStamp: state.chatList[0].sendTimeStamp - 1,
                size: 10,
            },
        });
    }
};
const filterAvatar = (id: string) => {
    const filterList = (myMessage.getContactAll as any[]).filter((row) => row.id == id);
    return filterList.length > 0
        ? filterList[0].avatorUrl
        : 'https://imgsa.baidu.com/forum/pic/item/023b5bb5c9ea15ce85b34b6eb1003af33a87b27c.jpg';
};
// 拉取聊天消息的状态操作
const chatStatus = (show: boolean) => {
    // 更多消息的状态显示
    state.isMore = show;
};
// 播放视频
const playVideo = inject('openDialog') as Function;
watchEffect(() => {
    state.contentMess = computed(() => myMessage.getContextObj).value;
    state.isHidden = computed(() => myMessage.getHiddenAside).value;
    state.chatList = computed(() => myMessage.getChatList).value;
    if (state.chatList.length <= 20) {
        state.isMore = false;
        setScrollHeight();
    }
});
defineExpose({
    chatStatus,
    setScrollHeight,
});
onMounted(() => {
    setScrollHeight();
});
const { isHidden, contentMess, chatList, isMore } = toRefs(state);
</script>

<style lang="scss" scoped>
* {
    user-select: text;
    font-family: 黑体 !important;
}

.content {
    width: 100%;
    height: 100%;
    border-top: 0;

    .wh_16 {
        width: 16px;
        height: 16px;

        &:hover {
            color: #f39c12;
        }
    }

    p {
        height: 45px;
        padding: 10px 20px;
    }

    .el-main {
        padding: 0;
        height: calc(100vh - 420px);
        overflow: auto;
    }

    .message {
        font-size: 14px;
        padding: 20px;

        li {
            margin: 10px 0;
        }

        .juz {
            font-size: 12px;
        }

        .opposite_content {
            display: inline-block;
            margin-left: 30px;
            // position: relative;
            // &::before {
            //     left: -6px;
            //     top: 16px;
            //     transform: rotate(135deg);
            // }
        }

        .right {
            float: right;
        }

        .left {
            float: left;
        }

        .me {
            .avatar_info {
                display: flex;
                flex-direction: row-reverse;
            }

            .me_content {
                margin-right: 30px;
                float: right;
            }
        }

        .content-text {
            max-width: 70%;
            // &::before {
            // content: '';
            // display: inline-block;
            // box-sizing: border-box;
            // width: 12px;
            // height: 12px;
            // border: 1px solid transparent;
            // border-radius: 3px;
            // position: absolute;
            // background-color: inherit;
            // border-right-color: inherit;
            // border-bottom-color: inherit;
            // }
        }
    }

    .file-content {
        width: 200px;
        background-color: #fff;
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
        cursor: pointer;

        &:hover {
            background-color: rgb(247, 243, 243);
        }

        &::v-deep(.el-progress__text) {
            min-width: 35px;
            font-size: 12px !important;
        }

        .flex {
            padding: 10px;

            span {
                flex: 1;
            }

            border-bottom: 1px solid rgba(232, 237, 250, 0.6);
        }

        p {
            padding: 4px 10px;
            height: auto;
            font-size: 12px;
            color: rgb(196, 196, 196);
        }
    }

    .video-content {
        width: 200px;
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
        cursor: pointer;
        position: relative;

        span {
            position: absolute;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            font-size: 40px;
            color: #fff;
        }
    }

    .footer {
        position: relative;
        padding: 0;
        border-top: 1px solid #e5e7eb;
    }
}
</style>
