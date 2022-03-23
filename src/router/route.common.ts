/*
 * @Author: your name
 * @Date: 2022-02-16 12:40:17
 * @LastEditTime: 2022-02-18 17:57:31
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\router\route.common.ts
 */
// 不需要鉴权的业务路由
import { RouteRecordRaw } from 'vue-router';

const commonRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      icon: '',
    },
    component: () => import('@/views/login/index.vue'),
  },
];

export default commonRoutes;
