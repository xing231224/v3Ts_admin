<!--
 * @Author: your name
 * @Date: 2022-03-17 11:22:00
 * @LastEditTime: 2022-03-21 14:35:43
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\components\Tabs\TabsItem.vue
-->

<template>
    <!-- vue3页面 -->
    <div class="pane" v-show="name == tabActive">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    name: String as () => any,
    label: String as () => any,
});
let tabActive = ref() as any;
tabActive = inject('tabActive');

</script>

<style lang="scss" scoped>
.pane {
    width: 100%;
    height: calc(100vh - 70px);
    box-shadow: 0px 1px 3px 1px #8d6f6f;
    background-color: #fff;
}
</style>
