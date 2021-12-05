import { login } from './login'
import { userInfo,editProfile, editAvatar, followUser,unfollowUser } from './user'
import { channels, channelsAll, addChannel,delChannel } from './channel'
import { articleList,articleInfo,zan, unzan, cancelUnlike, unlike } from './article'
import { cmtList,sendCmt } from './comment'
import { suggest, getHistory,getSearchResult } from './search'

export const loginAPI = login
export const userInfoAPI = userInfo
export const editProfileAPI = editProfile
export const editAvatarAPI = editAvatar
export const channelsAPI = channels
export const articleListAPI = articleList
export const articleInfoAPI = articleInfo
export const cmtListAPI = cmtList
export const sendCmtAPI = sendCmt
export const channelsAllAPI = channelsAll
export const addChannelAPI = addChannel
export const delChannelAPI = delChannel
export const suggestAPI = suggest
export const getHistoryAPI = getHistory
export const getSearchResultAPI = getSearchResult
export const followUserAPI = followUser
export const unfollowUserAPI = unfollowUser
export const zanAPI = zan
export const unzanAPI = unzan
export const cancelUnlikeAPI = cancelUnlike
export const unlikeAPI = unlike