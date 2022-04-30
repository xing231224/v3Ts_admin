/*
 * @Author: your name
 * @Date: 2022-03-28 16:48:02
 * @LastEditTime: 2022-04-28 14:54:45
 * @LastEditors: Please set LastEditors
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
