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
