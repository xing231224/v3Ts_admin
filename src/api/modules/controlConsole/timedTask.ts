/*
 * @Author: xing 1981193009@qq.com
 * @Date: 2022-06-14 15:28:16
 * @LastEditors: xing 1981193009@qq.com
 * @LastEditTime: 2022-06-27 17:15:26
 * @FilePath: \web_wxChat\src\api\modules\clientHandle.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable import/prefer-default-export */
import service from '@/api/http';
// 任务列表
export const searchTask = (obj: object) => service.post('/wechat/web/client/searchTask', obj);
// 创建话术
export const createTask = (obj: object) => service.post('/wechat/web/client/createTask', obj);
// 修改任务
export const updateTask = (obj: object) => service.post('/wechat/web/client/updateTask', obj);
// 删除任务
export const deleteTask = (id: string | number) => service.get(`/wechat/web/client/deleteTask?id=${id}`);
// 获取所有企微账号
export const getwechatList = () => service.get('/wechat/web/userWechat/getwechatList');
// 返回当前登录的企微账号
export const getwechatAcc = () => service.get('/wechat/web/userWechat/getwechatAcc');
