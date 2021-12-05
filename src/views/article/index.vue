<template>
  <div class="article-detail">
    <!-- 导航栏部分 -->
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" />
    <!-- 文章部分 -->
    <div class="article-wrap">
      <h3 class="title">{{ info.title }}</h3>
      <div class="aut_info">
        <van-image
          width="60"
          height="60"
          fit="cover"
          :src="info.aut_photo"
          round
        />
        <div class="info">
          <div>{{ info.aut_name }}</div>
          <div class="time">{{ info.pubdate | relvTime }}</div>
        </div>

        <!-- 判断当前登录用户不是这篇文章作者时，才显示 -->
        <div v-if="$store.state.userInfo.id != info.aut_id">
          <van-button
            @click="doFollow(true)"
            v-if="!info.is_followed"
            type="info"
            round
            >+ 关注</van-button
          >
          <van-button @click="doFollow(false)" v-else type="danger" round
            >- 取关</van-button
          >
        </div>
      </div>

      <!-- 文章内容 -->
      <div class="content" v-html="info.content">我是内容</div>
      <!-- 分割线 -->
      <van-divider>end</van-divider>
      <!-- 功能按钮区域 -->
      <div class="btn-wrap">
        <van-button
          v-if="info.attitude == -1"
          @click="zan(true)"
          type="primary"
          plain
          round
          icon="good-job-o"
          >点赞</van-button
        >

        <van-button
          v-if="info.attitude == 1"
          @click="zan(false)"
          type="primary"
          plain
          round
          icon="good-job"
          >取消点赞</van-button
        >

        <div v-if="info.attitude == -1" style="width: 30px"></div>

        <van-button
          @click="unlike(true)"
          v-if="info.attitude == -1"
          type="danger"
          plain
          round
          icon="delete-o"
          >不喜欢</van-button
        >
        <van-button
          @click="unlike(false)"
          v-if="info.attitude == 0"
          type="danger"
          plain
          round
          icon="delete"
          >取消不喜欢</van-button
        >
      </div>
    </div>
    <!-- 评论部分 -->
    <comment />
  </div>
</template>

<script>
import {
  articleInfoAPI,
  unfollowUserAPI,
  followUserAPI,
  zanAPI,
  unzanAPI,
  cancelUnlikeAPI,
  unlikeAPI,
} from "@/api";
// 导入评论组件
import comment from "./comment";
export default {
  name: "articleDetail",
  components: { comment },
  data() {
    return {
      info: {},
    };
  },
  methods: {
    async doFollow(status) {
      // 把要修改的状态赋值给数据
      this.info.is_followed = status;

      try {
        // 需要发请求给服务器去做更新
        if (status) {
          // 为true代表要关注
          await followUserAPI({
            target: this.info.aut_id, // 用户的id
          });
        } else {
          await unfollowUserAPI(this.info.aut_id);
        }

        this.$toast.success("操作成功");
      } catch {
        this.$toast.fail("操作失败！请登录后再试");
      }
    },

    // 跟赞有关
    async zan(status) {
      if (status) {
        // 调用点赞接口
        await zanAPI({
          target: this.info.art_id,
        });

        this.info.attitude = 1;
      } else {
        // 调用取消点赞接口
        await unzanAPI(this.info.art_id);
        this.info.attitude = -1;
      }
    },

    // 跟不喜欢有关
    async unlike(status) {
      if (status) {
        // 调用点赞接口
        await unlikeAPI({
          target: this.info.art_id,
        });

        this.info.attitude = 0;
      } else {
        // 调用取消点赞接口
        await cancelUnlikeAPI(this.info.art_id);
        this.info.attitude = -1;
      }
    },
  },
  async created() {
    let res = await articleInfoAPI(this.$route.query.id);
    this.info = res.data.data;
    // this.info.content = this.info.content.replace(/<code>/ig, '<code class="hljs">')
  },
};
</script>

<style lang="less" scoped>
.article-detail {
  // 文章部分
  .article-wrap {
    padding: 0 20px;
    .title {
      font-size: 24px;
      margin: 10px 0;
    }

    .aut_info {
      height: 80px;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .info {
        margin-left: 20px;
        // 设置剩余空间里的占比，如果就只给它设置了
        // 就代表剩余部分全部给它
        flex: 1;

        .time {
          color: gray;
        }
      }
    }

    .content {
      // 如果最后一个单词不够放了，就把整个单词换一行开始写
      word-wrap: break-word;
      //  设置空格换行那些格式，保持原样
      white-space: pre;
      // word-break: break-all; 以一行实在放不下了就换行可能会导致单词脱节
      overflow: hidden;

      ::v-deep {
        // 这个标签是一个行内元素，所以设置宽度没用
        pre {
          code {
            display: block;
            width: 100%;
            overflow: auto;
            background-color: #101010;
            color: #dcdcdc;
          }
        }

        img {
          width: 80%;
        }
      }
    }

    .btn-wrap {
      display: flex;
      justify-content: center;
      .van-button {
        width: 120px;
      }
    }
  }
}
</style>