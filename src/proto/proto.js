import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.default || ($protobuf.roots.default = new $protobuf.Root()))
    .setOptions({
        java_package: "com.jw.telbot.nettyServer",
        java_outer_classname: "ProtoMsg"
    })
    .addJSON({
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

// eslint-disable-next-line no-restricted-exports
export { $root as default };
