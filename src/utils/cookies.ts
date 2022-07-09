/*
 * @Author: your name
 * @Date: 2022-04-06 17:52:24
 * @LastEditTime: 2022-07-05 10:03:22
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\utils\cookie.ts
 */
import Cookies from 'js-cookie';

const TokenKey = 'web_wecaht-Token';
const TipsKey = 'web_wecaht-Tips';
export function getToken() {
    return Cookies.get(TokenKey);
}
// 合同添加页面
export function getTokenAdd() {
    return Cookies.get(TokenKey);
}

export function setToken(token: string | object) {
    return Cookies.set(TokenKey, token);
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}
// 消息提醒
export function getTips() {
    return Cookies.get(TipsKey);
}

export function setTips(Tips: string | object) {
    return Cookies.set(TipsKey, Tips);
}
export function removeTips() {
    return Cookies.remove(TipsKey);
}
