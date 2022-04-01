/*
 * @Author: your name
 * @Date: 2022-03-23 09:44:33
 * @LastEditTime: 2022-03-28 14:32:56
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\api\http.ts
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ElMessage } from 'element-plus';
import showCodeMessage from '@/api/code';
import { formatJsonToUrlParams, instanceObject } from '@/utils/format';

const BASE_PREFIX = import.meta.env.VITE_API_BASEURL;
console.log(BASE_PREFIX);


// 创建实例
const axiosInstance: AxiosInstance = axios.create({
    // 前缀
    baseURL: BASE_PREFIX,
    // 超时
    timeout: 1000 * 30,
    // 请求头
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // TODO 在这里可以加上想要在请求发送前处理的逻辑
        // TODO 比如 loading 等
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response;
        }
        ElMessage.info(JSON.stringify(response.status));
        return response;
    },
    (error: AxiosError) => {
        const { response } = error;
        if (response) {
            ElMessage.error(showCodeMessage(response.status));
            return Promise.reject(response.data);
        }
        ElMessage.warning('网络连接异常,请稍后再试!');
        return Promise.reject(error);
    },
);
const service = {
    get: (url: string, data?: object) => axiosInstance.get(url, { params: data }),
    post: (url: string, data?: object) => axiosInstance.post(url, data),
    put: (url: string, data?: object) => axiosInstance.put(url, data),
    delete: (url: string, data?: object) => axiosInstance.delete(url, data),
    upload: (url: string, file: File) =>
        axiosInstance.post(url, file, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    download: (url: string, data: instanceObject) => {
        const downloadUrl = `${BASE_PREFIX}/${url}?${formatJsonToUrlParams(data)}`;
        window.location.href = downloadUrl;
    },
};

export default service;
