import { useMemo } from "react";
import Editor from "@monaco-editor/react";

function EditorPane({ path, language, value, onChange }) {
  const editorLanguage = useMemo(() => {
    if (language) return language;
    if (path.endsWith(".js") || path.endsWith(".jsx")) return "javascript";
    if (path.endsWith(".ts") || path.endsWith(".tsx")) return "typescript";
    if (path.endsWith(".css")) return "css";
    if (path.endsWith(".json")) return "json";
    if (path.endsWith(".md")) return "markdown";
    return "plaintext";
  }, [language, path]);

  return (
    <div className="cx-editor-pane">
      <Editor
        path={path}
        height="100%"
        defaultLanguage={editorLanguage}
        language={editorLanguage}
        value={value}
        theme="vs-dark"
        options={{
          fontSize: 13,
          minimap: { enabled: false },
          smoothScrolling: true,
          automaticLayout: true,
          padding: { top: 8, bottom: 8 }
        }}
        onChange={(val) => onChange(val ?? "")}
      />
    </div>
  );
}

export default EditorPane;