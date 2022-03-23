/*
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-02-15 10:08:51
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\src\api\modules\login.ts
 */
import service from '@/api/http';

const loginApi = {
  // 验证登录实例
  postVerification: (params: object) => service.post(`/login`, params),
  register: (params: object) => service.post('/register', params),
  getAllInfo: () => service.get('/getLoginInfo'),
};

export default loginApi;
