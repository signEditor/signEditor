import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserWordInfo, saveUserWordInfo } from '../../store/action'
import Editor from '../../component/editor'
import './index.scss'
import { message } from 'antd'
class EditorPage extends Component {
    state = {
        allowEditor: false,
        status: 'loading'
    }
    async componentDidMount() {
        let { match } = this.props
        let { params: { id } } = match
        if(id === 0 || id) {
            //如果id是存在的话
            //就去获取文档数据
            let { getUserWord } = this.props
            let p = await getUserWord({
                userID: sessionStorage.getItem('userID'),
                wordID: id
            })
            let { code } = p
            if(code === '0000') {
                this.setState({
                    status: 'success'
                })
            } else {
                this.setState({
                    status: 'error'
                })
            }
        }
    }
    render() {
        let { userWordContent, userWordTitle } = this.props
        return (
            <div className="editorWrapper">
                <div className="wordTitle">{userWordTitle}</div>
                <div>
                    <Editor click={this.save} initData={userWordContent}></Editor>
                </div>
            </div>
        )
    }

    save = async editor => {
        let { saveUserWordInfo } = this.props
        let { params: { id } } = this.props.match
        let userID = sessionStorage.getItem('userID')
        let data = editor.getData()
        let reg = new RegExp(/<h1>(.*?)<\/h1>/)
        let title = '';
        if(reg.exec(data)) {
            title = reg.exec(data)[1]
        }
        let p = await saveUserWordInfo({
            userID,
            id,  //文章id
            title,
            content: data
        })
        if(p === '0000') message.success('保存成功')
        else message.success('保存失败')
    }
}


const mapStateToProps = state => {
    let { userWordContent, userWordTitle } = state
    return {
        userWordContent,
        userWordTitle
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUserWord(userInfo) {
            const action = getUserWordInfo(userInfo)
            return dispatch(action)
        },
        saveUserWordInfo(userWordInfo) {
            const action = saveUserWordInfo(userWordInfo)
            return dispatch(action)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorPage)