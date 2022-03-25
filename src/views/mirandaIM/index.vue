<!--
 * @Author: your name
 * @Date: 2022-03-21 14:09:09
 * @LastEditTime: 2022-03-25 16:09:33
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\views\mirandaIM\index.vue
-->
<template>
    <!-- vue3页面 -->
    <el-container>
        <el-header height="auto" style="font-size: 14px;border-bottom: 1px solid #e5e7eb;">
            <div class="flex" style="padding: 5px 0;">
                <span class="juz">在线状态</span>
                <span class="juz mr-5">
                    <i-ph-question-thin />
                </span>
                <el-switch v-model="value" size="large" />
                <div class="juz" style="margin: 0 10px;">
                    <el-divider direction="vertical" />
                </div>
                <span class="juz">最大接待人数</span>
                <span class="juz mr-5">
                    <i-ph-question-thin />
                </span>
                <span class="juz mr-5">10</span>
                <span class="juz">
                    <i-system-uicons-write />
                </span>
                <div class="juz" style="margin: 0 10px;">
                    <el-divider direction="vertical" />
                </div>
                <span class="juz">优先旧消息</span>
                <span class="juz mr-5">
                    <i-ph-question-thin />
                </span>
                <el-switch v-model="value" size="large" />
                <div class="juz" style="margin: 0 10px;">
                    <el-divider direction="vertical" />
                </div>
                <span class="juz">开启新消息通知</span>
                <span class="juz mr-5">
                    <i-ph-question-thin />
                </span>
                <el-switch v-model="value" size="large" />
            </div>
        </el-header>
        <el-container>
            <el-aside width="260px">
                <FriendList />
            </el-aside>
            <el-main style="padding: 0;">
                <Content />
            </el-main>
            <el-aside width="300px">
                <VerbalTrick />
            </el-aside>
        </el-container>
    </el-container>
</template>

<script setup lang='ts'>
import FriendList from "./friendList/index.vue"
import Content from "./content/index.vue"
import VerbalTrick from "./verbalTrick/index.vue"

const value = ref(false)
</script>

<style lang='scss' scoped>
.mr-5 {
    margin-right: 5px;
    font-size: 12px;
}
</style>