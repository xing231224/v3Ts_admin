<!--
 * @Author: your name
 * @Date: 2022-03-24 17:26:53
 * @LastEditTime: 2022-03-30 14:19:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\friendList.vue
-->
<template>
    <!-- vue3页面 -->
    <div style="--el-color-primary:#F39C12">
        <div style="padding:15px 10px ;">
            <el-input
                v-model="input2"
                placeholder="Please Input"
                class="input-round"
                :prefix-icon="Search"
            />
        </div>
        <el-tabs v-model="activeName" stretch class="demo-tabs">
            <el-tab-pane
                v-for="(item, index) in tabsList"
                :key="item.name"
                :label="item.name == 'third' ? item.label : item.label + `(${needList[index].length})`"
                :name="item.name"
            >
                <List :lists="needList[index]" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang='ts'>
import { Search } from '@element-plus/icons-vue'
import List from "./list.vue"
import { userType } from "./type"

const activeName = ref('first')
const tabsList = reactive(
    [
        {
            label: "我",
            name: "first"
        },
        {
            label: "待分配",
            name: "second"
        },
        {
            label: "全部",
            name: "third"
        }
    ]
)
const input2 = ref('')

const list = (inject("dataList")) as any

const needList = ref([[], [], []]) as any

const dataDispose = () => {
    tabsList.forEach((item, index) => {
        switch (item.name) {
            case "first":
                needList.value[index] = list.value.filter((item: userType) => item.status)
                break;
            case "second":
                needList.value[index] = list.value.filter((item: userType) => !item.status)
                break;
            case "third":
                needList.value[index] = list.value
                break;
            default:
                break;
        }
    })
}
watch(list, () => {
    dataDispose()
})
onMounted(() => {
    dataDispose()
})



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