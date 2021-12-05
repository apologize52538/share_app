<template>
  <div>
    <!-- 二级路由出口 -->
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item to="/layout/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/layout/ask" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/layout/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/layout/mine" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>