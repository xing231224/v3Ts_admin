/*
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-05-23 16:47:33
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\src\main.ts
 */
// i18n
// import { createI18n } from 'vue-i18n';
// vue router
import { createApp } from 'vue';
import { jsPlumb } from "jsplumb"
import router from '@/router/index';
// pinia
import store from '@/store';
import App from './App.vue';
import 'animate.css';
import 'virtual:windi.css';
// Devtools: https://windicss.org/integrations/vite.html#design-in-devtools
import 'virtual:windi-devtools';
import '@/assets/styles/index.scss';
import WebSocketClass from "@/utils/webSocket"
// import "@/mock"
import parsingEmoji from "@/utils/emjoymethod"
import { tips, confirmBox } from './utils/tips';

const app = createApp(App);
app.use(router).use(store).mount('#app');
// app.config.globalProperties.$websocket = new WebSocketClass("192.168.3.241:18888");
app.config.globalProperties.$websocket = new WebSocketClass("http://xings.free.aeert.com");
// 屏蔽错误信息
// app.config.errorHandler = () => null;
// 屏蔽警告信息
app.config.warnHandler = () => null;
console.log(app.config);


// 全局参数
// websocket

// app.config.globalProperties.$websocket = new WebSocketClass("127.0.0.1:6080");
// 解析emo表情
app.config.globalProperties.parsingEmoji = parsingEmoji;
app.config.globalProperties.$plumbIns = jsPlumb.getInstance();
app.config.globalProperties.$tips = tips;
app.config.globalProperties.$confirmBox = confirmBox;
