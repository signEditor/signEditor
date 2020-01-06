import axios from 'axios'
import { setUserInfo, setUserWordTemplate, setUserWordInfo } from './dispatch'
//这里进行ajax请求
/**
 * example
 * export const test = () => {
 *      return dispatch => {
 *          axios.get().then(res => {
 *              const action = test(res.data)
 *              dispatch(action)
 *          })
 *      }
 * }
 */

 export const url = 'http://127.0.0.1:5000'


//登录
export const login = val => {
    return async dispatch => {
        let res = await axios.post( url + '/login', {
            data: val
        })
        let { data: { code, msg, data } } = res
        let { id = '' } = data
        let action = setUserInfo({
            userID: id,
            userName: val.userName
        })
        dispatch(action)
        return {
            code,
            msg,
            data
        }
    }
}

//注册
export const register = val => {
    return async dispatch => {
        let res = await axios.post(url +'/register', {
            data: val
        })
        let { data: { code, msg, data } } = res
        let { id = '' } = data
        let action = setUserInfo({
            userID: id,
            userName: val.userName
        })
        dispatch(action)
        return {
            code,
            msg,
            data
        }
    }
}

//获取用户的word文档模板
export const getUserWordTemplate = userID => {
    return async dispatch => {
        let res = await axios.get(url + '/getUserTemplate', {
            params: {
                userID
            }
        })
        let { data: { code, msg, data } } = res
        let { wordTemplateData = []} = data
        if(code === '0000') {
            let action = setUserWordTemplate(wordTemplateData)
            dispatch(action)
        }
        return {
            msg,
            code,
            wordTemplateData
        }
    }
}

//去获取用户的word
export const getUserWordInfo = userInfo => {
    return async dispatch => {
        let res = await axios.get(url + '/getUserWordInfo', {
            params: {
                userID: userInfo.userID,
                wordID: userInfo.wordID
            }
        })
        let { data: { code, data, msg } } = res
        if(code === '0000') {
            let { content, title} = data
            const action = setUserWordInfo({
                userWordContent: content,
                userWordTitle: title
            })
            dispatch(action)
        }
        return {
            code,
            msg
        }
    }
}

export const saveUserWordInfo = info => {
    return async dispatch => {
        let res = await axios.post(url + '/saveUserWordInfo', {
            data: info
        })
        let { code } = res.data
        return code
    }
}

export const upLoadWord = FormData => {
    return async dispatch => {
        let res = await axios.post(url + '/upLoadWord', FormData)
        let { data: { title, data: { value } } } = res
        title = title.replace(/.doc(x)$/i, '')
        value = `<h1>${title}</h1>${value}`
        const action = setUserWordInfo({
            userWordContent: value,
            userWordTitle: title
        })
        dispatch(action)
        return {
            title,
            value
        }
    }
}