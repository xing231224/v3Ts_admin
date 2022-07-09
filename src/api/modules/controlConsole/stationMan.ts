/* eslint-disable import/prefer-default-export */
import service from '@/api/http';

export const fetchList = () => service.get('/wechat/web/userWechat/getwechatList');
export const getStation = () => service.get('/wechat/web/userWechat/getPosition');
export const delPosition = (id: string | number) => service.get(`/wechat/web/userWechat/delPosition/${id}`);
export const updatewechat = (obj: Object) => service.post('/wechat/web/userWechat/updatewechat', obj);
export const createPosition = (obj: Object) => service.post('/wechat/web/userWechat/createPosition', obj);
