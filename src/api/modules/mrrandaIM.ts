/*
 * @Author: your name
 * @Date: 2022-03-28 14:23:20
 * @LastEditTime: 2022-05-19 16:49:56
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\api\modules\mrrandaIM.ts
 */
import service from '@/api/http';

// eslint-disable-next-line import/prefer-default-export
export const userList = () => service.get("/userList")
// 获取内外部联系人
export const getWechatList = (id: number | string) => service.get(`/wechat/web/userWechat/getWechatList?id=${id}`)