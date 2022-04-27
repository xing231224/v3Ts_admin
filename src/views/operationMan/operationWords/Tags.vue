<!--
 * @Author: your name
 * @Date: 2022-04-06 16:55:30
 * @LastEditTime: 2022-04-13 10:19:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\verbalTRStock\Tags.vue
-->
<template>
    <div v-for="(item, index) in list" :id="`actionli_${item.id}`" :key="item.id" class="actionli el-tag"
        @contextmenu.prevent="del(index)">
        <el-popover v-if="isPre" trigger="click" placement="bottom">
            <Select :data-obj="branchList[index]" @change-name="changeName"></Select>
            <template #reference>
                <span style="position: relative; top: -4px; cursor: pointer">{{ item.name }}</span>
            </template>
        </el-popover>
        <span v-else style="position: relative; top: -4px; cursor: pointer">
            {{ item.name }}
        </span>
    </div>
</template>

<script setup lang='ts'>
import Select from "./Select.vue"

// eslint-disable-next-line vue/require-prop-types
defineProps(['list', 'isPre', 'branchList'])

const emit = defineEmits(['delBranch', 'changeData'])

function del(index: any) {
    emit("delBranch", index);
}
function changeName(val: any) {
    emit("changeData", val);
}

</script>

<style lang='scss' scoped>
.actionli {
    margin-top: 10px;
    float: left;
    margin-right: 4px;
    padding: 5px;

    /* position: relative; */
    background-color: #bce8f1;
}
</style>