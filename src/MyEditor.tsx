import React, { useState, useEffect, FC } from 'react'
import Editor, { useMonaco } from "@monaco-editor/react";
import { Button, message } from 'antd';

interface IProps {
  value: string,
  onChange: (value: string | undefined) => void
}

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

const MyEditor:FC<IProps> = (props) => {
  const { value, onChange } = props;
  const monaco = useMonaco();

  useEffect(() => {
    console.log('value变化了', value)
  }, [value])

  useEffect(() => {
    if (monaco) {
      console.log('monaco', monaco);

      if (monaco.editor.getModels().length) {
        const editor = monaco.editor.getModels()[0];
        editor.updateOptions({
          tabSize: 4,
          minimap: { enabled: false }, // 关闭小地图
        })
      }
    }
  }, [monaco]);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          if (isJSONString(value)) {
            const editor = monaco.editor.getModels()[0];
            editor.setValue(JSON.stringify(JSON.parse(value), null, 2))
          } else {
            message.error('请输入正确的 JSON 格式');
          }
        }}
      >JSON Format</Button>
       <Editor
          height="70vh"
          defaultLanguage="json"
          theme="vs-dark"
          value={value}
          onValidate={(markers) => {
            if (markers.length) {
              console.log("当前格式不正确")
            } else {
              console.log("格式正确的")
            }
            // markers.forEach(marker => console.log("onValidate:", markers));
          }}
          onChange={onChange}
        />
    </div>
  )
}

export default MyEditor