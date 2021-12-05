import request from '@/utils/request'


// 封装一个做登录的接口
export const login = (data) => {

    return request({
        url: '/v1_0/authorizations',
        // 千万不要忘记写method:post，不然默认是get
        method: 'post',
        data
    })
}