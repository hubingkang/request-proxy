import React, { useState, useEffect, FC } from 'react'
import { Button, message, Space } from 'antd';

import {Controlled as CodeMirror} from 'react-codemirror2'

// 引入CodeMirror和基础样式
import "codemirror/lib/codemirror.css";
// JSON代码高亮需要由JavaScript插件支持
import "codemirror/mode/javascript/javascript.js";
// 选择IDEA主题样式，还有其他很多主题可选
// import "codemirror/theme/idea.css";
// import "codemirror/theme/material.css";
// 主题风格
import 'codemirror/theme/dracula.css';
// 支持使用Sublime快捷键
import "codemirror/keymap/sublime.js";
// 搜索功能的依赖
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
// 支持搜索功能
import "codemirror/addon/search/search";
import "codemirror/addon/search/searchcursor.js";
// 支持各种代码折叠
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
// 支持代码区域全屏功能
import "codemirror/addon/display/fullscreen.css";
import "codemirror/addon/display/fullscreen.js";
// 支持括号自动匹配
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
// 支持代码自动补全
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/anyword-hint.js";
// 行注释
import "codemirror/addon/comment/comment.js";
// JSON错误检查
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/lint.js";
// 需要依赖全局的jsonlint，不是很优雅
import "codemirror/addon/lint/json-lint.js";
// 引入jsonlint
import jsonlint from "jsonlint-mod";
window.jsonlint = jsonlint;


const isJSONString = (str: string) => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

const jsonData = `{
  "name": "vite-project",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "start": "vite",
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@monaco-editor/react": "^4.4.5",
    "antd": "^4.20.2",
    "codemirror": "^5.65.3",
    "jsonlint-mod": "^1.7.6",
    "react": "^18.0.0",
    "react-codemirror2": "^7.2.1",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@rollup/plugin-replace": "^4.0.0",
    "@types/chrome": "^0.0.184",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^1.3.0",
    "rollup-plugin-copy": "^3.4.0",
    "typescript": "^4.6.3",
    "vite": "^2.9.7",
    "vite-plugin-monaco-editor": "^1.0.10"
  }
}`

interface IProps {
  [key: string]: any;
}

const CodeEditor:FC<IProps> = ({ onChange, value}) => {
  
  const handleChange = (editor: any, data: any, value: any) => {
    onChange(value)
  }

  return (
    <div className="code-editor">
      <div style={{ textAlign: 'right', marginBottom: '12px' }}>
        <Button
          type="primary"
          onClick={() => {
            if (isJSONString(value)) {
              onChange(JSON.stringify(JSON.parse(value), null, 2))
            } else {
              message.error('This is not the correct JSON format');
            }
          }}
        >JSON Format</Button>
      </div>

      <CodeMirror
        value={value}
        onBeforeChange={handleChange}
        className="json-codemirror"
        options={{
          mode: 'application/json',
          theme: 'dracula',
          lineNumbers: true,
          smartIndent: true,
          tabSize: 2,
          lint: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        }}
    
        // {...restProps}
      />
    </div>
  )
}

export default CodeEditor