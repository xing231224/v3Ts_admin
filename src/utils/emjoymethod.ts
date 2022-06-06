/*
 * @Author: your name
 * @Date: 2022-03-30 15:10:44
 * @LastEditTime: 2022-05-27 09:28:27
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\utils\emjoymethod.ts
 */

import {
    emojisAmap,
    emojisBmap,
    emojiReg,
    emojiString,
    wChartReg,
    wChatEmojis,
    wChatToUi,
    qqfaceArr
} from './emjoydata';

// 编码转换
// eslint-disable-next-line no-underscore-dangle
const _escapeToUtf32 = (str: string) => {
    const escaped = [];
    // eslint-disable-next-line no-use-before-define
    const unicodeCodes = _convertStringToUnicodeCodePoints(str);
    let i = 0;
    const l = unicodeCodes.length;
    let hex;

    // eslint-disable-next-line no-plusplus
    for (; i < l; i++) {
        hex = unicodeCodes[i].toString(16);
        escaped.push('0000'.substr(hex.length) + hex);
    }
    return escaped.join('-');
}

// eslint-disable-next-line no-underscore-dangle
const _convertStringToUnicodeCodePoints = (str: string) => {
    let surrogate1st = 0;
    const unicodeCodes = [];
    let i = 0;
    const l = str.length;
    // eslint-disable-next-line no-plusplus
    for (; i < l; i++) {
        const utf16Code = str.charCodeAt(i);
        if (surrogate1st != 0) {
            if (utf16Code >= 0xDC00 && utf16Code <= 0xDFFF) {
                const surrogate2nd = utf16Code;
                // eslint-disable-next-line no-bitwise
                const unicodeCode = (surrogate1st - 0xD800) * (1 << 10) + (1 << 16) + (surrogate2nd - 0xDC00);
                unicodeCodes.push(unicodeCode);
            }
            surrogate1st = 0;
        } else if (utf16Code >= 0xD800 && utf16Code <= 0xDBFF) {
            surrogate1st = utf16Code;
        } else {
            unicodeCodes.push(utf16Code);
        }
    }
    return unicodeCodes;
}

// 解析emoji表情 以及换行回车
export const parsingEmoji = (value: any, className = false) => {
    if (!value) return '';
    let str = value;
    str = str.replace(/\n/gi, '<br>');
    // str = EmojiUnicode.trans(str);
    // var reg = /^\[.*\]$/gi;
    const reg = /\[+[^[\]]+\]/g;
    // eslint-disable-next-line func-names
    str = str.replace(reg, function (s: any) {
        // eslint-disable-next-line no-var
        var s = s.split("[")[1].split(']')[0];
        if (emojiString.indexOf(s) != -1) {
            if (className) return `${emojisBmap[`[${s}]`]}`
            return `<span class="chat-emoji emoji_b ${emojisBmap[`[${s}]`]}" data-name="${s}"></span>`;
        } if (emojisAmap[s]) {
            if (className) return `emoji_a ${emojisAmap[s]}`
            return `<span class="chat-emoji emoji_a ${emojisAmap[s]}" data-name="${s}"></span>`;
        }
        return `[${s}]`;
        ;
    });
    str = str.replace(emojiReg, (emo: any) => {
        const emos = emo.replace(/\\/g, '\\');
        if (className) return `${emojisBmap[emos]}`
        return `<span class="chat-emoji emoji_b ${emojisBmap[emos]}" data-name="${emos}"></span>`;
    });
    // 微信emoji=》unicode表情规则
    str = str.replace(wChartReg, (wCeo: any) => {
        if (className) return `${wChatEmojis[_escapeToUtf32(wCeo).toLocaleUpperCase()]}`
        // eslint-disable-next-line no-use-before-define
        return `<span class="chat-emoji emoji_b ${wChatEmojis[_escapeToUtf32(wCeo).toLocaleUpperCase()]}" data-name="${wChatToUi[_escapeToUtf32(wCeo).toLocaleUpperCase()]}"></span>`;
    });

    // 解析url
    // 写的url正则匹配
    // eslint-disable-next-line no-useless-escape
    const regURL = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;
    // 正则替换
    str = str.replace(regURL, (a: string | string[]) => {
        // 如果包含http ，indexOf方法如果包含返回0,所以加上!
        if (!a.indexOf('http')) {
            return `<a href="${a}" style='text-decoration: underline' target=_blank>${a}</a>`;
        }
        return `<a href="http://${a}" style='text-decoration: underline' target=_blank>${a}</a>`;
    });
    return str;
};

// 获取所有表情
export const EmojiList = () => {
    const arr: { key: string, value: string }[] = []
    qqfaceArr.map(item => item[0]).forEach(item => {
        arr.push({ key: item, value: parsingEmoji(item, true) })
    })
    return arr
}



export default parsingEmoji