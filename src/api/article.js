import request from '@/utils/request'

// 封装一个获取新闻列表的方法
export const articleList = (params) => {

    // 默认url是新接口的路径
    let url = '/v1_0/articles' 
    
    // 旧接口要多一个参数必传，with_top: 0
    if (request.defaults.baseURL.indexOf('toutiao-app') != -1) {
        params.with_top = 0
        url = '/v1_1/articles'
    }

    return request({
        url,
        // get请求参数是params，post的请求体参数是data
        params
    })
}


// 封装一个获取新闻详情的方法
export const articleInfo = (id) => {

    return request({
        url: `/v1_0/articles/${id}`,
    })
}


// 封装一个点赞接口
export const zan = (data) => {

    return request({
        url: `/v1_0/article/likings`,
        method: 'post',
        data
    })
}
export const unzan = (id) => {

    return request({
        url: `/v1_0/article/likings/` + id,
        method: 'delete',
    })
}


export const unlike = (data) => {

    return request({
        url: `/v1_0/article/dislikes`,
        method: 'post',
        data
    })
}
export const cancelUnlike = (id) => {

    return request({
        url: `/v1_0/article/dislikes/` + id,
        method: 'delete',
    })
}