import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenticationStore } from './stores/auth_store'

const router =  createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Login',
      path: '/',
      component: () => import('./components/Login.vue'),
    },
    {
      name: 'Verify',
      path: '/verify',
      component: () => import('./components/VerifyEmail.vue'),
    },
    {
      name: 'Home',
      path: '/home',
      component: () => import('./components/Home.vue'),
      children:[
        {
          path: '', // An empty path will match the default route
          redirect: 'main' // Redirect to the 'main' route
        },
        {
          name: 'Page 1',
          path: '/main',
          component: () => import('./components/Main.vue'),
        },
        {
          name: 'Page 2',
          path: '/page2',
          component: () => import('./components/Page2.vue'),
        },
        {
          name: 'Add',
          path: '/add',
          component: () => import('./components/AddPost.vue'),
        },
      ]
    },
  ],
})

export function goToMainPage(){
  router.push({name: 'Login'})
}

router.beforeEach((to, from, next) => {

  const authStore = useAuthenticationStore();
  if(to.name != "Login"){
    if(to.name != "Verify"){
      authStore.checkStatus();
    }
  }
  else{
    if(authStore.loggedIn == true){
      authStore.login();
    }
  }
  
  next()
})

export default router