<template>
  <div class="replay">
    <!-- 当前评论 -->
    <van-cell>
      <template #title>
        <div class="cmt-wrap">
          <van-image round fit="cover" :src="currentItem.aut_photo"></van-image>
          <div class="info">
            <div class="name">{{ currentItem.aut_name }}</div>
            <div class="content">{{ currentItem.content }}</div>
            <div class="time">
              {{ currentItem.pubdate | relvTime }}
            </div>
          </div>
        </div>
      </template>
    </van-cell>

    <!-- 分割线 -->
    <van-divider>回复列表</van-divider>

    <!-- 回复列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.com_id">
        <template #title>
          <div class="cmt-wrap">
            <van-image round fit="cover" :src="item.aut_photo"></van-image>
            <div class="info">
              <div class="name">{{ item.aut_name }}</div>
              <div class="content">{{ item.content }}</div>
              <div class="time">
                {{ item.pubdate | relvTime }}
              </div>
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>

    <!-- 输入的区域 -->
    <div class="cmt-input-wrap">
      <van-field
        v-model="cmtValue"
        @keyup.enter="send"
        center
        clearable
        placeholder="请输入评论内容"
      >
        <template #button>
          <van-button @click="send" size="small" type="info">发布</van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { cmtListAPI, sendCmtAPI } from "@/api";
export default {
  props: {
    currentItem: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: undefined,
      // 输入的评论内容
      cmtValue: "",
    };
  },

  methods: {
    // 列表加载回复数据
    async onLoad() {
      let res = await cmtListAPI({
        type: "c",
        // 传评论id
        source: this.currentItem.com_id,
        offset: this.offset,
      });

      this.list.push(...res.data.data.results);
      // 把本次的最后一条id作为下次请求的参数
      this.offset = res.data.data.last_id;
      this.loading = false;

      //  当本次的最后一条id，等于 所有数据的结束id就意味着加载完了
      if (res.data.data.end_id == res.data.data.last_id) {
        this.finished = true;
      }
    },

    // 发送回复
    async send() {
      // 非空判断
      if (this.cmtValue == "") {
        this.$toast("请输入内容");
        return;
      }

      // 不为空，拿到数据发请求
      let res = await sendCmtAPI({
        // 评论id
        target: this.currentItem.com_id,
        // 回复的内容
        content: this.cmtValue,
        // 接口规定发表回复必须传文章id
        art_id: this.$route.query.id,
      });

      // 服务器会返回添加的这条新的评论
      // 我们只要把评论加到数组里，那么界面就有变化了
      this.list.unshift(res.data.data.new_obj);
      // 还要让当前评论的回复数 +1
      this.currentItem.reply_count++
      
      this.cmtValue = "";
      this.$toast("回复成功");
    },
  },
};
</script>

<style>
</style>