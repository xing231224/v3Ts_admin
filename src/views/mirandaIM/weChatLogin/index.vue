<!--
 * @Author: xing 1981193009@qq.com
 * @Date: 2022-04-12 14:52:39
 * @LastEditors: xing 1981193009@qq.com
 * @LastEditTime: 2022-06-30 17:53:08
 * @FilePath: \web_wxChat\src\views\mirandaIM\weChatLogin\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-dialog
        v-model="dialogVisible"
        title="登录"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose"
        custom-class="login-dialog"
    >
        <img :src="src" style="margin: auto" alt="" />
    </el-dialog>
</template>

<script setup lang="ts">
import { ElLoading } from 'element-plus';
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
const loadingFn = inject('loading') as Function;
// eslint-disable-next-line vue/no-setup-props-destructure
dialogVisible.value = props.modelValue;
const handleClose = () => {
    emit('handleClose');
    dialogVisible.value = false;
    messageStore().isLogin = false;
};
nextTick(() => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: '.login-dialog',
    });
    // 获取login二维码
    $websocket.webSocketSendMsg({ status: '1' });
    loadingFn(loading, true);
});
</script>

<style lang="scss" scoped>
.login-dialog {
    &::v-deep(.el-dialog__body) {
        min-height: 400px;
    }
}
</style>
