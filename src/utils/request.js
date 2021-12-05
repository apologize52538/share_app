import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Toast } from 'vant';

// 设置基地址
const instance = axios.create({
    // 新接口
    baseURL: 'http://toutiao.itheima.net/'

    // 旧接口
    // baseURL: 'http://toutiao-app.itheima.net/'
})

// 所有通过instance发送的请求都会被拦截下来
instance.interceptors.request.use(function (config) {

    // 给config加什么，那么请求时就有什么
    // 判断一下，有token才加
    if (store.state.tokenObj.token) {
        // 所以我们想给请求头加token，就加在headers里
        config.headers.Authorization = 'Bearer ' + store.state.tokenObj.token
    }
    return config;

}, function (error) {
    // 对请求错误做些什么
    // console.log('请求出错调用的函数')
    return Promise.reject(error);
});


/*************************  响应拦截 *****************************/
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;

}, async function (error) {

    if (error.response.status == 401) {

        try {
        // 能进入到这里代表token有问题
        // 利用refresh_token去获取新的token
        // 这里的坑点是：不能用instance这个对象去发请求
        // 原因：instance加了请求拦截，会把我的refresh_token给覆盖掉
        // 所以这个时候用 axios 发请求，但是它没有设置基地址，那我们自己把地址写全
        let res = await axios({
            url: 'http://toutiao.itheima.net/v1_0/authorizations',
            method: 'put',
            headers: {
                Authorization: 'Bearer ' + store.state.tokenObj.refresh_token
            }
        })

        // 拿到最新token了，就存到vuex和本地存储里
        store.commit('saveToken', {
            // 只替换token，refresh_token还用原来的
            token: res.data.data.token,
            refresh_token: store.state.tokenObj.refresh_token
        })

        // 拿到最新token以后，除了要保存以外，还要把之前发失败的那个请求再发一次
        // 然后把结果给返回回去
        return await instance(error.config)
    }catch {

        // 报错了，如果这里都报错了，就证明连refresh_token都过期了
        // 那就打回登录页，让它重新登录
        Toast.fail('登录状态已过期，请重新登录')
        router.push('/login')
        return Promise.reject(error);
    }

    } else {

        // 对响应错误做点什么
        return Promise.reject(error);
    }
});


// 暴露出去
export default instance