/*
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-07-04 17:26:44
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\src\router\route.async.ts
 */
// 需要鉴权的业务路由
import { RouteRecordRaw } from 'vue-router';

const Layout = () => import('@/views/Layout/index.vue');
// const _import = (path: string) => import(`../views/${path}.vue`)
const asyncRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        component: Layout,
        meta: {
            title: '首页',
            icon: 'dashboard',
        },
        children: [
            {
                path: '',
                component: () => import('@/views/home/index.vue'),
            },
        ],
    },
    {
        path: '/operationMan',
        name: 'operationMan',
        component: Layout,
        redirect: '/operationMan/operationWords',
        meta: {
            title: '话术管理',
            keepAlive: true,
            icon: 'huashu',
        },
        children: [
            {
                path: 'operationWords',
                meta: {
                    title: '话术设置',
                    icon: 'tdx',
                },
                name: 'operationWords',
                component: () => import('@/views/operationMan/operationWords/index.vue'),
            },
            {
                path: 'knowledgeBase',
                meta: {
                    title: '知识库',
                    icon: 'zhishiku',
                },
                name: 'knowledgeBase',
                component: () => import('@/views/operationMan/knowledgeBase/index.vue'),
            },
            // {
            //     path: 'verbalTrickPush',
            //     meta: {
            //         title: '话术推送',
            //         icon: 'swagger',
            //     },
            //     name: "verbalTrickPush",
            //     component: () => import('@/views/operationMan/verbalTrickPush/index.vue'),
            // }
        ],
    },
    {
        path: '/mirandaIM',
        name: 'mirandaIM',
        component: Layout,
        meta: {
            title: '聚合聊天',
            keepAlive: true,
            icon: 'chat',
        },
        children: [
            {
                path: '',
                component: () => import('@/views/mirandaIM/index.vue'),
            },
        ],
    },
    {
        path: '/clientStatus',
        name: 'clientStatus',
        component: Layout,
        meta: {
            title: '客户端状态',
            keepAlive: false,
            icon: 'pc_status',
        },
        children: [
            {
                path: '',
                component: () => import('@/views/controlConsole/clientStatus/index.vue'),
            },
        ],
    },
    {
        path: '/controlConsole',
        name: 'controlConsole',
        component: Layout,
        redirect: '/controlConsole/timedTask',
        meta: {
            title: '控制台',
            keepAlive: true,
            icon: 'console',
        },
        children: [
            {
                path: 'timedTask',
                meta: {
                    title: '定时任务',
                    icon: 'timed',
                },
                name: 'timedTask',
                component: () => import('@/views/controlConsole/timedTask/index.vue'),
            },
            // {
            //     path: 'clientStatus',
            //     meta: {
            //         title: '客户端状态',
            //         icon: 'pc_status',
            //     },
            //     name: 'clientStatus',
            //     component: () => import('@/views/controlConsole/clientStatus/index.vue'),
            // },
            {
                path: 'stationMan',
                meta: {
                    title: '岗位管理',
                    icon: 'station',
                },
                name: 'stationMan',
                component: () => import('@/views/controlConsole/stationMan/index.vue'),
            },
        ],
    },
];

export default asyncRoutes;
