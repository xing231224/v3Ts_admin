/*
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-03-23 15:31:14
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\src\router\route.async.ts
 */
// 需要鉴权的业务路由
import { RouteRecordRaw } from 'vue-router';
// import Layout from '@/views/Layout/index.vue'
const Layout = () => import("@/views/Layout/index.vue");
const asyncRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/login',
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
            meta: {
                title: '首页',
                icon: 'box',
            },
            component: () => import('@/views/home/index.vue'),

        }]
    },
    {
        path: '/mirandaIM',
        name: 'mirandaIM',
        component: Layout,

        meta: {
            title: '聚合聊天',
            icon: 'box',
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
            icon: 'box',
        },
        children: [
            {
                path: 'liaotSet',
                meta: {
                    title: '聊天设置',
                    icon: 'box',
                },
                name: "liaotSet",
                component: () => import('@/views/setting/liaotSet/index.vue'),
            },
            {
                path: 'iPhoneSet',
                meta: {
                    title: '手机设置',
                    icon: 'box',
                },
                name: "iPhoneSet",
                component: () => import('@/views/setting/iPhoneSet/index.vue'),
            },
        ]

    },
];

export default asyncRoutes;
