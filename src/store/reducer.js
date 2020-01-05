//保存数据仓库
import { 
    SET_USERINFO,
    SET_USERWORDTEMPLATE,
    SET_USERWORDINFO
 } from './actionType'
const InitState = {
    userName: '', //用户名
    userID: '',  //登录之后来保存用户ID
    userWordTemplate: [], //用户word模板
    userWordContent: '',
    userWordTitle: ''
}

const Reducer = (state = InitState, action) => {
    switch(action.type) {
        case SET_USERINFO:
            return {
                ...state,
                userID: action.data.userID,
                userName: action.data.userName
            }
        case SET_USERWORDTEMPLATE:
            return {
                ...state,
                userWordTemplate: action.data
            }
        case SET_USERWORDINFO:
            return {
                ...state,
                userWordContent: action.data.userWordContent,
                userWordTitle: action.data.userWordTitle
            }
        default:
            return state
    }
    return state
}

export default Reducer