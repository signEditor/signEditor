/**
 * 用来创建dispatch
 * example 
 * export const changeState = state => ({
 *      type: '',
 *      data: state
 * })
 */


import { 
    SET_USERINFO, 
    SET_USERWORDTEMPLATE,
    SET_USERWORDINFO 
} from './actionType'
//设置用户的id
export const setUserInfo = state => ({
    type: SET_USERINFO,
    data: {
        userID: state.userID,
        userName: state.userName
    }
})

//设置用户的word模板数据
export const setUserWordTemplate = state => ({
    type: SET_USERWORDTEMPLATE,
    data: state
})


//设置用户的word数据
export const setUserWordInfo = state => ({
    type: SET_USERWORDINFO,
    data: state
})
