<!--
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-03-25 15:37:08
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\src\views\home\index.vue
-->
<template>
    <!-- <div class="layout">

    </div>-->
    <el-container class="layout">
        <el-aside width="200px" style="background-color: #fff;overflow: hidden;">
            <img src="../../assets/logo.png" style="width: 80%;margin:10px auto;display: block;" />
            <SideBar />
        </el-aside>
        <el-container>
            <el-header class="header">
                <NavigationBar />
            </el-header>
            <el-main class="main">
                <AppMain />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import AppMain from "./components/AppMain.vue"
import SideBar from "./components/side_bar/index.vue"
import NavigationBar from "./components/navigation_bar/index.vue"
</script>

<style lang="scss" scoped>
.layout {
    background-color: #e5e7eb61;
    height: 100vh;
    .header {
        padding: 10px 0 0 !important;
        height: auto;
    }
    .main {
        width: 99%;
        background-color: #fff;
        padding-top: 0;
        padding-left: 0;
        border-top: 4px solid #f39c12;
        border-right: 4px solid #f39c12;
        border-top-right-radius: 10px;
        padding: 0;
    }
}
</style>
