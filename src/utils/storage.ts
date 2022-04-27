/*
 * @Author: your name
 * @Date: 2022-04-19 14:09:51
 * @LastEditTime: 2022-04-19 14:11:53
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\utils\strog.ts
 */
/**
 * @description: 存储localStorage
 * @param {string} key
 * @param {string} value
 * @return {*}
 */
export const localStorageSet = (key: string, value: string): any => {
    if (!key) return;
    if (typeof value != "string") {
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
    }
    window.localStorage.setItem(key, value);
};

/**
 * @description: 获取localStorage
 * @param {string} key
 * @return {*}
 */
export const localStorageGet = (key: string): any => {
    if (!key) return;
    return window.localStorage.getItem(key);
};

/**
 * @description: 删除localStorage
 * @param {string} key
 * @return {*}
 */
export const localStorageRemove = (key: string) => {
    if (!key) return;
    window.localStorage.removeItem(key);
};

/**
 * @description: 存储sessionStorage
 * @param {string} key
 * @param {string} value
 * @return {*}
 */
export const sessionStorageSet = (key: string, value: string) => {
    if (!key) return;
    if (typeof value != "string") {
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
    }
    window.sessionStorage.setItem(key, value);
};

/**
 * @description: 获取sessionStorage
 * @param {string} key
 * @return {*}
 */
export const sessionStorageGet = (key: string) => {
    if (!key) return;
    return window.sessionStorage.getItem(key);
};

/**
 * @description: 删除sessionStorage
 * @param {string} key
 * @return {*}
 */
export const sessionStorageRemove = (key: string) => {
    if (!key) return;
    window.sessionStorage.removeItem(key);
};