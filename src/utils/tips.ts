/*
 * @Author: your name
 * @Date: 2022-02-16 12:40:17
 * @LastEditTime: 2022-04-11 10:07:33
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\utils\tips.ts
 */
import { ElMessage, ElMessageBox } from 'element-plus';
import { BuildPropType } from 'element-plus/es/utils';

// /**
//  * 如何调用，如下面调用案例
//  * import {succesMsg,warnMsg,infoMsg,
//      errorMsg,alertBox,confirmBox} from '@/utils/msgBox.ts'
//   confirmBox('确认删除该标签吗？','确定',null).then(res => {
//     alert("确定："+res)
//   }).catch(res => {
//     alert("取消关闭："+res)
//   })
//  * */
// export default {
//   // 成功提示信息
//   succesMsg(msgInfo: string) {
//     ElMessage({
//       type: 'success',
//       showClose: true,
//       dangerouslyUseHTMLString: true,
//       message: msgInfo,
//     });
//   },
//   // 警告提示信息
//   warnMsg(msgInfo: string) {
//     ElMessage({
//       type: 'warning',
//       showClose: true,
//       dangerouslyUseHTMLString: true,
//       message: msgInfo,
//     });
//   },
//   // 错误提示信息
//   errorMsg(msgInfo: string) {
//     ElMessage({
//       type: 'error',
//       showClose: true,
//       dangerouslyUseHTMLString: true,
//       message: msgInfo,
//     });
//   },
//   // 一般信息提示信息
//   infoMsg(msgInfo: string) {
//     ElMessage({
//       type: 'info',
//       showClose: true,
//       dangerouslyUseHTMLString: true,
//       message: msgInfo,
//     });
//   },
//   // 确定一个确定按钮alertBox
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   alertBox(msg: string, btnName: string, type: any) {
//     const confirmName = btnName === '确定' ? '确定' : '是';
//     return ElMessageBox.alert(msg, '提示', {
//       type,
//       confirmButtonText: confirmName,
//       dangerouslyUseHTMLString: true,
//     });
//   },
//   // 确定取消;是否按钮弹出框
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   confirmBox(msg: string, btnName: string, type: any) {
//     const confirmName = btnName === '确定' ? '确定' : '是';
//     const cancelsName = btnName === '确定' ? '取消' : '否';
//     return ElMessageBox.confirm(msg, '提示', {
//       type,
//       confirmButtonText: confirmName,
//       cancelButtonText: cancelsName,
//       closeOnClickModal: false,
//       closeOnPressEscape: false,
//       dangerouslyUseHTMLString: true,
//     });
//   },
// };


export const tips = (type: BuildPropType<StringConstructor, "info" | "success" | "warning" | "error", unknown> | undefined, msg: string) => {
    ElMessage({
        type,
        message: msg,
    });

}

export const confirmBox = (msg: string, btnName: string, type: any) => {
    const confirmName = btnName === '确定' ? '确定' : '是';
    const cancelsName = btnName === '确定' ? '取消' : '否';
    return ElMessageBox.confirm(msg, '提示', {
        type,
        confirmButtonText: confirmName,
        cancelButtonText: cancelsName,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true,
    });
}