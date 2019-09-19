import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/process',
          component: () => import(/* webpackChunkName: "menu" */ './views/Process.vue')
        },
        {
          path: '/definitions',
          component: () => import(/* webpackChunkName: "menu" */ './views/Definition.vue')
        },
        {
          path: '/todo',
          component: () => import(/* webpackChunkName: "menu" */ './views/Todo.vue')
        },
        {
          path: '/design',
          component: () => import(/* webpackChunkName: "menu" */ './views/Modeler.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
