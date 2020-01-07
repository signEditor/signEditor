import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { getUserWordInfo, saveUserWordInfo, upLoadWord } from '../../store/action'
import Editor from '../../component/editor'
import './index.scss'
import { message, Spin, BackTop, Modal } from 'antd'
import html2canvas from 'html2canvas'
import jsPDF from '../../lib/jsPDF';
class EditorPage extends Component {
    state = {
        allowEditor: false,
        status: 'loading',
        visible: false,
        confirmLoading: false,
        pdfUrl: ''
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
        let { status, visible, confirmLoading, pdfUrl } = this.state
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
                await upLoadWord(fd)
            }
        }
        return (
            <div className="editorWrapper">
                <Modal
                    title="Title"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <img src={pdfUrl}></img>
                </Modal>
                <BackTop />
                {
                    status === 'loading' ?
                    <Spin className="loading" size="large" />
                    :
                    <Suspense fallback={<Spin className="loading" size="large" />}>
                        <div className="wordTitle">{userWordTitle}</div>
                        <div>
                            <Editor
                                config={config} 
                                save={this.save} 
                                Export={this.Export}
                                initData={userWordContent}
                            ></Editor>
                        </div>
                    </Suspense>
                }
            </div>
        )
    }

    save = async editor => {
        let { saveUserWordInfo } = this.props
        let { params: { id } } = this.props.match
        let userID = sessionStorage.getItem('userID')
        let data = editor.getData()
        let reg = new RegExp(/<h1[^>]*>(.*?)<\/h1>/)
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
            message.success('保存成功', 1, () => {
                history.push({
                    pathname: '/template'
                })
            })
        }
        else message.error('保存失败')
    }

    Export = async editor => {
        let that = this
        let dom = editor.domContainer.current
        let p = await html2canvas(dom, {
            backgroundColor: '#FFF'
        })
        let url = p.toDataURL()
        this.setState({
            visible: true,
            pdfUrl: url
        })
        /*.then(canvas => {
            var contentWidth = canvas.width
            var contentHeight = canvas.height

            console.log('contentWidth', contentWidth)
            console.log('contentHeight', contentHeight)
            // 将canvas转为base64图片
            var pageData = canvas.toDataURL('image/jpeg', 1.0)
            console.log(pageData)
            this.setState({
                visible: true,
                pdfUrl: pageData
            })
            return
            // 设置pdf的尺寸，pdf要使用pt单位 已知 1pt/1px = 0.75   pt = (px/scale)* 0.75
            // 2为上面的scale 缩放了2倍
            var pdfX = (contentWidth + 10) / 2 * 0.75
            var pdfY = (contentHeight + 500) / 2 * 0.75 // 500为底部留白

            // 设置内容图片的尺寸，img是pt单位 
            var imgX = pdfX;
            var imgY = (contentHeight / 2 * 0.75); //内容图片这里不需要留白的距离

            // 初始化jspdf 第一个参数方向：默认''时为纵向，第二个参数设置pdf内容图片使用的长度单位为pt，第三个参数为PDF的大小，单位是pt
            var PDF = new jsPDF('', 'pt', [pdfX, pdfY])

            // 将内容图片添加到pdf中，因为内容宽高和pdf宽高一样，就只需要一页，位置就是 0,0
            PDF.addImage(pageData, 'jpeg', 0, 0, imgX, imgY)
            PDF.save('download.pdf')
        })*/
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