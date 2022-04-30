<!--
 * @Author: your name
 * @Date: 2022-03-24 17:26:53
 * @LastEditTime: 2022-04-28 17:03:00
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\friendList.vue
-->
<template>
    <!-- vue3页面 -->
    <div style="--el-color-primary:#F39C12">
        <div style="padding:15px 10px ;">
            <el-autocomplete v-model="input2" :fetch-suggestions="querySearch" style="width: 100%;"
                :prefix-icon="Search" :trigger-on-focus="false" clearable class="input-round" placeholder="Please Input"
                @select="handleSelect">
                <template #default="{ item }">
                    <div class="value">{{ item.name }}</div>
                </template>
            </el-autocomplete>
        </div>
        <el-tabs v-model="activeName" stretch class="demo-tabs">
            <el-tab-pane v-for="(item, index) in tabsList" :key="item.name"
                :label="item.name == 'first' ? item.label : item.label + `(${needList[index].length})`"
                :name="item.name">
                <template v-if="activeName === 'first'">
                    <div style="text-align: center;margin-bottom: 10px;">
                        <el-tooltip content="添加子账号" placement="bottom" effect="light">
                            <el-button type="warning" :icon="CirclePlus" circle @click="addUser" />
                        </el-tooltip>
                    </div>
                    <List :lists="needList[index]" :active="activeName" />
                </template>
                <List v-else :lists="needList[index]" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang='ts'>
import { Search, CirclePlus } from '@element-plus/icons-vue'
import List from "./list.vue"
import Store from "@/store/message"
import { flatten } from '@/utils/mineUtils'
import { userType } from "./type"


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
const list = inject("dataList") as [[], [], []]

const dataDispose = () => {
    state.needList = [[], ...list]
}
// 多账号添加
const addUser = () => {
    messageStore.isLogin = true
}
const createFilter = (queryString: string) => {
    return (restaurant: userType) => {
        return (
            restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}
const querySearch = (queryString: string, cb: any) => {

    const results = queryString
        ? flatten(list).filter(createFilter(queryString))
        : flatten(list)
    // call callback function to return suggestions
    cb(results)
}
const handleSelect = (item: any) => {
    messageStore.setContextObj(item)

    // eslint-disable-next-line no-nested-ternary
    state.activeName = item.type == '7' ? 'second' : item.type == '8' ? 'third' : item.type == '9' ? 'fourthly' : ''


    nextTick(() => {
        const a = document.createElement('a')
        a.href = `#abc${item.id}`
        a.click()
        a.remove()
    })
}

watch(list, () => {
    dataDispose()
    messageStore.setContactList(list)
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