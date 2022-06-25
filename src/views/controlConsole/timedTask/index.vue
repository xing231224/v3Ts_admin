<!--
 * @Author: xing 1981193009@qq.com
 * @Date: 2022-06-20 15:54:35
 * @LastEditors: xing 1981193009@qq.com
 * @LastEditTime: 2022-06-25 17:47:03
 * @FilePath: \web_wxChat\src\views\clientHandle\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div style="padding: 20px; --el-color-primary: #f39c12">
        <el-button type="warning" @click="create()">创建任务</el-button>
        <el-table :data="tableData" border style="width: 100%; margin: 20px auto">
            <el-table-column align="center" prop="id" label="任务id" />
            <el-table-column align="center" prop="name" label="任务名称" />
            <el-table-column align="center" prop="address" label="任务时间" />
            <el-table-column align="center" prop="address" label="任务日期" />
            <el-table-column align="center" prop="address" label="任务人员" />
            <el-table-column align="center" prop="address" label="是否全选" />
            <el-table-column align="center" prop="address" label="话术" />
            <el-table-column align="center" prop="address" label="是否全选话术" />
            <el-table-column align="center" prop="address" label="开启关闭" />
        </el-table>

        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" top="8vh"
            :title="dialogType == 'create' ? '创建' : '编辑'" width="30%" :before-close="handleClose">
            <el-form ref="formRef" :rules="formRules" :model="form" label-width="120px">
                <el-form-item label="任务名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入任务名称" clearable />
                </el-form-item>
                <el-form-item label="话术" prop="flowList">
                    <el-select v-model="form.flowList" clearable multiple placeholder="请选择话术">
                        <el-option v-for="item in options_scenarios" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="任务日期" prop="weeks">
                    <el-select v-model="form.weeks" clearable multiple placeholder="请选择日期">
                        <el-option v-for="item in options_week" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="任务时间" prop="time">
                    <el-time-picker v-model="form.time" placeholder="请选择时间" value-format="HH:mm" format="HH:mm" />
                </el-form-item>
                <el-form-item label="企微" prop="wechatId">
                    <el-select v-model="form.wechatId" clearable placeholder="请选择企微" @change="changeWecaht">
                        <el-option v-for="item in options_wechatIds" :key="item.id" :label="item.name" :value="item.id">
                            <div class="flex">
                                <el-avatar :size="30" :src="item.avatorUrl" />
                                <span class="juz" style="margin-left: 10px;">{{ item.name }}</span>
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
                            <div v-show="state.externalList.length == 0" style="color: red;text-align: center;">
                                数据为空，或者未选择企微（请先选择企微） </div>
                            <div v-show="state.externalList.length > 0" style=" height: 300px; padding: 0 20px;">
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
                        <div class="view-content">
                            <div v-for="item in  state.externalShow" :key="item.id" class="flex">
                                <el-avatar size="small" :src="item.avatorUrl" />
                                <div class="juz" style="margin-left: 4px">
                                    <span class="userName">{{ item.name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="内部联系人" prop="internals">
                    <div>
                        <el-popover placement="left" :width="400" trigger="click">
                            <template #reference>
                                <el-button style="margin-right: 16px">点击选择</el-button>
                            </template>
                            <div v-show="state.internalList.length == 0" style="color: red;text-align: center;">
                                数据为空，或者未选择企微（请先选择企微） </div>
                            <div v-show="state.internalList.length > 0" style=" height: 300px; padding: 0 20px;">
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
                        <div class="view-content">
                            <div v-for="item in  state.internalShow" :key="item.id" class="flex">
                                <el-avatar size="small" :src="item.avatorUrl" />
                                <div class="juz" style="margin-left: 4px">
                                    <span class="userName">{{ item.name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">关闭</el-button>
                    <el-button type="warning" @click="createOrEdit(formRef)">{{ dialogType == 'create' ? '创建' : '编辑' }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { searchTask, createTask, updateTask, deleteTask, getwechatAcc } from '@/api/modules/controlConsole/timedTask';
import { getWechatList } from '@/api/modules/mrrandaIM';
import { sreachScenarios } from '@/api/modules/operationMang/operationword';
import { tips } from '@/utils/tips';

interface datatype {
    id: string;
    name: string;
    avatorUrl: string;
}
const formRef = ref<FormInstance>()
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
    options_scenarios: [] as { id: number, name: string }[],
    options_wechatIds: [] as { id: number, name: string, avatorUrl: string }[],
    externalList: [] as datatype[],
    externalShow: [] as datatype[],
    internalList: [] as datatype[],
    internalShow: [] as datatype[],
    form: {
        name: '',
        weeks: '',
        time: '',
        flowList: [],
        wechatId: '',
        internals: [],
        externals: []
    }
});

const formRules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入任务名称', trigger: 'blur' },
    ],
    flowList: [
        { required: true, message: '请选择话术', trigger: 'change' },
    ],
    weeks: [
        { required: true, message: '请选择任务日期', trigger: 'change' },
    ],
    time: [
        { required: true, message: '请选择任务时间', trigger: 'change' },
    ],
    wechatId: [
        { required: true, message: '请选择企微', trigger: 'change' }
    ],
    externals: [
        { required: true, message: '请选择外部联系人', trigger: 'change' }
    ],
    internals: [
        { required: true, message: '请选择外部联系人', trigger: 'change' }
    ]
})
const create = () => {
    formRef.value?.clearValidate();
    dialogVisible.value = true;
};
const handleClose = () => {
    formRef.value?.clearValidate();
    dialogVisible.value = false;
    state.externalShow = []
    state.internalShow = []
    state.form = {
        name: '',
        weeks: '',
        time: '',
        flowList: [],
        wechatId: '',
        internals: [],
        externals: []
    }
};

const changeWecaht = (val: string) => {
    state.externalList = []
    if (val) {
        getWechatList(val).then(res => {
            state.externalList = res.data.data.external
            state.internalList = res.data.data.internal
        })

    }
}
const createOrEdit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log(state.form);
            createTask(state.form).then(res => {
                if (res.data.status == 200) {
                    tips('success', res.data.msg)
                    dialogVisible.value = false
                } else {
                    tips('error', res.data.msg)
                }

            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

const changeExternal = (val: string[]) => {
    console.log(val);
    state.externalShow = [];
    val.forEach((id: string) => {
        state.externalShow.push(...state.externalList.filter((item) => item.id == id));
    });
}
const changeInternal = (val: string[]) => {
    state.internalShow = [];
    val.forEach((id: string) => {
        state.internalShow.push(...state.internalList.filter((item) => item.id == id));
    });
}
const getAllpulicData = () => {
    searchTask().then(res => {
        console.log(res);

    })
    sreachScenarios({ status: '1' }).then((res) => {
        state.options_scenarios = res.data.data
    });
    getwechatAcc().then(res => {
        state.options_wechatIds = res.data.data
    });
};

onMounted(() => {
    getAllpulicData()
})
const { tableData, dialogType, options_scenarios, options_wechatIds, form } = toRefs(state);
</script>

<style lang="scss" scoped>
.view-content {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;

    .flex {
        margin: 0 10px 10px 0;
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
