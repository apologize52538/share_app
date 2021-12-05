<template>
  <div class="container">
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小智同学"
    ></van-nav-bar>
    <div class="chat-list">
      <!-- 左侧是机器人小智 -->
      <div
        v-for="(item, index) in chatList"
        :key="index"
        class="chat-item"
        :class="item.isMe ? 'right' : 'left'"
      >
        <!-- 机器人 -->
        <van-image
          v-if="!item.isMe"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <div class="chat-pao" :class="{ my: item.isMe }">{{ item.msg }}</div>
        <!-- 自己头像 -->
        <van-image
          v-if="item.isMe"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </div>

      <!-- 右侧是当前用户 -->
      <!-- <div class="chat-item right">
        <div class="chat-pao my">ewqewq</div>
        <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
      </div> -->
    </div>

    <div class="reply-container van-hairline--top">
      <van-field v-model="msg" @keyup.enter="send" placeholder="说点什么...">
        <span @click="send" slot="button" style="font-size: 12px; color: #999">
          提交
        </span>
      </van-field>
    </div>
  </div>
</template>

<script>
// 导入socket.io客户端
import io from "socket.io-client";
export default {
  name: "UserChat",
  data() {
    return {
      socket: null,
      msg: "",
      // 保存聊天记录的数组
      chatList: [],
    };
  },
  methods: {
    send() {
      // 给服务器发消息
      if (this.msg) {
        // 发送
        this.socket.emit("message", {
          msg: this.msg,
          timestamp: Date.now(),
        });

        // 把自己发的内容加到数组里（自动就渲染了）
        this.chatList.push({
          isMe: true,
          msg: this.msg,
        });

        // 输入框清空
        this.msg = "";
      }
    },
  },

  created() {
    this.socket = io("http://toutiao.itheima.net", {
      query: {
        //  带入自己的token
        token: this.$store.state.tokenObj.token,
      },
      transports: ["websocket"],
    });

    // 接消息
    this.socket.on("message", (data) => {
      //   把机器人发的消息加到数组（自动渲染）
      this.chatList.push({
        isMe: false,
        msg: data.msg,
      });
    });
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    // 垂直放行，有个滚动条
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
      .chat-pao.my {
        background-color: #9eea6a;
        &::before {
          content: "";
          background: #9eea6a;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
