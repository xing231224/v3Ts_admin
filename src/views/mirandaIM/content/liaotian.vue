<!--
 * @Author: your name
 * @Date: 2022-03-25 14:44:13
 * @LastEditTime: 2022-03-25 16:06:05
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\content\liaotian.vue
-->
<template>
    <!-- vue3页面 -->
    <ul>
        <li class="opposite">
            <div class="flex">
                <el-avatar shape="square" :size="20" style="display: block;" :src="tx" />
                <span class="juz" style="margin: 0 10px;">昵称</span>
                <span class="juz">时间</span>
            </div>
            <span class="opposite_content">我已经添加了你，现在我们可以开始聊天了。</span>
        </li>
        <li class="me">
            <div class="avatar_info">
                <el-avatar shape="square" :size="20" style="display: block;" :src="tx" />
                <span class="juz" style="margin: 0 10px;">昵称</span>
                <span class="juz">时间</span>
            </div>
            <span class="me_content">
                哈喽家长好呀~感谢您来参加领礼品活动享
                <br />请回复3我给您发领取方法，完成后发给您领奖码~
                <br />t点链接查看礼品清单(全场任选)
                <br />https://jinshuju.net/f/XVkaPI
                <br />首每人限领1次哦~后续我会继续为您提供免费礼品活动、低价斑马课程、
            </span>
        </li>
    </ul>
</template>

<script setup lang='ts'>
import tx from "../../../assets/age1f-rzq97.png"
</script>

<style lang='scss' scoped>
ul {
    height: 100%;
    font-size: 14px;
    overflow: hidden;
    li {
        margin: 10px 0;
    }
    .juz {
        font-size: 12px;
    }
    .opposite_content {
        display: inline-block;
        margin-left: 30px;
        padding: 2px 15px;
        background-color: #e9e9e9;
        border-radius: 4px;
    }
    .right {
        float: right;
    }
    .left {
        float: left;
    }
    .me {
        float: right;
        .avatar_info {
            display: flex;
            flex-direction: row-reverse;
        }
        .me_content {
            display: inline-block;
            margin-right: 30px;
            padding: 2px 15px;
            background-color: #cbe5fe;
            border-radius: 4px;
        }
    }
}
</style>