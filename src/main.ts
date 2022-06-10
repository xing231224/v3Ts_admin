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
app.config.warnHandler = () => null;
// 全局参数
// app.config.globalProperties.$websocket = new WebSocketClass("127.0.0.1:6080");
// 解析emo表情
app.config.globalProperties.parsingEmoji = parsingEmoji;
app.config.globalProperties.$plumbIns = jsPlumb.getInstance();
app.config.globalProperties.$tips = tips;
app.config.globalProperties.$confirmBox = confirmBox;
