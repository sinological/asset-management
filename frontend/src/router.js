import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Search from './views/Search.vue';
import AdminLogin from './views/AdminLogin.vue';
import AdminDashboard from './views/AdminDashboard.vue';
import UploadCsv from './views/UploadCsv.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/search', component: Search },
  { path: '/admin/login', component: AdminLogin },
  { path: '/admin', component: AdminDashboard },
  { path: '/admin/upload', component: UploadCsv }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
