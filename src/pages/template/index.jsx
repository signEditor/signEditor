import React, { Component } from 'react'
import './index.scss'
import { connect } from 'react-redux'
import { message, List, Icon } from 'antd'
import { getUserWordTemplate } from '../../store/action'
import { Link } from 'react-router-dom'
class Template extends Component {
    async componentDidMount() {
        let { userID, userName } = this.props
        //如果用户id不存在就弹出信息并回到首页
        if(!userID && !sessionStorage.getItem('userID')) {
            let { history } = this.props
            message.error('请确认是否登录', 2, () => {
                history.push({
                    pathname: '/'
                })
            })
        } else {
            //设置session
            if(userID !== '') {
                sessionStorage.setItem('userID', userID)
            }
            if(userName !== '') {
                sessionStorage.setItem('userName', userName)
            }
            //去获取用户的富文档模板
            let { getUserWrodTemplate } = this.props
            let p = await getUserWrodTemplate(userID !== '' ? userID : sessionStorage.getItem('userID'))
            let { code } = p
            if(code !== '0000') {
                message.error('获取数据失败,请重试')
            }
        }
    }
    render() {
        let { userWordTemplate } = this.props
        let { userName } = this.props
        userName = userName ? userName : sessionStorage.getItem('userName')
        return (
            <div>
                <List
                    header={<div>欢迎您: {userName}</div>}
                    footer={<div style={{
                        textAlign: 'center',
                        fontSize: '20px'
                    }}><Icon type="edit" theme="twoTone" /></div>}
                    bordered
                    dataSource={userWordTemplate}
                    renderItem={item => (
                        <Link to={`/editor/${item.id}`}>
                            <List.Item className="wordTemplateItem" key={item.id}>
                                {item.title}
                            </List.Item>
                        </Link>
                    )}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    let { userID, userWordTemplate, userName } = state
    return {
        userID,
        userWordTemplate,
        userName
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUserWrodTemplate(id) {
            let action = getUserWordTemplate(id)
            return dispatch(action)
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Template)