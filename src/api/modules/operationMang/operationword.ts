/*
 * @Author: your name
 * @Date: 2022-04-06 10:24:57
 * @LastEditTime: 2022-07-05 14:35:21
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\api\modules\operationword.ts
 */
/* eslint-disable import/prefer-default-export */

import service from '@/api/http';

export const getUserByPhone = (mobile: number | string) => service.get(`/wechat/user/getUserByPhone/${mobile}`);
// 新建话术
export const createScenarios = (obj: object) => service.post(`/wechat/hxTelScenarios/createScenarios`, obj);
// 查询话术
export const sreachScenarios = (obj: object) => service.post(`/wechat/hxTelScenarios/sreachScenarios`, obj);
// 删除话术
export const delScenarios = (id: number | string) => service.get(`/wechat/hxTelScenarios/delScenarios/${id}`);
// 编辑话术
export const updateScenarios = (obj: object) => service.post(`/wechat/hxTelScenarios/updateScenarios`, obj);
// 新建普通节点
export const createNode = (obj: object) => service.post(`/wechat/hxTelFlowNode/createNode`, obj);
// 更新普通节点
export const updateNode = (obj: object) => service.post(`/wechat/hxTelFlowNode/updateNode`, obj);
// 删除普通节点
export const delNode = (id: number | string) => service.get(`/wechat/hxTelFlowNode/delNode/${id}`);
// 新建流程节点
export const createBranchNode = (obj: object) => service.post(`/wechat/hxTelFlowBranch/createBranchNode`, obj);
// 更新流程节点
export const updateBranchNode = (obj: object) => service.post(`/wechat/hxTelFlowBranch/updateBranchNode`, obj);
// 删除流程节点
export const delBranchNode = (id: number | string) => service.get(`/wechat/hxTelFlowBranch/delBranchNode/${id}`);
// 保存流程
export const saveNodeRelation = (obj: object) => service.post(`/wechat/hxTelScenarios/saveNodeRelation`, obj);
// 获取流程
export const getNodeRelation = (id: number | string) => service.get(`/wechat/hxTelScenarios/getNodeRelation/${id}`);
// 复制流程
export const copyFlow = (obj: object) => service.post(`/wechat/hxTelScenarios/copyFlow`, obj);
// 获取默认的关键词
export const getKeywrod = (obj: object) => service.post(`/wechat/hxTelKeyword/getKeywrod`, obj);
// 新增待编辑
export const waitRedact = (obj: object) => service.post(`/wechat/hxTelKeyword/waitRedact`, obj);
// 更新待编辑
export const updateKeyword = (obj: object) => service.post(`/wechat/hxTelKeyword/updateKeyword`, obj);
// 获取大文件列表
export const getBigFile = (obj: object) => service.post(`/wechat/web/userWechat/getBigFile `, obj);
// 获取话术
export const getDetailScenarios = () => service.get(`/wechat/hxTelScenarios/getDetailScenarios`);
// 添加知识库
export const addKnowledges = (obj: object) => service.post(`/wechat/hxTelScenarios/addKnowledges`, obj);

export const getScenariosById = (id: number) => service.get(`/wechat/hxTelScenarios/getScenariosById/${id}`);
