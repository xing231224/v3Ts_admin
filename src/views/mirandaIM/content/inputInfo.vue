<!--
 * @Author: your name
 * @Date: 2022-03-25 14:21:47
 * @LastEditTime: 2022-04-30 16:34:17
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\content\inputInfo.vue
-->
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
        <span style="position: relative;">
            <i-icon-park-folder-upload />
            <input ref="upload"
                style="width: 100%;height: 100%;position: absolute;top: 0;left: 0;cursor: pointer;opacity: 0;"
                type="file" @change="fileChange">
        </span>
    </div>
    <!-- <div id="editor" @keyup.ctrl.enter="sendInfo" @paste="pasteIntercept($event)"></div> -->
    <InputBox id="editor" ref="inpuBox" :enter="sendInfo" />
</template>

<script setup lang='ts'>
import * as qiniu from 'qiniu-js';
import { qiNiuToken } from '@/api/qiniu';
// import WangEditor from "wangeditor"

const { proxy: { $websocket } } = getCurrentInstance() as any;
const emit = defineEmits(['get-progress', 'success-upload'])
interface getEMOType {
    key: string,
    value: string,
    html: HTMLSpanElement
}
const inpuBox = ref()
const state = reactive({
    fileURL: '',
    filePercent: 0, // 上传进度
    token: '',
    baseurl: "http://pic.hzjiuwang.com",
    file: {} as File
})
// 发送给最老辈组件的数据
// const openDialog = inject('openDialog') as Function
// 监听上传进度给父组件
watch(() => state.filePercent, (n) => {
    // const obj = {
    //     fileURL: state.fileURL,
    //     filePercent: state.filePercent,
    //     file: state.file
    // }
    emit('get-progress', n)
})
// 发送消息
const sendInfo = () => {
    // openDialog(true)
    // 得实体化
    const obj = { status: "", key: "3333", data: '2221454' }
    $websocket.webSocketSendMsg(obj)
}
// 接收消息
$websocket.getWebSocketMsg((msg: any) => {
    msg.data.arrayBuffer().then((res: number | number[] | null | undefined) => {
        console.log($websocket.transformResponse("MessageRequest")(res));
    })
})
// 将表情添加到文本框
const getEmo = (obj: getEMOType) => {
    inpuBox.value.insertStr(obj.key)
}
// 上传
function uploadFile(file: File) {
    // 上传时的配置
    const config = {
        useCdnDomain: true,
    };
    //  设置文件的配置
    const putExtra = {
        fname: "",
        params: {},
        mimeType: null,
    };
    const key = file.name;
    //   实例化七牛云的上传实例
    const observable = qiniu.upload(file, key, state.token, putExtra, config);
    //   设置实例的监听对象
    const observer = {
        //   接收上传进度信息
        next(res: { total: { percent: string; }; }) {
            // 上传进度
            state.filePercent = parseInt(res.total.percent, 10);
        },
        // 接收上传错误信息
        error(err: any) {
            console.log(err);
        },
        // 接收上传完成后的信息
        complete(res: { key: string; }) {
            // 拼接路径字符串
            state.fileURL = `${state.baseurl}/${res.key}`;
            emit("success-upload", { fileURL: state.fileURL, file })
        },
    };
    // 上传开始
    // const subscription = observable.subscribe(observer);
    observable.subscribe(observer);
}
// 获取文件
const fileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.item(0) as File
    uploadFile(file)
}

function getQiNiuToken() {
    qiNiuToken().then((res: { data: { data: string } }) => {
        state.token = res.data.data;
    });
}
onMounted(() => {
    getQiNiuToken()
})

// const { editor } = toRefs(state)
</script>

<style lang='scss' scoped>
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