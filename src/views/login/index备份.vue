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
        <van-button :loading="isLoading" loading-text="登录中..."   round block type="info" native-type="submit"
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
    doLogin(data) {
      
      // 发请求之前就应该把加载状态设置为true
      this.isLoading = true

      // 发请求给服务器问账号密码是否正确
      // 因为这个接口要传一个对象，我参数data刚好是一个对象
      // 这个接口要求有2个属性：mobile和code，我data刚好有这两个属性
      // 刚好他们的值又是我们界面输入的内容，所以就可以直接把data传给接口
      loginAPI(data)
        .then((res) => {
          // 如果成功，就让你请求是成功状态，失败就直接请求报错
          // console.log(res);
          this.$toast.success('登录成功')
        })
        .catch(() => {

          // 如果catch触发了就证明登录失败
          this.$toast.fail('登录失败')
        })
        .finally ( () => {

          // 不管是成功还是失败都会调用的函数
          this.isLoading = false
        } )
    },
  },
};
</script>

<style>
</style>