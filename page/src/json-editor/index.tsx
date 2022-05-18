import { useEffect, FC, useCallback, useRef } from 'react'
import Editor from "@monaco-editor/react";

interface IProps {
  onChange?: (value: string) => void;
  defaultValue: Record<string, any>;
  height?: string;
}

const JsonEditor:FC<IProps> = (props) => {
  const { onChange, defaultValue, height } = props;

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
    handleEditorUpdateValue(defaultValue.value);
  }, [defaultValue, handleEditorUpdateValue]);

  return (
    <div>
      <Editor
        language="json"
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