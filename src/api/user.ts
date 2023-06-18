import { get, post } from '@/utils/request'

export function fetchUserInfo<T = any>(
) {
  return get<T>({
    url: '/base/user/me',
  })
}

export function sendVerifyCode<T>(
  params: {
    email: string
  },
) {
  const data = {
    email: params.email,
  }

  return post<T>({
    data,
    url: '/base/user/get_verify_code',
  })
}

export function doRegister<T>(
  params: {
    email: string
    password: string
    verify_code: string
  },
) {
  const data = {
    email: params.email,
    verify_code: params.verify_code,
    password: params.password,
  }

  return post<T>({
    data,
    url: '/base/user/register',
  })
}

export function doLogin<T>(
  params: {
    email: string
    password: string
  },
) {
  const data = {
    email: params.email,
    password: params.password,
  }

  return post<T>({
    data,
    url: '/base/user/login',
  })
}
