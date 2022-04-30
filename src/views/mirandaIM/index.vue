<!--
 * @Author: your name
 * @Date: 2022-03-21 14:09:09
 * @LastEditTime: 2022-04-28 15:17:31
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\views\mirandaIM\index.vue
-->
<template>
    <el-container v-if="myMessage.accounts.length > 0">
        <el-header height="auto" style="font-size: 14px;border-bottom: 1px solid #e5e7eb;">
            <div class="flex" style="padding: 5px 0;">
                <span class="juz">在线状态</span>
                <span class="juz mr-5">
                    <i-ph-question-thin />
                </span>
                <el-switch v-model="value" size="large" />
                <div class="juz" style="margin: 0 10px;">
                    <el-divider direction="vertical" />
                </div>
                <span class="juz">最大接待人数</span>
                <span class="juz mr-5">
                    <i-ph-question-thin />
                </span>
                <span class="juz mr-5">10</span>
                <span class="juz">
                    <i-system-uicons-write />
                </span>
                <div class="juz" style="margin: 0 10px;">
                    <el-divider direction="vertical" />
                </div>
                <span class="juz">优先旧消息</span>
                <span class="juz mr-5">
                    <i-ph-question-thin />
                </span>
                <el-switch v-model="value" size="large" />
                <div class="juz" style="margin: 0 10px;">
                    <el-divider direction="vertical" />
                </div>
                <span class="juz">开启新消息通知</span>
                <span class="juz mr-5">
                    <i-ph-question-thin />
                </span>
                <el-switch v-model="value" size="large" />
            </div>
        </el-header>
        <el-container>
            <el-aside width="260px">
                <FriendList />
            </el-aside>
            <el-main class="main">
                <Content v-if="isContentMess" />
                <div v-else class="svg_message juz">
                    <svg-icon name="messagechahua" />
                </div>
            </el-main>
            <el-aside :width="isHidden ? '0px' : '300px'" class="aside">
                <VerbalTrickVue />
            </el-aside>
        </el-container>
    </el-container>
    <WeCahtLogin v-if="myMessage.isLogin" v-model="myMessage.isLogin" />
    <el-dialog v-model="dialogVisible" title="Tips" width="30%" @close="handleClose">
        <img :src="imgSrc" />
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import FriendList from "./friendList/index.vue"
import Content from './content/index.vue'
import VerbalTrickVue from './verbalTR/index.vue'
import WeCahtLogin from "./weChatLogin/index.vue"
import Store from "@/store/message"
import userStore from "@/store/user"


const { proxy: { $websocket } } = getCurrentInstance() as any;
const myMessage = Store()
const myuserStore = userStore()
const state = reactive({
    value: false,
    dialogVisible: false,
    isHidden: false,
    dataList: [[], [], []],
    isContentMess: false
})
const imgSrc = ref('')
const handleClose = () => {
    console.log(1111);
}
const openDialog = (bool: boolean) => {
    state.dialogVisible = bool
}
$websocket.webSocketSendMsg({ key: '', status: '10', data: { userId: `${myuserStore.userId}` } })
$websocket.webSocketSendMsg({ key: '', status: '7', data: { userId: `${myuserStore.userId}` } })
$websocket.webSocketSendMsg({ key: '', status: '8', data: { userId: `${myuserStore.userId}` } })
$websocket.webSocketSendMsg({ key: '', status: '9', data: { userId: `${myuserStore.userId}` } })
$websocket.getWebSocketMsg((obj: any) => {
    switch (obj.status) {
        case '7':
            state.dataList[0] = obj.data
            break;
        case '8':
            state.dataList[1] = obj.data
            break;
        case '9':
            state.dataList[2] = obj.data
            break;
        case '10':
            myMessage.accounts = obj.data
            break;
        default:
            break;
    }
})
// 传递参数给子孙组件
console.log(state.dataList);
provide("dataList", state.dataList)
provide("openDialog", openDialog)

watchEffect(() => {
    state.isContentMess = computed(() => myMessage.$state.isContext).value
    state.isHidden = computed(() => myMessage.getHiddenAside).value
})


const { value, dialogVisible, isHidden, isContentMess } = toRefs(state)

</script>

<style lang='scss' scoped>
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
        transition: width 0.5s;
    }
}

.mr-5 {
    margin-right: 5px;
    font-size: 12px;
}
</style>