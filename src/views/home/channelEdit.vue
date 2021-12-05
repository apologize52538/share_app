<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <div class="channel-wrap">
      <div class="title">
        <span>我的频道</span>
        <van-button
          @click="isEdit = !isEdit"
          size="small"
          plain
          type="danger"
          >{{ isEdit ? "取消" : "编辑" }}</van-button
        >
      </div>

      <van-grid>
        <van-grid-item v-for="(item, index) in ownChannels" :key="item.id">
          <span
            @click="intoChannel(index)"
            :class="{ active: index == value }"
            >{{ item.name }}</span
          >
          <van-icon
            @click="delChannel(index, item)"
            v-if="isEdit && index"
            class="del-icon"
            name="cross"
          />
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 可选频道 -->
    <div class="channel-wrap">
      <div class="title">
        <span>可选频道</span>
      </div>

      <van-grid>
        <van-grid-item
          v-for="item in optionalChannel"
          :key="item.id"
          :text="item.name"
          @click="addChannel(item)"
        />
      </van-grid>
    </div>
  </div>
</template>

<script>
import { setChannel } from '@/utils/storage'
import { addChannelAPI, delChannelAPI } from '@/api'
export default {
  props: {
    // 接受父组件传来的自己有的频道
    ownChannels: {
      //   限制必填和类型为数组
      required: true,
      type: Array,
    },
    // 接受父组件传来的所有频道
    allChannels: {
      //   限制必填和类型为数组
      required: true,
      type: Array,
    },
    // 父组件传递过来的索引
    value: {
      type: Number,
    },
  },

  // 只是在告诉外界用v-model的时候生成的事件名叫xx
  // model: {
  //   prop: 'active',
  //   event: 'xx'
  // },

  data() {
    return {
      // 记录当前的编辑状态
      isEdit: false,
    };
  },

  methods: {
    // 1. 点击进入频道
    intoChannel(index) {
      // 把这个被点的下标传递给父组件
      this.$emit("input", index);
      // 通知父组件关闭窗口
      this.$emit("close");
    },

    // 2. 点击可选添加频道
    async addChannel(item) {
      // 把被点的频道加到我的频道里
      this.ownChannels.push(item);
      // 判断是否有登录
      if ( this.$store.state.tokenObj.token ) {

        // 代表登录了
        await addChannelAPI({
          channels: [{ id: item.id,seq: this.ownChannels.length }]
        })

      }else {

        // 没登录,保存我的频道到本地
        setChannel(this.ownChannels)
      }
    },

    // 3. 点击x删除频道
    async delChannel(index, item) {
      // 从自己的频道数组里删除
      this.ownChannels.splice(index, 1);

      // 判断要删除的下标是否小于当前下标，若小于，就让高亮索引-1
      if (index < this.value) {
        this.$emit("input", this.value - 1);
      }

      // 判断是否登录
      if (this.$store.state.tokenObj.token) {
        await delChannelAPI(item.id)

      }else {

        // 没登录
        // 把剩余的我的频道数组保存到本地存储就行了
        setChannel(this.ownChannels)
      }
    },
  },

  computed: {
    // 可选频道
    optionalChannel() {
      // 过滤所有频道
      /*
      let res = this.allChannels.filter((value) => {
        // 判断当前这个元素在不在我的频道里面，在就不过滤出来
        // 不在就过滤出来
        let index = this.ownChannels.findIndex((v) => {
          if (v.id == value.id) return true;
        });

        // 如果下标为-1代表不存在，那么就过滤出来
        // if (index == -1) 
        //     return true;
        // else 
        //     return false;
        return index == -1
      });

      return res
      */

      /*
      return this.allChannels.filter((value) => {
        // 判断当前这个元素在不在我的频道里面，在就不过滤出来
        // 不在就过滤出来
        let index = this.ownChannels.findIndex((v) => {
          // if (v.id == value.id) return true;
          // 因为条件为true我就要return true，所以简单说我就直接return 条件
          return v.id == value.id
        });
        return index == -1;
      });
    */

      // return this.allChannels.filter(
      //   (value) => this.ownChannels.findIndex((v) => v.id == value.id) == -1
      // );

      // 下面是用find的写法
      return this.allChannels.filter(
        (v) => !this.ownChannels.find((value) => value.id == v.id)
      );
    },
  },
};
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 0 20px;
  .channel-wrap {
    .title {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .active {
    color: red;
  }

  .del-icon {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
</style>