import request from '@/utils/request'

// 封装一个获取用户资料的接口
export const userInfo = () => {

    return request({
        url: '/v1_0/user/profile',
    })
}

// 修改用户资料
export const editProfile = (data) => {

    return request({
        url: '/v1_0/user/profile',
        method: 'patch',
        data
    })
}


// 修改用户头像
export const editAvatar = (data) => {

    return request({
        url: '/v1_0/user/photo',
        method: 'patch',
        data
    })
}


// 关注用户
export const followUser = (data) => {

    return request({
        url: '/v1_0/user/followings',
        method: 'post',
        data
    })
}
// 取关用户
export const unfollowUser = (id) => {

    return request({
        url: '/v1_0/user/followings/' + id,
        method: 'delete',
    })
}