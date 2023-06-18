import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStoreWithout()

    if (!authStore.token) {
      if (to.name === 'register' || to.name === 'verify')
        return next()
      else if (to.name !== 'login')
        return next({ name: 'login' })
    }

    console.log(authStore.token)
    if (to.name !== 'login' && !authStore.session) {
      try {
        const data = await authStore.getSession()
        console.log('tomwang session ', data)
        // if (String(data.auth) === 'false' && authStore.token)
        // authStore.removeToken()
        if (to.path === '/500')
          next({ name: 'Root' })
        else
          next()
      }
      catch (error) {
        if (to.path !== '/500')
          next({ name: '500' })
        else
          next()
      }
    }
    else {
      next()
    }
  })
}
