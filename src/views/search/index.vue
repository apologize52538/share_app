<template>
  <div class="search">
    <!-- 导航栏 -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />

    <!-- 搜索栏 -->
    <van-search
      v-model.trim="key"
      @input="onInput"
      shape="round"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>

    <!-- 历史记录区域 -->
    <van-cell-group v-if="!key">
      <van-cell title="历史记录" />
      <van-cell
        v-for="(item, index) in historyList"
        :key="index"
        :title="item"
        @click="$router.push({ name: 'result', query: {  key: item } })"
      />
    </van-cell-group>
    <!-- 联想区域 -->
    <van-cell-group v-else>
      <van-cell
        v-for="(item, index) in colorSuggests"
        :key="index"
        icon="search"
        @click="$router.push({ name: 'result', query: {  key: suggestList[index] } })"
      >
        <div v-html="item"></div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { suggestAPI, getHistoryAPI } from "@/api";
export default {
  name: "search",
  data() {
    return {
      key: "",
      suggestList: [],
      timerId: null,
      // 保存历史记录的数组
      historyList: JSON.parse(window.localStorage.getItem("history")) || [],
    };
  },

  methods: {
    // 搜索的点击事件
    onSearch() {
      if (this.key) {

        // 如果本次搜索的历史不在数组里才保存起来
        if (this.historyList.indexOf(this.key) == -1) {
          // 把key加到数组
          this.historyList.unshift(this.key);
          // 把数组保存到本地存储
          window.localStorage.setItem(
            "history",
            JSON.stringify(this.historyList)
          );
        }

        // 跳转到搜索结果页面
        this.$router.push({
          name: "result",
          query: {
            key: this.key,
          },
        });
      }
    },

    // 输入框内容发生变化调用
    onInput() {
      // 把要执行的代码放到一个定时器里，如果短时间内频繁触发
      // 就频繁让定时器重新计时
      clearTimeout(this.timerId);

      this.timerId = setTimeout(async () => {
        // 有值发请求
        if (this.key) {
          // 拿到输入的内容，发请求获取联想词汇
          let res = await suggestAPI({
            q: this.key,
          });

          this.suggestList = res.data.data.options;
        }
      }, 500);
    },
  },

  async created() {
    // 旧接口才用
    // let res = await getHistoryAPI();
    // this.historyList = res.data.data.keywords;
  },

  //   计算属性
  computed: {
    colorSuggests() {
      // 遍历搜索联想的数组，产生一个新数组
      let reg = new RegExp(this.key, "ig");
      return this.suggestList.map((v) =>
        v.replace(reg, `<span style="color:red;">${this.key}</span>`)
      );
    },
  },
};
</script>

<style>
</style>