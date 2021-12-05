import request from '@/utils/request'

// 封装一个获取评论列表的接口
export const cmtList = (params) => {

    return request({
        url: '/v1_0/comments',
        params
    })
}


// 封装一个发表评论/回复 的接口
export const sendCmt = (data) => {

    return request({
        url: '/v1_0/comments',
        method: 'post',
        data
    })
}