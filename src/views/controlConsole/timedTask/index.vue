<!--
 * @Author: xing 1981193009@qq.com
 * @Date: 2022-06-20 15:54:35
 * @LastEditors: xing 1981193009@qq.com
 * @LastEditTime: 2022-06-27 18:46:08
 * @FilePath: \web_wxChat\src\views\clientHandle\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div style="padding: 20px; --el-color-primary: #f39c12">
        <el-button type="warning" @click="create()">创建任务</el-button>
        <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%; margin: 20px auto">
            <el-table-column align="center" prop="name" label="任务名称" width="250" />
            <el-table-column align="center" label="任务时间" width="110">
                <template #default="scope">
                    {{ parseTime(scope.row.time, '{h}:{i}') }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="任务星期">
                <template #default="scope">
                    <el-tag v-for="item in scope.row.weeks" :key="item" class="ml-2 mb-2" type="warning">{{
                        options_week.find((row) => row.value == item)?.label
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="任务人员" width="345">
                <template #default="scope">
                    <div class="flex contacts">
                        <span>内部人员：</span>
                        <div class="flex-col">
                            <div :class="`contacts_list ${!scope.row.isInternal ? 'over_hidden' : ''}`">
                                <el-scrollbar>
                                    <div
                                        v-for="item in scope.row.internalContacts"
                                        :key="item.id"
                                        :title="item.name"
                                        class="flex"
                                    >
                                        <el-avatar size="small" :src="item.avatorUrl" />
                                        <div class="juz" style="margin-left: 4px">
                                            <span class="userName">{{ item.name }}</span>
                                        </div>
                                    </div>
                                </el-scrollbar>
                            </div>
                            <div v-if="scope.row.internalContacts.length > 3" class="pull-down">
                                <el-icon>
                                    <CaretBottom v-show="!scope.row.isInternal" @click="scope.row.isInternal = true" />
                                    <CaretTop v-show="scope.row.isInternal" @click="scope.row.isInternal = false" />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                    <div class="flex contacts">
                        <span>外部人员：</span>
                        <div class="flex-col">
                            <div :class="`contacts_list ${!scope.row.isExternal ? 'over_hidden' : ''}`">
                                <el-scrollbar height="168px">
                                    <div
                                        v-for="item in scope.row.externalContacts"
                                        :key="item.id"
                                        :title="item.name"
                                        class="flex"
                                    >
                                        <el-avatar size="small" :src="item.avatorUrl" />
                                        <div class="juz" style="margin-left: 4px">
                                            <span class="userName">{{ item.name }}</span>
                                        </div>
                                    </div>
                                </el-scrollbar>
                            </div>
                            <div v-if="scope.row.externalContacts.length > 3" class="pull-down">
                                <el-icon>
                                    <CaretBottom v-show="!scope.row.isExternal" @click="scope.row.isExternal = true" />
                                    <CaretTop v-show="scope.row.isExternal" @click="scope.row.isExternal = false" />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="话术" width="200">
                <template #default="scope">
                    <el-tag
                        v-for="item in JSON.parse(scope.row.scenariosList)"
                        :key="item"
                        class="ml-2 mb-2"
                        type="warning"
                        >{{ options_scenarios.find((row) => row.id == item)?.name }}</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column align="center" label="开启关闭" width="110">
                <template #default="scope">
                    <el-switch
                        v-model="scope.row.status"
                        size="large"
                        :active-value="1"
                        :inactive-value="2"
                        style="--el-switch-on-color: #e6a23c"
                    />
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="140">
                <template #default="scope">
                    <el-button size="small" @click="editRow(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="delRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
            v-model="dialogVisible"
            :close-on-click-modal="false"
            top="8vh"
            :title="dialogType == 'create' ? '创建' : '编辑'"
            width="30%"
            :before-close="handleClose"
        >
            <el-form ref="formRef" :rules="formRules" :model="form" label-width="120px">
                <el-form-item label="任务名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入任务名称" clearable />
                </el-form-item>
                <el-form-item label="话术" prop="scenarioIds">
                    <el-select
                        v-model="form.scenarioIds"
                        style="width: 240px"
                        clearable
                        multiple
                        placeholder="请选择话术"
                    >
                        <el-option
                            v-for="item in options_scenarios"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="任务星期" prop="weeks">
                    <el-select v-model="form.weeks" clearable style="width: 240px" multiple placeholder="请选择星期">
                        <el-option
                            v-for="item in options_week"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="任务时间" prop="time">
                    <el-time-picker
                        v-model="time"
                        placeholder="请选择时间"
                        value-format="x"
                        format="HH:mm"
                        @change="(val) => (form.time = Number(val) / 1000 + '')"
                    />
                </el-form-item>
                <el-form-item label="企微" prop="wechatId">
                    <el-select v-model="form.wechatId" clearable placeholder="请选择企微" @change="changeWecaht">
                        <el-option v-for="item in options_wechatIds" :key="item.id" :label="item.name" :value="item.id">
                            <div class="flex">
                                <el-avatar :size="30" :src="item.avatorUrl" />
                                <span class="juz" style="margin-left: 10px">{{ item.name }}</span>
                            </div>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="外部联系人" prop="externals">
                    <div>
                        <el-popover placement="left" :width="400" trigger="click">
                            <template #reference>
                                <el-button style="margin-right: 16px">点击选择</el-button>
                            </template>
                            <div v-show="state.externalList.length == 0" style="color: red; text-align: center">
                                数据为空，或者未选择企微（请先选择企微）
                            </div>
                            <div v-show="state.externalList.length > 0" style="height: 300px; padding: 0 20px">
                                <el-scrollbar>
                                    <el-checkbox-group v-model="form.externals" @change="changeExternal">
                                        <el-checkbox v-for="item in state.externalList" :key="item.id" :label="item.id">
                                            <div class="flex">
                                                <el-avatar size="small" :src="item.avatorUrl" />
                                                <div class="juz" style="margin-left: 4px">
                                                    <span class="userName">{{ item.name }}</span>
                                                </div>
                                            </div>
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-scrollbar>
                            </div>
                        </el-popover>
                        <el-scrollbar max-height="200px" style="margin-top: 10px">
                            <div class="view-content">
                                <div v-for="item in state.externalShow" :key="item.id" class="flex">
                                    <div class="juz">
                                        <el-avatar size="small" :src="item.avatorUrl" />
                                    </div>
                                    <div class="juz" style="margin-left: 4px">
                                        <span class="userName">{{ item.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </el-form-item>
                <el-form-item label="内部联系人" prop="internals">
                    <div>
                        <el-popover placement="left" :width="400" trigger="click">
                            <template #reference>
                                <el-button style="margin-right: 16px">点击选择</el-button>
                            </template>
                            <div v-show="state.internalList.length == 0" style="color: red; text-align: center">
                                数据为空，或者未选择企微（请先选择企微）
                            </div>
                            <div v-show="state.internalList.length > 0" style="height: 300px; padding: 0 20px">
                                <el-scrollbar>
                                    <el-checkbox-group v-model="form.internals" @change="changeInternal">
                                        <el-checkbox v-for="item in state.internalList" :key="item.id" :label="item.id">
                                            <div class="flex">
                                                <el-avatar size="small" :src="item.avatorUrl" />
                                                <div class="juz" style="margin-left: 4px">
                                                    <span class="userName">{{ item.name }}</span>
                                                </div>
                                            </div>
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-scrollbar>
                            </div>
                        </el-popover>
                        <el-scrollbar max-height="200px" style="margin-top: 10px">
                            <div class="view-content">
                                <div v-for="item in state.internalShow" :key="item.id" class="flex">
                                    <div class="juz">
                                        <el-avatar size="small" :src="item.avatorUrl" />
                                    </div>
                                    <div class="juz" style="margin-left: 4px">
                                        <span class="userName">{{ item.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">关闭</el-button>
                    <el-button type="warning" @click="createOrEdit(formRef)"
                        >{{ dialogType == 'create' ? '创建' : '编辑' }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { CaretBottom, CaretTop } from '@element-plus/icons-vue';
import { searchTask, createTask, updateTask, deleteTask, getwechatAcc } from '@/api/modules/controlConsole/timedTask';
import { getWechatList } from '@/api/modules/mrrandaIM';
import { sreachScenarios } from '@/api/modules/operationMang/operationword';
import { parseTime } from '@/utils/mineUtils';

const {
    proxy: { $tips, $confirmBox },
} = getCurrentInstance() as any;

interface datatype {
    id: string;
    name: string;
    avatorUrl: string;
}
interface tableRowT {
    id: number;
    name: string;
    weeks: string[];
    time: string;
    scenarioIds: never[];
    wechatId: string;
    internals: never[];
    externals: never[];
    internalsWechatId: string;
    externalsWechatId: string;
    scenariosList: string;
}

const formRef = ref<FormInstance>();
const tableLoading = ref(false);
const dialogVisible = ref(false);
const options_week = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 7 },
];
const state = reactive({
    tableData: [],
    dialogType: 'create',
    options_scenarios: [] as { id: number; name: string }[],
    options_wechatIds: [] as { id: number; name: string; avatorUrl: string }[],
    externalList: [] as datatype[],
    externalShow: [] as datatype[],
    internalList: [] as datatype[],
    internalShow: [] as datatype[],
    time: 0 as number,
    form: {
        name: '',
        weeks: [] as number[],
        time: '',
        scenarioIds: [],
        wechatId: '',
        internals: [],
        externals: [],
    },
});

const formRules = reactive<FormRules>({
    name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
    scenarioIds: [{ required: true, message: '请选择话术', trigger: 'change' }],
    weeks: [{ required: true, message: '请选择任务星期', trigger: 'change' }],
    time: [{ required: true, message: '请选择任务时间', trigger: 'change' }],
    wechatId: [{ required: true, message: '请选择企微', trigger: 'change' }],
    externals: [{ required: true, message: '请选择外部联系人', trigger: 'change' }],
    internals: [{ required: true, message: '请选择外部联系人', trigger: 'change' }],
});
const getList = () => {
    tableLoading.value = true;
    /* eslint-disable no-param-reassign */
    searchTask({ time: Math.floor(new Date().getTime() / 1000) }).then((res) => {
        state.tableData = res.data.data;
        state.tableData.forEach((item: any) => {
            item.isExternal = false;
            item.isInternal = false;
        });
        tableLoading.value = false;
    });
};
const create = () => {
    formRef.value?.clearValidate();
    dialogVisible.value = true;
};
const delRow = (row: tableRowT) => {
    $confirmBox('是否确认删除？', '确认', '取消').then(() => {
        deleteTask(row.id).then((res) => {
            if (res.data.status === 200) {
                $tips('success', res.data.msg);
            } else {
                $tips('error', res.data.msg);
            }
        });
    });
};
const changeWecaht = (val: string, cb: Function) => {
    state.externalList = [];
    if (val) {
        getWechatList(val).then((res) => {
            state.externalList = res.data.data.external;
            state.internalList = res.data.data.internal;
            cb();
        });
    }
};
const changeExternal = (val: string[]) => {
    state.externalShow = [];
    val.forEach((id: string) => {
        state.externalShow.push(...state.externalList.filter((item) => item.id == id));
    });
};
const changeInternal = (val: string[]) => {
    state.internalShow = [];
    val.forEach((id: string) => {
        state.internalShow.push(...state.internalList.filter((item) => item.id == id));
    });
};
const editRow = (row: tableRowT) => {
    console.log(row);

    state.dialogType = 'edit';
    dialogVisible.value = true;
    state.time = Number(row.time) * 1000;
    state.form = {
        name: row.name,
        weeks: row.weeks.map((item) => Number(item)),
        time: row.time,
        scenarioIds: JSON.parse(row.scenariosList),
        wechatId: row.wechatId,
        internals: JSON.parse(row.internalsWechatId),
        externals: JSON.parse(row.externalsWechatId),
    };
    changeWecaht(row.wechatId, () => {
        changeExternal(state.form.externals);
        changeInternal(state.form.internals);
    });
};
const handleClose = () => {
    formRef.value?.clearValidate();
    dialogVisible.value = false;
    state.externalShow = [];
    state.internalShow = [];
    state.time = 0;
    state.form = {
        name: '',
        weeks: [],
        time: '',
        scenarioIds: [],
        wechatId: '',
        internals: [],
        externals: [],
    };
};

const createOrEdit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            createTask(state.form).then((res) => {
                if (res.data.status == 200) {
                    $tips('success', res.data.msg);
                    getList();
                    dialogVisible.value = false;
                } else {
                    $tips('error', res.data.msg);
                }
            });
        } else {
            console.log('error submit!', fields);
        }
    });
};

const getAllpulicData = () => {
    sreachScenarios({ status: '1' }).then((res) => {
        state.options_scenarios = res.data.data;
    });
    getwechatAcc().then((res) => {
        state.options_wechatIds = res.data.data;
    });
};

onActivated(() => {
    getList();
    getAllpulicData();
});
const { tableData, dialogType, options_scenarios, options_wechatIds, form, time } = toRefs(state);
</script>

<style lang="scss" scoped>
.view-content {
    display: flex;
    flex-wrap: wrap;
    .flex {
        margin: 0 2px 2px 0;
    }
}
.contacts {
    margin-bottom: 10px;
    &:last-child {
        margin-bottom: 0;
    }
    .flex-col {
        flex: 1;
        .pull-down {
            text-align: right;
            padding: 0 20px;
            &::v-deep(.el-icon) {
                cursor: pointer;
            }
        }
    }
    .contacts_list {
        flex-wrap: wrap;
        display: flex;
        height: 180px;
        transition: all 0.5s;

        .flex {
            display: inline-flex;
            margin-right: 5px;
            margin-bottom: 5px;
        }
    }
    .over_hidden {
        height: 24px;
        overflow: hidden;
    }
    .userName {
        width: 50px !important;
    }
}
.userName {
    width: 70px !important;
    color: #606b7c;
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*不换行*/
    text-overflow: ellipsis;
    /*超出部分文字以...显示*/
}
</style>
