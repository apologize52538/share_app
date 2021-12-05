// 导入请求对象
import request from '@/utils/request'

// 封装一个获得频道列表数据的方法
export const channels = () => {

    return request({
        url: '/v1_0/user/channels'
    })
}


// 封装一个获得所有频道数据的方法
export const channelsAll = () => {

    return request({
        url: '/v1_0/channels'
    })
}

// 封装一个添加频道的请求方法
export const addChannel = (data) => {

    return request({
        url: '/v1_0/user/channels',
        method: 'patch',
        data
    })
}
// 封装一个删除频道的请求方法
export const delChannel = (id) => {

    return request({
        url: '/v1_0/user/channels/' + id,
        method: 'delete',
    })
}