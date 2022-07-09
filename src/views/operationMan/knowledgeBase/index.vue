<template>
    <div class="knowledgeBase" style="--el-color-primary: #f39c12">
        <div class="header flex-sb">
            <div class="flex">
                <span class="juz">关键词：</span>
                <div style="margin-right: 10px">
                    <el-input v-model="listQuery.keyword" clearable placeholder="请输入关键字" />
                </div>
                <span class="juz">岗位：</span>
                <div style="margin-right: 10px">
                    <el-select v-model="listQuery.position" clearable placeholder="岗位">
                        <el-option v-for="item in options_station" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </div>
                <el-button type="warning" :icon="Search" @click="getList">搜索</el-button>
                <el-button type="warning" plain :icon="CirclePlus" @click="dialogFn('')">添加知识库</el-button>
                <el-button type="warning" :icon="Upload" @click="expressExcel">导出</el-button>
                <el-button type="warning" :icon="Coordinate" @click="updateCheck">审核</el-button>
            </div>
            <div>
                <el-button type="warning" :icon="Delete" plain @click="batchDel()"> 批量删除 </el-button>
            </div>
        </div>
        <el-table
            v-loading="listLoading"
            :data="tableData"
            style="width: 100%; margin: 20px 0"
            element-loading-text="给我一点时间"
            @selection-change="handleSelectionChange"
        >
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" prop="name" label="标题" width="180" />
            <el-table-column align="center" prop="keyword" label="问法" />
            <el-table-column align="center" label="优先排序" width="80">
                <template #default="scope">
                    <div>
                        <el-input v-model="scope.row.sort" @blur="updataSort(scope.row)" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="关键词" width="80">
                <template #default="scope">
                    <div>{{ filterCount(scope.row?.keyword) }}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="岗位" width="80">
                <template #default="scope">
                    <div v-if="scope.row.position">
                        {{ options_station.find((item:any) => item.id == scope.row?.position).name }}
                    </div>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="label" label="知识库标签" />
            <el-table-column align="center" label="状态" width="80">
                <template #default="scope">
                    <el-tag v-if="scope.row?.checkStatus == 1" type="success">已生效 </el-tag>
                    <el-tag v-if="scope.row?.checkStatus == 0" type="danger">待审核 </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="更新时间">
                <template #default="scope">
                    <div v-if="scope.row?.updateTime">
                        {{ parseTime(scope.row?.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template #default="scope">
                    <div>
                        <el-button :icon="Edit" @click="dialogFn(scope.row)"> 编辑 </el-button>
                        <el-button :icon="Delete" @click="del(scope.row)"> 删除 </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" style="text-align: center">
            <el-pagination
                v-model:current-page="listQuery.page"
                style="justify-content: center"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="40%"
            :close-on-click-modal="false"
            center
            top="2vh"
            @close="handleClose"
        >
            <el-form
                ref="form"
                :model="creatForm"
                :rules="rules"
                style="width: 90%; margin: auto"
                label-position="left"
                label-width="95px"
            >
                <el-form-item label="标题名称" prop="name">
                    <div>
                        <el-input v-model="creatForm.name" placeholder="请输入标题名称" />
                    </div>
                </el-form-item>
                <el-form-item label="知识库标签" prop="label">
                    <el-input v-model="creatForm.label" placeholder="请输入知识库标签" />
                </el-form-item>
                <el-form-item label="知识库类型" prop="type">
                    <el-select v-model="creatForm.type" placeholder="选择类型">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="岗位" prop="position">
                    <el-select v-model="creatForm.position" clearable placeholder="岗位">
                        <el-option v-for="item in options_station" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="问题">
                    <el-input v-model="keywords" placeholder="回车Enter添加问题" @keyup.enter="addKeyWord" />
                    <div class="flex-col">
                        <el-tag
                            v-for="tag in keywordList"
                            :key="tag.id"
                            class="mt-4"
                            type="warning"
                            closable
                            @close="keyWordClose(tag.keyword)"
                        >
                            {{ tag.keyword }}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="录音" prop="path">
                    <el-button
                        :type="recorderStatus ? 'danger' : 'warning'"
                        :icon="Microphone"
                        :round="true"
                        @mousedown.stop="recordFn"
                        @mouseup.stop="emptyTime"
                        @click.stop="playRecorder"
                    >
                        长按
                    </el-button>
                    <!-- 倒计时 -->
                    <span v-show="countDownTime && countDownNum !== 0" class="pull-right" style="margin-right: 10px">{{
                        countDownNum
                    }}</span>
                    <video ref="videoPlay" style="display: none" :src="creatForm.path" />
                </el-form-item>
                <el-form-item>
                    <template #label>
                        <div style="width: 52px; padding: 5px 8px">
                            <span>图文</span>
                            <el-button size="small" :icon="CirclePlus" type="warning" circle @click="addPath()" />
                        </div>
                    </template>
                    <div
                        v-for="(item, index) in imgPathList"
                        :key="item"
                        style="margin: 5px 0; width: 100%"
                        class="flex"
                    >
                        <div class="flex" style="margin-right: 10px; flex: 1">
                            <div style="width: 52px">
                                <span>备注：</span>
                                <el-button :icon="Remove" type="warning" circle @click="deletePath(index)" />
                            </div>
                            <el-input v-model="item.itext" type="textarea" :rows="4" />
                        </div>
                        <me-upload ref="UpLoadRef" v-model="item.ipath" :limit="1" :token="token" />
                    </div>
                </el-form-item>
                <el-form-item label="暂停时间" prop="pauseTime">
                    <div class="flex">
                        <div style="width: 100px; margin-right: 10px">
                            <el-input v-model.number="creatForm.pauseTime" />
                        </div>
                        <span class="juz">毫秒</span>
                    </div>
                    <div style="color: ccc">该暂停时间为等待用户响应时间</div>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="handleClose"> 取 消 </el-button>
                <el-button type="warning" @click="submitForm()"> 确 定 </el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ElLoading } from 'element-plus';
import Recorder from 'js-audio-recorder';
import * as qiniu from 'qiniu-js';
import { v4 } from 'uuid';
import { CirclePlus, Delete, Microphone, Remove, Edit, Search, Upload, Coordinate } from '@element-plus/icons-vue';
import {
    createKnowledge,
    updateKnowledge,
    sreachKnowledge,
    delKnowledge,
    exportApi,
    updateCheckTime,
} from '@/api/modules/operationMang/knowledgeBase';
import { getStation } from '@/api/modules/controlConsole/stationMan';
import { qiNiuToken } from '@/api/qiniu';
import { parseTime } from '@/utils/mineUtils';

const {
    proxy: { $tips, $confirmBox },
} = getCurrentInstance() as any;

const uuid = v4;

const state = reactive<Record<string, any>>({
    options_station: [],
    imgPathList: [
        {
            ipath: [],
            itext: '',
        },
    ] as { ipath: []; itext: string }[],
    tableData: [],
    listQuery: {
        limit: 20,
        page: 1,
    },
    creatForm: {
        pauseTime: 3000,
        path: '',
    },
    listLoading: false,
    dialogVisible: false,
    dialogTitle: '添加知识库',
    total: 0,
    options: [
        {
            value: 0,
            label: '普通',
        },
        {
            value: 1,
            label: '业务问题',
        },
        {
            value: 2,
            label: '肯定',
        },
        {
            value: 3,
            label: '否定',
        },
        {
            value: 4,
            label: '拒绝',
        },
        {
            value: 5,
            label: '中性',
        },
        {
            value: 6,
            label: '未识别',
        },
        {
            value: 7,
            label: '重复',
        },
        {
            value: 8,
            label: '用户未说话',
        },
        {
            value: 9,
            label: '无法回答',
        },
        {
            value: 10,
            label: '无法回答次数',
        },
    ],
    Loop: null, // 长按
    countDownTime: null, // 倒计时
    countDownNum: 3,
    recorderStatus: false, // 录音状态
    recorder: null,
    baseurl: 'http://pic.hzjiuwang.com',
    filePercent: 0,
    firstTime: 0,
    lastTime: 0,
    // 定义一个开始时间和结束时间
    eventFlag: false,
    token: null,
    rules: {
        name: [{ required: true, message: '请输入标题名称', trigger: 'blur' }],
        label: [{ required: true, message: '请输入知识库标签', trigger: 'blur' }],
        keyword: [{ required: true, message: '请输入关键词', trigger: 'blur' }],
        pauseTime: [{ required: true, message: '请输入暂停时间', trigger: 'blur' }],
        // path: [
        //     {
        //         required: true,
        //         message: '请长按录音，上传录音文件！！！',
        //         trigger: 'click',
        //     },
        // ],
        type: [{ required: true, message: '请选择知识库类型', trigger: 'change' }],
        position: [{ required: true, message: '请选择岗位', trigger: 'change' }],
    },
    ids: null,
    keywordList: [],
});
const UpLoadRef = ref();
const form = ref();
const videoPlay = ref();
const keywords = ref('');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const filterCount = (str: string): number => str.split(',').length;
const deletePath = (index: number) => {
    if (state.imgPathList.length == 1) return;
    state.imgPathList.splice(index, 1);
};
const addPath = () => {
    state.imgPathList.push({
        ipath: [],
        itext: '',
    });
};
// 添加问题
const addKeyWord = () => {
    if (!keywords.value) return $tips('warning', '请先输入问题！！！');
    state.keywordList.push({
        id: new Date().getTime() / 1000 + state.keywordList.length,
        keyword: keywords.value,
    });
    keywords.value = '';
};
// 删除问题
const keyWordClose = (keyword: string) => {
    state.keywordList.splice(state.keywordList.indexOf(keyword), 1);
};

const expressExcel = () => {
    $confirmBox('是否确认导出？', '确定', 'warning')
        .then(() => {
            const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: '.main',
            });
            exportApi().then((response) => {
                if (response.status == 200) {
                    const blob = new Blob([response.data]); // 创建一个blob对象
                    const a = document.createElement('a'); // 创建一个<a></a>标签
                    a.href = URL.createObjectURL(blob); // response is a blob
                    a.download = `知识库.txt`; // 文件名称
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } else {
                    $tips('error', response.data.msg);
                }
                loading.close();
            });
        })
        .catch(() => null);
};
// 批量删除
const batchDel = () => {
    if (!state.ids) return $tips('warning', '请先选择下列数据！！！');
    $confirmBox('此操作将永久删除, 是否继续?', '确定', 'warning')
        .then(() => {
            delKnowledge(state.ids).then((res: { data: { status: number; msg: any } }) => {
                if (res.data.status === 200) {
                    state.ids.split('-').forEach((item: any) => {
                        state.tableData = state.tableData.filter((i: any) => i.id !== Number(item));
                    });
                    $tips('success', '删除成功!');
                } else {
                    $tips('error', res.data.msg);
                }
            });
        })
        .catch(() => null);
};
const del = (row: { id: any }) => {
    $confirmBox('此操作将永久删除, 是否继续?', '确定', 'warning')
        .then(() => {
            delKnowledge(row.id).then((res: { data: { status: number; msg: any } }) => {
                if (res.data.status === 200) {
                    state.tableData.splice(state.tableData.indexOf(row), 1);
                    $tips('success', '删除成功!');
                } else {
                    $tips('error', res.data.msg);
                }
            });
        })
        .catch(() => null);
};
const updataSort = (row: { id: any; sort: any }) => {
    updateKnowledge(row).then((res: { data: { status: number; msg: any } }) => {
        if (res.data.status === 200) {
            $tips('success', res.data.msg);
            state.tableData.forEach((item: { id: any; sort: any }) => {
                if (item.id === row.id) {
                    // eslint-disable-next-line no-param-reassign
                    item.sort = row.sort;
                }
            });
        } else {
            $tips('error', res.data.msg);
        }
    });
};
const getList = () => {
    state.listLoading = true;
    sreachKnowledge(state.listQuery).then((res: { data: { data: { records: never[]; total: number } } }) => {
        state.tableData = res.data.data.records;
        state.total = res.data.data.total;
        state.listLoading = false;
    });
};
const updateCheck = () => {
    updateCheckTime().then((res) => {
        if (res.data.status === 200) {
            $tips('success', res.data.msg);
            getList();
        } else {
            $tips('error', res.data.msg);
        }
    });
};
const dialogFn = (row: any) => {
    if (state.imgPathList.length == 0) {
        addPath();
    }
    console.log(row);
    if (row) {
        state.creatForm = row;
        state.keywordList = row.keyword.split(',').map((item: string, index: number) => {
            return {
                id: index,
                keyword: item,
            };
        });
        console.log(state.keywordList);

        if (row.imgPath) {
            state.imgPathList = [];
            (JSON.parse(row.imgPath) as any[]).forEach((item) => {
                state.imgPathList.push({
                    ipath: item.ipath ? [{ realurl: item.ipath }] : [],
                    itext: item.itext || '',
                });
            });
        }
        state.dialogTitle = '编辑知识库';
    } else {
        state.dialogTitle = '添加知识库';
    }
    state.dialogVisible = true;
};
const handleSelectionChange = (val: any[] | string) => {
    if (val) {
        state.ids = (val as { id: string }[]).map((item) => item.id).join('-');
    } else {
        state.ids = null;
    }
};

const handleClose = () => {
    form.value.clearValidate();
    state.dialogVisible = false;
    state.creatForm = {
        pauseTime: 3000,
        path: '',
    };
    state.recorderStatus = false; // 录音状态
    state.recorder = null;
    state.imgPathList = [];
    state.keywordList = [];
};
const handleSizeChange = (val: number) => {
    state.listQuery.limit = val;
    getList();
};
const handleCurrentChange = (val: number) => {
    state.listQuery.page = val;
    getList();
};
const uploadFile = (file: File) => {
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
    const key = `${new Date().getTime()}_${uuid()}`;
    //   实例化七牛云的上传实例
    const observable = qiniu.upload(file, key, state.token, putExtra, config);
    //   设置实例的监听对象
    const observer = {
        //   接收上传进度信息
        next(res: { total: { percent: string } }) {
            // 上传进度
            // eslint-disable-next-line radix
            state.filePercent = parseInt(res.total.percent);
            if (state.filePercent == 100) {
                $tips('success', '上传录音成功！！！');
            }
        },
        // 接收上传错误信息
        error(err: any) {
            console.log(err);
        },
        // 接收上传完成后的信息
        complete(res: { key: any }) {
            // 拼接路径字符串
            state.creatForm.path = `${state.baseurl}/${res.key}`;
            console.log(state.creatForm.path);
        },
    };
    // 上传开始
    observable.subscribe(observer);
};
const clear = () => {
    clearInterval(state.countDownTime);
    clearTimeout(state.Loop);
    state.countDownTime = null;
    state.countDownNum = 3;
};
// 播放录音
const playRecorder = () => {
    clear();
    if (!state.recorderStatus && state.eventFlag) {
        console.log('点击');
        if (state.creatForm.path) return videoPlay.value.play();
        if (!state.recorder) return $tips('warning', '没有缓存录音！！！');
        state.recorder.play();
        clearInterval(state.countDownTime);
        clearTimeout(state.Loop);
        state.countDownTime = null;
        state.Loop = null;
        state.countDownNum = 3;
    }
};

// 倒计时录音
const countDown = () => {
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
};
// 长按录音
const recordFn = () => {
    state.firstTime = new Date().getTime();
    clearTimeout(state.Loop); // 再次清空定时器，防止重复注册定时器
    state.Loop = null;
    state.Loop = setTimeout(() => {
        countDown();
    }, 1000);
};
const emptyTime = () => {
    state.lastTime = new Date().getTime();
    // 如果这个时间差小于300  ，就把锁打开
    // eslint-disable-next-line no-return-assign
    if (state.lastTime - state.firstTime < 3000) return (state.eventFlag = true);
    console.log('抬起');
    clearTimeout(state.Loop); // 清空定时器，防止重复注册定时器
    clearInterval(state.countDownTime);
    state.countDownTime = null;
    state.Loop = null;
    state.countDownNum = 3;
    state.eventFlag = false;
    if (state.recorder) {
        state.recorder.stop();
        state.recorderStatus = false;
        uploadFile(state.recorder.getWAVBlob());
    }
};
const submitForm = () => {
    state.creatForm.ipathVos = [];
    state.imgPathList.forEach((item: { ipath: { realurl: string }[]; itext: string }) => {
        if (item.ipath || item.itext) {
            state.creatForm.ipathVos.push({
                ipath: item.ipath[0] ? item.ipath[0].realurl : '',
                itext: item.itext,
            });
        }
    });
    state.creatForm.keyword = state.keywordList.map((item: { keyword: any }) => item.keyword).join(',');
    form.value.validate((valid: any) => {
        if (valid) {
            (state.dialogTitle === '添加知识库' ? createKnowledge : updateKnowledge)(state.creatForm).then(
                (res: { data: { status: number; msg: any } }) => {
                    if (res.data.status === 200) {
                        getList();
                        handleClose();
                        $tips('success', res.data.msg);
                    } else {
                        $tips('error', res.data.msg);
                    }
                },
            );
        } else {
            console.log('error submit!!');
            return false;
        }
    });
};
const addTableIndex = () => {
    const table = document.querySelector('.el-table__body-wrapper') as HTMLDivElement;
    const tableSelect = table.getElementsByClassName('el-table-column--selection');
    const arr = Array.from(tableSelect);
    arr.forEach((item: any, index) => {
        if (item.childNodes.length == 2) {
            item.removeChild(item.lastChild);
        }
        const span = document.createElement('span') as HTMLSpanElement;
        span.innerText = `${index + 1}`;
        item.appendChild(span);
    });
};
const getQiNiuToken = () => {
    qiNiuToken().then((res) => {
        state.token = res.data.data;
    });
};
onUpdated(() => {
    addTableIndex();
});
onActivated(() => {
    getStation().then((res) => {
        state.options_station = res.data.data;
    });
    getQiNiuToken();
    getList();
});
const {
    options_station,
    tableData,
    listQuery,
    listLoading,
    total,
    dialogVisible,
    dialogTitle,
    creatForm,
    rules,
    options,
    recorderStatus,
    countDownTime,
    countDownNum,
    token,
    imgPathList,
    keywordList,
} = toRefs(state);
</script>
<style lang="scss" scoped>
.knowledgeBase {
    padding: 20px;

    .header {
        padding-right: 20px;
        span {
            font-size: 14px;
        }
    }
}
</style>
