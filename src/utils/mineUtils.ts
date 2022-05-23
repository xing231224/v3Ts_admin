/* eslint-disable func-names */
/*
 * @Author: your name
 * @Date: 2022-04-07 10:39:17
 * @LastEditTime: 2022-05-23 11:27:46
 * @LastEditors: xing 1981193009@qq.com
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

export function parseTime(time: any, cFormat = "{y}-{m}-{d} {h}:{i}:{s}") {
    if (arguments.length === 0) {
        return null;
    }
    // eslint-disable-next-line prefer-template
    if ((time + "").length === 10) {
        // eslint-disable-next-line no-param-reassign
        time = +time * 1000;
    }

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
    const time_str = cFormat.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
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

export const timeDispose = function (time: number) {
    const date = new Date(time * 1000)
    const startTime = new Date(new Date().setHours(0, 0, 0, 0)) as unknown as number
    // 当天
    if (date.toDateString() === new Date().toDateString()) return parseTime(date, '{h}:{i}')
    // 一天前
    if (date as unknown as number >= startTime - 86400 * 1000) return parseTime(date, '昨天 {h}:{i}')
    // 两天前
    if (date as unknown as number >= startTime - 86400 * 2 * 1000) return parseTime(date, '前天 {h}:{i}')
    // 七天内
    if (date as unknown as number >= startTime - 86400 * 6 * 1000) {
        const day = date.getDay() as number;
        let days = ''
        if (day == 1) {
            days = '星期一'
        } else if (day == 2) {
            days = '星期二'
        } else if (day == 3) {
            days = '星期三'
        } else if (day == 4) {
            days = '星期四'
        } else if (day == 5) {
            days = '星期五'
        } else if (day == 6) {
            days = '星期六'
        } else if (day == 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            days = '星期日'
        }
        return days
    }
    return parseTime(date, '{m}/{d}')
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

// 获取后缀 以及 封面图片
export function getSuffix(url: string): { icoURL: string, suffix: string } {
    const suffix = url.substring(url.lastIndexOf(".")); // 将接口中返回的各文件链接进行截取，来判断属于什么格式文件
    let icoURL = ''
    // 追加html 文件
    if (suffix == ".pdf") {
        icoURL = 'https://img0.baidu.com/it/u=3644622474,3688361323&fm=26&fmt=auto&gp=0.jpg'
    } else if (
        suffix == ".png" ||
        suffix == ".jpg" ||
        suffix == ".jpeg" ||
        suffix == ".jfif"
    ) {
        icoURL = ''
    } else if (suffix == ".doc" || suffix == ".docx" || suffix == ".txt") {
        icoURL = 'https://img1.baidu.com/it/u=1714136260,3766911961&fm=26&fmt=auto&gp=0.jpg'
    } else if (suffix == ".xls" || suffix == ".xlsx") {
        icoURL = 'https://img1.baidu.com/it/u=1123362811,2189997153&fm=26&fmt=auto&gp=0.jpg'
    } else if (
        suffix == ".mp4" ||
        suffix == ".mov" ||
        suffix == ".m4v" ||
        suffix == ".wmv"
    ) {
        icoURL = ''
    } else if (suffix == '.rar' || suffix == '.zip' || suffix == '.7z') {
        icoURL = 'https://img1.baidu.com/it/u=1684598855,1971464006&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
    }

    return {
        icoURL,
        suffix
    }
}
// 计算文件大小函数(保留两位小数), Size为字节大小
export function getfilesize(size: number): string {
    if (!size)
        return "0K";

    const num = 1024.00; // byte
    if (size < num)
        return `${size}B`;
    if (size < num ** 2)
        return `${(size / num).toFixed(2)}K`; // kb
    if (size < num ** 3)
        return `${(size / num ** 2).toFixed(2)}M`; // M
    if (size < num ** 4)
        return `${(size / num ** 3).toFixed(2)}G`; // G
    return `${(size / num ** 4).toFixed(2)}T`; // T
}

// 下载文件
export const downFile = async (fileURl: string, name = '') => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', fileURl, true);
    // 响应类型设置为blob
    xhr.responseType = 'blob';
    // 请求成功
    xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr.response);
            a.download = name;
            // 将a标签添加到body中是为了更好的兼容性，谷歌浏览器可以不用添加
            document.body.appendChild(a);
            a.click();
            // 移除
            a.remove();
            // 释放url
            window.URL.revokeObjectURL(a.href);
        }
    });
    // 监听下载进度
    xhr.addEventListener('progress', function (e) {
        const percent = Math.trunc(e.loaded / e.total * 100);
    });
    // 错误处理
    xhr.addEventListener('error', function (e) {
        // todo
    });
    // 发送请求
    xhr.send();

    return
    const response = await fetch(fileURl, { mode: 'no-cors' })
    // 内容转变成blob地址
    const blob = await response.blob()
    console.log(blob);
    // 创建隐藏的可下载链接
    const objectUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    // 地址
    a.href = objectUrl
    // 修改文件名
    a.download = name || fileURl
    // 触发点击
    document.body.appendChild(a)
    a.click()
    // 移除
    setTimeout(() => document.body.removeChild(a), 1000)
}