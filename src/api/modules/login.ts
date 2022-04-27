/* eslint-disable import/prefer-default-export */
/*
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-04-18 17:30:35
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\src\api\modules\login.ts
 */
import service from '@/api/http';


export const crmLogin = (ticket: any, code: any) => {
    const grant_type = 'crm'
    const scope = 'server'
    const loginType = 'multiple'
    return service.post(
        '/auth/crm/token',
        {
            ticket,
            code,
            grant_type,
            scope,
            loginType
        },
        { headers: { 'Authorization': 'Basic cGlnOnBpZw==' } })
}


export const mobileLogin = (mobile: any, password: any) => service.get('/auth/call-wechat/token', { mobile, password }, { 'Authorization': 'Basic cGlnOnBpZw==' })

export const getUserId = () => service.get('/wechat/web/userWechat/getUserId')