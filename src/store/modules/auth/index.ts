import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store'
import { fetchUserInfo } from '@/api/user'

interface SessionResponse {
  // auth: boolean
  // model: 'chinchilla' | 'ChatGPTUnofficialProxyAPI'
  email: string
}

export interface AuthState {
  token: string | undefined
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    session: null,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'chinchilla'
    },
  },

  actions: {
    async getSession() {
      try {
        const data = await fetchUserInfo<any>()
        // const data : any = { auth: false, model: 'chinchilla' }
        this.session = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
