/*
 * @Author: your name
 * @Date: 2022-04-07 10:39:17
 * @LastEditTime: 2022-04-18 16:33:16
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\utils\mineUtils.ts
 */
import { v4 } from "uuid"

function isObject(o: any) {
    return (
        Object.prototype.toString.call(o) === "[object Object]" ||
        Object.prototype.toString.call(o) === "[object Array]"
    );
}
// eslint-disable-next-line import/prefer-default-export
export function deepCopy(o: { [x: string]: any; }, hash = new Map()) {
    if (!isObject(o)) return o;
    if (hash.has(0)) return hash.get(o);
    const objArr = Array.isArray(o) ? [] : {} as any;
    hash.set(o, objArr);
    // eslint-disable-next-line no-restricted-syntax
    for (const i in o) {
        if (isObject(o[i])) {
            objArr[i] = deepCopy(o[i]);
        } else {
            objArr[i] = o[i];
        }
    }
    return objArr;
}

// 代码执行一次
// eslint-disable-next-line func-names
export const once = function (fn: Function) {
    let caller = true
    // eslint-disable-next-line func-names
    const on = () => {
        if (caller) {
            caller = false
            // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unused-vars
            fn.apply(on, arguments)
        }

    }
    return on()
}
export function parseTime(time: any, cFormat: string) {
    if (arguments.length === 0) {
        return null;
    }
    // eslint-disable-next-line prefer-template
    if ((time + "").length === 10) {
        // eslint-disable-next-line no-param-reassign
        time = +time * 1000;
    }

    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
        date = time;
    } else if (typeof time === "string") {
        date = new Date(time)
    } else {
        // eslint-disable-next-line radix
        date = new Date(parseInt(time));
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    } as any;
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === "a")
            return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
        if (result.length > 0 && value < 10) {
            value = `0${value}`;
        }
        return value || 0;
    });
    return time_str;
}

export function randomKey() {
    return `${new Date().getTime()}${v4()}`
}

// 数组扁平化
export function flatten(arr: any[]): [] {
    return arr.reduce((prev, next) => {
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}