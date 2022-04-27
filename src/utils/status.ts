/*
 * @Author: your name
 * @Date: 2022-04-18 16:12:35
 * @LastEditTime: 2022-04-18 16:17:04
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\utils\status.ts
 */
declare interface codeMessageMapTypes {
    INIT_WEB: string;  // 初始连接  0
    LOG_WEB: string;  // web登录企业微信  1
    SEND_WEB: string; // web端网页消息发送 3
    ACK_WEB: string;  // web端确认消息收到 4
    OFF_WEB: string;  // web端退出企业微信  5
    OFF_MSG_WEB: string; // 拉取离线消息  6
    [key: string]: string;
}

const codeMessageMap: codeMessageMapTypes = {
    INIT_WEB: '[400]:请求参数错误',
    LOG_WEB: '[401]:账户未登录',
    SEND_WEB: '[403]:拒绝访问',
    ACK_WEB: '[404]:请求路径错误',
    OFF_WEB: '[405]:请求方法错误',
    OFF_MSG_WEB: '[500]:服务器错误',
};

const showCodeMessage = (code: number | string): string => {
    return codeMessageMap[JSON.stringify(code)] || '网络连接异常,请稍后再试!';
};

export default showCodeMessage;