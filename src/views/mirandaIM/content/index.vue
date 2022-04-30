<!--
 * @Author: your name
 * @Date: 2022-03-25 10:39:43
 * @LastEditTime: 2022-04-30 16:36:49
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\content\index.vue
-->
<template>
    <!-- vue3页面 -->
    <el-container class="content">
        <el-header height="auto" class="flex-sb" style="padding: 0; border-bottom: 1px solid #e5e7eb;">
            <p>{{ contentMess.name }}</p>
            <div v-if="isHidden" class="juz" style="margin-right: 10px;cursor: pointer;" @click="openVerbal()">
                <i-teenyicons-double-caret-right-outline class="wh_16" />
            </div>
        </el-header>
        <el-main>
            <ul class="message">
                <li class="opposite">
                    <div class="flex">
                        <el-avatar shape="square" :size="20" style="display: block;"
                            :src="contentMess.avatorUrl ? contentMess.avatorUrl : `https://imgsa.baidu.com/forum/pic/item/023b5bb5c9ea15ce85b34b6eb1003af33a87b27c.jpg`" />
                        <span class="juz" style="margin: 0 10px;">{{ contentMess.name }}</span>
                        <span class="juz">{{ contentMess.newTime }}</span>
                    </div>
                    <span class="opposite_content">{{ contentMess.context }}</span>
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
        </el-main>
        <el-footer height="200px" class="footer">
            <inputInfoVue @get-progress="getProgress" @success-upload="successUpload" />
        </el-footer>
    </el-container>
</template>

<script setup lang='ts'>
import tx from "../../../assets/age1f-rzq97.png"
import inputInfoVue from './inputInfo.vue';
import Store from "@/store/message"

const myMessage = Store()
const contentMess = ref({}) as any

const isHidden = ref(false)

const openVerbal = () => {
    myMessage.setHiddenAside(false)
}
// 获取file信息以及上传进度 上传 成功 之后的url
const getProgress = (filePercent: number) => {
    console.log(filePercent);
}
const successUpload = (obj: { file: File, fileURL: string }) => {
    console.log(obj);
}
watchEffect(() => {
    contentMess.value = computed(() => myMessage.getContextObj).value
    isHidden.value = computed(() => myMessage.getHiddenAside).value
})
</script>

<style lang='scss' scoped>
.content {
    width: 100%;
    height: 100%;
    border-top: 0;

    .wh_16 {
        width: 16px;
        height: 16px;
    }

    p {
        height: 45px;
        padding: 10px 20px;
    }

    .message {
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

    .footer {
        position: relative;
        padding: 0;
        border-top: 1px solid #e5e7eb;
    }
}
</style>