<template>
    <div class="transfer flex">
        <div class="transfer-panel">
            <div class="transfer-panel-header">
                <div>
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
                        >全选</el-checkbox
                    >
                </div>
                <span class="juz">({{ checkedCities.length }}/{{ data.length }})</span>
            </div>
            <div class="transfer-panel-body flex-col">
                <div class="search-input">
                    <el-input
                        v-model="searchInput"
                        placeholder="请输入"
                        :suffix-icon="Search"
                        clearable
                        @input="changeSear"
                    />
                </div>
                <div class="transfer-panel-content">
                    <el-scrollbar>
                        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="item in list" :key="item.indexId" :label="item.conversationId">
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
            </div>
        </div>
        <div style="width: 30px"></div>
        <div class="transfer-panel">
            <div class="transfer-panel-header">
                <span style="height: 32px; line-height: 32px">选择发送列表</span>
            </div>
            <div class="transfer-panel-body flex-col">
                <div class="transfer-panel-content" style="padding: 10px 20px; height: 352px">
                    <el-scrollbar>
                        <div class="view-content">
                            <div v-for="item in selectList" :key="item.indexId" class="flex">
                                <el-avatar size="small" :src="item.avatorUrl" />
                                <div class="juz" style="margin-left: 4px">
                                    <span class="userName">{{ item.name }}</span>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>
s
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';

interface datatype {
    indexId: string | number;
    conversationId: string | number;
    name: string;
    avatorUrl: string;
}
const props = defineProps({
    data: {
        type: Array as () => datatype[],
        required: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    historyData: Array as () => string[],
});
const checkAll = ref(false);
const isIndeterminate = ref(false);
const searchInput = ref('');
const checkedCities = ref<string[]>([]);
const state = reactive({
    list: props.data,
    selectList: [] as datatype[],
});
const changeSear = (val: string) => {
    state.list = [];
    if (val) {
        state.list = props.data.filter((item) => item.name.indexOf(val) != -1);
    } else {
        state.list = props.data;
    }
};
const handleCheckedCitiesChange = (value: string[]) => {
    const checkedCount = value.length;
    checkAll.value = checkedCount === props.data.length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < props.data.length;
};
const handleCheckAllChange = (val: boolean) => {
    checkedCities.value = val ? (props.data.map((item) => item.conversationId) as string[]) : [];
    isIndeterminate.value = false;
};
watch(checkedCities, (n) => {
    state.selectList = [];
    n.forEach((id) => {
        state.selectList.push(...props.data.filter((item) => item.conversationId == id));
    });
});
watch(
    () => props.historyData,
    (n) => {
        if (n && n?.length > 0) {
            checkedCities.value = n;
        }
    },
    { immediate: true },
);
watch(
    () => props.data,
    (n) => {
        if (n.length === 0) {
            checkAll.value = false;
            isIndeterminate.value = false;
            checkedCities.value = [];
            state.selectList = [];
            state.list = [];
        } else {
            state.list = n;
        }
    },
);
defineExpose({
    state,
});
const { list, selectList } = toRefs(state);
</script>

<style lang="scss" scoped>
.transfer {
    .transfer-panel {
        flex: 1;
        .transfer-panel-header {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            min-height: 20px;
            background-color: #f5f7fa;
            border: 1px solid #ebeef5;
            span {
                font-size: 14px;
                color: #606b7c;
            }
        }
        .transfer-panel-body {
            // height: 300px;
            border: 1px solid #ebeef5;
            border-top: none;
            .search-input {
                // max-width: 200px;
                margin: 10px 0;
                padding: 0 20px;
            }
            .transfer-panel-content {
                // flex: 1;
                height: 300px;
                padding: 0 20px;
                .userName {
                    width: 70px !important;
                    color: #606b7c;
                    overflow: hidden; /*超出部分隐藏*/
                    white-space: nowrap; /*不换行*/
                    text-overflow: ellipsis; /*超出部分文字以...显示*/
                }
                .view-content {
                    display: flex;
                    flex-wrap: wrap;
                    margin: 0 10px 10px 0;
                    .flex {
                        margin: 0 10px 10px 0;
                    }
                }
                &::v-deep(.el-checkbox) {
                    height: auto;
                    margin: 0 10px 10px 0;
                }
            }
        }
    }
}
</style>
