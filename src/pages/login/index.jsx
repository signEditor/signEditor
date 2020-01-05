import React, { Component } from 'react'
import './index.scss'
import { connect } from 'react-redux'
import { createForm } from 'rc-form'
import { Divider, Input, Button, message } from 'antd';
import { login, register } from '../../store/action'
class Login extends Component {
    
    state = {
        loginState: false,
        registState: false
    }

    render() {
        const { getFieldDecorator } = this.props.form
        let { loginState, registState } = this.state
        return (
            <div className="container">
                <div className="bg"></div>
                <div className="loginWrapper">
                    <div className="title">富文档编辑器</div>
                    <Divider />
                    <div className="InputWrapper">
                        <span className="info">用户名：</span>
                        {
                            getFieldDecorator('userName', {
                                initialValue: '',
                                rules: [{
                                    required: true
                                }]
                            })(
                                <Input allowClear placeholder="用户名" className="userName"></Input>
                            )
                        }
                    </div>

                    <div className="InputWrapper">
                        <span className="info">密码：</span>
                        {
                            getFieldDecorator('passWd', {
                                initialValue: '',
                                rules: [{
                                    required: true
                                }]
                            })(
                                <Input allowClear placeholder="密码" type="password" className="userName"></Input>
                            )
                        }
                    </div>
                    <div className="btnWrapper">
                        <Button onClick={e=>this.login(e)} loading={loginState} className="btn" type="primary">登录</Button>
                        <Button onClick={e => this.register(e)}  loading={registState}  className="btn" type="primary">注册</Button>
                    </div>
                </div>
            </div>
        )
    }

    //点击登录
    login = async e => {
        const { validateFields } = this.props.form
        await this.setState({
            loginState: true
        })
        validateFields(async (err, val) => {
            if(err) {
                message.warn('信息不完整')
                await this.setState({
                    loginState: false
                })
                return
            }
            let { submit } = this.props
            let p = await submit(val)
            let { code, msg, data } = p
            await this.setState({
                loginState: false
            })
            if(code === '0000') {
                message.success(msg, 1, () => {
                    let { history } = this.props
                    let { id } = data
                    if(id !== '') {
                        history.push({
                            pathname: '/template'
                        })
                    } 
                })
            } else {
                message.error(msg)
            }
            await this.setState({
                loginState: false
            })
        })
    }

    //点击注册
    register = async e => {
        const { validateFields } = this.props.form
        await this.setState({
            registState: true
        })
        validateFields(async (err, val) => {
            if(err) {
                message.warn('信息不完整')
                await this.setState({
                    registState: false
                })
                return
            }
            let { register } = this.props
            let p = await register(val)
            let { code, msg, data: { id } } = p
            if(code === '0000') {
                message.success(msg, 1, () => {
                    let { history } = this.props
                    if(id !== '') {
                        history.push({
                            pathname: '/template'
                        })
                    } 
                })
            } else {
                message.error(msg)
            }
            await this.setState({
                registState: false
            })
        })
    }
}

const mapStateToProps = state => {
    let { userID } = state
    return {
        userID
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submit(val) {
            const action = login(val)
            return dispatch(action)
        },
        register(val) {
            const action = register(val)
            return dispatch(action)
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Login))