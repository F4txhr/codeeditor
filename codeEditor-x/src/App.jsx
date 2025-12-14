import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import Explorer from "./components/Explorer";

/**
 * Tahap 1.1:
 * - WorkspaceState: banyak file, satu aktif
 * - Explorer menampilkan tree file
 * - Operasi dasar: pilih file, new file (prompt)
 */

const INITIAL_FILES = {
  "src/main.js": {
    language: "javascript",
    content: `// File entry utama
console.log("Hello from codeEditor-x");`
  },
  "src/components/Counter.js": {
    language: "javascript",
    content: `import React, { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`
  }
};

function App() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [activePath, setActivePath] = useState("src/main.js");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((v) => !v);
  };

  const activeFile = files[activePath];

  const handleChangeCode = (value) => {
    setFiles((prev) => ({
      ...prev,
      [activePath]: {
        ...(prev[activePath] || { language: "javascript" }),
        content: value
      }
    }));
  };

  const handleOpenFile = (path) => {
    setActivePath(path);
  };

  const handleNewFile = () => {
    const name = window.prompt("Nama file baru (mis. src/utils/helpers.js):");
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    if (files[trimmed]) {
      window.alert("File sudah ada.");
      return;
    }
    // deteksi bahasa sederhana dari ekstensi
    const ext = trimmed.split(".").pop() || "";
    let language = "plaintext";
    if (["js", "jsx"].includes(ext)) language = "javascript";
    else if (["ts", "tsx"].includes(ext)) language = "typescript";
    else if (ext === "css") language = "css";
    else if (ext === "json") language = "json";

    setFiles((prev) => ({
      ...prev,
      [trimmed]: {
        language,
        content: ""
      }
    }));
    setActivePath(trimmed);
  };

  return (
    <div className="cx-root">
      <header className="cx-header">
        <div className="cx-header-left">
          <span className="cx-logo">codeEditor-x</span>
          <span className="cx-header-sub">Web IDE · Tahap 0</span>
        </div>
        <div className="cx-header-right">
          <button className="cx-header-button" onClick={toggleSidebar}>
            <span className="material-symbols-outlined">
              {sidebarVisible ? "chevron_left" : "chevron_right"}
            </span>
          </button>
        </div>
      </header>

      <main className="cx-main">
        {sidebarVisible && (
          <Explorer
            files={files}
            activePath={activePath}
            onOpenFile={handleOpenFile}
            onNewFile={handleNewFile}
          />
        )}

        <section
          className={
            "cx-editor-shell" + (sidebarVisible ? "" : " cx-editor-shell-full")
          }
        >
          <div className="cx-editor-container">
            <MonacoEditor
              height="100%"
              defaultLanguage={activeFile?.language || "javascript"}
              language={activeFile?.language || "javascript"}
              value={activeFile?.content ?? ""}
              theme="vs-dark"
              onChange={(val) => handleChangeCode(val ?? "")}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                smoothScrolling: true,
                automaticLayout: true,
                padding: { top: 8, bottom: 8 }
              }}
            />
          </div>
          <footer className="cx-statusbar">
            <div className="cx-status-left">
              <span className="cx-status-pill">
                <span className="material-symbols-outlined">source_environment</span>
                main
              </span>
            </div>
            <div className="cx-status-right">
              <span className="cx-status-muted">
                Tahap 1.1 · Explorer + multi-file
              </span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;