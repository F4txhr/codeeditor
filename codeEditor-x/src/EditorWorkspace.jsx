import Editor from "@monaco-editor/react";

/**
 * EditorWorkspace
 *
 * Desain "Editor Kode 2" dengan dua panel:
 * - Atas: index.js
 * - Bawah: styles.css
 * Membaca dan menulis ke files state yang sama dengan Editor utama.
 */
function EditorWorkspace({ jsFile, cssFile, onChangeJs, onChangeCss }) {
  return (
    <div className="ew-root">
      <header className="ew-header">
        <div className="ew-header-left">
          <button className="ew-icon-button" aria-label="Menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="ew-header-meta">
            <span className="ew-header-label">Workspace</span>
            <div className="ew-header-title">
              Mobile-App-v2
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </div>
        <div className="ew-header-center">
          <button className="ew-toggle-button">
            <span className="material-symbols-outlined">tab</span>
          </button>
          <button className="ew-toggle-button active">
            <span className="material-symbols-outlined">vertical_split</span>
          </button>
          <button className="ew-toggle-button">
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
        </div>
        <div className="ew-header-right">
          <button className="ew-icon-button">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      <main className="ew-main">
        {/* Tab bar */}
        <div className="ew-tabs">
          <div className="ew-tab ew-tab-active">
            <span className="material-symbols-outlined js">javascript</span>
            <span className="ew-tab-label">index.js</span>
          </div>
          <div className="ew-tab">
            <span className="material-symbols-outlined css">css</span>
            <span className="ew-tab-label">styles.css</span>
          </div>
        </div>

        {/* Split editors */}
        <div className="ew-split">
          <div className="ew-pane">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              language="javascript"
              value={jsFile?.content ?? ""}
              theme="vs-dark"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                smoothScrolling: true,
                automaticLayout: true,
                padding: { top: 8, bottom: 8 }
              }}
              onChange={(val) => onChangeJs(val ?? "")}
            />
          </div>

          <div className="ew-resizer" />

          <div className="ew-pane">
            <Editor
              height="100%"
              defaultLanguage="css"
              language="css"
              value={cssFile?.content ?? ""}
              theme="vs-dark"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                smoothScrolling: true,
                automaticLayout: true,
                padding: { top: 8, bottom: 8 }
              }}
              onChange={(val) => onChangeCss(val ?? "")}
            />
          </div>
        </div>
      </main>

      <footer className="ew-statusbar">
        <div className="ew-status-left">
          <button className="ew-status-pill">
            <span className="material-symbols-outlined">source_environment</span>
            master*
          </button>
          <span className="ew-status-muted">
            <span className="material-symbols-outlined">error</span> 0
          </span>
          <span className="ew-status-muted">
            <span className="material-symbols-outlined">warning</span> 0
          </span>
        </div>
        <div className="ew-status-right">
          <span className="ew-status-muted">Workspace: Split</span>
          <span className="ew-status-muted">UTF-8</span>
          <span className="ew-status-muted">JavaScript</span>
        </div>
      </footer>
    </div>
  );
}

export default EditorWorkspace;