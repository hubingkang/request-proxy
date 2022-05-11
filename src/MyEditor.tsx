import React, { useState, useEffect, FC } from 'react'
import Editor, { useMonaco } from "@monaco-editor/react";

interface IProps {
  value: string | undefined,
  onChange: (value: string | undefined) => void
}

const MyEditor:FC<IProps> = (props) => {
  const { value, onChange } = props;

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      if ( monaco.editor.getModels().length) {
        monaco.editor.getModels()[0].updateOptions({ tabSize: 2 })
      }
    }
  }, [monaco]);

  return (
    <div>
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