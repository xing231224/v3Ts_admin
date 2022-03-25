/*
 * @Author: your name
 * @Date: 2022-02-16 12:40:17
 * @LastEditTime: 2022-03-24 15:49:56
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEc
 * @FilePath: \v3-ts_demo\src\router\index.ts
 */
import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import exceptionRoutes from '@/router/route.exception';
import asyncRoutes from '@/router/route.async';
import commonRoutes from '@/router/route.common';
import routers from '@/store/routers';

const routes: Array<RouteRecordRaw> = [
    // 无鉴权的业务路由 ex:登录
    ...commonRoutes,
    // 带鉴权的业务路由
    ...asyncRoutes,
    // 异常页必须放在路由匹配规则的最后
    ...exceptionRoutes,
];

const router: Router = createRouter({
    // 新的vue-router4 使用 history路由模式 和 base前缀
    history: createWebHistory(import.meta.env.VITE_BASE),
    routes,
});
const whiteList = '/login'
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
/**
 * @description: 全局路由前置守卫，在进入路由前触发，导航在所有守卫 resolve 完之前一直处于等待中。
 * @param {RouteLocationNormalized} to  即将要进入的目标
 * @param {RouteLocationNormalizedLoaded} from  当前导航正在离开的路由
 * @return {*}
 */
router.beforeEach((to, from) => {
    console.log(to, from);
    const myRouters = routers()
    if (to.path == from.path) return

    if (!NProgress.isStarted()) {
        NProgress.start();
    }

    myRouters.GenerateRoutes().then(() => {
        myRouters.getAddRouters.forEach(item => {
            router.addRoute(item)
        })
        if (whiteList.indexOf(to.path) !== -1) return
        const routeList = myRouters.getAddRouters.filter(item => item.children)
        const obj = getObj(to.path, routeList)
        if (myRouters.getNavRouter.find(item => item.name == obj.name)) return
        myRouters.addNavRouter(getObj(to.path, routeList))
    })
    // 设置页面标题
    document.title = (to.meta.title as string) || import.meta.env.VITE_APP_TITLE;
});

router.afterEach(() => {
    NProgress.done();
});

export default router;
