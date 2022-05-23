/*
 * @Author: your name
 * @Date: 2022-03-28 16:48:02
 * @LastEditTime: 2022-05-23 10:30:15
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\friendList\type.d.ts
 */
export interface userType {
    id: number | string,
    unread: number,
    avatorUrl: string,
    name: string,
    newTime: string,
    context: string,
    status: boolean,
    [propName: string]: any
}


export interface chatType {
    clientId: string
    content: string
    contentType: number
    conversationId: string
    sendTimeStamp: number
    sendType: string
    senderId: number
    senderNickName: string
    serverId: number
    fileId?: number | string
    filePercent?: number | string
    [propName: string]: any
}