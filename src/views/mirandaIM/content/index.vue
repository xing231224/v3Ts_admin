<!--
 * @Author: your name
 * @Date: 2022-03-25 10:39:43
 * @LastEditTime: 2022-03-25 15:55:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\content\index.vue
-->
<template>
    <!-- vue3页面 -->
    <el-container class="content">
        <el-header height="auto" style="padding: 0;">
            <p>喜羊羊</p>
        </el-header>
        <el-main>
            <liaotianVue />
        </el-main>
        <el-footer height="140px" style="padding: 0;border-top: 1px solid #e5e7eb;">
            <inputInfoVue />
        </el-footer>
    </el-container>
</template>

<script setup lang='ts'>
import inputInfoVue from './inputInfo.vue';
import liaotianVue from './liaotian.vue';
</script>

<style lang='scss' scoped>
.content {
    width: 100%;
    height: 100%;
    border: 1px solid #e5e7eb;
    border-top: 0;
    p {
        height: 45px;
        padding: 10px 20px;
        border-bottom: 1px solid #e5e7eb;
    }
}
</style>