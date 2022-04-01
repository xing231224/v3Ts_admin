/*
 * @Author: your name
 * @Date: 2022-03-28 12:07:38
 * @LastEditTime: 2022-03-28 15:04:33
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3ts_admin\src\mock\index.ts
 */
import Mock from "mockjs"

Mock.mock('/userList', 'get', {
    // list是一个数组，包含5个元素
    'data|60': [
        {
            'id|+1': 1,
            'nickName': '@cname', // 昵称
            "unread|1-20": 0, // 未读
            'status|1': true,  // true 我的
            "context": '@csentence(20)', // 消息
            'avatar': '@image', // 头像
            'newTime': "@date('yyyy-MM-dd')"
        }
    ]
})