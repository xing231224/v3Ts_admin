<!--
 * @Author: xing 1981193009@qq.com
 * @Date: 2022-06-24 09:52:27
 * @LastEditors: xing 1981193009@qq.com
 * @LastEditTime: 2022-07-06 15:21:01
 * @FilePath: \web_wxChat\src\views\controlConsole\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="clientStatus">
        <el-row>
            <el-col :span="24">
                <el-table :data="c_data" border style="width: 100%">
                    <el-table-column align="center" label="C#客户端">
                        <template #default="scope">
                            {{ scope.row?.clientKey }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template #default="scope">
                            <el-tag v-if="scope.row?.ctx?.removed" class="ml-2" type="danger">断连</el-tag>
                            <el-tag v-else class="ml-2" type="success">连接</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="微企">
                        <template #default="scope">
                            {{ scope.row?.wechatId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="登录状态">
                        <template #default="scope">
                            <el-tag v-if="scope.row?.statue == '1'" class="ml-2" type="danger">正在登录</el-tag>
                            <el-tag v-if="scope.row?.statue == '2'" class="ml-2" type="success">登录完成</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="用户id">
                        <template #default="scope">
                            {{ scope.row?.userId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="登录的客户端">
                        <template #default="scope">
                            {{ scope.row?.clientId }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="web_data" border style="width: 100%">
                    <el-table-column align="center" label="WEB客户端">
                        <template #default="scope">
                            {{ scope.row?.clientKey }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template #default="scope">
                            <el-tag v-if="scope.row?.ctx?.removed" class="ml-2" type="danger">断连</el-tag>
                            <el-tag v-else class="ml-2" type="success">连接</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="用户id">
                        <template #default="scope">
                            {{ scope.row?.userId }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { getClientDetail } from '@/api/modules/controlConsole/clientStatus';

interface wctxsT {
    clientId?: string;
    endTime?: number;
    logTime?: number;
    statue?: string;
    userId?: string;
    wechatId?: string;
    [propName: string]: any;
}
interface clientT {
    c_init: { [propName: string]: { ctx: { removed: boolean }; wctxs: wctxsT[] } };
    w_init: { [propName: string]: { ctx: { removed: boolean }; wctxs: wctxsT[] } };
}

const state = reactive({
    apiData: {} as clientT,
    c_data: [] as wctxsT[],
    web_data: [] as any[],
});

onActivated(() => {
    state.web_data = [];
    state.c_data = [];
    getClientDetail().then((res) => {
        state.apiData = res.data.data;
        /* eslint-disable no-restricted-syntax,guard-for-in */
        for (const key in state.apiData.c_init) {
            if (state.apiData.c_init[key].wctxs.length > 0) {
                state.c_data = [
                    ...state.apiData.c_init[key].wctxs.map((item: any) => {
                        return { ...item, ctx: state.apiData.c_init[key].ctx, clientKey: key };
                    }),
                ];
            } else {
                state.c_data.push({
                    clientKey: key,
                    ctx: state.apiData.c_init[key].ctx,
                    ...state.apiData.c_init[key].wctxs,
                });
            }
        }
        for (const key in state.apiData.w_init) {
            state.web_data.push({ clientKey: key, ...state.apiData.w_init[key] });
        }
    });
});
const { c_data, web_data } = toRefs(state);
</script>

<style lang="scss" scoped>
.clientStatus {
    padding: 20px;

    .box-card {
        margin: 20px;

        &:first-child {
            margin-bottom: 100px;
        }

        &::v-deep(.el-card__header) {
            padding: 10px 20px;
        }
    }

    .el-row {
        &:first-child {
            margin: 20px 0 60px 0;
        }
    }
}
</style>
