import { createRouter, createWebHistory } from 'vue-router'
import NProgress    from 'nprogress';


import axios from "axios";
import store from '../store';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/auth/Register.vue'),
        meta: {
            disableIfLoggedIn: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/auth/Login.vue'),
        meta: {
            disableIfLoggedIn: true
        }
    },
    {
        path: '/logout',
        name: 'Logout',
        component: {
            beforeRouteEnter() {
                store.commit('logout')
                localStorage.removeItem('token')
                delete axios.defaults.headers.common['Authorization']
                router.push('/login')
            }
        },
        meta: {
            disableIfLoggedIn: true
        }
    },
    {
        path: '/products',
        name: 'Products',
        component: () => import('../views/products/ProductList.vue'),
        meta: { 
            requiresAuth: true
        }
    },
    {
        path: '/products/create',
        name: 'Product Create',
        component: () => import('../views/products/ProductCreate.vue'),
        meta: { 
            requiresAuth: true
        }
    },
    {
        path: '/products/edit/:id',
        name: 'ProductEdit',
        component: () => import('../views/products/ProductEdit.vue'),
        meta: { 
            requiresAuth: true
        }
    }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn && localStorage.getItem('token') != null) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})

// Add a request interceptor
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
},
error => {
    Promise.reject(error)
});

//Add a response interceptor
axios.interceptors.response.use((response) => {
    return response
}, function(error) {
    if (error.response.status === 401) {
        router.push({ name: 'login' })
    }
    return Promise.reject(error);
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
      NProgress.start()
  }
  next()
});

router.afterEach(() => {
  NProgress.done()
});

export default router
