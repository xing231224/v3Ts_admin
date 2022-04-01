<!--
 * @Author: your name
 * @Date: 2022-03-21 14:58:57
 * @LastEditTime: 2022-03-29 15:23:52
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\views\Layout\components\index.vue
-->
<template>
    <el-menu
        class="el-menu-vertical-demo"
        style="height: 100%"
        ss
        router
        :default-active="activeMenu"
        :unique-opened="false"
        mode="vertical"
        active-text-color="#F39C12"
    >
        <template v-for="item in routeList" :key="item.name">
            <el-menu-item
                v-if="item.meta && item.children?.length && item.children.length == 1"
                :key="item.path"
                :index="item.path"
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
                        <svg-icon v-if="item.meta?.icon" :name="(row.meta?.icon as string)"></svg-icon>
                        <span>{{ row.meta?.title }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </template>
    </el-menu>
</template>

<script setup lang="ts">
import { RouteRecordRaw } from "vue-router"
import routers from '@/store/routers';

const route = useRoute();

const routeList = routers().getAddRouters.filter((item) => item.children);

const activeMenu = computed(() => {
    const { path } = route;
    return path;
});
const getObj = (path: string, routeList: RouteRecordRaw[]) => {
    interface obj {
        path: string,
        name: any,
        title: any
    }
    let objs = {} as obj;
    let routeObj = {} as RouteRecordRaw;
    const routePath = path.split('/').slice(1, path.split('/').length)
    if (routePath.length > 1) {
        routePath.forEach(item => {
            // 先找根路径
            routeObj = (routeList.find(item => item.name == routePath[0])?.children?.find(row => row.name == item)) as RouteRecordRaw
        })
        objs = {
            path,
            name: routeObj.name,
            title: routeObj.meta?.title
        }
    } else {
        routeObj = routeList.find(item => item.name == routePath[0]) as RouteRecordRaw
        objs = {
            path: routeObj.path,
            name: routeObj.name,
            title: routeObj.meta?.title
        }
    }
    return objs
}
watch(route, (n) => {
    const obj = getObj(n.path, routeList)
    if (routers().getNavRouter.find(item => item.name == obj.name)) return
    routers().addNavRouter(getObj(n.path, routeList))
}, {
    immediate: true
})


</script>

<style lang="scss" scoped></style>
