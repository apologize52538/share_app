// 把key声明成一个变量
const TOKEN_KEY = 'hmtt76'

// 保存token，需要参数
export const setToken = (tokenObj) => {

    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenObj))
}


// 获取token，不用参数，需要返回值
export const getToken = () => {

    // 注意：拿到的是字符串，所以记得先JSON.parse转成对象再返回
    return JSON.parse(window.localStorage.getItem(TOKEN_KEY))
}


// 删除token，既不要参数，也不要返回值
export const removeToken = () => {
 
    window.localStorage.removeItem(TOKEN_KEY)   
}
