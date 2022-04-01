/*
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-04-01 17:36:29
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\src\main.ts
 */
// i18n
// import { createI18n } from 'vue-i18n';
// vue router
import { createApp } from 'vue';
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
import "@/mock"
import parsingEmoji from "@/utils/emjoymethod"


const app = createApp(App);
app.use(router).use(store).mount('#app');
// 屏蔽错误信息
// app.config.errorHandler = () => null;
// 屏蔽警告信息
app.config.warnHandler = () => null;
// websocket
app.config.globalProperties.$websocket = new WebSocketClass("192.168.3.241:18888");
// 解析emo表情
app.config.globalProperties.parsingEmoji = parsingEmoji;
