<!--
 * @Author: your name
 * @Date: 2022-04-12 09:42:00
 * @LastEditTime: 2022-04-12 11:32:33
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\operationMan\verbalTrickPush\index.vue
-->
<template>
    <div class="verbalTrickPush">
        <div>
            <el-button type="warning" :loading="loading" @click="getOnLineUser">刷新在线用户</el-button>
        </div>

        <div class="flex-sb" style="margin: 20px 0">
            <el-card class="box-card">
                <el-button type="warning" @click="dialogVisible = true, dialogType = 'add'">添加分组</el-button>
                <el-table
                    ref="table"
                    v-loading="loading"
                    class="el-table"
                    :data="tableData"
                    border
                    :span-method="arraySpanMethod"
                    :row-class-name="tableRowClassName"
                    style="width: 100%; margin: 20px 0"
                    @expand-change="expandChange"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="expand">
                        <template #default="props">
                            <el-table
                                :ref="'multipleTable_' + props.row.id"
                                :data="props.row.userWechats"
                                border
                                class="child-table"
                                :show-header="false"
                                style="width: 100%"
                                @selection-change="handleSelectionChangeTwo($event, props.row.id)"
                            >
                                <el-table-column type="selection" align="center" width="55" />
                                <el-table-column align="center" prop="acctid"></el-table-column>
                                <el-table-column align="center" prop="userId"></el-table-column>
                                <el-table-column align="center" prop="nickname" />
                                <el-table-column align="center" prop="username" />
                                <el-table-column align="center">
                                    <template #default="scope">
                                        <div>
                                            <el-button
                                                type="danger"
                                                @click="byGroup_del(scope.row)"
                                            >删除</el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" align="center" width="55" />
                    <el-table-column align="center" prop="acctid" label="账号">
                        <template #default="scope">
                            <div>{{ scope.row.name }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="userId" label="用户Id">
                        <template #default="scope">
                            <div v-if="scope.row.userWechats" class="flex-col">
                                <div>
                                    <el-button
                                        type="success"
                                        @click="group_edit(scope.row, 'edit')"
                                    >编辑</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" @click="group_del(scope.row)">删除</el-button>
                                </div>
                            </div>
                            <div v-else>{{ scope.row.userId }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="nickname" label="昵称" />
                    <el-table-column align="center" prop="username" label="真实姓名" />
                    <el-table-column align="center" label="操作">
                        <template #default="scope">
                            <div class="flex-col">
                                <div>
                                    <el-button
                                        type="success"
                                        @click="group_edit(scope.row, 'select')"
                                    >编辑</el-button>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <div class="flex-col btn">
                <div style="margin: 20px 0">
                    <el-popover ref="popoverRef" placement="top" :width="400" trigger="click">
                        <template #reference>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="scenariosId ? scenariosIdComp : '未选择话术'"
                                placement="bottom"
                            >
                                <el-button v-popover="popoverRef">选择话术</el-button>
                            </el-tooltip>
                        </template>
                        <div style="text-align: center">
                            <el-select
                                v-model="scenariosId"
                                style="margin: 20px auto; width: 90%"
                                placeholder="请选择话术"
                            >
                                <el-option
                                    v-for="item in options_scenarios"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </div>
                    </el-popover>
                </div>
                <div style="margin: 20px 0">
                    <el-button @click="sendScenariosFn()">发送话术</el-button>
                </div>
            </div>
            <el-card class="box-card">
                <div class="flex">
                    <el-select
                        v-model="listQuery.userId"
                        style="width: 120px; margin: 0 5px"
                        placeholder="用户"
                    >
                        <el-option
                            v-for="item in options_lineuser"
                            :key="item.id"
                            :label="item.username"
                            :value="item.id"
                        />
                    </el-select>
                    <div style="width: 120px; margin: 0 5px">
                        <el-input v-model="listQuery.acctId" placeholder="客户"></el-input>
                    </div>
                    <el-select
                        v-model="listQuery.scenariosId"
                        style="width: 120px; margin: 0 5px"
                        placeholder="话术"
                    >
                        <el-option
                            v-for="item in options_scenarios"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <el-select
                        v-model="listQuery.status"
                        style="width: 120px; margin: 0 5px"
                        placeholder="状态"
                    >
                        <el-option label="未发" :value="0" />
                        <el-option label="已发" :value="1" />
                    </el-select>
                    <el-button style="margin-left: auto" type="warning">查询</el-button>
                </div>
                <el-table
                    v-loading="loading_send"
                    :data="sendList"
                    border
                    style="width: 100%; margin: 20px 0"
                >
                    <el-table-column align="center" prop="acctId" label="账号"></el-table-column>
                    <el-table-column align="center" prop="userId" label="用户Id"></el-table-column>
                    <el-table-column align="center" prop="nickname" label="昵称"></el-table-column>
                    <el-table-column align="center" prop="username" label="真实姓名"></el-table-column>
                    <el-table-column align="center" prop="username" label="状态" width="80">
                        <template #default="scope">
                            <span v-if="scope.row.status === 0" style="color: red">未发</span>
                            <span v-else style="color: #46ff46">已发</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="justify-content: center;"
                    :current-page="listQuery.page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="listQuery.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                ></el-pagination>
            </el-card>
        </div>
        <el-dialog
            v-model="dialogVisible"
            :title="dialogType == 'add' ? '添加分组' : dialogType == 'edit' ? '编辑分组' : '选择分组'"
            width="30%"
            :close-on-click-modal="false"
            @close="handleClose"
        >
            <div v-if="dialogType == 'select'">
                <el-checkbox-group v-model="checkGroup">
                    <el-checkbox
                        v-for="item in groupList"
                        :key="item.id"
                        :label="item.id"
                    >{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </div>
            <div v-else class="flex">
                <span class="juz" style="width:80px">分组名称:</span>
                <el-input v-model="form.name" clearable></el-input>
            </div>
            <template #footer>
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="warning" @click="group_add">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ElMessageBox } from "element-plus"
import {
    onLineUser,
    sendScenarios,
    getSendListWr,
    addGroup,
    updateGroup,
    delGroup,
    getGroupList,
    updateWechatByGroup,
    updateWechat
} from "@/api/modules/operationMang/verbalTrickPush";
import { sreachScenarios } from "@/api/modules/operationMang/operationword";

const { proxy } = getCurrentInstance() as any;
const { $tips, $refs } = proxy
const table = ref()
const popoverRef = ref()
const state = reactive<Record<string, any>>({
    form: {
        name: "",
    },
    tableData: [],
    multipleSelection: [],
    childMultipleSelection: {},
    options_scenarios: [],
    options_lineuser: [],
    sendList: [],
    scenariosId: null,
    dialogVisible: false,
    dialogType: "",
    loading: false,
    loading_send: false,
    listQuery: {
        page: 1,
        limit: 10,
    },
    total: 0,
    groupList: [],
    checkGroup: []
})

const scenariosIdComp = computed(() => {
    return (
        `已选择话术----${state.options_scenarios.find((item: { value: any; }) => item.value === state.scenariosId)
            .label}`
    );
})

const getOnLineUser = () => {
    state.loading = true;
    state.tableData = [];
    state.onLineUserId = null;
    onLineUser().then((res) => {
        if (res.data.status === 200) {
            state.tableData = res.data.data.groupList;
            state.tableData = state.tableData.concat(res.data.data.userList)
            state.loading = false;
        }
    });
}
const group_add = () => {
    if (state.dialogType == 'select') {
        if (state.checkGroup.length === 0) return $tips("error", '请选择分组')
        const obj = {
            id: state.form.id,
            groupList: state.checkGroup
        }
        updateWechat(obj).then(res => {
            if (res.data.status == 200) {
                $tips("success", res.data.msg)
                state.dialogVisible = false
                getOnLineUser()
            } else {
                $tips("error", res.data.msg)
            }
        })
    } else if (!state.form.name) return $tips("error", '请输入分组名称')
        (state.dialogType == 'add' ? addGroup : updateGroup)(state.form).then((res: { data: { status: number; msg: any; }; }) => {
            if (res.data.status == 200) {
                $tips("success", res.data.msg)
                state.dialogVisible = false
                getOnLineUser()
            } else {
                $tips("error", res.data.msg)
            }
        })

}
const group_del = (row: { id: string | number; }) => {
    ElMessageBox.confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        delGroup(row.id).then(res => {
            if (res.data.status == 200) {
                $tips("success", res.data.msg)
                getOnLineUser()
            } else {
                $tips("error", res.data.msg)
            }
        })
    }).catch(() => {
        $tips('info', '已取消删除')
    });
}
const byGroup_del = (row: { id: any; }) => {
    const obj = {
        groupId: '',
        id: row.id
    }
    state.tableData.forEach((item: { userWechats: any; id: string; }) => {
        if ((item.userWechats ? item.userWechats : []).includes(row)) {
            obj.groupId = item.id
        }
    })
    ElMessageBox.confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        updateWechatByGroup(obj).then(res => {
            if (res.data.status == 200) {
                $tips("success", res.data.msg)
                getOnLineUser()
            } else {
                $tips("error", res.data.msg)
            }
        })
    }).catch(() => {
        $tips('info', '已取消删除')
    });
}
const group_edit = (row: { id: any; name: any; }, type: string) => {
    state.dialogType = type
    state.dialogVisible = true
    state.form.id = row.id
    if (type == 'edit') {
        state.form.name = row.name
    }
}
const handleClose = () => {
    state.dialogVisible = false
    state.form = {}
}
const getGroupListFn = () => {
    getGroupList().then(res => {
        state.groupList = res.data.data
    })
}
const expandChange = (expandedRows: any[]) => {
    expandedRows.forEach((item: { id: any; userWechats: any[]; }) => {
        if (state.multipleSelection.includes(item.id)) {
            table.value.toggleRowExpansion(item, true)
            nextTick(() => {
                item.userWechats.forEach((row: any) => {
                    const refs = $refs[`multipleTable_${item.id}`]
                    // eslint-disable-next-line no-unused-expressions
                    refs ? refs.toggleRowSelection(row, true) : null;
                })
            })
        }
    })
}
const tableRowClassName = (obj: { row: any; }) => {
    const { row } = obj
    if (row.userWechats) {
        return "warning-row";
    }
    return "";
}
const arraySpanMethod = (obj: any) => {
    const { row, columnIndex } = obj
    if (row.userWechats) {
        if (columnIndex == 2) {
            return [1, 4];
        }
    } else {
        if (columnIndex == 0) {
            return [0, 1]
        } if (columnIndex == 1) {
            return [1, 2]
        }
    }

}
const handleSelectionChange = (val: any[]) => {
    if (val.length > 0) {
        val.forEach((item: { id: any; userWechats: any[]; }) => {
            let refs = $refs[`multipleTable_${item.id}`]
            if (item.userWechats) {
                if (!state.multipleSelection.includes(item.id)) {
                    table.value.toggleRowExpansion(item, true)
                }
                nextTick(() => {
                    item.userWechats.forEach((row: any) => {
                        refs = $refs[`multipleTable_${item.id}`]
                        // eslint-disable-next-line no-unused-expressions
                        refs ? refs.toggleRowSelection(row, true) : null;
                    })
                })
            } else {
                // eslint-disable-next-line no-unused-expressions
                refs ? refs.clearSelection() : null;
            }
        })
    } else {
        state.tableData.forEach((item: { id: any; userWechats: any; }) => {
            const refs = $refs[`multipleTable_${item.id}`]
            if (item.userWechats) {
                table.value.toggleRowExpansion(item, false)
                // eslint-disable-next-line no-unused-expressions
                refs ? refs.clearSelection() : null;
            }
        })
    }
    state.multipleSelection = val.filter((item: { userWechats: any; }) => !item.userWechats).map((item: { id: any; }) => item.id);
}
const handleSelectionChangeTwo = (val: any[], id: any) => {
    state.childMultipleSelection[`group_${id}`] = val.map((item: { id: any; }) => item.id)
}
// 获取话术
const getScenarios = () => {
    sreachScenarios({}).then((res) => {
        (res.data.data || []).forEach((item: { name: any; id: any; }) => {
            state.options_scenarios.push({
                label: item.name,
                value: item.id,
            });
        });
    });
}
const getSendListWrFn = () => {
    state.loading_send = true;
    getSendListWr(state.listQuery).then((res) => {
        state.total = res.data.data.total;
        state.sendList = res.data.data.records;
        state.loading_send = false;
    });
}
// 发送话术
const sendScenariosFn = () => {
    let arr: any[] = []
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in state.childMultipleSelection) {
        arr = [...arr, ...state.childMultipleSelection[key]]
    }
    const ids = state.multipleSelection.concat(arr)
    if (!state.scenariosId) return $tips("warning", "未选择话术！！！");
    if (ids.length === 0)
        return $tips("warning", "未选择在线人员！！！");
    const obj = {
        ids,
        scenarios: state.scenariosId,
    };
    sendScenarios(obj).then((res) => {
        if (res.data.status == 200) {
            $tips("success", res.data.msg);
            state.scenariosId = null;
            getSendListWrFn()
        } else {
            $tips("error", res.data.msg);
        }
    });
}

const handleSizeChange = (val: any) => {
    state.listQuery.limit = val;
    getSendListWrFn();
}
const handleCurrentChange = (val: any) => {
    state.listQuery.page = val;
    getSendListWrFn();
}

onMounted(() => {
    getOnLineUser();
    getScenarios();
    getSendListWrFn();
    getGroupListFn()
})

const { loading,
    dialogVisible,
    dialogType,
    scenariosId,
    options_scenarios,
    options_lineuser,
    sendList,
    loading_send,
    form, tableData,
    checkGroup, listQuery,
    total, groupList
} = toRefs(state)
</script>

<style lang='scss' scoped>
.verbalTrickPush {
    padding: 20px;
    .box-card {
        flex: 1;
    }
    .btn {
        // justify-content: center;
        margin: 0 20px;
    }
}
.el-table ::v-deep(.warning-row) {
    background: oldlace;
}

.el-table ::v-deep(.success-row) {
    background: #f0f9eb;
}
.el-table ::v-deep(.el-table__expanded-cell) {
    padding: 1px;
    padding-left: 48px;
}
</style>