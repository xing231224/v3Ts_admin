import service from '@/api/http';

// eslint-disable-next-line import/prefer-default-export
export const userList = () => service.get('/userList');
// 获取内外部联系人
export const getWechatList = (id: number | string) => service.get(`/wechat/web/userWechat/getWechatList?id=${id}`);
export const openknowledge = (id: number | string, type: number) =>
    service.get(`/wechat/web/userWechat/openknowledge?weChatId=${id}&type=${type}`);
