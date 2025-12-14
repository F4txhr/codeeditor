import { useRef } from "react";
import Editor from "@monaco-editor/react";

/**
 * EditorScreen
 *
 * Layout editor mirip desain "Editor Kode 1":
 * - Header dengan file name + path
 * - Editor (Monaco) penuh
 * - Toolbar bawah dengan tombol simbol + save
 */
function EditorScreen({
  path,
  language,
  value,
  onChange,
  onToggleSidebar,
  sidebarVisible
}) {
  const editorRef = useRef(null);

  const handleMount = (editor) => {
    editorRef.current = editor;
  };

  const insertText = (text) => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = editor.getSelection();
    editor.executeEdits("toolbar-insert", [
      {
        range: selection,
        text,
        forceMoveMarkers: true
      }
    ]);
    editor.focus();
  };

  const handleToolbar = (type) => {
    switch (type) {
      case "brace":
        insertText("{ }");
        break;
      case "paren":
        insertText("( )");
        break;
      case "bracket":
        insertText("[ ]");
        break;
      case "equal":
        insertText("=");
        break;
      case "quote":
        insertText('"');
        break;
      case "tab":
        insertText("  ");
        break;
      case "save":
        // onChange sudah menyimpan ke localStorage di App
        // Di sini kita hanya bisa nanti tambahkan notifikasi jika perlu
        break;
      default:
        break;
    }
  };

  return (
    <div className="ek-root">
      {/* Header */}
      <header className="ek-header">
        <div className="ek-header-left">
          <button
            className="ek-icon-button"
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
          >
            <span className="material-symbols-outlined">
              {sidebarVisible ? "chevron_left" : "chevron_right"}
            </span>
          </button>
          <div className="ek-header-meta">
            <h1 className="ek-file-name">
              {path.split("/").slice(-1)[0] || "index.js"}
            </h1>
            <span className="ek-file-path">
              {path.split("/").slice(0, -1).join("/") + "/"}
            </span>
          </div>
        </div>
        <div className="ek-header-right">
          <div className="ek-dot" />
          <button
            className="ek-icon-button ek-icon-primary"
            aria-label="Run"
          >
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
        </div>
      </header>

      {/* Editor area */}
      <main className="ek-main">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language="javascript"
          value={value}
          theme="vs-dark"
          onMount={handleMount}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            smoothScrolling: true,
            automaticLayout: true,
            padding: { top: 8, bottom: 8 }
          }}
          onChange={(val) => onChange(val ?? "")}
        />
      </main>

      {/* Toolbar bawah */}
      <div className="ek-toolbar">
        <div className="ek-toolbar-left">
          <button
            className="ek-key-button"
            onClick={() => handleToolbar("brace")}
          >
            {"{ }"}
          </button>
          <button
            className="ek-key-button"
            onClick={() => handleToolbar("paren")}
          >
            ( )
          </button>
          <button
            className="ek-key-button"
            onClick={() => handleToolbar("bracket")}
          >
            [ ]
          </button>
          <button
            className="ek-key-button"
            onClick={() => handleToolbar("equal")}
          >
            =
          </button>
          <button
            className="ek-key-button"
            onClick={() => handleToolbar("quote")}
          >
            &quot;
          </button>
          <button
            className="ek-key-button ek-key-primary"
            onClick={() => handleToolbar("tab")}
          >
            TAB
          </button>
        </div>
        <div className="ek-toolbar-right">
          <button
            className="ek-icon-button"
            onClick={() => handleToolbar("save")}
            aria-label="Save"
          >
            <span className="material-symbols-outlined">save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorScreen;