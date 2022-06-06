/*
 * @Author: your name
 * @Date: 2022-03-28 16:48:02
 * @LastEditTime: 2022-06-02 10:59:24
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\views\mirandaIM\friendList\type.d.ts
 */
export interface userType {
    id: number | string,  // 子账号id
    conversationId: string,
    corpId: string,
    avatorUrl: string, // 子账号 头像
    name: string, // 子账号 姓名
    offNumTatal: number, // 未读消息数
    [propName: string]: any
}


export interface userInfo {
    avatorUrl: string,  // 头像
    conversationId: string, // 聊天窗口ID
    corpId: string,
    departmentId?: string, // 公司Id
    departmentName?: string, // 公司名称
    email?: string, // 邮箱
    id: string //
    indexId: number,
    mobile?: string, // 手机号
    name: string, // 姓名
    offLineMsg?:msgType ,  //
    offLineNum?: number  // 未读消息数
    sex?: string,     // 性别
    weChatId: string    // 子账号id
    [propName: string]: any
}

// 消息类型
export interface msgType {
    clientId?: string,
    conversationId: string, // 窗口id
    sendTimeStamp: number,  // 发送时间戳
    senderId?: number,  // 发送人Id
    senderNickName?: string,  // 发送人姓名
    content?: string | undefined,   // 文本消息
    imageUrl?: string,   // 图片消息
    fileSize?: number  // 文件大小
    mp4Url?: string  // 视频消息
    fileUrl?: string // 文件消息
    fileName?: string  // 文件名
    msgId?: string // 消息Id
    fileId?: number | string  // 文件id
    filePercent?: number | string // 文件上传进度
    [propName: string]: any
}