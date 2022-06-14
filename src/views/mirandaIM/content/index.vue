<!--
 * @Author: your name
 * @Date: 2022-03-25 10:39:43
 * @LastEditTime: 2022-06-11 10:13:51
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\content\index.vue
-->

<template>
    <!-- vue3页面 -->
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
                                            ? contentMess.avatorUrl
                                                ? contentMess.avatorUrl
                                                : `https://imgsa.baidu.com/forum/pic/item/023b5bb5c9ea15ce85b34b6eb1003af33a87b27c.jpg`
                                            : myMessage.activeAccountInfo.avatorUrl
                                    "
                                />
                                <el-tag
                                    v-if="item.telType == 1"
                                    size="small"
                                    style="margin-right: 10px; padding: 0 2px"
                                    type="danger"
                                    >话术</el-tag
                                >
                                <span class="juz" :style="item.telType == 1 ? `margin:0 5px` : 'margin: 0 10px'">{{
                                    item.sendType == '0'
                                        ? item.conversationId[0] == 'R'
                                            ? item.senderNickName
                                            : contentMess.name
                                        : myMessage.activeAccountInfo.name
                                }}</span>
                                <span class="juz">{{ parseTime(item.sendTimeStamp, `{y}/{m}/{d} {h}:{i}`) }}</span>
                            </div>
                            <div
                                :class="
                                    item.sendType == '0' ? 'opposite_content content-text' : 'me_content content-text'
                                "
                            >
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
                                    <el-progress
                                        v-if="
                                            (item.fileId && item.filePercent !== 100 && item.filePercent !== 0) ||
                                            item.ack == '0'
                                        "
                                        :percentage="item.filePercent"
                                        type="circle"
                                        :stroke-width="2"
                                        :width="14"
                                        :status="item.isUpload && item.filePercent == 100 ? 'success' : 'exception'"
                                        :show-text="false"
                                        :color="colors"
                                        style="display: flex; align-items: end; padding: 0 5px"
                                    />
                                    <div v-else style="display: flex; align-items: end; padding: 0 5px">
                                        <CircleCheck
                                            v-if="(item.isUpload && item.filePercent == 100) || item.ack == '1'"
                                            style="width: 14px; height: 14px"
                                            color="green"
                                        />
                                        <CircleClose
                                            v-if="item.fileId && item.isUpload == false && item.filePercent !== 100"
                                            style="width: 14px; height: 14px"
                                            color="red"
                                        />
                                    </div>
                                    <!-- 图片 -->
                                    <img
                                        v-if="item.msgType == '402' || item.msgType == '408'"
                                        width="175"
                                        style="cursor: pointer"
                                        :src="item.imageUrl || item.url"
                                        @click="
                                            item.msgType == '408' ? null : playVideo(true, item.imageUrl, item.msgType)
                                        "
                                    />
                                    <div
                                        v-else-if="item.msgType == '405'"
                                        class="file-content"
                                        @click="downFile(item.fileUrl, item.fileName)"
                                    >
                                        <div class="flex">
                                            <span class="juz">{{ item.fileName }}</span>
                                            <div class="juz">
                                                <img
                                                    width="35"
                                                    style="transform: scale(1.5)"
                                                    :src="getSuffix(item.fileName).icoURL"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <p>{{ getfilesize(item.fileSize) }}</p>
                                    </div>
                                    <!-- 视频 -->
                                    <div
                                        v-else-if="item.msgType == '403'"
                                        class="video-content"
                                        @click="playVideo(true, item.mp4Url, item.msgType)"
                                    >
                                        <video :src="item.mp4Url"></video>
                                        <span>
                                            <i-ph-play-circle-thin />
                                        </span>
                                    </div>
                                </div>
                                <!-- 语音 -->
                                <div v-else-if="item.msgType == '404'">
                                    <PlayAduio :url="item.voiceUrl" :is-play="false" :keys="item.sendTimeStamp" />
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>
            </el-scrollbar>
        </el-main>
        <el-footer height="200px" class="footer">
            <inputInfoVue @get-progress="getProgress" @success-upload="successUpload" @success-send="setScrollHeight" />
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
const getProgress = (filePercent: number) => {
    console.log(filePercent, 11111);
};
const successUpload = (obj: { file: File; fileURL: string }) => {
    console.log(obj);
};
const setScrollHeight = (number = 0) => {
    const content_warp = document.getElementsByClassName('content_warp')[0];
    // 默认到底部
    nextTick(() => {
        if (content_warp) {
            scroll.value?.setScrollTop(
                number || (scroll.value.resize$ as HTMLElement).clientHeight - content_warp.clientHeight,
            );
        }
    });
};
const scrollFn = (obj: { scrollTop: number }) => {
    // const content_warp = document.getElementsByClassName('content_warp')[0];
    state.scrollTop = obj.scrollTop;
    // 拉取历史消息
    if (obj.scrollTop == 0 && state.chatList.length > 0) {
        $websocket.webSocketSendMsg({
            status: '6',
            data: {
                conversationId: state.contentMess.conversationId,
                sendTimeStamp: state.chatList[0].sendTimeStamp,
                size: 10,
            },
        });
        // scroll.value?.setScrollTop(content_warp.clientHeight);
    }
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
