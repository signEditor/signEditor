import React, { Component } from 'react';
import { Provider } from 'react-redux'
import store from './store/index'
import './index.css'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

/**
 * 顶级组件用来放置路由页面
 * @author 马羽
 * @date: 2020-1-3
 * example <Route path="/" component={Test}></Route>
 * @description 组件放在component中, 页面放在pages中 数据在store的reducer中
 * 在action请求数据，redux的type定义在actionType中，dispatch定义修改数据的dispatch  action进行请求的异步处理
 * page页面创建文件夹代表一个页面 index.js index.scss
 */
class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<Switch>
					</Switch>
				</Router>
			</Provider>
		)
	}
}


export default App