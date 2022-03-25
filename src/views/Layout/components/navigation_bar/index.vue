<!--
 * @Author: your name
 * @Date: 2022-03-21 14:59:41
 * @LastEditTime: 2022-03-25 15:23:34
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\views\Layout\components\navigation_bar\index.vue
-->
<template>
    <div v-show="routeList.length > 0" :class="`tabbed flex-sb`">
        <ul>
            <li
                v-for="item in routeList"
                :key="item.path"
                :class="
                    item.path == activePath
                        ? 'active animate__animated animate__backInDown animate__faster'
                        : 'animate__animated animate__backInDown animate__faster'
                "
                @click="goPath(item.path)"
            >{{ item.title }}</li>
        </ul>
        <div class="juz">
            <!-- <slot name="headerRight"></slot> -->
        </div>
    </div>
</template>
<script setup lang="ts">
import Store from '@/store/routers';

const Route = useRoute();
const Router = useRouter();
const routeList = Store().getNavRouter;
const activePath = ref(Route.path);

watch(Route, (n) => {
    activePath.value = n.path;
});
const goPath = (path: string) => {
    if (path == Route.path) return;
    Router.push(path);
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/tabs.css";
.tabbed {
    border: 0;
}
</style>
