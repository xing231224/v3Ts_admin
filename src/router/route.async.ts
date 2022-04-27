/*
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-04-12 10:49:51
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\src\router\route.async.ts
 */
// 需要鉴权的业务路由
import { RouteRecordRaw } from 'vue-router';

const Layout = () => import("@/views/Layout/index.vue");
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
        children: [{
            path: '',
            component: () => import('@/views/home/index.vue'),

        }]
    },
    {
        path: '/operationMan',
        name: 'operationMan',
        component: Layout,
        redirect: "/operationMan/operationWords",
        meta: {
            title: '话术管理',
            keepAlive: true,
            icon: 'dashboard',
        },
        children: [
            {
                path: 'operationWords',
                meta: {
                    title: '话术设置',
                    icon: 'swagger',
                },
                name: "operationWords",
                component: () => import('@/views/operationMan/operationWords/index.vue'),
            },
            {
                path: 'knowledgeBase',
                meta: {
                    title: '知识库',
                    icon: 'swagger',
                },
                name: "knowledgeBase",
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
        ]

    },
    {
        path: '/mirandaIM',
        name: 'mirandaIM',
        component: Layout,
        meta: {
            title: '聚合聊天',
            keepAlive: true,
            icon: 'dashboard',
        },
        children: [
            {
                path: '',
                component: () => import('@/views/mirandaIM/index.vue'),
            },
        ]

    },
    {
        path: '/setting',
        name: 'setting',
        component: Layout,
        meta: {
            title: '设置',
            icon: 'dashboard',
        },
        children: [
            {
                path: 'liaotSet',
                meta: {
                    title: '聊天设置',
                    icon: 'swagger',
                },
                name: "liaotSet",
                component: () => import('@/views/setting/liaotSet/index.vue'),
            },
            {
                path: 'iPhoneSet',
                meta: {
                    title: '手机设置',
                    icon: 'swagger',
                },
                name: "iPhoneSet",
                component: () => import('@/views/setting/iPhoneSet/index.vue'),
            },
        ]

    },
];

export default asyncRoutes;
