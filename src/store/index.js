import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);

import { setToken, getToken, removeToken } from '@/utils/auth'
import { userInfoAPI } from "@/api";

const store = new Vuex.Store({
    state: {
        // 如果给默认值的时候要考虑能不能取到值，不能取到给默认值
        tokenObj: getToken() || {},
        // 保存用户信息的变量
        userInfo: {}
    },
    mutations: {

        // 提供一个修改的方法
        saveToken(state, payload) {
            // 把传进来的token对象赋值给tokenObj
            state.tokenObj = payload
            // 存到本地存储
            setToken(payload)
        },

        // 因为我要清空vuex里的数据以及localStorage里的
        logout (state) {

            // 清空vuex里的token
            state.tokenObj = {}
            // 清空vuex里的userInfo
            state.userInfo = {}
            // 清空本地存储的token
            removeToken()
        },

        setUserInfo(state, payload) {

            state.userInfo = payload
        }
    },

    actions: {

        // 把刚刚请求的代码复制过来即可
        async reqUserInfo(context) {

            // 判断，是否有数据，有就不发了，没有才发
            // 没有数据才发请求
            if (!context.state.userInfo.name) {
                // 发请求获取用户信息
                let res = await userInfoAPI();
                // 保存到vuex里
                context.commit("setUserInfo", res.data.data);
            }
        }
    }
});

export default store