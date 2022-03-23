<!--
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-03-22 17:02:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\src\views\home\index.vue
-->
<template>
    <!-- <div class="layout">

    </div>-->
    <el-container class="layout">
        <el-aside width="200px">
            <SideBar />
        </el-aside>
        <el-container>
            <el-header class="header">
                <NavigationBar />
            </el-header>
            <el-main>
                <AppMain />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import asyncRoutes from "@/router/route.async"
import AppMain from "./components/AppMain.vue"
import SideBar from "./components/side_bar/index.vue"
import NavigationBar from "./components/navigation_bar/index.vue"
</script>

<style lang="scss" scoped>
.layout {
    background-color: #e5e7eb61;
    .header {
        padding: 10px 0 0 !important;
    }
}
</style>
