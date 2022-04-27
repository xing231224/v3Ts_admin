<!--
 * @Author: your name
 * @Date: 2022-04-07 10:23:31
 * @LastEditTime: 2022-04-13 10:19:30
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\verbalTRStock\Select.vue
-->
<template>
    <div class="el-scrollbar">
        <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px">
            <ul class="el-scrollbar__view el-select-dropdown__list" style="position: relative">
                <!---->
                <li v-for="(item, index) in list" :key="item.id" class="el-select-dropdown__item"
                    @dblclick.stop="isEdit && index == 0 ? changeInp() : null">
                    <el-input v-if="isEdit && isInput" ref="saveInput" v-model="item.name" class="input-new-tag"
                        @keyup.enter="handleInput(item)" />
                    <el-tag class="tags" :closable="index == 0 ? false : true" @close="handleClose(item)">
                        <span>{{ item.name }}</span>
                    </el-tag>
                </li>
                <li class="el-select-dropdown__item">
                    <el-input v-show="inputVisible" ref="saveTagInput" v-model="inputValue" class="input-new-tag"
                        @keyup.enter="handleInputConfirm" />
                    <el-button v-show="!inputVisible" class="button-new-tag" size="small" @click="showInput">+ New Tag
                    </el-button>
                </li>

                <div class="resize-triggers">
                    <div class="expand-trigger">
                        <div style="width: 239px; height: 183px"></div>
                    </div>
                    <div class="contract-trigger"></div>
                </div>
            </ul>
        </div>
        <div class="el-scrollbar__bar is-horizontal">
            <div class="el-scrollbar__thumb" style="transform: translateX(0%)"></div>
        </div>
        <div class="el-scrollbar__bar is-vertical">
            <div class="el-scrollbar__thumb" style="transform: translateY(0%)"></div>
        </div>
    </div>
</template>


<script setup lang='ts'>
import { updateBranchNode } from "@/api/modules/operationMang/operationword";
import { deepCopy } from "@/utils/mineUtils";

const { proxy: { $tips } } = getCurrentInstance() as any;
const emit = defineEmits(['changeName'])
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['dataObj'])
const saveInput = ref()
const saveTagInput = ref()
const state = reactive({
    list: [] as any[],
    inputVisible: false,
    inputValue: "",
    isEdit: false,
    isInput: false,
    input: "",
    memberId: "",
})
function changeInp() {
    state.isInput = true;
    nextTick(() => {
        saveInput.value.focus();
    });
}
function updataKeyWord(name = '', childName = '') {
    return new Promise<void>((resolve, reject) => {
        const arr = deepCopy(state.list);
        const obj = deepCopy(props.dataObj);
        let keyword = arr.map((item: { name: any; }) => item.name);
        if (name) {
            obj.name = name;
        }
        if (childName) {
            keyword.splice(keyword.indexOf(childName), 1);
        }
        keyword.splice(0, 1);
        keyword = keyword.join(",");
        obj.keyword = keyword;
        updateBranchNode(obj).then((res: any) => {
            if (res.data.status === 200) {
                $tips("success", res.data.msg);
                resolve();
            } else {
                $tips("error", res.data.msg);
                reject();
            }
        });
    });
}
function handleInput(item: { name: any; }) {
    state.isInput = false;
    emit("changeName", item);
    updataKeyWord(item.name);
}
function showInput() {
    state.inputVisible = true;
    nextTick(() => {
        saveTagInput.value.$refs.input.focus();
    });
}
function handleInputConfirm() {
    const { inputValue } = state;
    if (inputValue) {
        state.list.push({
            id: state.list.length + 2,
            name: inputValue,
        });
    }
    updataKeyWord().then(() => {
        state.inputVisible = false;
        state.inputValue = "";
    });
}

function handleClose(item: any) {
    updataKeyWord('', item.name).then(() => {
        state.list.splice(state.list.indexOf(item), 1);
    });
}

onMounted(() => {
    const arr = ["肯定", "否定", "没听清", "其他"];
    state.isEdit = !arr.includes(props.dataObj.name);
    state.list.push({ id: 0, name: props.dataObj.name });
    // eslint-disable-next-line no-unused-expressions
    props.dataObj.keyword
        ? props.dataObj.keyword.split(",").forEach((item: any, index: number) => {
            state.list.push({
                id: index + 1,
                name: item,
            });
        })
        : null;
})


const { list, isEdit, inputVisible, inputValue, isInput } = toRefs(state)
</script>

<style lang='scss' scoped>
.el-scrollbar {
    padding-bottom: 12px;
}

@keyframes resizeanim {
    from {
        opacity: 0;
    }

    to {
        opacity: 0;
    }
}

.resize-triggers {
    animation: 1ms resizeanim;
    visibility: hidden;
    opacity: 0;
}

.resize-triggers,
.resize-triggers>div,
.contract-trigger:before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: -1;
}

.resize-triggers>div {
    background: #eee;
    overflow: auto;
}

.contract-trigger:before {
    width: 200%;
    height: 200%;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.tags {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    height: 100%;
}
</style>