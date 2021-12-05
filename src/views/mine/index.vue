<template>
  <div class="mine">
    <!-- 资料栏 -->
    <div class="profile">
      <van-image class="avatar" round fit="cover" :src="info.photo" />
      <div class="info">
        <div class="name">{{ info.name }}</div>
        <div class="birth">{{ info.birthday }}</div>
      </div>
    </div>

    <!-- 连接区域 -->
    <van-row class="my-link">
      <van-col span="8">
        <van-icon name="newspaper-o" />
        <span>我的作品</span>
      </van-col>
      <van-col span="8">
        <van-icon name="star-o" />
        <span>我的收藏</span>
      </van-col>
      <van-col span="8">
        <van-icon name="tosend" />
        <span>阅读历史</span>
      </van-col>
    </van-row>

    <!-- 功能区域 -->
    <van-cell-group>
      <van-cell to="/mine/edit" icon="edit" title="编辑资料" is-link />
      <van-cell to="/mine/chat" icon="chat-o" title="小智同学" is-link />
      <van-cell icon="setting-o" title="系统设置" is-link />
      <van-cell @click="doLogout" icon="info-o" title="退出登录" is-link />
    </van-cell-group>
  </div>
</template>

<script>

export default {
  name: "mine",

  methods: {

    // 退出的点击事件
    doLogout () {
      
      // 清空token
      this.$store.commit('logout')
      this.$router.push('/login')
    }
  },

  created() {
    
    this.$store.dispatch('reqUserInfo')
  },

  computed: {

    info () {

      return this.$store.state.userInfo
    }
  }
};
</script>

<style lang="less" scoped>
.mine {
  .profile {
    height: 140px;
    background-color: #3296fa;
    display: flex;
    align-items: center;

    .avatar {
      width: 75px;
      height: 75px;
      margin-left: 20px;
      margin-right: 10px;
    }

    .info {
      font-size: 16px;
      color: #fff;
      .name {
        font-weight: 700;
      }
      .birth {
        background-color: #fff;
        color: #3296fa;
        margin-top: 5px;
        padding: 2px;
      }
    }
  }

  .my-link {
    margin: 20px 0;

    .van-col {
      display: flex;
      // 切换主轴为y轴
      flex-direction: column;
      align-items: center;
      font-size: 16px;

      .van-icon {
        font-size: 30px;
        margin-bottom: 5px;

        &-newspaper-o {
          color: #8daaff;
        }

        &-star-o {
          color: #ff3800;
        }

        &-tosend {
          color: #ffaf42;
        }
      }
    }
  }
}
</style>