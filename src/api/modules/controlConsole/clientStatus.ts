/* eslint-disable import/prefer-default-export */
import service from '@/api/http';

export const getClientDetail = () => service.get('/wechat/web/client/getClientDetail');
