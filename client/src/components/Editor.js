import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

const Editor = ({ onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const instance = CodeMirror(editorRef.current, {
      mode: 'javascript',
      theme: 'default',
      lineNumbers: true,
    });

    instance.on('change', () => {
      const code = instance.getValue();
      onChange(code);
    });
  }, []);

  return <div ref={editorRef} style={{ height: '500px' }} />;
};

export default Editor;
