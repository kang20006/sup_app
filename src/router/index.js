import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import SasGen from '../views/SasGen.vue'
import test from '../views/test.vue'
const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/sasgen',
    name: 'sasgen',
    component: SasGen},
    {
      path: '/test',
      name: 'test',
      component: test},
    
]

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL), routes
})

export default router
