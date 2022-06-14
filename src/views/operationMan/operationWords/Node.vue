<!--
 * @Author: your name
 * @Date: 2022-04-06 12:01:42
 * @LastEditTime: 2022-06-14 14:32:17
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\verbalTRStock\Processnode.vue
-->
<template>
    <div
        :id="`node_move${dataObj?.id}`"
        class="node_move"
        :style="`top:${dataObj?.top}px;left:${dataObj?.left}px`"
        @dblclick="dialogFn"
        @mouseup="mouseup"
    >
        <div :id="`node_main${dataObj?.id}`" class="node_main">
            <div class="node_header">
                <p class="flex-sb">
                    <span style="flex: 1; word-wrap: break-word; word-break: break-all">
                        {{ createObj.name || '流程节点' }}
                    </span>
                    <!-- 倒计时 -->
                    <span v-show="countDownTime && countDownNum !== 0" style="margin-right: 10px; position: relative">{{
                        countDownNum
                    }}</span>
                    <span class="juz">
                        <i-mdi-microphone
                            :class="recorderStatus ? 'microphone colorRed' : 'microphone'"
                            @mousedown.stop="recordFn"
                            @mouseup.stop="emptyTime"
                            @click.stop="playRecorder"
                        />
                    </span>
                </p>
                <i-ion-ios-close-circle-outline class="delete" @click="detele(`node_move${dataObj?.id}`)" />
            </div>
            <div class="node_content">{{ createObj.content }}</div>
            <div class="node_tags">
                <el-tag
                    v-for="(item, index) in list"
                    :id="`node_tags${item.id}`"
                    :key="item.id"
                    style="padding: 0; padding-top: 4px; margin-right: 2px"
                    @contextmenu.prevent="delBranch(index)"
                >
                    <el-popover v-if="isPre" trigger="click" placement="bottom">
                        <Select ref="selectRef" :data-obj="branchList[index]" @change-name="changeData"></Select>
                        <template #reference>
                            <span style="position: relative; top: -4px; cursor: pointer; padding: 6px 4px">{{
                                item.name
                            }}</span>
                        </template>
                    </el-popover>
                    <span v-else style="position: relative; top: -4px; cursor: pointer; padding: 4px">
                        {{ item.name }}
                    </span>
                </el-tag>
            </div>
        </div>
    </div>
    <video ref="videoPlay" style="display: none" :src="videoUrl"></video>
    <el-dialog
        v-model="dialogVisible"
        title="流程节点"
        width="30%"
        :close-on-click-modal="false"
        :append-to-body="true"
        @close="handleClose"
    >
        <div class="flex">
            <span class="juz" style="width: 80px">节点名称：</span>
            <div>
                <el-input v-model="fromObj.name"></el-input>
            </div>
        </div>
        <div class="flex" style="margin: 20px 0">
            <span style="width: 95px">AI话术：</span>
            <el-input v-model="fromObj.content" type="textarea" :rows="4" placeholder="请输入内容"></el-input>
        </div>
        <div class="flex">
            <span style="width: 80px">上传：</span>
            <UpLoad ref="upLoad" :list="dataObj?.vpath" :token="token" />
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="affirm()">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import Recorder from 'js-audio-recorder';
import * as qiniu from 'qiniu-js';
import { v4 } from 'uuid';
import Select from './Select.vue';
import UpLoad from './upLoad.vue';
import { createNode, delNode, delBranchNode } from '@/api/modules/operationMang/operationword';

const {
    proxy: { $tips, $plumbIns },
    proxy,
} = getCurrentInstance() as any;
const uuid = v4;
const emit = defineEmits(['getInfo', 'delNodeFn', 'mouseup', 'delConnect']);
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['dataObj', 'scenariosInfo', 'isPreserve', 'token']);
const upLoad = ref();
const selectRef = ref();
const videoPlay = ref();
const state = reactive<Record<string, any>>({
    dialogVisible: false,
    createObj: {
        name: '',
        content: '',
    },
    fromObj: {
        name: '',
        content: '',
    },
    nodeObj: {
        isShow: false,
    },
    list: [
        { id: uuid(), name: '肯定' },
        { id: uuid(), name: '否定' },
        { id: uuid(), name: '没听清' },
        { id: uuid(), name: '其他' },
        { id: uuid(), name: '待编辑' },
    ], // 页面展示
    branchList: [], // 后端需要的数据
    common: {
        isSource: true,
        connector: ['Bezier', { gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
        endpoint: 'Dot',
        isTarget: true,
        cssClass: 'z_index',
        paintStyle: {
            fill: '#409eff',
            radius: 6,
        },
        connectorStyle: {
            strokeWidth: 1,
            stroke: 'rgb(97, 183, 207)',
        },
        connectorHoverStyle: {
            stroke: 'red',
            strokeWidth: 2,
        },
        connectorOverlays: [
            // ["Arrow", { width: 12, length: 12, location: 0.35 }],
            // ["Arrow", { width: 12, length: 12, location: 0.65 }],
            ['Arrow', { width: 12, length: 12, location: 0.5 }],
            ['Arrow', { width: 12, length: 12, location: 1 }],
        ],
    },
    EndpointList: [], // 所有端点id
    isPre: false, // 状态是否保存过
    Loop: null, // 长按
    countDownTime: null, // 倒计时
    countDownNum: 3,
    recorderStatus: false, // 录音状态
    recorder: null,
    videoUrl: '',
    baseurl: 'http://pic.hzjiuwang.com',
    filePercent: 0,
    firstTime: 0,
    lastTime: 0,
    // 定义一个开始时间和结束时间
    eventFlag: false,
    memberId: null,
});

const mouseup = (e: MouseEvent) => {
    emit('mouseup', e);
};
function changeData(val: { name: any }) {
    state.list[state.list.length - 1].name = val.name;
    state.branchList[state.branchList.length - 1].name = val.name;
}
// 添加端点
function addDot(id: any, position: any, common: any) {
    state.EndpointList.push({ id });
    $plumbIns.addEndpoint(
        id,
        {
            anchors: position,
            uuid: id,
        },
        common,
    );
}
// 删除获取信息节点id
function delInfoId(eleId: string) {
    state.EndpointList.forEach((value: { id: any }, t: any) => {
        if (value.id == eleId) {
            state.EndpointList.splice(t, 1);
        }
    });
}
// 删除小节点
function delBranch(index: number) {
    ElMessageBox.confirm('确定删除所点击的节点吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            if (!state.isPre) {
                //   没有创建过得
                state.list.forEach((item: { id: any }, i: any) => {
                    if (index === i) {
                        $plumbIns.remove(`node_tags${item.id}`);
                        state.list.splice(index, 1);
                        delInfoId(`node_tags${item.id}`);
                        $tips('success', '删除成功！！！');
                    }
                });
                return;
            }
            state.branchList.forEach((item: { id: any }, i: any) => {
                if (index === i) {
                    delBranchNode(item.id).then((res: { data: { status: number; msg: any } }) => {
                        if (res.data.status === 200) {
                            $plumbIns.remove(`node_tags${item.id}`);
                            state.list.splice(index, 1);
                            state.branchList.splice(index, 1);
                            delInfoId(`node_tags${item.id}`);
                            $tips('success', '删除成功！！！');
                        } else {
                            $tips('error', res.data.msg);
                        }
                    });
                }
            });
        })
        .catch(() => null);
}
// 获取组件坐标
function getPosition() {
    const ele =
        document.getElementById(`node_move${props.dataObj?.id}`) ||
        document.getElementById(`node_move${state.nodeObj.id}`);
    const top = ele?.style.top.substring(0, ele.style.top.indexOf('px'));
    const left = ele?.style.left.substring(0, ele.style.left.indexOf('px'));
    return `${top},${left}`;
}
// 修改Id
function editId(oldId: string, newId: string) {
    $plumbIns.setId(oldId, newId);
}
// 新建节点
function affirm() {
    if (!state.fromObj.name) return $tips('warning', '节点名称不得为空！！！');
    if (!state.fromObj.content) return $tips('warning', '节点内容不得为空！！！');
    state.createObj.vos = upLoad.value.fileList.map((item: { realurl: any }) => {
        return { realurl: item.realurl };
    });
    state.createObj.scenariosId = props.scenariosInfo?.id;
    state.createObj.position = getPosition();
    state.createObj.name = state.fromObj.name;
    state.createObj.content = state.fromObj.content;

    if (state.isPre) {
        state.createObj.id = state.nodeObj.id;
        state.createObj.branchList = state.branchList;
    } else {
        state.createObj.branchList = state.list.map((item: { name: any }) => {
            return { name: item.name };
        });
    }
    createNode(state.createObj).then((res: { data: { status: number; data: { branchList: any[]; id: any } } }) => {
        if (res.data.status == 200) {
            // 没创建过得
            if (!state.isPre) {
                res.data.data.branchList.forEach((item: { id: string }, index: string | number) => {
                    editId(`node_tags${state.list[index].id}`, `node_tags${item.id}`);
                });
                editId(`node_move${props.dataObj?.id}`, `node_move${res.data.data.id}`);
                editId(`node_main${props.dataObj?.id}`, `node_main${res.data.data.id}`);
                state.nodeObj.isShow = true;
            } else {
                res.data.data.branchList.forEach((item: { keyword: any; id: string }, index: string | number) => {
                    state.branchList[index].keyword = item.keyword;
                    editId(`node_tags${state.branchList[index].id}`, `node_tags${item.id}`);
                    nextTick(() => {
                        console.log(state.branchList);
                    });
                });
            }
            state.branchList = res.data.data.branchList;
            state.nodeObj = Object.assign(state.nodeObj, res.data.data);
            state.dialogVisible = false;
            state.isPre = true; // 创建完成
        }
    });
}
// 删除节点
function detele(id: string) {
    ElMessageBox.confirm('确定删除所点击的节点吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            if (!state.isPre) {
                const noPre = id.replace('node_move', '');
                emit('delNodeFn', noPre);
                $plumbIns.remove(id);
                state.EndpointList = [];
                $tips('success', '删除成功！！！');
                return;
            }
            delNode(state.nodeObj.id).then((res: { data: { status: number; msg: any } }) => {
                if (res.data.status === 200) {
                    $plumbIns.remove(`node_move${state.nodeObj.id}`);
                    emit('delNodeFn', state.nodeObj.id);
                    state.EndpointList = [];
                    $tips('success', '删除成功！！！');
                } else {
                    $tips('error', res.data.msg);
                }
            });
        })
        .catch(() => null);
}
function jsPlumbFn() {
    const id = props.dataObj?.id;
    // 添加顶部端点
    $plumbIns.draggable(`node_move${id}`, { containment: 'parent' });
    nextTick(() => {
        state.common.paintStyle.radius = 4;
        // 添加底部小端点
        state.list?.forEach((item: { id: string }) => {
            addDot(`node_tags${item.id}`, 'Bottom', state.common);
        });
    }).then(() => {
        //   限制链接数
        state.common.maxConnections = -1;
        state.common.isSource = false;
        addDot(`node_main${id}`, 'Top', state.common);
        // 建立链接
        if (props.dataObj?.branchList) {
            nextTick(() => {
                props.dataObj?.branchList.forEach((item: { id: string; nextFlowId: string }) => {
                    if (item.nextFlowId) {
                        $plumbIns.connect({
                            uuids: [`node_tags${item.id}`, `node_main${item.nextFlowId}`],
                        });
                    }
                });
            });
        }
    });
}
// 给父组件的数据
function getEndpointInfo() {
    const obj: Record<string, any> = {};
    if (state.isPre) {
        state.EndpointList = [];
        obj.id = state.nodeObj.id;
        obj.scenariosId = props.scenariosInfo?.id;
        obj.position = getPosition();
        obj.name = state.createObj.name;
        obj.content = state.createObj.content;
        obj.path = state.videoUrl;
        obj.branchList = [];
        state.EndpointList.push({ id: `node_main${state.nodeObj.id}` });
        state.branchList.forEach((item: any) => {
            console.log(item.id);
            console.log(proxy.$refs.selectRef);
            console.log(
                proxy.$refs.selectRef.filter((row: { tagsObj: { tagsId: any } }) => row.tagsObj.tagsId == item.id),
            );
            state.EndpointList.push({ id: `node_tags${item.id}` });
            obj.branchList.push({
                id: item.id,
                name: item.name,
                nextFlowId: '',
                keyword: proxy.$refs.selectRef
                    .filter((row: { tagsObj: { tagsId: any } }) => row.tagsObj.tagsId == item.id)[0]
                    .tagsObj.list.value.map((row: { name: any }) => row.name)
                    .join(','),
            });
        });
        obj.vos = upLoad.value
            ? upLoad.value.fileList.map((item: { realurl: any }) => {
                  return { realurl: item.realurl };
              })
            : JSON.parse(props.dataObj.vpath);
    }
    state.EndpointList.forEach((item: any, index: number) => {
        const data = $plumbIns.getEndpoints(item.id)[0].connections[0] || '';
        const objInfo = {
            sourceId: data.sourceId, // 线的起始html元素的ID
            targetId: data.targetId, // 线的目标html元素的ID
            endpoints: data.endpoints, // 线的端点 有起始端点和目标端点 endpoints是一个数组
        };
        // eslint-disable-next-line no-param-reassign
        item.info = data ? objInfo : data;
        if (state.isPre) {
            // 父节点
            if (item.id.indexOf('node_tags') !== -1) {
                obj.branchList[index - 1].nextFlowId = data ? data.targetId : data;
            } else {
                obj.sourceId = data ? data.sourceId : data;
            }
        }
    });
    if (state.isPre) return obj;
}
// 监听保存状态
watch(
    () => props.isPreserve,
    (n) => {
        if (n) {
            if (state.isPre) return emit('getInfo', getEndpointInfo());
            getEndpointInfo();
            emit('getInfo', state.EndpointList);
        }
    },
);
// 上传
function uploadFile(file: any) {
    // 上传时的配置
    const config = {
        useCdnDomain: true,
    };
    //  设置文件的配置
    const putExtra = {
        fname: '',
        params: {},
        mimeType: null,
    };
    const key = `${props.scenariosInfo?.id}_${new Date().getTime()}.mp3`;
    //   实例化七牛云的上传实例
    const observable = qiniu.upload(file, key, props.token, putExtra, config);
    //   设置实例的监听对象
    const observer = {
        //   接收上传进度信息
        next(res: { total: { percent: string } }) {
            // 上传进度
            state.filePercent = parseInt(res.total.percent, 10);
            if (state.filePercent == 100) {
                $tips('success', '上传录音成功！！！');
            }
        },
        // 接收上传错误信息
        error(err: any) {
            console.log(err);
        },
        // 接收上传完成后的信息
        complete(res: { key: string }) {
            // 拼接路径字符串
            state.videoUrl = `${state.baseurl}/${res.key}`;
            console.log(state.videoUrl);
        },
    };
    // 上传开始
    // const subscription = observable.subscribe(observer);
    observable.subscribe(observer);
}
function clear() {
    clearInterval(state.countDownTime);
    clearTimeout(state.Loop);
    state.countDownTime = null;
    state.countDownNum = 3;
}
// 播放录音
function playRecorder() {
    clear();
    if (!state.recorderStatus && state.eventFlag) {
        // eslint-disable-next-line no-sequences
        if (state.videoUrl) return videoPlay.value.play(), $tips('success', '开始播放录音！！！');
        if (!state.recorder) return $tips('warning', '没有缓存录音，长按3s开始录制音频！！！');
        state.recorder.play();
        clearInterval(state.countDownTime);
        clearTimeout(state.Loop);
        state.countDownTime = null;
        state.Loop = null;
        state.countDownNum = 3;
    }
}

// 倒计时录音
function countDown() {
    clearInterval(state.countDownTime);
    state.countDownTime = null;
    state.countDownTime = setInterval(() => {
        // eslint-disable-next-line no-plusplus
        state.countDownNum--;
        if (state.countDownNum === 0) {
            state.recorder = null;
            state.recorder = new Recorder({
                sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
                sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
                numChannels: 1, // 声道，支持 1 或 2， 默认是1
            });
            clearInterval(state.countDownTime);
            state.countDownTime = null;
            state.countDownNum = 3;
            $tips('success', '开始录音！！！');
            state.recorderStatus = true;
            state.recorder.start();
        }
    }, 1000);
}
// 长按录音
function recordFn() {
    state.firstTime = new Date().getTime();
    clearTimeout(state.Loop); // 再次清空定时器，防止重复注册定时器
    state.Loop = null;
    state.Loop = setTimeout(() => {
        countDown();
    }, 1000);
}
function emptyTime() {
    state.lastTime = new Date().getTime();
    // 如果这个时间差小于300  ，就把锁打开
    // eslint-disable-next-line no-return-assign
    if (state.lastTime - state.firstTime < 3000) return (state.eventFlag = true);
    state.eventFlag = false;
    clear();
    if (state.recorder) {
        state.recorder.stop();
        state.recorderStatus = false;
        uploadFile(state.recorder.getWAVBlob());
    }
}
function dialogFn() {
    state.dialogVisible = true;
    if (state.createObj.name && state.createObj.content) {
        state.fromObj.name = state.createObj.name;
        state.fromObj.content = state.createObj.content;
    }
}
function created() {
    const position = props.dataObj?.position.split(',');
    // eslint-disable-next-line prefer-destructuring, vue/no-mutating-props
    props.dataObj.top = position[0];
    // eslint-disable-next-line prefer-destructuring, vue/no-mutating-props
    props.dataObj.left = position[1];
    if (props.dataObj?.branchList) {
        state.isPre = true;
        state.list = props.dataObj.branchList;
        state.branchList = props.dataObj.branchList;
        state.videoUrl = props.dataObj.path;
        state.createObj.id = props.dataObj.id;
        state.nodeObj.id = props.dataObj.id;
        state.createObj.name = props.dataObj.name;
        state.createObj.content = props.dataObj.content;
    }
}
function handleClose() {
    state.dialogVisible = false;
    state.fromObj = {
        name: '',
        content: '',
    };
}
onUnmounted(() => {
    $plumbIns.reset();
});
created();
onMounted(() => {
    $plumbIns.setContainer('diagramContainer');
    jsPlumbFn();
    // 当链接建立前
    $plumbIns.bind('beforeDrop', (info: { targetId: string | string[] }) => {
        if (info.targetId.indexOf('node_tags') !== -1) {
            return false;
        }
        return true;
    });
});
const {
    createObj,
    recorderStatus,
    countDownTime,
    fromObj,
    dialogVisible,
    countDownNum,
    isPre,
    list,
    branchList,
    videoUrl,
} = toRefs(state);
const { dataObj } = toRefs(props);
</script>

<style lang="scss" scoped>
.node_move {
    width: 214px;
    margin: 0 15px 15px;
    position: absolute;

    // border-top-left-radius: 20px;
    // border-top-right-radius: 20px;
    .node_main {
        background-color: #409eff;
        cursor: default;
        border-radius: 8px;

        &:hover {
            box-shadow: rgb(102, 166, 244) 0 0 12px 0;
        }

        .node_header {
            font-size: 12px;
            color: #fff;
            padding: 8px 10px;
            position: relative;

            .delete {
                display: none;
                font-size: 20px;
                position: absolute;
                right: -8px;
                top: -12px;
                color: #f39c12;

                cursor: pointer;
            }

            &:hover .delete {
                display: block;
            }
        }

        .node_content {
            background-color: #fff;
            padding: 4px;
            margin: 0 1px;
            font-size: 12px;
            font-family: 仿宋;
            border-bottom: 1px dashed #ccc;
            overflow-wrap: break-word;
            word-break: break-all;
        }

        .node_tags {
            margin: 0 1px;
            background-color: #fff;
            padding: 6px 4px;
            border-bottom: 1px solid #409eff;
            border-radius: 0px 0px 8px 8px;
        }
    }

    .microphone {
        font-size: 16px;
        margin-right: 15px;
        cursor: pointer;
    }

    .colorRed {
        color: red;
    }
}
</style>
