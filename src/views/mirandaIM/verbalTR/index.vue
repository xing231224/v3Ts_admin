<!--
 * @Author: your name
 * @Date: 2022-03-25 10:42:04
 * @LastEditTime: 2022-04-15 11:41:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\verbalTrick\index.vue
-->
<template>
    <!-- vue3页面 -->
    <div class="verbal_header flex-sb">
        <div class="flex-sa" style="flex: .5;">
            <div class="juz active">
                <i-ph-folder-notch-open class="wh_30" />
            </div>
            <div class="juz">
                <i-icon-park-outline-people-speak class="wh_16" />
            </div>
            <div class="juz">
                <i-gis-search-attribtues class="wh_16" />
            </div>
        </div>
        <div class="juz" @click="closeVerbal()">
            <i-teenyicons-double-caret-left-outline class="wh_16" />
        </div>
    </div>
    <div style="--el-color-primary:#F39C12">
        <el-tabs v-model="activeName" stretch class="demo-tabs">
            <el-tab-pane label="公司话术" name="first">
                <div class="verbal_Tree">
                    <el-input v-model="input2" class="verbal_search" placeholder="Please Input" :prefix-icon="Search" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="我的话术" name="second">Config</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang='ts'>
import { Search } from '@element-plus/icons-vue'
import Store from "@/store/message"

const myMessage = Store()
const input2 = ref('')
const activeName = ref("first")
const closeVerbal = () => {
    myMessage.setHiddenAside(true)
}


</script>

<style lang='scss' scoped>
.verbal_header {
    padding: 10px 20px;
    border-bottom: 1px solid #e5e7eb;
    height: 45px;

    .active {
        color: #f39c12;
    }

    .juz {
        cursor: pointer;
    }

    .wh_30 {
        width: 30px;
        height: 30px;
    }

    .wh_16 {
        width: 16px;
        height: 16px;
    }
}

.verbal_Tree {
    padding: 0 20px;

    .verbal_search {
        margin-bottom: 10px;
    }
}
</style>