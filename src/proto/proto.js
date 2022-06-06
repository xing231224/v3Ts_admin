/*
 * @Author: xing 1981193009@qq.com
 * @Date: 2022-05-25 17:59:24
 * @LastEditors: xing 1981193009@qq.com
 * @LastEditTime: 2022-06-01 12:03:10
 * @FilePath: \v3ts_admin\src\proto\proto.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars */
import * as $protobuf from "protobufjs/light";

const protoRoot = ($protobuf.roots.default || ($protobuf.roots.default = new $protobuf.Root())).setOptions({
    java_package: "com.jw.telbot.nettyServer",
    java_outer_classname: "ProtoMsg"
}).addJSON({
    MessageRequest: {
        fields: {
            status: {
                type: "string",
                id: 1
            },
            key: {
                type: "string",
                id: 2
            },
            data: {
                type: "bytes",
                id: 3
            },
            clientId: {
                type: "string",
                id: 4
            },
            weChatId: {
                type: "string",
                id: 5
            },
            state: {
                type: "int32",
                id: 6
            },
            msg: {
                type: "string",
                id: 7
            }
        }
    }
});

export default {
    protoRoot,
    protobuf: $protobuf
};
