import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike'; // Import for C++
import 'codemirror/theme/material.css';

const Editor = ({ onChange, value, editorRef }) => {
  const editorContainerRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    if (!editorContainerRef.current) return;

    editorInstance.current = CodeMirror(editorContainerRef.current, {
      mode: 'text/x-c++src', // C++ mode
      theme: 'material',
      lineNumbers: true,
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      indentUnit: 4, // C++ typically uses 4 spaces
      tabSize: 4,
      value: value || '',
    });

    editorInstance.current.on('change', (instance) => {
      const code = instance.getValue();
      onChange(code);
    });

    if (editorRef) {
      editorRef.current = editorInstance.current;
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.toTextArea();
      }
    };
  }, []);

  useEffect(() => {
    if (editorInstance.current && value !== undefined) {
      const currentValue = editorInstance.current.getValue();
      if (currentValue !== value) {
        editorInstance.current.setValue(value);
      }
    }
  }, [value]);

  return (
    <div 
      ref={editorContainerRef} 
      style={{ 
        height: '100%',
        width: '100%',
        fontSize: '14px',
      }} 
    />
  );
};

export default Editor;