<!--
 * @Author: your name
 * @Date: 2022-03-25 14:21:47
 * @LastEditTime: 2022-04-18 18:05:53
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\content\inputInfo.vue
-->
<template>
    <span class="tips">使用Enter发送消息，Ctrl+Enter回车换行</span>
    <div class="input_utils">
        <el-popover placement="top" :width="255" trigger="hover">
            <template #reference>
                <span style="display: inline-block;">
                    <i-twemoji-face-without-mouth />
                </span>
            </template>
            <template #default>
                <el-scrollbar :min-size="10">
                    <Emoji @click="getEmo" />
                </el-scrollbar>
            </template>
        </el-popover>
    </div>
    <!-- <div id="editor" @keyup.ctrl.enter="sendInfo" @paste="pasteIntercept($event)"></div> -->
    <InputBox id="editor" ref="inpuBox" :enter="sendInfo" />
</template>

<script setup lang='ts'>
// import WangEditor from "wangeditor"

const { proxy: { $websocket } } = getCurrentInstance() as any;
// interface stateType {
//     context: string,
//     dialogVisible: boolean,
// }
interface getEMOType {
    key: string,
    value: string,
    html: HTMLSpanElement
}
const inpuBox = ref()
// const state = reactive<stateType>({
//     context: "",
//     dialogVisible: true,
// })
// 发送给最老辈组件的数据
// const openDialog = inject('openDialog') as Function
// 发送消息
const sendInfo = () => {
    // openDialog(true)
    // 得实体化
    const obj = { status: "", key: "3333", data: '2221454' }
    $websocket.webSocketSendMsg(obj, 'MessageRequest')
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

// onMounted(() => {
//     state.editor = new WangEditor('#editor')
//     // 菜单配置
//     state.editor.config.menus = []
//     // 全屏配置
//     state.editor.config.showFullScreen = false
//     // 高度配置
//     state.editor.config.height = 100
//     // 提示配置
//     state.editor.config.placeholder = ''
//     // 监听函数
//     state.editor.config.onchange = (html: string) => {
//         // 第二步，监控变化，同步更新到 textarea
//         state.context = html
//     }
//     state.editor.create()
// })

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
    // border-bottom: 1px solid #e5e7eb;
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