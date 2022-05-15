import React, { useState, useEffect, FC, useCallback, useRef } from 'react'
import Editor, { useMonaco, BeforeMount, OnMount, OnValidate } from "@monaco-editor/react";


const JsonEditor:FC = (props) => {
  const { onChange } = props;

  const monaco = useMonaco();
  
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    editor.getModel()?.updateOptions({
      tabSize: 2,
      insertSpaces: false,
      minimap: { enabled: false }, // 关闭小地图
    });
    // updateEditorLayout();

    // window.addEventListener("resize", () => {
    //   // automaticLayout isn't working
    //   // https://github.com/suren-atoyan/monaco-react/issues/89#issuecomment-666581193
    //   // clear current layout
    //   updateEditorLayout();
    // });

    // // need to use formatted prettify json string
    // defaultValue && handleEditorUpdateValue(prettifyJsonString(defaultValue));
  };

  const handleEditorChange = useCallback(
    (value) => {
      // isAutoPrettifyOn && handleEditorPrettify();
      onChange && onChange(value);
    },
    [onChange]
  );


  return (
    <div>
      <Editor
        language="json"
        path={"path"}
        options={{
          automaticLayout: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
        }}
        onMount={handleEditorDidMount}
        height="100vh"
        onChange={handleEditorChange}
        // beforeMount={handleEditorWillMount}
        // onValidate={handleEditorValidation}
      />
    </div>
  )
}

export default JsonEditor