/*
 * @Author: xing 1981193009@qq.com
 * @Date: 2022-03-23 09:44:33
 * @LastEditors: xing 1981193009@qq.com
 * @LastEditTime: 2022-06-23 10:09:39
 * @FilePath: \web_wxChat\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// i18n
// import { createI18n } from 'vue-i18n';
// vue router
import { createApp } from 'vue';
import { jsPlumb } from 'jsplumb';
import VueViewer from 'v-viewer';
import router from '@/router/index';
// pinia
import store from '@/store';
import App from './App.vue';
import 'viewerjs/dist/viewer.css';
import 'animate.css';
import 'virtual:windi.css';
// Devtools: https://windicss.org/integrations/vite.html#design-in-devtools
import 'virtual:windi-devtools';
import '@/assets/styles/index.scss';

// import "@/mock"
import parsingEmoji from '@/utils/emjoymethod';
import { tips, confirmBox } from './utils/tips';

const app = createApp(App);
app.use(router)
    .use(store)
    .use(VueViewer, {
        debug: true,
    })
    .mount('#app');

// 全局配置
// VueViewer.setDefaults();
app.config.warnHandler = () => null;
// 全局参数
// app.config.globalProperties.$websocket = new WebSocketClass("127.0.0.1:6080");
// 解析emo表情
app.config.globalProperties.parsingEmoji = parsingEmoji;
app.config.globalProperties.$plumbIns = jsPlumb.getInstance();
app.config.globalProperties.$tips = tips;
app.config.globalProperties.$confirmBox = confirmBox;
