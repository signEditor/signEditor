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
        let { initData, save, config, Export } = this.props
        let { editor } = this.state
        let editorEl = this.editorEl
        return (
            <div className="editorWrapper">
                <div className="toolBar" ref={toolbar => this.toolbar=toolbar} ></div>
                <CKEditor
                    ref={editorEl => this.editorEl = editorEl}
                    className="editor"
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
                    <Button onClick={e => Export(editorEl)} type="primary">导出</Button>
                </div>
            </div>
        )
    }
}

export default Editor