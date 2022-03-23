<!--
 * @Author: your name
 * @Date: 2022-03-23 14:47:12
 * @LastEditTime: 2022-03-23 16:02:47
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\components\SvgIcon\index.vue
-->
<template>
    <svg :class="svgClass" aria-hidden="true" v-on="$attrs" :style="`color:${props.color}`">
        <use :xlink:href="iconName" />
    </svg>
</template>
<script lang="ts">
export default {
    name: 'SvgIcon'
}
</script>
<script setup lang="ts">
/**
 * 名称：SvgIcon
 * @param name String required
 * @param color String
 * 依赖：src/plugins/svgBuilder.js 需要在 vite中配置
 * 使用方式：
 * 在 template 中使用 <svg-icon name="bug"/>
 */


/* data */
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: ''
    }
}) // 获取props defineProps<{ msg: string }>()
const iconName = computed((): string => `#icon-${props.name}`)
const svgClass = computed((): string => {
    if (props.name) {
        return `svg-icon icon-${props.name}`
    } else {
        return 'svg-icon'
    }
})
</script>

<style scoped>
.svg-icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    margin: 0 10px;
}
</style>
