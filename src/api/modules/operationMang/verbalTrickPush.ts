/*
 * @Author: your name
 * @Date: 2022-04-12 09:44:14
 * @LastEditTime: 2022-04-12 09:49:54
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\api\modules\operationMang\verbalTrickPush.ts
 */
import service from '@/api/http';

// 获取在线用户
export const onLineUser = () => service.get(`/wechat/web/userWechat/getUserList`)
// 勾选用户发送请求
export const sendScenarios = (data: object) => service.post(`/wechat/web/userWechat/sendScenarios`, data)
export const getSendListWr = (data: object) => service.post(`/wechat/web/userWechat/getSendListWr`, data)
export const addGroup = (data: object) => service.post(`/wechat/web/userWechat/addGroup`, data)
export const updateGroup = (data: object) => service.post(`/wechat/web/userWechat/updateGroup`, data)
export const delGroup = (id: string | number) => service.get(`/wechat/web/userWechat/delGroup/${id}`)
export const getGroupList = () => service.get(`/wechat/web/userWechat/getGroupList`)
export const updateWechat = (data: object) => service.post(`/wechat/web/userWechat/updateWechat`, data)
export const updateWechatByGroup = (data: object) => service.get(`/wechat/web/userWechat/updateWechatByGroup`, data)