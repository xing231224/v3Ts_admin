/*
 * @Author: your name
 * @Date: 2022-02-18 11:11:15
 * @LastEditTime: 2022-07-06 15:12:09
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\store\routers.ts
 */
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import asyncRoutes from '@/router/route.async';
import commonRoutes from '@/router/route.common';

interface obj {
    path: string;
    name: any;
    title: any;
}
interface state {
    routers: RouteRecordRaw[];
    addRouters: RouteRecordRaw[];
    navRouters: obj[];
}

const routers = defineStore({
    id: 'routers',
    state: (): state => {
        return {
            routers: commonRoutes || [],
            addRouters: [],
            navRouters: [],
        };
    },
    getters: {
        getRouters: (state) => state.routers,
        getAddRouters: (state) => state.addRouters,
        getNavRouter: (state) => state.navRouters,
    },
    actions: {
        async GenerateRoutes() {
            this.routers = commonRoutes.concat(asyncRoutes);
            this.addRouters = asyncRoutes;
        },
        addNavRouter(routeObj: obj) {
            this.navRouters.push(routeObj);
        },
        delNavRouter(path: string) {
            // this.navRouters = this.navRouters.filter((item) => item.path != path);
            this.navRouters.splice(
                this.navRouters.findIndex((item) => item.path == path),
                1,
            );
        },
    },
});
export default routers;
