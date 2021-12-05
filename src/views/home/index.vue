<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar>
      <template #left>
      </template>

      <template #right>
        <van-button @click="$router.push('/search')" class="btn-search" round icon="search" type="primary"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>

    <!-- tab栏 -->
    <!-- title设置标题 -->
    <!-- 双标签里面放这一栏里的内容 -->
    <van-tabs v-model="active" class="my-tabs">
      <!-- 频道列表 -->
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 每个频道下的新闻列表 -->
        <article-list :channel_id="item.id" />
      </van-tab>

      <van-icon @click="show = true" class="icon-channel" name="wap-nav" />
    </van-tabs>

    <!-- 频道管理界面 -->
    <!-- 
         对于我们封装的组件而言，$event不是事件对象，
         而是我们从子组件里传过来的值，我们传过来是什么它就是什么 
         在本项目中，这个$event,就是子组件里传过来的index（下标）
    -->
    <van-action-sheet v-model="show" title="频道管理">
      <!-- <channel-edit
        :ownChannels="channels"
        :allChannels="allChannels"
        :value="active"
        @input="active = $event"
        @close="show = false"
      /> -->

      <!-- 对于组件的v-model而言，其实相当于只是一个语法糖 -->
      <!-- 
        所以你要是对组件写了一个 v-model="数据"
        它相当于帮你生成了 :value="数据" 以及 @input="数据 = $event"
      -->
      <channel-edit
        :ownChannels="channels"
        :allChannels="allChannels"
        v-model="active"
        @close="show = false"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import { channelsAPI, channelsAllAPI } from "@/api";
import { getChannel } from "@/utils/storage";

// 导入组件
import articleList from "./articleList.vue";
import channelEdit from "./channelEdit.vue";
export default {
  name: "home",
  components: {
    articleList,
    channelEdit,
  },
  data() {
    return {
      // 跟tab选中索引双向绑定
      active: 0,
      show: false,
      // 保存用户的频道
      channels: [],
      allChannels: [],
    };
  },

  async created() {
    // 1. 发请求获取用户自己的频道
    /*
    // 判断是否登录
    if (this.$store.state.tokenObj.token) {

      let res = await channelsAPI();
      this.channels = res.data.data.channels;

    } else {
      // 获取本地存储
      let res = getChannel();

      if (res) {
        // 有值就直接取出来
        this.channels = res;
      } else {
        // 本地存储没值发请求
        let res = await channelsAPI();
        this.channels = res.data.data.channels;
      }
    }
    */

    // 优化代码
    // 先取一下本地存储
    let local = getChannel();
    // 要么没登录，要么本地存储没数据
    if ( !local || this.$store.state.tokenObj.token) {

      let res = await channelsAPI();
      this.channels = res.data.data.channels;
    }else {

      // 能来到这代表没登录并且本地存储有数据
      this.channels = local
    }

    // 2. 获取所有频道
    let res2 = await channelsAllAPI();
    this.allChannels = res2.data.data.channels;
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
  .btn-search {
    background-color: rgba(255, 255, 255, 0.2);
    width: 100px;
    height: 30px;
    border: none;
    .van-icon-search {
      color: #fff;
    }
  }

  .my-tabs {
    ::v-deep .van-tabs__nav {
      width: 85%;
    }

    .icon-channel {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 30px;
      width: 10%;
      text-align: center;
    }
  }
}
</style>