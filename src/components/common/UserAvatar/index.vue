<script setup lang='ts'>
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
import { useAuthStore, useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import { router } from '@/router'

const userStore = useUserStore()
const authStore = useAuthStore()

const authInfo = computed(() => authStore.session)
const userInfo = computed(() => userStore.userInfo)

const doLogout = function () {
  authStore.removeToken()
  router.push('/')
}
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0">
      <template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
        <NAvatar
          size="large"
          round
          :src="userInfo.avatar"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ authInfo.email ?? 'ChenZhaoYu' }}
      </h2>
      <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <!-- <n-button text tiny error="danger"> -->
        <!-- Logout -->
        <!-- </n-button> -->
        <span class="btn-logout" @click="doLogout">
          Logout
        </span>
      </p>
    </div>
  </div>
</template>

<style lang="less">
.btn-logout {
  cursor: pointer;
}
</style>
