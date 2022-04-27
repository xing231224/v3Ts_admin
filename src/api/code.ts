/*
 * @Author: your name
 * @Date: 2022-03-23 09:44:33
 * @LastEditTime: 2022-04-18 16:12:15
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\api\code.ts
 */
declare interface codeMessageMapTypes {
    400: string;
    401: string;
    403: string;
    404: string;
    405: string;
    500: string;
    [key: string]: string;
}

const codeMessageMap: codeMessageMapTypes = {
    400: '[400]:请求参数错误',
    401: '[401]:账户未登录',
    403: '[403]:拒绝访问',
    404: '[404]:请求路径错误',
    405: '[405]:请求方法错误',
    500: '[500]:服务器错误',
};

const showCodeMessage = (code: number | string): string => {
    return codeMessageMap[JSON.stringify(code)] || '网络连接异常,请稍后再试!';
};

export default showCodeMessage;
