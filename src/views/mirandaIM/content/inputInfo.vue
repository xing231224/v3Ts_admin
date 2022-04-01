<!--
 * @Author: your name
 * @Date: 2022-03-25 14:21:47
 * @LastEditTime: 2022-04-01 17:38:04
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\content\inputInfo.vue
-->
<template>
    <span class="tips">使用Ctrl+Enter发送消息，Enter回车换行</span>
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

    <div id="editor" @keyup.ctrl.enter="sendInfo" @paste="pasteIntercept($event)"></div>
</template>

<script setup lang='ts'>
import WangEditor from "wangeditor"

const { proxy: { $websocket, parsingEmoji } } = getCurrentInstance() as any;
interface stateType {
    editor: any,
    context: string
}
interface getEMOType {
    key: string,
    value: string,
    html: HTMLSpanElement
}
const state = reactive<stateType>({
    editor: {},
    context: ""
})
const sendInfo = () => {
    // 得实体化
    const obj = { status: "222", key: "3333", data: '2221454' }
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
    state.editor.cmd.do('insertHTML', `<p>${obj.key}</p>`)
}
onMounted(() => {
    state.editor = new WangEditor('#editor')
    // 菜单配置
    state.editor.config.menus = []
    // 全屏配置
    state.editor.config.showFullScreen = false
    // 高度配置
    state.editor.config.height = 100
    // 提示配置
    state.editor.config.placeholder = ''
    // 监听函数
    state.editor.config.onchange = (html: string) => {
        // 第二步，监控变化，同步更新到 textarea
        state.context = parsingEmoji(html)
        state.editor.txt.html(parsingEmoji(html))
    }
    state.editor.create()
})

// 粘贴图片
const pasteIntercept = (d: any) => {
    const obj = {
        data: "",
        mode: 0,
    };
    // eslint-disable-next-line no-plusplus
    for (let b = 0; b < d.clipboardData.items.length; b++) {
        const c = d.clipboardData.items[b];
        if (c.type == "image/png") {
            obj.mode = 1;
            const a = new FileReader() as any;
            a.onloadend = () => {
                obj.data = a.result.substr(a.result.indexOf(",") + 1);
                const img = `<img src="data:image/png;base64,${obj.data}" alt="">`
                state.editor.cmd.do('insertHTML', `<p>${img}</p>`)
            };
            a.readAsDataURL(c.getAsFile());
            break;
        }
    }
}

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
}
</style>