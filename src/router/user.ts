import { UserLayout } from '@/views/user/layout'

export default {
  path: '/user',
  name: 'user',
  component: UserLayout,
  children: [
    {
      path: '/user/register',
      name: 'register',
      component: () => import('@/views/user/register.vue'),
    },
    {
      path: '/user/login',
      name: 'login',
      component: () => import('@/views/user/login.vue'),
    },
  ],
}
