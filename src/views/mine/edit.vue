<template>
  <div class="mine-edit">
    <!-- 1. 导航栏 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" />

    <!-- 2. 头像区域 -->
    <div class="avatar">
      <van-image round fit="cover" :src="userInfo.photo"></van-image>
      <van-uploader :after-read="afterRead" />
    </div>

    <!-- 3. 资料cell区域 -->
    <van-cell
      @click="showNameDialog"
      title="名称"
      :value="userInfo.name"
      is-link
    />
    <van-cell
      @click="popShow = true"
      title="性别"
      :value="userInfo.gender ? '男' : '女'"
      is-link
    />
    <van-cell
      @click="showBirth"
      title="生日"
      :value="userInfo.birthday"
      is-link
    />

    <!-- 4. 弹出框 -- 修改名字 -->
    <!-- 这里的v-model是用来控制这个弹出框显示或隐藏的，true显示，false隐藏 -->
    <van-dialog
      class="dialog-name"
      v-model="dialogShow"
      title="修改名称"
      show-cancel-button
      @confirm="changeName"
    >
      <!-- 输入框 -->
      <van-field ref="nameInp" v-model="editName" />
    </van-dialog>

    <!-- 5. 弹出层 -- 修改性别 -->
    <van-popup v-model="popShow" position="bottom" :style="{ height: '16%' }">
      <van-nav-bar
        title="修改性别"
        left-text="取消"
        @click-left="popShow = false"
      />
      <van-cell @click="changeSex(1)" title="男" is-link />
      <van-cell @click="changeSex(0)" title="女" is-link />
    </van-popup>

    <!-- 6. 弹出层 -- 修改生日 -->
    <van-popup v-model="birthShow" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
        @confirm="changeBirthday"
        @cancel="birthShow = false"
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>

    <!-- 7. 裁剪区域 -->
    <!-- autoCrop加上就代表给一个裁剪框 -->
    <div class="crop-wrap" v-show="cropShow">
      <vueCropper
        ref="cropper"
        autoCrop
        autoCropWidth="150"
        autoCropHeight="150"
        :img="cropImg"
      ></vueCropper>
      <van-button @click="doCrop" type="primary">裁剪</van-button>
      <van-button @click="cropShow = false" type="primary">取消</van-button>
    </div>
  </div>
</template>

<script>
import { editProfileAPI, editAvatarAPI } from "@/api";
import moment from "moment";

import { VueCropper } from "vue-cropper";

export default {
  components: {
    VueCropper,
  },
  data() {
    return {
      dialogShow: false,
      // 绑定修改姓名输入框的
      editName: "",
      popShow: false,
      // 控制时间选择的显示和隐藏
      birthShow: false,
      // 用来获取它选择的时间，或者用来设置默认显示的时间
      currentDate: new Date(),
      // 设置最小能设置的日期
      minDate: new Date("1949-10-01"),
      // 设置最大能设置的日期
      maxDate: new Date(),
      // 控制裁剪区域显示或隐藏
      cropShow: false,
      // 装裁剪图片的变量
      cropImg: "",
    };
  },

  methods: {
    // 1. 点击姓名的点击事件
    showNameDialog() {
      // 1.1 显示出弹出框
      this.dialogShow = true;
      // 1.2 把我的名字显示到输入框
      this.editName = this.userInfo.name;
      // 1.3 让输入框获得焦点
      // vue对组件用的是懒加载，如果你默认是隐藏的，它就没有去渲染它
      // 既然没有渲染它，此时找不到输入框，所以我们要用一个$nextTick
      this.$nextTick(() => {
        // 等下一次dom渲染完毕，再去找到input，再让它获得焦点
        this.$refs.nameInp.focus();
      });
    },

    // 2. 修改名字
    async changeName() {
      // 发请求，修改名字
      await editProfileAPI({
        name: this.editName,
      });

      // 修改成功，还要改掉vuex里的值
      this.$store.commit("setUserInfo", {
        // 要保留原来的数据，只单独修改name
        ...this.$store.state.userInfo,
        name: this.editName,
      });
    },

    // 3. 修改性别
    async changeSex(gender) {
      // 优化一下性能：判断如果要修改的性别跟之前的性别一样，就没必要往下执行
      if (gender === this.userInfo.gender) {
        this.popShow = false;
        return;
      }

      // 发请求去修改
      await editProfileAPI({
        gender,
      });

      // 修改成功要改掉vuex里的数据，界面才会变
      this.$store.commit("setUserInfo", {
        // 要保留原来的数据，只单独修改name
        ...this.$store.state.userInfo,
        gender,
      });

      // 隐藏弹出层
      this.popShow = false;
    },
    // 4.1 生日cell点击事件 - 显示生日选择器
    showBirth() {
      // 把自己的生日赋值给时间选择
      this.currentDate = new Date(this.userInfo.birthday);
      // 显示时间选择器
      this.birthShow = true;
    },
    // 4.2 修改生日
    async changeBirthday() {
      // 注意：这里接口要求的数据是字符串，而我们拿到的时间是Date类型
      // 不匹配，需要转
      const birthday = moment(this.currentDate).format("YYYY-MM-DD");

      // 发请求
      await editProfileAPI({
        birthday,
      });
      // 请求成功修改vuex
      this.$store.commit("setUserInfo", {
        // 要保留原来的数据，只单独修改name
        ...this.$store.state.userInfo,
        birthday,
      });

      // 隐藏生日选择器
      this.birthShow = false;
    },

    // 5. 文件上传选择完文件后触发的函数
    afterRead(file) {
      // // file里包含了当前选择的文件信息
      // // content属性有选择的图片对应的base64编码
      // console.log("选择完文件了", file.content);
      // // file属性就有这张文件对象
      // console.log("选择完文件了", file.file);

      // 显示裁剪容器
      this.cropShow = true;
      // 把选择的文件赋值给裁剪插件
      this.cropImg = file.content;
    },

    // 6. 点击裁剪触发
    doCrop() {
      // 要不要拿到框选后裁剪的结果
      this.$refs.cropper.getCropBlob( async (data) => {
        
        // 要给接口传文件对象，虽然我们用的是axios，本质上发的是ajax
        // 而ajax要传文件，必须要依赖 FormData 对象
        let fm = new FormData() // 空的
        // 添加内容,参数1：key 参数2：值
        fm.append('photo', data)

        let res = await editAvatarAPI(fm) 
        // 隐藏裁剪框
        this.cropShow = false
        // 把上传后的图片最新地址传递到vuex
        this.$store.commit('setUserInfo', {
          ...this.$store.state.userInfo,
          photo: res.data.data.photo
        })
        this.$toast.success('修改成功！')
      });
    },
  },

  created() {
    this.$store.dispatch("reqUserInfo");
  },

  computed: {
    // 利用计算属性来优化访问vuex里的数据
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
};
</script>

<style lang="less" scoped>
.mine-edit {
  .avatar {
    height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .van-image {
      width: 120px;
      height: 120px;
    }

    .van-uploader {
      width: 100%;
      height: 100%;
      position: absolute;
      opacity: 0;

      ::v-deep {
        .van-uploader__wrapper {
          width: 100%;
          height: 100%;

          .van-uploader__upload {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .dialog-name {
    .van-field {
      border: 1px solid #ddd;
    }
  }

  .crop-wrap {
    // 铺满整个屏幕
    // vw: viewport width 视口宽度
    // vh：viewport height 视口高度
    // 把视口宽度和高度各自分成100份，写100代表铺满
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: #f00;

    .van-button {
      position: fixed;
      bottom: 0;
      left: 0;

      &:nth-of-type(2) {
        // 要把left给恢复成默认值
        left: auto;
        right: 0;
      }
    }
  }
}
</style>