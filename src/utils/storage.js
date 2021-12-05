// 把key声明成一个变量
const CHANNEL_KEY = 'hmtt76_channel'

// 保存频道，需要参数
export const setChannel = (list) => {

    window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(list))
}


// 获取频道，不用参数，需要返回值
export const getChannel = () => {

    // 注意：拿到的是字符串，所以记得先JSON.parse转成对象再返回
    return JSON.parse(window.localStorage.getItem(CHANNEL_KEY))
}


// 删除频道，既不要参数，也不要返回值
export const removeChannel = () => {
 
    window.localStorage.removeItem(CHANNEL_KEY)   
}
