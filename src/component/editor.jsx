import React, { Component } from 'react'
import '../lib/ckeditor'
import CKEditor from '@ckeditor/ckeditor5-react';
import { Button } from 'antd'
class Editor extends Component {
    state = {
        editor: null,
        data: ''
    }

    render() {
        let { initData, click } = this.props
        let { editor } = this.state
        return (
            <div>
                <div className="toolBar" ref={toolbar => this.toolbar=toolbar} ></div>
                <CKEditor
                    editor={ DecoupledEditor }
                    onInit = { async editor => {
                        await this.setState({
                            editor
                        })
                        this.toolbar.appendChild( editor.ui.view.toolbar.element )
                    } }
                    data = {initData}
                ></CKEditor>
                <div><Button onClick={e => click(editor)} type="primary">保存</Button></div>
            </div>
        )
    }
}

export default Editor