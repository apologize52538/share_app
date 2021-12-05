<template>
  <div class="articleList" ref="artList">
    <!-- 
      v-model：标记当前是否正在加载，如果正在加载不能去刷新别的，当他为false代表加载完毕
      @refresh事件绑定的onRefresh，当我们在顶部下拉，就会调用onRefresh来加载数据
          如果触发下拉刷新，会自动把v-model绑定的值改成true
     -->
    <van-pull-refresh v-model="pullLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 使用插槽：单标签改成双标签 -->
        <van-cell
          v-for="item in list"
          @click="
            $router.push({ path: '/article', query: { id: item.art_id } })
          "
          :key="item.art_id"
          :title="item.title"
        >
          <template #label>
            <!-- 图片区域 -->
            <van-grid :border="false" :column-num="item.cover.type">
              <van-grid-item
                v-for="(value, index) in item.cover.images"
                :key="index"
              >
                <van-image :src="value" />
              </van-grid-item>
            </van-grid>

            <!-- 作者信息区域 -->
            <div class="info">
              <span>{{ item.aut_name }}</span>
              <span style="margin: 0 10px">{{ item.comm_count }}评论</span>
              <span>{{ item.pubdate | relvTime }}</span>
              <van-icon name="cross" style="float: right" />
            </div>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入接口
import { articleListAPI } from "@/api";
export default {
  name: "articleList",
  // 接收参数
  props: {
    channel_id: {
      // 必传
      required: true,
    },
  },
  data() {
    return {
      // 标记下拉刷新的状态
      pullLoading: false,
      // 装数据的数组
      list: [],
      // 标记当前是否还正在加载，如果为true，代表当前正在加载
      // 所以不会调用onLoad，只有当为false，才会调用onLoad
      // 调用onLoad后会自动把loading的值改成true
      loading: false,
      finished: false,
      timestamp: Date.now(),
      // 保存滚动条距离
      scrollTop: 0,
    };
  },

  methods: {
    // 列表上拉刷新
    async onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      let res = await articleListAPI({
        channel_id: this.channel_id,
        timestamp: this.timestamp,
      });

      // 拿到数据了，赋值数组
      // this.list = res.data.data.results;
      // --------------- 上面这句话有问题 ----------------
      //  --------------- 因为不断的在覆盖，就会导致不会保存之前请求到的新闻 ----------------
      this.list.push(...res.data.data.results);

      // 拿到数组，赋值之前新闻的时间戳
      this.timestamp = res.data.data.pre_timestamp;

      // 代表本次加载完，需要进行下次加载
      this.loading = false;

      // 代表全部加载完毕，当返回的pre_timestamp为null，代表本次是最后一组数据了
      // 所以应该把finished改为true，代表全部加载完毕
      if (this.timestamp == null) {
        this.finished = true;
      }
    },

    // 下拉刷新调用的方法
    async onRefresh() {
      // 请求数据
      let res = await articleListAPI({
        channel_id: this.channel_id,
        // 下拉刷新肯定是查最新数据，所以传入当前时间戳
        timestamp: Date.now(),
      });

      // 把请求到的最新数据直接覆盖
      this.list = res.data.data.results;
      // 把下一段的时间戳赋值一下，方便用户做上拉列表刷新
      this.timestamp = res.data.data.pre_timestamp;

      // 把下拉刷新状态改为false
      this.pullLoading = false;
    },
  },

  // 只有mounted才是最早能访问到dom的钩子
  mounted() {
    // 给dom盒子加滚动事件
    this.$refs.artList.onscroll = () => {
      this.scrollTop = this.$refs.artList.scrollTop;
    };
  },

  activated() {
    // 激活时再把之前的滚动条的高度赋值给滚动条，让它滚到对应的位置
    this.$refs.artList.scrollTop = this.scrollTop;
  },
};
</script>

<style lang="less">
.articleList {
  position: fixed;
  width: 100%;
  left: 0;
  top: 90px; // 是nav-bar高度是46，tabs是44，加起来90
  bottom: 50px; // 这是tabbar的高度
  overflow: scroll;
}
</style>