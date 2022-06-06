/*
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-05-28 10:12:04
 * @LastEditors: xing 1981193009@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\src\main.ts
 */
// i18n
// import { createI18n } from 'vue-i18n';
// vue router
import { createApp } from 'vue';
import { jsPlumb } from 'jsplumb';
import router from '@/router/index';
// pinia
import store from '@/store';
import App from './App.vue';
import 'animate.css';
import 'virtual:windi.css';
// Devtools: https://windicss.org/integrations/vite.html#design-in-devtools
import 'virtual:windi-devtools';
import '@/assets/styles/index.scss';

// import "@/mock"
import parsingEmoji from '@/utils/emjoymethod';
import { tips, confirmBox } from './utils/tips';
// import WebSocketClass from '@/utils/webSocket';

const app = createApp(App);
app.use(router).use(store).mount('#app');

// 全局参数
// app.config.globalProperties.$websocket = new WebSocketClass("127.0.0.1:6080");
// 解析emo表情
app.config.globalProperties.parsingEmoji = parsingEmoji;
app.config.globalProperties.$plumbIns = jsPlumb.getInstance();
app.config.globalProperties.$tips = tips;
app.config.globalProperties.$confirmBox = confirmBox;
