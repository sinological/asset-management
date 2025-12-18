import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

console.log('BUILD VERSION:', new Date().toISOString());

createApp(App).use(router).mount('#app');
