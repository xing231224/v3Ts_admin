<!--
 * @Author: your name
 * @Date: 2022-03-24 17:26:53
 * @LastEditTime: 2022-03-25 11:33:22
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
        <el-tabs v-model="activeName" stretch class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="我(0)" name="first">
                <List />
            </el-tab-pane>
            <el-tab-pane label="待分配(99)" name="second">Config</el-tab-pane>
            <el-tab-pane label="全部" name="third">Role</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang='ts'>
import { Search } from '@element-plus/icons-vue'
import List from "./list.vue"

const activeName = ref('first')
const input2 = ref('')
const handleClick = () => 11
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