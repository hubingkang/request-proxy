import React, { useState, useEffect, FC, useCallback, useRef } from 'react'
import Editor, { useMonaco, BeforeMount, OnMount, OnValidate } from "@monaco-editor/react";

const mockData = `{
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
    "react": "^17.0.2",
    "react-codemirror2": "^7.2.1",
    "react-dom": "^17.0.2",
    "react-split-pane": "^0.1.92"
  },
  "devDependencies": {
    "@rollup/plugin-replace": "^4.0.0",
    "@types/chrome": "^0.0.184",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^1.3.0",
    "rollup-plugin-copy": "^3.4.0",
    "typescript": "^4.6.3",
    "vite": "^2.9.7"
  }
}`

interface IProps {
  onChange?: (value: string) => void;
  defaultValue?: string;
  height?: string;
}

const JsonEditor:FC<IProps> = (props) => {
  const { onChange, defaultValue, height } = props;

  const monaco = useMonaco();
  
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.getModel()?.updateOptions({
      tabSize: 2,
      insertSpaces: false,
    });
    handleEditorUpdateValue()
  };

  const handleEditorUpdateValue = useCallback((value?: string) => {
    const editor: any = editorRef.current;
    if (!editor) return;
    editor.setValue(value || '');
    value && editor.getAction("editor.action.formatDocument").run();
  }, []);

  const handleEditorChange = useCallback(
    (value: any) => {
      onChange && onChange(value);
    },
    [onChange]
  );

  useEffect(() => {
    handleEditorUpdateValue(defaultValue);
  }, [defaultValue, handleEditorUpdateValue]);

  return (
    <div>
      <Editor
        language="json"
        // path={"path"}
        options={{
          automaticLayout: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false,
          },
          tabSize: 2,
        }}
        onMount={handleEditorDidMount}
        height={height}
        onChange={handleEditorChange}
        // beforeMount={handleEditorWillMount}
        // onValidate={handleEditorValidation}
      />
    </div>
  )
}

export default JsonEditor