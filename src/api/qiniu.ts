/* eslint-disable import/prefer-default-export */
/*
 * @Author: your name
 * @Date: 2022-04-06 10:53:57
 * @LastEditTime: 2022-04-06 10:54:33
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\api\modules\qiniu.ts
 */
import service from '@/api/http';

export const qiNiuToken = () => service.get(`/wechat/web/qiniu/token`)

