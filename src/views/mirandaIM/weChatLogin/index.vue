<!--
 * @Author: your name
 * @Date: 2022-04-12 14:52:39
 * @LastEditTime: 2022-05-30 15:16:11
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\weChatLogin\index.vue
-->
<template>
    <el-dialog
        v-model="dialogVisible"
        title="登录"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose"
    >
        <img :src="src" style="margin: auto" alt="" />
    </el-dialog>
</template>

<script setup lang="ts">
import messageStore from '@/store/message';
import WebSocketClass from '@/utils/webSocket';

const emit = defineEmits(['handleClose']);
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    src: {
        type: String,
        required: true,
    },
});
const dialogVisible = ref(false);
const $websocket = inject('websocket') as WebSocketClass;
// eslint-disable-next-line vue/no-setup-props-destructure
dialogVisible.value = props.modelValue;
const handleClose = () => {
    emit('handleClose');
    dialogVisible.value = false;
    messageStore().isLogin = false;
};
// 获取login二维码
$websocket.webSocketSendMsg({ status: '1' });
</script>

<style lang="scss" scoped></style>
