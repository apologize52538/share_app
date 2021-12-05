<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />

    <!-- 表单 -->
    <van-form @submit="doLogin">
      <!-- 输入框 -->
      <van-field
        v-model="mobile"
        name="mobile"
        label="手机号"
        placeholder="请输入手机号"
        :rules="rules.mobile"
      />
      <van-field
        v-model="code"
        name="code"
        label="验证码"
        placeholder="请输入验证码"
        :rules="rules.code"
      />
      <div style="margin: 16px">
        <van-button
          :loading="isLoading"
          loading-text="登录中..."
          round
          block
          type="info"
          native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入登录接口
import { loginAPI } from "@/api";
export default {
  data() {
    return {
      mobile: "13911111111",
      code: "246810",
      isLoading: false,
      rules: {
        mobile: [
          { required: true, message: "请填写手机号" },
          {
            pattern: /^1[2-9]\d{9}$/,
            message: "请填写正确的手机号",
            trigger: "onBlur",
          },
        ],

        code: [
          { required: true, message: "请填写验证码" },
          { pattern: /^\d{6}$/, message: "请输入6位数字验证码" },
        ],
      },
    };
  },
  methods: {
    // 等规则全部通过并且点了登录（本质上是提交按钮）
    // 这个事件有个参数
    async doLogin(data) {
      // 发请求之前就应该把加载状态设置为true
      this.isLoading = true;

      // 发请求，并拿到数据给res
      try {
        let res = await loginAPI(data);
        this.$toast.success("登录成功");
        // 既存到vuex又存到本地存储了
        this.$store.commit("saveToken", res.data.data);

        // 调用获取用户信息的方法
        this.$store.dispatch('reqUserInfo')

        // 判断是否携带back参数
        if (this.$route.query.back) {
          // 就把参数值当做该打回的页面地址
          this.$router.push(this.$route.query.back);
        } else {
          // 跳转到home
          this.$router.push("/layout/home");
        }
        
      } catch {
        // 能来到这，证明请求有问题
        this.$toast.fail("登录失败");
      }

      this.isLoading = false;
    },
  },
};
</script>

<style>
</style>