<!--
 * @Author: xing 1981193009@qq.com
 * @Date: 2022-06-28 11:48:16
 * @LastEditors: xing 1981193009@qq.com
 * @LastEditTime: 2022-07-06 15:33:19
 * @FilePath: \web_wxChat\src\views\controlConsole\stationMan\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div style="padding: 20px">
        <el-button type="warning" @click="dialogVisible = true">管理岗位</el-button>
        <el-table v-loading="tableLoading" :data="tableData" style="width: 100%; margin: 20px auto">
            <el-table-column align="center" label="头像">
                <template #default="scope">
                    <el-image
                        style="width: 50px; height: 50px"
                        :src="scope.row?.avatorUrl"
                        :preview-src-list="[scope.row?.avatorUrl]"
                        :z-index="99999"
                        preview-teleported
                        fit="cover"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="名称" />
            <el-table-column align="center" label="岗位">
                <template #default="scope">
                    <el-select v-model="scope.row.position" placeholder="岗位" @change="changeStation(scope.row)">
                        <el-option v-for="item in options_station" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-dialog v-model="dialogVisible" title="管理岗位" width="30%" @close="handleClose">
        <div class="flex mb-5">
            <span class="juz mr-5">新增岗位:</span>
            <el-tooltip content="添加子账号" placement="bottom" effect="light">
                <div class="juz">
                    <el-button type="warning" :icon="CirclePlus" circle @click="addStation" />
                </div>
            </el-tooltip>
        </div>
        <div class="flex">
            <span class="flex mr-5 justify-start">岗位列表：</span>
            <ul class="list">
                <li v-for="i in options_station" :key="i.id" class="list-item">
                    <el-tag class="mb-2" type="warning" effect="plain" closable @close="delStation(i)">{{
                        i.name
                    }}</el-tag>
                </li>
            </ul>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">关闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { CirclePlus } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import {
    fetchList,
    getStation,
    updatewechat,
    createPosition,
    delPosition,
} from '@/api/modules/controlConsole/stationMan';

const {
    proxy: { $tips },
} = getCurrentInstance() as any;
const dialogVisible = ref(false);
const state = reactive({
    tableData: [],
    tableLoading: false,
    options_station: [] as { id: number; name: string }[],
});

const getList = () => {
    state.tableLoading = true;
    fetchList().then((res) => {
        state.tableData = res.data.data;
        state.tableLoading = false;
    });
};
const getStationList = () => {
    getStation().then((res) => {
        state.options_station = res.data.data;
    });
};
const handleClose = () => {
    dialogVisible.value = false;
};
const addStation = () => {
    ElMessageBox.prompt('请输入添加岗位名称：', '添加', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'globalcolor',
    })
        .then(({ value }) => {
            createPosition({ name: value }).then((res) => {
                if (res.data.status === 200) {
                    getStationList();
                    $tips('success', res.data.msg);
                } else {
                    $tips('error', `${res.data.msg}!!!`);
                }
            });
        })
        .catch(() => null);
};
const delStation = (item: { id: number; name: string }) => {
    ElMessageBox.confirm(`确定删除-${item.name}-岗位吗？`, 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            delPosition(item.id).then((res) => {
                if (res.data.status === 200) {
                    getStationList();
                    $tips('success', res.data.msg);
                } else {
                    $tips('error', `${res.data.msg}!!!`);
                }
            });
        })
        .catch(() => null);
};
const changeStation = (row: any) => {
    updatewechat(row).then((res) => {
        if (res.data.status === 200) {
            $tips('success', res.data.msg);
        } else {
            $tips('error', res.data.msg);
        }
    });
};

onActivated(() => {
    getStationList();
    getList();
});

const { tableData, tableLoading, options_station } = toRefs(state);
</script>

<style lang="scss" scoped>
.dialog-footer {
    width: 100%;
    display: block;
    text-align: center;
}
.list {
    flex: 1;
}
</style>
