/*
 * @Author: your name
 * @Date: 2022-04-06 17:21:47
 * @LastEditTime: 2022-07-01 16:15:57
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\store\user.ts
 */
import { defineStore } from 'pinia';
import { crmLogin, mobileLogin } from '@/api/modules/login';
import { setToken, removeToken } from '@/utils/cookies';

export default defineStore({
    id: 'user',
    state: () => {
        return {
            SET_TOKEN: '',
            SET_REFRESH_TOKEN: '',
            userId: '' as string | number,
            mobile: '' as string | number,
        };
    },
    getters: {},
    actions: {
        // crm登录
        CRMLogin(params: { ticket: any; code: any }) {
            // console.log(params);
            return new Promise<void>((resolve: Function, reject: Function) => {
                crmLogin(params.ticket, params.code)
                    .then((response: any) => {
                        const { data } = response;
                        setToken(data.access_token);
                        this.SET_TOKEN = data.access_token;
                        this.SET_REFRESH_TOKEN = data.refresh_token;
                        resolve();
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        // 手机号登录
        MobileLogin(userInfo: { mobile: string; password: string }) {
            const mobile = userInfo.mobile.trim();
            const password = userInfo.password.trim();
            return new Promise<void>((resolve, reject) => {
                mobileLogin(mobile, password)
                    .then((response) => {
                        const { data } = response;
                        setToken(data.access_token);
                        localStorage.setItem('nikename', mobile);
                        this.mobile = mobile;
                        this.SET_TOKEN = data.access_token;
                        this.SET_REFRESH_TOKEN = data.refresh_token;
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        // 退出登录
        loginOut() {
            return new Promise<void>((reslove) => {
                this.SET_TOKEN = '';
                this.SET_REFRESH_TOKEN = '';
                removeToken();
                localStorage.removeItem('nikename');
                reslove();
            });
        },
        setUserId(id: string | number) {
            this.userId = id;
        },
    },
});
