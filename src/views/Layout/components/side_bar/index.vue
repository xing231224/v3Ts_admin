<!--
 * @Author: your name
 * @Date: 2022-03-21 14:58:57
 * @LastEditTime: 2022-03-22 16:48:29
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\views\Layout\components\index.vue
-->
<template>
    <!-- vue3页面 -->
    <!-- <div></div> -->
    <el-menu
        class="el-menu-vertical-demo"
        style="height: 100%;"
        router
        :default-active="activeMenu"
        :unique-opened="false"
        mode="vertical"
    >
        <template v-for="item in routeList" :key="item.name">
            <el-menu-item
                v-if="item.meta && item.children?.length && item.children.length == 1"
                :index="item.path"
                :key="item.path"
            >
                <span>{{ item.meta?.title }}</span>
            </el-menu-item>
            <el-sub-menu v-else :index="item.path">
                <template #title>
                    <span>{{ item.meta?.title }}</span>
                </template>
                <el-menu-item-group v-for="row in item.children" :key="row.path">
                    <el-menu-item :index="item.path + '/' + row.path">{{ row.meta?.title }}</el-menu-item>
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