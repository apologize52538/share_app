<template>
  <div class="result">
    <!-- 导航栏 -->
    <van-nav-bar :title="key + ' 的搜索结果'" />

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.art_id"
        :title="item.title"
        @click="$router.push({ name: 'article', query: { id: item.art_id } })"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResultAPI } from "@/api";
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      key: this.$route.query.key,
      page: 1,
    };
  },
  methods: {
    async onLoad() {
      let res = await getSearchResultAPI({
        page: this.page,
        per_page: 10,
        q: this.key,
      });

      this.list.push(...res.data.data.results);
      this.page++; // 下次查下一页
      // 代表本次加载完毕
      this.loading = false;

      // 当数组的长度与服务器里数据的总数一致时，代表加载完成
      if (this.list.length >= res.data.data.total_count) {
        this.finished = true;
      }
    },
  },
};
</script>

<style>
</style>