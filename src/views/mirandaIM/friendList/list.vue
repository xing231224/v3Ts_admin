<!--
 * @Author: your name
 * @Date: 2022-03-25 09:45:11
 * @LastEditTime: 2022-04-21 15:27:42
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\friendList\list.vue
-->
<template>
    <!-- vue3页面 -->
    <ul class="friend_list">
        <el-scrollbar :min-size="10">

            <li v-for="item in lists" :key="item.id" :class="item.id == activeId ? `flex active` : `flex`"
                @click="openMessage(item)">
                <el-badge :value="item.unread" class="juz">
                    <el-avatar shape="square" style="display: block;" :src="item.avatar" />
                </el-badge>
                <div class="flex-col">
                    <div class="flex-sb">
                        <span>{{ item.nickName }}</span>
                        <span>{{ item.newTime }}</span>
                    </div>
                    <p>{{ item.context }}</p>
                </div>
            </li>
        </el-scrollbar>
    </ul>
</template>

<script setup lang='ts'>

// import tx from "../../../assets/age1f-rzq97.png"
import Store from "@/store/message"
import { userType } from "./type"

interface propsType {
    lists: Array<userType>,
}
defineProps<propsType>()
const myMessage = Store()
const activeId = ref('') as any

const openMessage = (item: any) => {
    myMessage.setContextObj(item)
}
watchEffect(() => {
    activeId.value = computed(() => myMessage.getActiveId).value
})
</script>

<style lang='scss' scoped>
.friend_list {
    height: calc(100vh - 250px);
    list-style: none;
    background-color: #fff;
    margin: 0px;
    padding: 0px 0px;

    li {
        // margin: 0 0 5px;
        border-bottom: 1px solid #e5e7eb;
        padding: 15px 10px 10px;
        font-size: 12px;
        color: #444444;
        cursor: pointer;

        &:hover {
            background-color: #f7f7f7;
            color: #f39c12;
            border-left: 2px solid #f39c12;

            a {
                color: #f39c12;
            }
        }

        a {
            color: #000;
            display: inline-block;
            width: 100%;
            height: 100%;
        }

        &.active {
            background-color: #f7f7f7;
            color: #f39c12;
            border-left: 2px solid #f39c12;

            a {
                color: #f39c12;
            }
        }

        .flex-col {
            flex: 1;
            margin-left: 20px;
            justify-content: space-between;
        }
    }
}
</style>