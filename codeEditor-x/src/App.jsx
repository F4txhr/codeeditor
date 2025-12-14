import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

/**
 * Tahap 0:
 * - Layout dasar: Sidebar kosong + Editor + Status bar
 * - WorkspaceState sangat sederhana: satu file aktif
 */

const INITIAL_CODE = `// Selamat datang di codeEditor-x
// Tahap 0: Layout dasar editor
// Silakan mulai menulis kode di sini.

function hello() {
  console.log("Hello from codeEditor-x!");
}
`;

function App() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((v) => !v);
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
          <aside className="cx-sidebar">
            <div className="cx-sidebar-header">
              <span className="cx-sidebar-title">EXPLORER</span>
            </div>
            <div className="cx-sidebar-body">
              <p className="cx-sidebar-placeholder">
                Sidebar akan berisi tree proyek dan Git status.
              </p>
            </div>
          </aside>
        )}

        <section
          className={
            "cx-editor-shell" + (sidebarVisible ? "" : " cx-editor-shell-full")
          }
        >
          <div className="cx-editor-container">
            <MonacoEditor
              height="100%"
              defaultLanguage="javascript"
              language="javascript"
              value={code}
              theme="vs-dark"
              onChange={(val) => setCode(val ?? "")}
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
              <span className="cx-status-muted">Tahap 0 · Layout dasar</span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;