<template>
    <span class="tips">使用Enter发送消息，Ctrl+Enter回车换行</span>
    <div class="input_utils">
        <el-popover placement="top" :width="255" trigger="hover">
            <template #reference>
                <span>
                    <i-twemoji-face-without-mouth />
                </span>
            </template>
            <template #default>
                <el-scrollbar :min-size="10">
                    <Emoji @click="getEmo" />
                </el-scrollbar>
            </template>
        </el-popover>
        <span style="position: relative">
            <i-ic-sharp-drive-folder-upload style="color: rgb(255, 204, 77)" />
            <input
                ref="upload"
                style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; cursor: pointer; opacity: 0"
                type="file"
                @change="fileChange"
            />
        </span>
    </div>
    <InputBox id="editor" ref="inpuBox" :enter="sendInfo" />
</template>

<script setup lang="ts">
import * as qiniu from 'qiniu-js';
import { qiNiuToken } from '@/api/qiniu';
import Store from '@/store/message';
import WebSocketClass from '@/utils/webSocket';
import { randomKey, isVideo } from '@/utils/mineUtils';

const myMessage = Store();
const $websocket = inject('websocket') as WebSocketClass;
const {
    proxy: { $tips },
} = getCurrentInstance() as any;
const emit = defineEmits(['get-progress', 'success-upload', 'success-send']);
interface getEMOType {
    key: string;
    value: string;
    html: HTMLSpanElement;
}
const inpuBox = ref();
const upload = ref();
const state = reactive({
    fileURL: '',
    filePercent: 0, // 上传进度
    token: '',
    baseurl: 'http://pic.hzjiuwang.com',
    file: {} as File,
});
// 监听上传进度给父组件
watch(
    () => state.filePercent,
    () => {
        const obj = {
            fileURL: state.fileURL,
            filePercent: state.filePercent,
            file: state.file,
        };
        emit('get-progress', obj);
    },
);

// const inputBoxFn = (e: InputEvent) => {
//     console.log(e);
//     if (e.data == '@') {
//         // 群聊@成员
//         // 获取光标位置
//         // console.log(window.getSelection());
//         // console.log(document.createRange());
//     }
// };
// 文本消息
const sendText = (text: string | null | undefined = '') => {
    const sendObj = {
        content: text || inpuBox.value.getChildNode('html'),
        conversationId: myMessage.userData.conversationId,
        sendType: '1',
        msgType: '401',
        msgId: randomKey(),
        ack: '0', // 表示发送状态
        sendTimeStamp: Math.floor(new Date().getTime() / 1000),
    };
    const obj = { status: '401', data: { ...sendObj, content: text || inpuBox.value.getChildNode() } };
    // 添加到消息体
    myMessage.addChatList(sendObj).then(() => {
        // 设置滚动条
        inpuBox.value.clearContent();
        $websocket.webSocketSendMsg(obj);
        emit('success-send');
    });
};
// 将表情添加到文本框
const getEmo = (obj: getEMOType) => {
    inpuBox.value.insertStr(obj.key);
};

// 上传
function uploadFile(file: File, sendFile: any = {}) {
    state.file = file;
    // 上传时的配置
    const config = {
        useCdnDomain: true,
    };
    //  设置文件的配置
    const putExtra = {
        fname: '',
        params: {},
        mimeType: null,
    };
    const key = file.name;
    //   实例化七牛云的上传实例
    const observable = qiniu.upload(file, key, state.token, putExtra, config);
    //   设置实例的监听对象
    const observer = {
        //   接收上传进度信息
        next(res: { total: { percent: string } }) {
            // 上传进度
            state.filePercent = parseInt(res.total.percent, 10);
            if (sendFile?.fileIds) {
                myMessage.setUploadInfo(sendFile.fileIds, 'filePercent', parseInt(res.total.percent, 10));
            }
            // 清空
            if (state.filePercent == 100) {
                (upload.value as HTMLInputElement).value = '';
            }
        },
        // 接收上传错误信息
        error(err: any) {
            myMessage.setUploadInfo(sendFile.fileIds, 'isUpload', false);
            console.log(err);
            $tips('error', err);
        },
        // 接收上传完成后的信息
        complete(res: { key: string }) {
            // 拼接路径字符串
            state.fileURL = `${state.baseurl}/${res.key}`;
            // 处理文件发送字段
            /* eslint-disable no-param-reassign */
            sendFile.url = `${state.baseurl}/${res.key}`;
            // 发送消息给后端
            emit('success-upload', { fileURL: state.fileURL, file });
            myMessage.setUploadInfo(sendFile.fileIds, 'isUpload', true);
            myMessage.setUploadInfo(sendFile.fileIds, 'content', state.fileURL);
            // 发送到后端
            const obj = {
                status: isVideo(file.name) == 'img' ? '402' : isVideo(file.name) == 'video' ? '403' : '405',
                data: { ...sendFile },
            };
            $websocket.webSocketSendMsg(obj);
        },
    };
    // 上传开始
    // const subscription = observable.subscribe(observer);
    observable.subscribe(observer);
}
// 将base64转换为file
class BaseFile {
    constructor(dataurl: string) {
        // eslint-disable-next-line no-undef, no-constructor-return
        return this.blobToFile(this.dataURLtoBlob(dataurl), `${new Date().getTime()}.png`);
    }

    // eslint-disable-next-line class-methods-use-this
    dataURLtoBlob(dataurl: any) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        // eslint-disable-next-line no-plusplus
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    // 将blob转换为file
    // eslint-disable-next-line class-methods-use-this
    blobToFile(theBlob: any, fileName: any) {
        // eslint-disable-next-line no-param-reassign
        theBlob.lastModifiedDate = new Date();
        // eslint-disable-next-line no-param-reassign
        theBlob.name = fileName;
        return theBlob;
    }
}
// 获取文件
const fileChange = (e: any) => {
    const file = e.name ? e : ((e.target as HTMLInputElement).files?.item(0) as File);
    // 前端需要的数据
    const sendFile = {
        conversationId: myMessage.userData.conversationId,
        fileName: file.name, // 文件名
        fileIds: file.size + new Date().getTime(),
        filePercent: 0, // 上传进度
        fileSize: file.size, // 文件大小
        msgType: isVideo(file.name) == 'img' ? '402' : isVideo(file.name) == 'video' ? '403' : '405', // 文件类型
        sendTimeStamp: Math.floor(new Date().getTime() / 1000), // 发送时间
        sendType: '1',
        msgId: randomKey(),
        ack: '0', // 表示发送状态
    };
    // 添加到消息体
    myMessage.addChatList(sendFile).then(() => {
        // 设置滚动条
        emit('success-send');
    });
    uploadFile(file, sendFile);
};
// 发送消息
const sendInfo = () => {
    // 处理截图加文本消息
    const { childNodes } = inpuBox.value.html as HTMLElement;
    // 含图片元素的  图文分开发送
    if ((inpuBox.value.getChildNode('html') as string).indexOf('img') !== -1) {
        childNodes.forEach((item) => {
            if (item.nodeName == 'IMG') {
                // eslint-disable-next-line no-new
                fileChange(new BaseFile((item as HTMLImageElement).src));
                inpuBox.value.clearContent();
            } else {
                if ((item as HTMLElement).innerHTML == '&nbsp;') return;
                sendText(item.textContent);
            }
        });
    } else {
        if (
            (childNodes.length == 1 && (childNodes.item(0) as HTMLElement).innerHTML == '&nbsp;') ||
            childNodes.length == 0
        )
            return $tips('warning', '不能发送空消息！！！');
        // 发送文本消息
        sendText();
    }
};

function getQiNiuToken() {
    qiNiuToken().then((res: { data: { data: string } }) => {
        state.token = res.data.data;
    });
}
onMounted(() => {
    getQiNiuToken();
});
</script>

<style lang="scss" scoped>
.tips {
    position: absolute;
    top: -20px;
    right: -8px;
    font-size: 12px;
    transform: scale(0.8);
    color: #ccc;
}

.input_utils {
    height: 20px;
    padding: 10px;
    box-sizing: content-box;
    display: flex;

    // border-bottom: 1px solid #e5e7eb;
    span {
        margin-right: 10px;
        cursor: pointer;
    }
}

#editor {
    overflow: auto;
    height: calc(100% - 42px);

    &::v-deep(.w-e-toolbar) {
        border: none !important;
    }

    &::v-deep(.w-e-text-container) {
        min-height: 100% !important;
        border: none !important;
        z-index: 22 !important;
    }

    &::v-deep(.w-e-text-container p) {
        font-size: 14px !important;
        font-family: 仿宋;
        margin: 0;
    }

    &::v-deep(.w-e-text) {
        padding: 0 20px;

        &::-webkit-scrollbar {
            width: 7px;
            height: 5px;
            border-radius: 15px;
            -webkit-border-radius: 15px;
        }

        &::-webkit-scrollbar-track-piece {
            background-color: #ffff;
            border-radius: 15px;
            -webkit-border-radius: 15px;
            /* opacity: .8; */
            background: transparent;
        }

        &::-webkit-scrollbar-thumb:vertical {
            height: 5px;
            background-color: rgba(144, 147, 153, 0.5);
            border-radius: 15px;
            -webkit-border-radius: 15px;
        }

        &::-webkit-scrollbar-thumb:horizontal {
            width: 7px;
            background-color: rgba(144, 147, 153, 0.5);
            border-radius: 15px;
            -webkit-border-radius: 15px;
        }
    }

    &::-webkit-scrollbar {
        width: 7px;
        height: 5px;
        border-radius: 15px;
        -webkit-border-radius: 15px;
    }

    &::-webkit-scrollbar-track-piece {
        background-color: #ffff;
        border-radius: 15px;
        -webkit-border-radius: 15px;
        /* opacity: .8; */
        background: transparent;
    }

    &::-webkit-scrollbar-thumb:vertical {
        height: 5px;
        background-color: rgba(144, 147, 153, 0.5);
        border-radius: 15px;
        -webkit-border-radius: 15px;
    }

    &::-webkit-scrollbar-thumb:horizontal {
        width: 7px;
        background-color: rgba(144, 147, 153, 0.5);
        border-radius: 15px;
        -webkit-border-radius: 15px;
    }
}
</style>
