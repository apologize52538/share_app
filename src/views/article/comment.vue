<template>
  <div class="comment">
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
                <van-button @click="showReply(item)" size="mini"
                  >回复({{ item.reply_count }})</van-button
                >
              </div>
            </div>
            <van-icon name="like-o" />
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

    <!-- sheet区域 -->
    <van-action-sheet v-model="sheetShow" title="发表回复">
      <reply v-if="sheetShow" :currentItem="currentItem" />
    </van-action-sheet>
  </div>
</template>

<script>
// 导入接口
import { cmtListAPI, sendCmtAPI } from "@/api";
// 导入组件
import reply from "./reply";
export default {
  components: {
    reply,
  },
  data() {
    return {
      // 控制回复面板的显示
      sheetShow: false,
      currentItem: {},
      list: [],
      loading: false,
      finished: false,
      // 输入的评论内容
      cmtValue: "",
      offset: undefined,
    };
  },
  methods: {
    // 回复的点击事件
    showReply(item) {
      // 1. 显示出回复面板
      this.sheetShow = true;
      // 2. 把当前被点的评论传递给回复面板
      this.currentItem = item;
    },
    // 列表加载数据
    async onLoad() {
      let res = await cmtListAPI({
        type: "a",
        source: this.$route.query.id,
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

    // 发送评论
    async send() {
      // 非空判断
      if (this.cmtValue == "") {
        this.$toast("请输入内容");
        return;
      }

      // 不为空，拿到数据发请求
      let res = await sendCmtAPI({
        // 文章id
        target: this.$route.query.id,
        content: this.cmtValue,
      });

      // 服务器会返回添加的这条新的评论
      // 我们只要把评论加到数组里，那么界面就有变化了
      this.list.unshift(res.data.data.new_obj);

      this.cmtValue = "";
      this.$toast("发表评论成功");
    },
  },
};
</script>

<style lang="less" scoped>
.comment {
  margin-top: 20px;

  ::v-deep .cmt-wrap {
    display: flex;
    .van-image {
      width: 45px;
      height: 45px;
    }
    .info {
      margin-left: 20px;
      flex: 1;
      .name {
        color: #466b9d;
      }

      .content {
        margin: 8px 0;
      }

      .time {
        height: 20px;
        display: flex;
        align-items: center;
        color: gray;
      }
    }
  }

  .cmt-input-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>