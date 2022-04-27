<!--
 * @Author: your name
 * @Date: 2022-04-02 10:45:44
 * @LastEditTime: 2022-04-06 09:24:37
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\components\InputBox\index.vue
-->
<template>
    <div ref="input_box" class="input_box" contenteditable="true" @keydown="inputKeyUp">
        <p>&nbsp;</p>
    </div>
</template>

<script setup lang='ts'>
const input_box = ref<HTMLDivElement>()
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['enter'])
// interface stateType {
//     cursor: number
//     position: Range | undefined
// }
// const state = reactive<stateType>({
//     cursor: 0,
//     position: undefined,
// })
// const emit = defineEmits(['change', 'addContent',]);
// 设置光标位置
function setCaretPosition(ctrl: Node | Text) {
    // Modern browsers
    const s = window.getSelection();
    const r = document.createRange();
    r.setStart(ctrl, 1);
    r.setEnd(ctrl, 1);
    s?.removeAllRanges();
    s?.addRange(r);
}
// 光标处加入内容
// function clickInsert(node: Node | Text) {
//     state.position = window.getSelection()?.getRangeAt(0)
//     state.position?.insertNode(node)
//     setCaretPosition(node)
// }
// 文本换行
const newLine = () => {
    const p = document.createElement("p")
    p.innerHTML = '&nbsp;'
    input_box.value?.appendChild(p)
    setCaretPosition(p)
}
// 监听键盘事件
const inputKeyUp = (e: KeyboardEvent) => {
    // ctrl + enter
    if (e.ctrlKey && e.key == 'Enter') {
        console.log('ctrl + enter');
        // props.ctrlEnter()
        newLine()
    }
    // enter
    if (!e.ctrlKey && e.key == 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        console.log('enter');
        props.enter()
    }
}
// 光标处加入内容
function insertStr(str: any) {
    console.log(str);
    // input_box.value?.focus();
    const selection = window.getSelection ? window.getSelection() : document.selection;
    const range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
    if (!window.getSelection) {
        range.innerText(str);
        range.collapse(false);
        range.select();
        // input_box.value?.focus();
    } else {
        range.collapse(false);
        const hasR = range.createContextualFragment(str);
        let hasR_lastChild = hasR.lastChild;
        while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {
            const e = hasR_lastChild;
            hasR_lastChild = hasR_lastChild.previousSibling;
            hasR.removeChild(e)
        }
        range.insertNode(hasR);
        if (hasR_lastChild) {
            range.setEndAfter(hasR_lastChild);
            range.setStartAfter(hasR_lastChild)
        }
        selection.removeAllRanges();
        selection.addRange(range)
        // input_box.value?.focus();
    }
};
// 获取html或者text
const getChildNode = (type: string) => {
    return type === 'html' ? input_box.value?.innerHTML : input_box.value?.innerText
}

// 粘贴图片
// const pasteIntercept = (d: any) => {
//     const obj = {
//         data: "",
//         mode: 0,
//     };
//     // eslint-disable-next-line no-plusplus
//     for (let b = 0; b < d.clipboardData.items.length; b++) {
//         const c = d.clipboardData.items[b];
//         if (c.type == "image/png") {
//             obj.mode = 1;
//             const a = new FileReader() as any;
//             a.onloadend = () => {
//                 obj.data = a.result.substr(a.result.indexOf(",") + 1);
//                 insertStr(`<img src="data:image/png;base64,${obj.data}" alt="" />`)
//             };
//             a.readAsDataURL(c.getAsFile());
//             break;
//         }
//     }
// }
onMounted(() => {
    input_box.value?.focus()
})
// 使用这个方法导出方法或者属性 便于父组件通过ref 获取到实例
defineExpose({
    insertStr,
    getChildNode
})


</script>

<style lang='scss' scoped>
.input_box {
    width: 100%;
    height: 100%;
    outline: none;
    font-family: 仿宋;
    padding: 0 20px;
    font-size: 14px;
}
</style>