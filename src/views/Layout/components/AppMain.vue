<!--
 * @Author: your name
 * @Date: 2022-03-21 14:57:39
 * @LastEditTime: 2022-03-22 17:11:11
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\views\Layout\components\AppMain.vue
-->
<template>
    <section style="height: 100vh;">
        <router-view :key="key"></router-view>
    </section>
</template>

<script setup lang='ts'>
const Route = useRoute()
const key = () => {
    return Route.path
}
</script>

<style lang='scss' scoped>
</style>