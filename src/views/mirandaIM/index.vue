<!--
 * @Author: your name
 * @Date: 2022-03-21 14:09:09
 * @LastEditTime: 2022-05-10 16:26:52
 * @LastEditors: xing 1981193009@qq.com
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
            <el-aside :width="myMessage.activeAccountInfo.id ? '380px' : '130px'" class="aside">
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
    <el-dialog v-if="dialogVisible" v-model="dialogVisible" :title="isVideo(fileUrl) ? '查看视频' : '查看图片'" width="30%"
        @close="handleClose">
        <div v-if="isVideo(fileUrl)">
            <video id="upvideo" :src="fileUrl" style="width: 100%; height: 100%" controls>您的浏览器不支持视频播放</video>
        </div>
        <img v-else :src="fileUrl" />
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="downFile(fileUrl, isVideo(fileUrl) ? '视频.mp4' : '图片.png')">下载
                </el-button>
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
import { downFile } from "@/utils/mineUtils"

const { proxy: { $websocket } } = getCurrentInstance() as any;
const myMessage = Store()
const myuserStore = userStore()
const state = reactive({
    value: false,
    dialogVisible: false,
    isHidden: false,
    dataList: [] as any[],
    isContentMess: false,
    contacts: [] as any[]
})
const fileUrl = ref('')
const handleClose = () => {
    console.log(1111);
}
const isVideo = computed(() => {
    return (url: any) => {
        const last = url.substring(url.lastIndexOf("."));
        if (
            last == ".png" ||
            last == ".jpg" ||
            last == ".jpeg" ||
            last == ".jfif"
        ) {
            return false;
        } if (
            last == ".mp4" ||
            last == ".mov" ||
            last == ".m4v" ||
            last == ".wmv"
        ) {
            return true;
        }
    };
})
const openDialog = (bool: boolean, url: string) => {
    state.dialogVisible = bool
    fileUrl.value = url
}
// 时间排序
const sortTime = (arr: any[]): any[] => {
    return arr.sort((a, b) => b.offLineMsg.sendTimeStamp - a.offLineMsg.sendTimeStamp)
}
$websocket.webSocketSendMsg({ key: '', status: '10', data: { userId: `${myuserStore.userId}` } })
$websocket.getWebSocketMsg((obj: any) => {
    switch (obj.status) {
        // 内部联系人
        case '7':
            state.contacts[0] = {
                title: '内部联系人',
                children: obj.data
            }
            break;
        // 外部联系人
        case '8':
            state.contacts[1] = {
                title: '外部联系人',
                children: obj.data
            }
            break;
        // 群聊
        case '9':
            state.contacts[2] = {
                title: '群聊',
                children: obj.data
            }
            break;
        // 子账号
        case '10':
            myMessage.accounts = obj.data
            break;
        // 聊天列表
        case '11':
            state.dataList[0] = sortTime(obj.data)
            break;
        // 当前窗口聊天记录
        case '6':
            // 添加聊天记录进列表
            myMessage.setChatList(obj.data)
            break;
        default:
            break;
    }
})
// 传递参数给子孙组件
provide("dataList", state.dataList)

provide("openDialog", openDialog)

watchEffect(() => {
    state.isContentMess = computed(() => myMessage.$state.isContext).value
    state.isHidden = computed(() => myMessage.getHiddenAside).value
    if (state.contacts.length == 3) {
        state.dataList[1] = state.contacts
    }

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
        overflow: hidden;
        transition: width 0.6s;
    }
}

.mr-5 {
    margin-right: 5px;
    font-size: 12px;
}
</style>