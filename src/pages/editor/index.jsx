import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserWordInfo, saveUserWordInfo, upLoadWord } from '../../store/action'
import Editor from '../../component/editor'
import './index.scss'
import { message, Spin } from 'antd'
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
        userWordTitle = userWordTitle.replace(/&nbsp;/gi, '')
        let { status } = this.state
        let that = this
        const config = {
            name: 'file',
            action: '',
            showUploadList: false,
            beforeUpload(file) {
                let name = file.name
                if(/doc(x)$/.test(name)) return true
                else {
                    message.error('只支持上传word')
                    return false
                }
            },
            async customRequest(info) {
                let { file } = info
                let { upLoadWord } = that.props
                let fd = new FormData()
                fd.append('file', file)
                let p = await upLoadWord(fd)
                
            },
            onChange(info) {
                
            }
        }
        return (
            <div className="editorWrapper">
                {
                    status === 'loading' ?
                    <Spin className="loading" size="large" />
                    :
                    <>
                        <div className="wordTitle">{userWordTitle}</div>
                        <div>
                            <Editor
                                config={config} 
                                save={this.save} 
                                initData={userWordContent}
                            ></Editor>
                        </div>
                    </>
                }
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
        if(p === '0000') {
            let { history } = this.props
            message.success('保存成功', 2, () => {
                history.push({
                    pathname: '/template'
                })
            })
        }
        else message.error('保存失败')
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
        },
        upLoadWord(FormData) {
            const action = upLoadWord(FormData)
            return dispatch(action)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorPage)