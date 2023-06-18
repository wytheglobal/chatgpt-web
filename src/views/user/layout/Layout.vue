<template>
  <div>
    <div>User</div>
    <RouterView v-slot="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </RouterView>
  </div>
</template>
