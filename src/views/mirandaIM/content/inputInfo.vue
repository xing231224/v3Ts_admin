<!--
 * @Author: your name
 * @Date: 2022-03-25 14:21:47
 * @LastEditTime: 2022-03-25 14:42:47
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\content\inputInfo.vue
-->
<template>
    <el-input v-model="textarea" class="textarea" type="textarea" placeholder="Please input" />
</template>

<script setup lang='ts'>
const textarea = ref('')
</script>

<style lang='scss' scoped>
.textarea {
    height: 100%;
    &::v-deep(textarea) {
        min-height: 100% !important;
        padding: 10px;
        border: 0;
        &::-webkit-scrollbar {
            width: 7px;
            height: 5px;
            border-radius: 15px;
            -webkit-border-radius: 15px;
        }

        &::-webkit-scrollbar-track-piece {
            background-color: #ffff;
            border-radius: 15px;
            -webkit-border-radius: 15px;
            /* opacity: .8; */
            background: transparent;
        }

        &::-webkit-scrollbar-thumb:vertical {
            height: 5px;
            background-color: rgba(144, 147, 153, 0.5);
            border-radius: 15px;
            -webkit-border-radius: 15px;
        }

        &::-webkit-scrollbar-thumb:horizontal {
            width: 7px;
            background-color: rgba(144, 147, 153, 0.5);
            border-radius: 15px;
            -webkit-border-radius: 15px;
        }
    }
}
</style>