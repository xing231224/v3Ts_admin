<template>
    <div class="upload">
        <el-upload
            ref="upload"
            :action="action"
            list-type="picture-card"
            :file-list="fileList"
            :auto-upload="true"
            multiple
            :limit="limit"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :on-preview="handlePictureCardPreview"
            show-file-list
            :data="postData"
        >
            <el-icon class="avatar-uploader-icon">
                <Plus />
            </el-icon>
            <template #file="{ file }">
                <slot name="file" :file="file"></slot>
            </template>
        </el-upload>
        <slot />
        <el-dialog v-if="dialogVisible" v-model="dialogVisible" :append-to-body="true">
            <div v-if="isVideo(dialogImageUrl)">
                <video id="upvideo" :src="dialogImageUrl" style="width: 100%; height: 100%" controls>
                    您的浏览器不支持视频播放
                </video>
            </div>
            <img v-else :src="dialogImageUrl" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { v4 } from 'uuid';

const {
    proxy: { $tips },
    proxy,
} = getCurrentInstance() as any;

const props = defineProps({
    token: {
        type: String,
        required: true,
    },
    list: {
        type: String,
        default: '',
        required: false,
    },
    modelValue: {
        type: Array,
        default: () => [],
    },
    // eslint-disable-next-line vue/require-default-prop
    limit: Number,
});
const emit = defineEmits(['update:modelValue']);
const uuid = v4;
const state = reactive({
    action: 'http://upload.qiniup.com',
    dialogVisible: false,
    dialogImageUrl: '',
    fileList: [] as any[],
    imgsrc: '',
    postData: {
        token: '',
        key: '',
    },
    url: 'http://pic.hzjiuwang.com',
});
const isVideo = computed(() => {
    return (url: any) => {
        const last = url.substring(url.lastIndexOf('.'));
        if (last == '.png' || last == '.jpg' || last == '.jpeg' || last == '.jfif') {
            return false;
        }
        if (last == '.mp4' || last == '.mov' || last == '.m4v' || last == '.wmv') {
            return true;
        }
    };
});

function beforeUpload(file: any) {
    const isVideo = file.type.indexOf('video') !== -1;
    const isImage = file.type.indexOf('image') !== -1;
    if (!isVideo && !isImage) {
        $tips('error', '只可以上传视频和图片！！！');
        return false;
    }
    const last = file.name.substring(file.name.lastIndexOf('.'));
    state.postData.key = `${new Date().getTime()}_${uuid()}${last}`;
}
// 截取视频第一帧作为播放前默认图片
function findvideocover(url: string, db: Function) {
    nextTick(() => {
        const video = document.createElement('video') as any;
        video.src = url;
        video.type = 'video/mp4';
        video.crossOrigin = 'anonymous'; // 解决跨域问题，也就是提示污染资源无法转换视频
        video.currentTime = 2; // 第一帧
        video.addEventListener('loadeddata', () => {
            const canvas = document.createElement('canvas');
            canvas.width = 320;
            canvas.height = 320;
            canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.width);
            // eslint-disable-next-line no-unused-expressions
            db && db(canvas.toDataURL('image/png'));
        });
    });
}
function handleSuccess(response: any, file: any) {
    state.fileList = state.fileList.filter((item) => item != file);
    const baseUrl = `${state.url}/${response.key}`;
    const last = file.name.substring(file.name.lastIndexOf('.')); // 将接口中返回的各文件链接进行截取，来判断属于什么格式文件
    if (last == '.pdf') {
        state.fileList.push({
            url: 'https://img0.baidu.com/it/u=3644622474,3688361323&fm=26&fmt=auto&gp=0.jpg', // pdf封面图片
            realurl: baseUrl, // 接口返回的pdf文件链接
        });
    } else if (last == '.png' || last == '.jpg' || last == '.jpeg' || last == '.jfif') {
        state.fileList.push({
            url: baseUrl,
            realurl: baseUrl,
        });
    } else if (last == '.doc' || last == '.docx' || last == '.txt') {
        state.fileList.push({
            url: 'https://img1.baidu.com/it/u=1714136260,3766911961&fm=26&fmt=auto&gp=0.jpg',
            realurl: baseUrl,
        });
    } else if (last == '.xls' || last == '.xlsx') {
        state.fileList.push({
            url: 'https://img1.baidu.com/it/u=1123362811,2189997153&fm=26&fmt=auto&gp=0.jpg',
            realurl: baseUrl,
        });
    } else if (last == '.mp4' || last == '.mov' || last == '.m4v' || last == '.wmv') {
        findvideocover(baseUrl, (url: string) => {
            state.fileList.push({
                url,
                realurl: baseUrl,
            });
        });
    }
}
const handlePictureCardPreview = (file: any) => {
    state.dialogImageUrl = file.realurl;
    state.dialogVisible = true;
};

onMounted(() => {
    state.postData.token = props.token;
    (props.list ? JSON.parse(props.list) : '' || props.modelValue).forEach((item: any) => {
        if (isVideo.value(item.realurl)) {
            //  视频
            findvideocover(item.realurl, (url: string) => {
                state.fileList.push({
                    url,
                    realurl: item.realurl,
                });
            });
        } else {
            state.fileList.push({
                url: item.realurl,
                realurl: item.realurl,
            });
        }
    });
});
watch(
    () => state.fileList,
    (n) => {
        emit('update:modelValue', n);
    },
    {
        deep: true,
    },
);
const { action, dialogVisible, dialogImageUrl, fileList, postData } = toRefs(state);

defineExpose({
    handleRemove: (file: any) => proxy.$refs.upload.handleRemove(file),
    handlePictureCardPreview,
    ...toRefs(state),
});
</script>

<style lang="scss" scoped>
.upload {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.upload ::v-deep(.el-upload) {
    width: 80px;
    height: 80px;
}

.upload ::v-deep(.el-upload-list__item) {
    width: 80px;
    height: 80px;
}
</style>
