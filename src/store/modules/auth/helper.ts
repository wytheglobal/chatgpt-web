import { ss } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'

export function getToken() {
  return ss.get(LOCAL_NAME)
}

export function setToken(token: string) {
  console.log('tomwang set token', token)
  return ss.set(LOCAL_NAME, token)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}
