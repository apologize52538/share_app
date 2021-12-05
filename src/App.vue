<template>
  <div>
    <keep-alive>
      <!-- 路由出口 -->
      <router-view v-if="$route.meta.needKeep"></router-view>
    </keep-alive>

      <!-- 这里的出口是没有被缓存的 -->
     <router-view v-if="!$route.meta.needKeep"></router-view>
  </div>
</template>

<script>
export default {
  
};
</script>

<style>
</style>