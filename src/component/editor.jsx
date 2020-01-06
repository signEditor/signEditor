import React, { Component } from 'react'
import '../lib/ckeditor'
import CKEditor from '@ckeditor/ckeditor5-react';
import { Button, Upload, Icon } from 'antd'
class Editor extends Component {
    state = {
        editor: null,
        data: ''
    }

    render() {
        let { initData, save, config } = this.props
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
                <div>
                    <Button onClick={e => save(editor)} type="primary">保存</Button>
                    <Upload {...config}>
                        <Button>
                            <Icon type="upload" /> 上传word
                        </Button>
                    </Upload>
                </div>
            </div>
        )
    }
}

export default Editor