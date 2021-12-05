import request from '@/utils/request'

// 封装一个获得联想词汇的接口
export const suggest = (params) => {

    return request({
        url: '/v1_0/suggestion',
        params
    })
}


// 旧接口封装的方法 --------------
export const getHistory = () => {

    return request({
        url: '/v1_0/search/histories',
    })
}

// 获取搜索结果
export const getSearchResult = (params) => {

    return request({
        url: '/v1_0/search',
        params
    })
}