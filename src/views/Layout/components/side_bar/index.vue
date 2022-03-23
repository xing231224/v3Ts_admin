<!--
 * @Author: your name
 * @Date: 2022-03-21 14:58:57
 * @LastEditTime: 2022-03-23 16:23:05
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\views\Layout\components\index.vue
-->
<template>
    <el-menu
        class="el-menu-vertical-demo"
        style="height: 100%;"
        router
        :default-active="activeMenu"
        :unique-opened="false"
        mode="vertical"
        active-text-color="#F39C12"
    >
        <template v-for="item in routeList" :key="item.name">
            <el-menu-item
                v-if="item.meta && item.children?.length && item.children.length == 1"
                :index="item.path"
                :key="item.path"
            >
                <template #title>
                    <!-- <component :is="'Baseline10k'"></component> -->
                    <svg-icon v-if="item.meta?.icon" :name="(item.meta?.icon as string)"></svg-icon>
                    <span>{{ item.meta?.title }}</span>
                </template>
            </el-menu-item>
            <el-sub-menu v-else :index="item.path">
                <template #title>
                    <svg-icon v-if="item.meta?.icon" :name="(item.meta?.icon as string)"></svg-icon>
                    <span>{{ item.meta?.title }}</span>
                </template>
                <el-menu-item-group v-for="row in item.children" :key="row.path">
                    <el-menu-item :index="item.path + '/' + row.path">
                        <svg-icon v-if="item.meta?.icon" :name="(item.meta?.icon as string)"></svg-icon>
                        <span>{{ row.meta?.title }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </template>
    </el-menu>
</template>

<script setup lang='ts'>
import routers from '@/store/routers';
const route = useRoute()

const routeList = routers().getAddRouters.filter(item => item.children)

const activeMenu = computed(() => {
    const { meta, path } = route
    return path
})




</script>

<style lang='scss' scoped>
</style>