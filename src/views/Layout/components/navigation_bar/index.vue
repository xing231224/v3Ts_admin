<!--
 * @Author: your name
 * @Date: 2022-03-21 14:59:41
 * @LastEditTime: 2022-07-06 15:17:28
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\views\Layout\components\navigation_bar\index.vue
-->
<template>
    <div v-if="state.routeList?.length > 0" class="tabbed flex-sb">
        <ul>
            <template v-for="item in state.routeList" :key="item?.name">
                <li
                    :class="
                        item?.path == activePath
                            ? 'active animate__animated animate__backInDown animate__faster'
                            : 'animate__animated animate__backInDown animate__faster'
                    "
                    @click="goPath(item?.path)"
                >
                    <span>{{ item?.title }}</span>
                    <span v-show="state.routeList?.length != 1" class="close" @click.stop="delNavRouter(item.path)">
                        <i-ion-ios-close-circle-outline />
                    </span>
                </li>
            </template>
        </ul>
        <div class="flex">
            <el-dropdown class="avatar-container" trigger="click">
                <el-popover placement="bottom-start" :width="200" trigger="hover">
                    <template #reference>
                        <el-tooltip effect="dark" content="点击查看更多功能" placement="bottom">
                            <div class="juz tx">
                                <el-avatar :size="30" :src="tx" />
                            </div>
                        </el-tooltip>
                    </template>
                </el-popover>
                <template #dropdown>
                    <el-dropdown-menu class="user-dropdown">
                        <router-link class="inlineBlock" to="/">
                            <el-dropdown-item>主页</el-dropdown-item>
                        </router-link>

                        <!-- <router-link class="inlineBlock" to="/">
                            <el-dropdown-item>修改信息</el-dropdown-item>
                        </router-link> -->

                        <el-dropdown-item divided>
                            <span style="display: block" @click="logout">退出登录</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <span class="juz" style="font-size: 14px">{{ userStore().mobile }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import Store from '@/store/routers';
import userStore from '@/store/user';
import tx from '@/assets/age1f-rzq97.png';

interface routeObj {
    path: string;
    name: any;
    title: any;
}

const Route = useRoute();
const Router = useRouter();
const routerStore = Store();
const state = reactive({
    routeList: [] as routeObj[],
});
const activePath = ref(Route.path);

const delNavRouter = (path: string) => {
    routerStore.delNavRouter(path);
    const navList = routerStore.getNavRouter;
    if (navList.length > 0) {
        Router.push(navList[navList.length - 1].path);
    }
};

const logout = () => {
    userStore()
        .loginOut()
        .then(() => {
            window.location.reload();
        });
};

watchEffect(() => {
    state.routeList = routerStore.navRouters;
    if (!userStore().mobile) {
        userStore().$patch({
            mobile: localStorage.getItem('nikename') || '',
        });
    }
});
watch(Route, (n) => {
    nextTick(() => {
        activePath.value = n.path;
    });
});
const goPath = (path: string) => {
    if (path == Route.path) return;
    Router.push(path);
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tabs.css';

.tabbed {
    border: 0;

    ul {
        padding-top: 10px;

        li {
            position: relative;

            .close {
                display: none;
                position: absolute;
                right: -24px;
                top: -12px;

                svg {
                    width: 25px;
                    height: 25px;
                    z-index: 99999;
                }
            }

            &:hover {
                .close {
                    display: block;
                }
            }
        }
    }

    .tx {
        margin-right: 5px;
        cursor: pointer;
        animation: rotate 3s linear infinite;

        &:hover {
            animation: normal;
        }
    }
}

.flex ::v-deep(.el-tooltip__trigger) {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

@keyframes rotate {
    0% {
        -webkit-transform: rotate(0deg);
    }

    25% {
        -webkit-transform: rotate(90deg);
    }

    50% {
        -webkit-transform: rotate(180deg);
    }

    75% {
        -webkit-transform: rotate(270deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
    }
}
</style>
