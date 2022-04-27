<!--
 * @Author: your name
 * @Date: 2022-04-12 14:52:39
 * @LastEditTime: 2022-04-26 11:22:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\weChatLogin\index.vue
-->
<template>
    <el-dialog v-model="dialogVisible" title="登录" width="30%" :close-on-click-modal="false" :before-close="handleClose">
        <img :src="imgBase64" alt="">
    </el-dialog>
</template>

<script setup lang='ts'>
import userStore from "@/store/user"
import messageStore from "@/store/message"

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})
const myuserStore = userStore()
const dialogVisible = ref(false)
const imgBase64 = ref('')
const { proxy: { $websocket } } = getCurrentInstance() as any;

const obj = { key: '', status: '2', data: { userId: `${myuserStore.userId}` } }
// 获取login二维码
$websocket.webSocketSendMsg(obj)
// 接收消息
$websocket.getWebSocketMsg((obj: any) => {
    console.log(obj);
    imgBase64.value = `data:image/png;base64,${obj.data.qrCode}`
})
// eslint-disable-next-line vue/no-setup-props-destructure
dialogVisible.value = props.modelValue
const handleClose = () => {
    dialogVisible.value = false
    messageStore().isLogin = false
}
</script>

<style lang='scss' scoped>
</style>