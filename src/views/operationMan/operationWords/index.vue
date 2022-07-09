<!--
 * @Author: your name
 * @Date: 2022-03-30 14:17:46
 * @LastEditTime: 2022-07-09 17:18:56
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\verbalTRStock\index.vue
-->
<template>
    <!-- <div class="operationWords" style="--el-color-primary:#F39C12"> -->
    <div class="operationWords">
        <!-- <div style="padding: 0 20px">
            <el-button type="warning" :icon="User" @click="dialogFn('selectAdmain')">选择用户</el-button>
            <span v-if="userInfo && userObj.checked" style="margin: 0 20px">用户：{{ userInfo.userName }}</span>
        </div> -->
        <div class="flex">
            <div class="operation_btn">
                <div style="text-align: center">
                    <el-button type="primary" :icon="CirclePlus" @click="dialogFn('add')">添加 </el-button>
                </div>
                <el-scrollbar height="85vh" wrap-style="padding:0 20px">
                    <el-card
                        v-for="(o, index) in trickList"
                        :key="o.id"
                        :class="cardIndex === index ? `box-card border-card` : 'box-card'"
                    >
                        <div style="padding: 20px 10px" @click="selectCard(index)">
                            <div class="box-fn">
                                <span @click.stop="dialogFn('edit', o)">编辑</span>
                                <span @click.stop="deteleTrick(o, index)">删除</span>
                            </div>
                            <div style="font-size: 14px">{{ o.name }}</div>
                        </div>
                    </el-card>
                </el-scrollbar>
            </div>
            <div id="NodeRelation" style="flex: 1">
                <div ref="plumb_header" class="plumb_header flex">
                    <div ref="kongtiao" @mousedown="mouseDownHandleelse($event)">
                        <el-button type="primary" :icon="Expand">流程节点</el-button>
                    </div>
                    <el-button type="primary" style="margin: 0 20px" :icon="CollectionTag" @click="preserve()"
                        >保存
                    </el-button>
                    <el-button type="primary" :icon="CopyDocument" @click="dialogFn('copy')"> 复制话术</el-button>
                    <el-button-group class="ml-4">
                        <el-tooltip class="box-item" effect="dark" content="放大" placement="top-start">
                            <el-button type="primary" :icon="ZoomIn" @click="scaleFn('ZoomIn')" />
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="dark" content="缩小" placement="top-start">
                            <el-button type="primary" :icon="ZoomOut" @click="scaleFn('ZoomOut')" />
                        </el-tooltip>
                    </el-button-group>
                    <el-button type="primary" class="ml-4" :icon="CirclePlus" @click="dialogFn('addKonwledgeBase')">
                        添加知识库</el-button
                    >
                </div>
                <div class="diagramContainer-warp">
                    <div class="diagramContainer_content" @mousemove="mousemoveHandler">
                        <div v-if="listShow" id="diagramContainer">
                            <Node
                                v-for="item in list"
                                :key="item.id"
                                :scenarios-info="scenariosInfoFn"
                                :is-preserve="isPreserve"
                                :data-obj="item"
                                :token="updatatoken"
                                @mouseup="mouseup(item.id)"
                                @get-info="getInfo"
                                @del-node-fn="delNodeFn"
                            />
                        </div>
                    </div>
                </div>
                <div class="move_view">
                    <div style="width: 100%; height: 100%; position: relative" class="move_lookWarp">
                        <div class="move_lookView"></div>
                        <span
                            v-for="item in list"
                            :id="`move_span${item.id}`"
                            :key="item.id"
                            class="dian"
                            :style="`top:${positionXY(item.position).x}px;left:${positionXY(item.position).y}px ;`"
                        ></span>
                    </div>
                </div>
                <p class="move_position">X:{{ movePosition.x }}, Y:{{ movePosition.y }}</p>
            </div>
        </div>
        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="30%"
            :close-on-click-modal="false"
            @close="handleClose"
        >
            <!-- 选择用户 -->
            <!-- <div v-if="dialogType == 'selectAdmain'">
                <div class="flex">
                    <div style="margin: 0 20px">
                        <el-input v-model="userObj.mobile" placeholder="请输入用户手机号"></el-input>
                    </div>
                    <div>
                        <el-button type="success" @click="searchUser">搜索</el-button>
                    </div>
                </div>
                <div style="margin: 20px">
                    <el-checkbox v-if="userInfo" ref="userCheckox">{{ userInfo.userName }}</el-checkbox>
                </div>
                <p style="text-align: right; padding: 20px 20px 0">
                    <el-button type="primary" @click="searchAffirm">确 定</el-button>
                </p>
            </div> -->
            <!-- 添加话术 -->
            <div v-if="dialogType === 'add' || dialogType === 'edit'">
                <div class="flex">
                    <span class="juz">话术名称：</span>
                    <div>
                        <el-input v-model="trickName"></el-input>
                    </div>
                </div>

                <p style="text-align: right; padding: 20px 20px 0">
                    <el-button type="primary" @click="addTrick">确 定</el-button>
                </p>
            </div>
            <div v-if="dialogType === 'copy'">
                <div class="flex">
                    <span class="juz">新话术名称：</span>
                    <div>
                        <el-input v-model="newTrickName"></el-input>
                    </div>
                </div>
                <p style="text-align: right; padding: 20px 20px 0">
                    <el-button type="primary" @click="copyFlowFn">确 定</el-button>
                </p>
            </div>
            <div v-if="dialogType === 'addKonwledgeBase'">
                <el-checkbox-group v-model="knowledgeIds" class="flex-col">
                    <el-checkbox v-for="item in knowledgeList" :key="item.id" :label="item.id">{{
                        item.name
                    }}</el-checkbox>
                </el-checkbox-group>
                <p style="text-align: right; padding: 20px 20px 0">
                    <el-button type="primary" @click="addKnowledge">添 加</el-button>
                </p>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElLoading } from 'element-plus';
import { CirclePlus, CopyDocument, Expand, CollectionTag, ZoomIn, ZoomOut } from '@element-plus/icons-vue';
import {
    createScenarios,
    sreachScenarios,
    updateScenarios,
    delScenarios,
    saveNodeRelation,
    getNodeRelation,
    copyFlow,
    addKnowledges,
    getScenariosById,
} from '@/api/modules/operationMang/operationword';
import { sreachKnowledge } from '@/api/modules/operationMang/knowledgeBase';
import { qiNiuToken } from '@/api/qiniu';
import Node from './Node.vue';

const {
    proxy: { $tips, $plumbIns },
} = getCurrentInstance() as any;
const route = useRoute();
const plumb_header = ref();
const kongtiao = ref();
// const userCheckox = ref();
const state = reactive<{ [propName: string]: any }>({
    list: [],
    userObj: {
        mobile: '18270811535',
        checked: false,
    },
    cloneDiv: null,
    userInfo: null,
    dialogVisible: false,
    dialogTitle: '',
    dialogType: '',
    cardIndex: 0,
    trickList: [], // 话术列表
    trickName: '',
    newTrickName: '',
    isPreserve: false, // 是否保存
    contentPosition: {
        left: -3000,
        top: -3000,
    },
    moveDataelse: {
        x: null,
        y: null,
    },
    movePosition: {
        x: null,
        y: null,
    },
    dataList: [],
    timer: null, // 保存限时
    count: 10,
    countTime: null,
    scenariosId: null,
    loading: null,
    updatatoken: null,
    scale: 1, // 缩放
    firstTime: 0,
    lastTime: 0,
    eventFlag: false,
    Loop: null, // 长按
    countDownTime: null, // 倒计时
    listShow: true,
    knowledgeList: [],
    knowledgeIds: [],
});
const getQiNiuToken = (): void => {
    qiNiuToken().then((res: { data: { data: null } }) => {
        state.updatatoken = res.data.data;
    });
};

const sreachKnowledgeFn = () => {
    sreachKnowledge({}).then((res) => {
        state.knowledgeList = res.data.data.records || [];
    });
};
const scenariosInfoFn = computed(() => {
    let scenariosInfo = {};
    state.trickList.forEach((item: any, index: number) => {
        if (index === state.cardIndex) {
            scenariosInfo = item;
            state.scenariosId = item.id;
        }
    });
    return scenariosInfo;
});
const positionXY = (str: string) => {
    return {
        x: Number(str.split(',')[0]) / 50,
        y: Number(str.split(',')[1]) / 50,
    };
};
const mouseup = (id: number | string) => {
    nextTick(() => {
        const node_move = document.querySelector(`.node_move${id}`) as HTMLElement;
        const top = node_move?.style.top.substring(0, node_move.style.top.indexOf('px'));
        const left = node_move?.style.left.substring(0, node_move.style.left.indexOf('px'));
        state.list.forEach((item: any) => {
            if (item.id === id) {
                // eslint-disable-next-line no-param-reassign
                item.position = `${top},${left}`;
            }
        });
    });
};
const delNodeFn = (id: any) => {
    document.getElementById(`move_span${id}`)?.remove();
};
// 保存限制
function preserveLimit() {
    let heelNode = 0; // 根节点数量
    // 未创建数据 [[],[]]  创建数据类型[{}]
    try {
        state.dataList.forEach((item: any) => {
            // 创建过得节点
            if (Object.prototype.toString.call(item) === '[object Object]') {
                if (!item.sourceId) {
                    // eslint-disable-next-line no-plusplus
                    heelNode++;
                }
                item.branchList.forEach((row: any) => {
                    if (!row.nextFlowId) {
                        $tips('error', '子节点必须都连上线!!!');
                        throw Error('跳出循环！！！');
                    }
                    // eslint-disable-next-line no-param-reassign
                    row.nextFlowId = Number(row.nextFlowId.replace('node_main', ''));
                });
            } else {
                // 没创建过得节点
                item.forEach((row: any) => {
                    if (row.id.length > 12) {
                        $tips('error', '存在未创建节点!!!');
                        throw Error('跳出循环！！！');
                    }
                    // 只有一个根节点
                    if (row.id.indexOf('node_main') !== -1 && !row.info) {
                        // eslint-disable-next-line no-plusplus
                        heelNode++;
                    }
                    // 子节点必须 都连上线
                    if (row.id.indexOf('node_tags') !== -1 && !row.info) {
                        $tips('error', '子节点必须都连上线!!!');
                        throw Error('跳出循环！！！');
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
        return;
    }
    if (heelNode != 1) return $tips('error', '必须只有一个根节点!!!');
    const arr = state.dataList.filter((item: any) => Object.prototype.toString.call(item) === '[object Object]');
    // 获取pid 根节点
    arr.forEach((item: any) => {
        if (item.sourceId) {
            const myId = Number(item.sourceId.replace('node_tags', ''));
            arr.forEach((row: any) => {
                if (row.branchList.some((obj: any) => obj.id == myId)) {
                    // eslint-disable-next-line no-param-reassign
                    item.pid = row.id;
                }
            });
        }
    });
    saveNodeRelation(arr).then((res) => {
        if (res.data.status === 200) {
            $tips('success', res.data.msg);
        } else {
            $tips('error', res.data.msg);
        }
    });
}
// 保存
function preserve() {
    state.isPreserve = true;
    // 限制
    nextTick(() => {
        if (!state.timer) {
            preserveLimit();
            state.timer = setTimeout(() => {
                state.isPreserve = false;
                clearTimeout(state.timer);
                state.timer = null;
                state.dataList = [];
            }, 1000 * 10);
            state.countTime = setInterval(() => {
                // eslint-disable-next-line no-plusplus
                state.count--;
                if (state.count == 0) {
                    clearInterval(state.countTime);
                    state.count = 10;
                }
            }, 1000);
        } else {
            $tips('warning', `还剩${state.count}s 可以保存！！！`);
        }
    });
}

// 获取信息
function getInfo(data: any) {
    // if (Object.prototype.toString.call(data) === '[object Object]') return state.dataList.push(data);
    state.dataList.push(data);
}
// 移动小视图
function move_view() {
    const warp = document.getElementsByClassName('diagramContainer-warp')[0] as HTMLDivElement;
    const lookView = document.getElementsByClassName('move_lookView')[0] as HTMLDivElement;
    const content = document.getElementsByClassName('diagramContainer_content')[0] as HTMLDivElement;
    const moveView = document.getElementsByClassName('move_view')[0] as HTMLDivElement;
    moveView.style.width = `${content.clientWidth / 50}px`;
    moveView.style.height = `${content.clientHeight / 50}px`;
    lookView.style.cssText += `width:${warp.clientWidth / 50}px;height:${warp.clientHeight / 50}px;top:${
        3000 / 50
    }px;left:${3000 / 50}px;`;
    if (!window.onresize) {
        window.onresize = move_view;
    }
}
function drogInit() {
    const content = document.getElementsByClassName('diagramContainer_content')[0] as any;
    content.style.top = `${-3000}px`;
    content.style.left = `${-3000}px`;
    move_view();
}
// 选择话术
function selectCard(index: number) {
    // eslint-disable-next-line no-use-before-define
    if (cardIndex.value == index) return;
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: '#NodeRelation',
    });
    state.scenariosId = '';
    state.cardIndex = index;
    state.list = [];
    state.listShow = false;
    state.trickList.forEach((item: any, index: number) => {
        if (index === state.cardIndex) {
            state.scenariosId = item.id;
        }
    });
    if (!state.scenariosId) {
        loading.close();
        nextTick(() => {
            state.listShow = true;
        });
        return;
    }
    getNodeRelation(state.scenariosId).then((res) => {
        if (res.data.status === 200) {
            state.list = res.data.data || [];
            $tips('success', '获取成功！！！');
            nextTick(() => {
                drogInit();
                getQiNiuToken();
            });
            loading.close();
            state.listShow = true;
        } else {
            $tips('error', res.data.msg);
            loading.close();
            state.listShow = true;
        }
    });
}
// 删除话术
function deteleTrick(o: { id: string | number }, index: number) {
    ElMessageBox.confirm('此操作将永久删除该话术, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            delScenarios(o.id).then((res) => {
                if (res.data.status === 200) {
                    state.trickList.splice(index, 1);
                    $tips('success', res.data.msg);
                    if (state.cardIndex == index) {
                        selectCard(0);
                    }
                } else {
                    $tips('error', res.data.msg);
                }
            });
        })
        .catch(() => null);
}

function drog() {
    const warp = document.getElementsByClassName('diagramContainer-warp')[0] as any;
    const content = document.getElementsByClassName('diagramContainer_content')[0] as any;
    const lookView = document.getElementsByClassName('move_lookView')[0] as any;
    const lookWarp = document.getElementsByClassName('move_lookWarp')[0] as any;
    // 鼠标按下
    content.addEventListener('mousedown', (e: MouseEvent) => {
        if (content.setCapture) {
            // IE低版本
            content.setCapture();
        }
        // eslint-disable-next-line no-param-reassign
        e = e || window.event;
        // 鼠标相对于盒子的位置
        const offsetX = e.clientX - content.offsetLeft;
        const offsetY = e.clientY - content.offsetTop;
        // 鼠标移动
        // eslint-disable-next-line func-names
        document.onmousemove = function (e) {
            // eslint-disable-next-line no-param-reassign
            e = e || window.event;
            const left = Math.max(Math.min(e.clientX - offsetX, 0), -(content.clientWidth - warp.clientWidth));
            const top = Math.max(Math.min(e.clientY - offsetY, 0), -(content.clientHeight - warp.clientHeight));
            state.contentPosition.left = left;
            state.contentPosition.top = top;
            content.style.left = `${left}px`;
            content.style.top = `${top}px`;
            lookView.style.left = `${-left / 50}px`;
            lookView.style.top = `${-top / 50}px`;
        };
        // 鼠标抬起
        // eslint-disable-next-line func-names
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            if (content.releaseCapture) {
                content.releaseCapture(); // 释放全局捕获
            }
        };
        return false; // 标准浏览器的默认行为
    });
    lookView.addEventListener('mousedown', (e: MouseEvent) => {
        if (lookView.setCapture) {
            // IE低版本
            lookView.setCapture();
        }
        // eslint-disable-next-line no-param-reassign
        e = e || window.event;
        // 鼠标相对于盒子的位置
        const offsetX = e.clientX - lookView.offsetLeft;
        const offsetY = e.clientY - lookView.offsetTop;
        // 鼠标移动
        // eslint-disable-next-line func-names
        document.onmousemove = function (e) {
            // eslint-disable-next-line no-param-reassign
            e = e || window.event;
            const left = Math.min(Math.max(e.clientX - offsetX, 0), lookWarp.clientWidth - lookView.clientWidth);
            const top = Math.min(Math.max(e.clientY - offsetY, 0), lookWarp.clientHeight - lookView.clientHeight);

            lookView.style.left = `${left}px`;
            lookView.style.top = `${top}px`;
            content.style.left = `${-left * 50}px`;
            content.style.top = `${-top * 50}px`;
        };
        // 鼠标抬起
        // eslint-disable-next-line func-names
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            if (lookView.releaseCapture) {
                lookView.releaseCapture(); // 释放全局捕获
            }
        };
        return false; // 标准浏览器的默认行为
    });
}

const searchAffirm = () => {
    const loadingInstance = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(122, 122, 122, 0.8)',
        target: document.querySelector('.operationWords') as HTMLElement,
    });
    sreachScenarios({}).then((res) => {
        if (res.data.status === 200) {
            state.trickList = res.data.data;
            state.dialogVisible = false;
            if (state.trickList.length == 0) {
                loadingInstance.close();
                nextTick(() => {
                    drog();
                    move_view();
                });
                return;
            }
            // state.userObj.checked = userCheckox.value.model;
            state.scenariosId = state.trickList[0].id;
            const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: '#NodeRelation',
            });
            getNodeRelation(state.scenariosId).then((res) => {
                if (res.data.status === 200) {
                    state.list = res.data.data || [];
                    $tips('success', '获取成功！！！');
                    nextTick(() => {
                        drog();
                        move_view();
                    });
                } else {
                    $tips('error', res.data.msg);
                }
                loading.close();
            });
        } else {
            $tips('error', res.data.msg);
        }
        loadingInstance.close();
    });
};
// function searchUser() {
//     const loading = ElLoading.service({
//         lock: true,
//         text: 'Loading',
//         background: 'rgba(0, 0, 0, 0.7)',
//         target: '.el-dialog',
//     });
//     getUserByPhone(state.userObj.mobile).then((res) => {
//         if (res.data.status === 200) {
//             state.userInfo = res.data.data;
//         } else {
//             $tips('error', res.data.msg);
//         }
//         loading.close();
//     });
// }
// 查询话术
function searchScenar() {
    sreachScenarios({}).then((res) => {
        if (res.data.status === 200) {
            state.trickList = res.data.data;
        } else {
            $tips('error', res.data.msg);
        }
    });
}
// 添加话术 和 编辑
function addTrick() {
    if (!state.trickName) return $tips('warning', '请输入话术名称！！！');

    if (state.dialogType === 'add') {
        createScenarios({
            name: state.trickName,
        }).then((res) => {
            if (res.data.status === 200) {
                $tips('success', res.data.msg);
                searchScenar();
                state.dialogVisible = false;
                selectCard(state.trickList.length);
            } else {
                $tips('error', res.data.msg);
            }
        });
    } else if (state.dialogType === 'edit') {
        const obj: any = {
            name: state.trickName,
        };
        obj.id = state.trickList.find((item: any) => item.isChecked).id;
        updateScenarios(obj).then((res) => {
            if (res.data.status === 200) {
                $tips('success', res.data.msg);
                state.trickList.forEach((item: any) => {
                    // eslint-disable-next-line no-return-assign, no-param-reassign
                    if (obj.id === item.id) return (item.name = obj.name);
                });
                state.dialogVisible = false;
            } else {
                $tips('error', res.data.msg);
            }
        });
    }
}
function dialogFn(type: string, row: any = '') {
    state.dialogType = type;
    switch (type) {
        case 'selectAdmain':
            state.dialogTitle = '选择用户';
            state.userObj.checked = false;
            state.userInfo = null;
            state.list = [];
            break;
        case 'add':
            state.dialogTitle = '添加话术';
            break;
        case 'edit':
            state.dialogTitle = '编辑话术';
            state.trickName = row.name;
            state.trickList.forEach((item: any) => {
                if (item.id === row.id) {
                    // eslint-disable-next-line no-param-reassign
                    item.isChecked = true;
                } else {
                    // eslint-disable-next-line no-param-reassign
                    item.isChecked = false;
                }
            });
            break;
        case 'copy':
            state.dialogTitle = '复制话术';
            break;
        case 'addKonwledgeBase':
            state.dialogTitle = '添加知识库';
            if (!state.scenariosId) return $tips('warning', '请先选择话术！！！');
            getScenariosById(state.scenariosId).then((res) => {
                state.knowledgeIds = res.data.data
                    ? JSON.parse(res.data.data.knows).map((item: string) => Number(item))
                    : [];
            });
            break;
        default:
            break;
    }
    state.dialogVisible = true;
}
// 添加知识库
function addKnowledge() {
    // if (state.knowledgeIds.length == 0) return $tips('warning', '请先选择知识库');
    addKnowledges({ ids: state.knowledgeIds, scenarios: state.scenariosId }).then((res) => {
        if (res.data.status == 200) {
            $tips('success', res.data.msg);
            state.dialogVisible = false;
        } else {
            $tips('success', res.data.msg);
        }
    });
}
// 提交复制
function copyFlowFn() {
    if (!state.newTrickName) return $tips('warning', '请输入复制话术名称！！！');
    copyFlow({ id: state.scenariosId, name: state.newTrickName }).then((res) => {
        if (res.data.status === 200) {
            $tips('success', res.data.msg);
            searchScenar();
            state.dialogVisible = false;
        } else {
            $tips('error', res.data.msg);
        }
    });
}
function handleClose() {
    state.trickName = '';
    state.dialogVisible = false;
    state.newTrickName = '';
    state.knowledgeIds = [];
}
function mouseMoveHandleelse(event: { pageX: number; pageY: number }) {
    const moveLeft = `${event.pageX - state.moveDataelse.x}px`;
    const moveTop = `${event.pageY - state.moveDataelse.y}px`;
    state.cloneDiv.style.left = moveLeft;
    state.cloneDiv.style.top = moveTop;
}
function mouseDownHandleelse(event: { pageX: number; pageY: number }) {
    state.cloneDiv = kongtiao.value.cloneNode(true);
    state.cloneDiv.style.position = 'absolute';
    state.cloneDiv.style.zIndex = '999999';
    plumb_header.value.appendChild(state.cloneDiv);
    state.moveDataelse.x = event.pageX - state.cloneDiv.offsetLeft;
    state.moveDataelse.y = event.pageY - state.cloneDiv.offsetTop;
    state.cloneDiv.style.cursor = 'move';
    window.onmousemove = mouseMoveHandleelse;
}

function windowMouseup() {
    window.onmousemove = null;
    nextTick(() => {
        if (state.cloneDiv) {
            const parents = document.getElementsByClassName('diagramContainer-warp')[0] as any;
            const topP = parents?.offsetTop || 0; // 可视区的top
            const leftP = parents?.offsetLeft || 0; // 可视区的left
            const btnT = state.cloneDiv.offsetTop; // 距离父元素的top
            const btnL = state.cloneDiv.offsetLeft; // 距离父元素的left
            if (btnT <= topP || btnL <= leftP) {
                $tips('warning', '不在区域内！！！');
                state.cloneDiv.remove();
                state.cloneDiv = null;
                return;
            }
            state.list.push({
                id: state.list.length,
                position: `${btnT - state.contentPosition.top - 70},${btnL - state.contentPosition.left}`,
            });
            state.cloneDiv.remove(); // 删除
            state.cloneDiv = null;
        }
    });
}

function zoom(scale: any) {
    const dom = document.getElementsByClassName('diagramContainer_content')[0] as any;
    const move_view = document.getElementsByClassName('move_view')[0] as any;
    dom.style.cssText = `-webkit-transform: scale(${scale});
    -moz-transform:scale(${scale});
         -ms-transform: scale(${scale});
         -o-transform: scale(${scale});
         transform: scale(${scale});
         transform-origin: ${state.movePosition.x}px ${state.movePosition.y}px;
         `;
    move_view.style.cssText += `-webkit-transform: scale(${scale});
    -moz-transform:scale(${scale});
         -ms-transform: scale(${scale});
         -o-transform: scale(${scale});
         transform: scale(${scale});
         transform-origin: ${state.movePosition.x / 50}px ${state.movePosition.y / 50}px;
         `;
    $plumbIns.setZoom(0.75);
}
// 缩放
const scaleFn = (type: string) => {
    switch (type) {
        // 放大
        case 'ZoomIn':
            state.scale = Math.min((state.scale += 0.1), 1.5);
            break;
        // 缩小
        case 'ZoomOut':
            state.scale = Math.max(0.7, (state.scale -= 0.1));
            break;
        default:
            break;
    }
    zoom(state.scale.toFixed(2));
};
const mousemoveHandler = (event: any) => {
    if (event.target?.id == 'diagramContainer') {
        state.movePosition = {
            x: event.offsetX,
            y: event.offsetY,
        };
    }
};

watchEffect(() => {
    if (state.list.length == 0) {
        window.onresize = null;
    } else {
        $plumbIns.bind('dblclick', (conn: any) => {
            ElMessageBox.confirm('确定删除所点击的链接吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    $plumbIns.deleteConnection(conn);
                    $tips('success', '删除成功!');
                })
                .catch(() => null);
        });
    }
});

watch(
    () => route.path,
    (o) => {
        if (o != '/operationMan/operationWords') {
            window.onresize = null;
        } else if (!window.onresize) {
            window.onresize = move_view;
        }
    },
);

onMounted(() => {
    sreachKnowledgeFn();
    getQiNiuToken();
    searchAffirm();
    window.onmouseup = windowMouseup;
    $plumbIns.ready(() => {
        $plumbIns.setSuspendDrawing(false, true);
        $plumbIns.importDefaults({
            ConnectionsDetachable: false,
        });
    });
});

const {
    list,
    dialogVisible,
    newTrickName,
    dialogType,
    trickName,
    dialogTitle,
    isPreserve,
    cardIndex,
    trickList,
    updatatoken,
    movePosition,
    listShow,
    knowledgeList,
    knowledgeIds,
} = toRefs(state);
</script>

<style lang="scss" scoped>
.operationWords {
    padding: 0 20px;

    .operation_btn {
        margin: 20px 20px 0 0;
        border-right: 1px solid #ccc;
    }

    .diagramContainer-warp {
        height: 80vh;
        overflow: hidden;
        position: relative;

        // &:hover {
        //     overflow: auto;
        // }

        // &::-webkit-scrollbar {
        //     /*滚动条整体样式*/
        //     width: 4px;
        //     /*高宽分别对应横竖滚动条的尺寸*/
        //     height: 4px;
        // }

        // &::-webkit-scrollbar-thumb {
        //     /*滚动条里面小方块*/
        //     border-radius: 10px;
        //     background-color: skyblue;
        //     background-image: -webkit-linear-gradient(45deg,
        //             rgba(255, 255, 255, 0.2) 25%,
        //             transparent 25%,
        //             transparent 50%,
        //             rgba(255, 255, 255, 0.2) 50%,
        //             rgba(255, 255, 255, 0.2) 75%,
        //             transparent 75%,
        //             transparent);
        // }

        // &::-webkit-scrollbar-track {
        //     /*滚动条里面轨道*/
        //     box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        //     background: #ededed;
        //     border-radius: 10px;
        // }

        .diagramContainer_content {
            cursor: grab;

            &:active {
                cursor: grabbing;
            }

            top: -3000px;
            left: -3000px;
            transform: scale(1);
            transform-origin: 0px 0px;
            position: absolute;
            width: 1000%;
            height: 1000%;
        }

        #diagramContainer {
            width: 100%;
            height: 100%;
            // background: #dff0d8;
            background-image: linear-gradient(90deg, hsla(0, 0%, 86.3%, 0.5) 6%, transparent 0),
                linear-gradient(hsla(0, 0%, 75.3%, 0.5) 6%, transparent 0);
            background-size: 12px 12px;
            position: relative;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            &::v-deep(.z_index) {
                z-index: 22 !important;
            }

            &::v-deep(.jtk-connector) {
                z-index: 22 !important;
            }
        }
    }

    // #diagramContainer {
    //   width: 100%;
    //   height: 75vh;
    //   background: #dff0d8;
    //   position: relative;
    //   overflow: hidden;
    //   -webkit-user-select: none;
    //   -moz-user-select: none;
    //   -ms-user-select: none;
    //   user-select: none;
    // }

    .box-card {
        width: 200px;
        margin: 20px 0;
        cursor: pointer;
        position: relative;

        .box-fn {
            color: #fff;
            opacity: 0.7;
            position: absolute;
            display: none;
            top: 0px;
            left: 0px;
            width: auto;
            z-index: 100;
            background-color: rgb(18, 18, 18);
            padding: 5px;

            span {
                color: #fff;
                font-size: 14px;
            }
        }

        &:hover {
            .box-fn {
                display: block;
            }
        }
    }

    .plumb_header {
        margin: 20px 0;
    }
}

.border-card {
    border: 1px solid #409eff;
}

.box-card {
    &::v-deep(.el-card__body) {
        padding: 0;
    }
}

#NodeRelation {
    position: relative;

    .move_position {
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-size: 14px;
        color: #7e7e7e;
    }

    .move_view {
        position: absolute;
        right: 0px;
        top: 73px;

        &::before {
            content: '';
            position: absolute;
            background-color: #40a0ff79;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            -webkit-filter: blur(10px);
            filter: blur(10px);
        }

        .move_lookView {
            position: absolute;
            cursor: grab;

            &:active {
                cursor: grabbing;
            }

            &::before {
                content: '';
                position: absolute;
                background-color: #fff;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                -webkit-filter: blur(2px);
                filter: blur(2px);
            }
        }

        .dian {
            position: absolute;
            display: block;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #409eff;
        }
    }
}
</style>
