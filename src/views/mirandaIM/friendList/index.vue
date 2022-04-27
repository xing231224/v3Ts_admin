<!--
 * @Author: your name
 * @Date: 2022-03-24 17:26:53
 * @LastEditTime: 2022-04-25 11:06:03
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\friendList.vue
-->
<template>
    <!-- vue3页面 -->
    <div style="--el-color-primary:#F39C12">
        <div style="padding:15px 10px ;">
            <el-input v-model="input2" placeholder="Please Input" class="input-round" :prefix-icon="Search" />
        </div>
        <el-tabs v-model="activeName" stretch class="demo-tabs">
            <el-tab-pane v-for="(item, index) in tabsList" :key="item.name"
                :label="item.name == 'third' || item.name == 'fourthly' ? item.label : item.label + `(${needList[index].length})`"
                :name="item.name">
                <div v-if="activeName === 'first'" style="text-align: center;">
                    <el-tooltip content="添加子账号" placement="bottom" effect="light">
                        <el-button type="warning" :icon="CirclePlus" circle @click="addUser" />
                    </el-tooltip>
                </div>
                <List :lists="needList[index]" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang='ts'>
import { Search, CirclePlus } from '@element-plus/icons-vue'
import List from "./list.vue"
import { userType } from "./type"
import Store from "@/store/message"

const messageStore = Store()
const state = reactive({
    activeName: 'first',
    input2: '',
    tabsList: [
        {
            label: "我",
            name: "first"
        },
        {
            label: "内部",
            name: "second"
        },
        {
            label: "外部",
            name: "third"
        },
        {
            label: "群",
            name: "fourthly"
        }
    ],
    needList: [[], [], [], []]
})
const list = inject("dataList") as []
const dataDispose = () => {
    state.tabsList.forEach((item, index) => {
        switch (item.name) {
            case "first":
                state.needList[index] = list.filter((item: userType) => item.status)
                break;
            case "second":
                state.needList[index] = list.filter((item: userType) => !item.status)
                break;
            case "third":
                state.needList[index] = list
                break;
            default:
                break;
        }
    })
}
// 多账号添加
const addUser = () => {
    messageStore.isLogin = true
}
watch(list, () => {
    dataDispose()
})
onMounted(() => {
    dataDispose()
})

const { input2, tabsList, needList, activeName } = toRefs(state)

</script>

<style lang='scss' scoped>
.input-round {
    &::v-deep(input) {
        border-radius: 20px;
    }
}

.demo-tabs {
    &::v-deep(.el-tabs__nav-wrap::after) {
        background-color: #fff;
    }
}
</style>