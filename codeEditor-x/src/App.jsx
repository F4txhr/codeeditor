import { useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import Explorer from "./components/Explorer";
import TabsBar from "./components/TabsBar";

/**
 * Tahap 1:
 * - WorkspaceState: banyak file, satu aktif
 * - Explorer: tree file + new/rename/delete
 * - Sorting & filtering sederhana
 */

const now = Date.now();

const INITIAL_FILES = {
  "src/main.js": {
    language: "javascript",
    content: `// File entry utama
console.log("Hello from codeEditor-x");`,
    savedContent: `// File entry utama
console.log("Hello from codeEditor-x");`,
    gitStatus: "modified",
    modifiedAt: now
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
}`,
    savedContent: `import React, { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
    gitStatus: "untracked",
    modifiedAt: now
  }
};

const INITIAL_FOLDERS = ["src", "src/components"];

function App() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [openTabs, setOpenTabs] = useState(Object.keys(INITIAL_FILES));
  const [activePath, setActivePath] = useState("src/main.js");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [splitMode, setSplitMode] = useState("single"); // "single" | "terminal"
  const [previewVisible, setPreviewVisible] = useState(false);
  const [problems, setProblems] = useState([]);
  const [terminalHeight, setTerminalHeight] = useState(160);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const resizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(160);

  const toggleSidebar = () => {
    setSidebarVisible((v) => !v);
  };

  const activeFile = files[activePath];

  const applyLint = (code) => {
    const lines = code.split("\n");
    const items = [];
    lines.forEach((line, idx) => {
      const lineNumber = idx + 1;
      if (line.includes("console.log")) {
        items.push({
          severity: "warning",
          message: "Hindari penggunaan console.log di kode produksi.",
          lineNumber,
          column: line.indexOf("console.log") + 1
        });
      }
      if (line.includes("TODO")) {
        items.push({
          severity: "info",
          message: "TODO ditemukan.",
          lineNumber,
          column: line.indexOf("TODO") + 1
        });
      }
      if (line.includes("eval(")) {
        items.push({
          severity: "error",
          message: "Penggunaan eval berbahaya.",
          lineNumber,
          column: line.indexOf("eval(") + 1
        });
      }
    });
    setProblems(items);

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (!model) return;

    const markers = items.map((p) => ({
      severity:
        p.severity === "error"
          ? monaco.MarkerSeverity.Error
          : p.severity === "warning"
          ? monaco.MarkerSeverity.Warning
          : monaco.MarkerSeverity.Info,
      message: p.message,
      startLineNumber: p.lineNumber,
      startColumn: p.column,
      endLineNumber: p.lineNumber,
      endColumn: p.column + 5
    }));
    monaco.editor.setModelMarkers(model, "lint", markers);
  };

  const handleChangeCode = (value) => {
    const ts = Date.now();
    const code = value || "";
    setFiles((prev) => ({
      ...prev,
      [activePath]: {
        ...(prev[activePath] || { language: "javascript" }),
        content: code,
        modifiedAt: ts,
        savedContent: prev[activePath]?.savedContent ?? code
      }
    }));
    applyLint(code);
  };

  const handleSaveActive = () => {
    if (!activePath || !files[activePath]) return;
    const content = files[activePath].content;
    setFiles((prev) => ({
      ...prev,
      [activePath]: {
        ...prev[activePath],
        savedContent: content
      }
    }));
  };

  const toggleSplitMode = () => {
    setSplitMode((prev) => (prev === "single" ? "terminal" : "single"));
  };

  const togglePreview = () => {
    setPreviewVisible((v) => !v);
  };

  const startResizeTerminal = (event) => {
    const e = event.touches ? event.touches[0] : event;
    resizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = terminalHeight;

    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", stopResizeTerminal);
    window.addEventListener("touchmove", handleResizeMove, { passive: false });
    window.addEventListener("touchend", stopResizeTerminal);
  };

  const handleResizeMove = (event) => {
    if (!resizingRef.current) return;
    if (event.cancelable) {
      event.preventDefault();
    }
    const e = event.touches ? event.touches[0] : event;
    const deltaY = startYRef.current - e.clientY;
    const next = Math.min(Math.max(startHeightRef.current + deltaY, 80), 320);
    setTerminalHeight(next);
  };

  const stopResizeTerminal = () => {
    resizingRef.current = false;
    window.removeEventListener("mousemove", handleResizeMove);
    window.removeEventListener("mouseup", stopResizeTerminal);
    window.removeEventListener("touchmove", handleResizeMove);
    window.removeEventListener("touchend", stopResizeTerminal);
  };

  const ensureTab = (path) => {
    setOpenTabs((prev) =>
      prev.includes(path) ? prev : [...prev, path]
    );
  };

  const handleOpenFile = (path) => {
    ensureTab(path);
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

    const ts = Date.now();

    setFiles((prev) => ({
      ...prev,
      [trimmed]: {
        language,
        content: "",
        gitStatus: "untracked",
        modifiedAt: ts
      }
    }));

    // pastikan folder path tercatat
    const parts = trimmed.split("/");
    if (parts.length > 1) {
      const folderPath = parts.slice(0, -1).join("/");
      setFolders((prev) =>
        prev.includes(folderPath) ? prev : [...prev, folderPath]
      );
    }

    ensureTab(trimmed);
    setActivePath(trimmed);
  };

  const handleRenameFile = (path) => {
    const name = window.prompt("Nama baru untuk file:", path);
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed || trimmed === path) return;
    if (files[trimmed]) {
      window.alert("File dengan nama itu sudah ada.");
      return;
    }
    setFiles((prev) => {
      const current = prev[path];
      if (!current) return prev;
      const { [path]: _, ...rest } = prev;
      return { ...rest, [trimmed]: current };
    });

    // update daftar folder jika perlu
    const oldFolder = path.split("/").slice(0, -1).join("/");
    const newFolder = trimmed.split("/").slice(0, -1).join("/");
    setFolders((prev) => {
      let next = [...prev];
      if (newFolder && !next.includes(newFolder)) {
        next.push(newFolder);
      }
      // oldFolder dibiarkan; bisa dibersihkan nanti jika kosong
      return next;
    });

    setActivePath(trimmed);
  };

  const handleDeleteFile = (path) => {
    if (!window.confirm(`Hapus file "${path}"?`)) return;
    setFiles((prev) => {
      if (!prev[path]) return prev;
      const { [path]: _, ...rest } = prev;
      return rest;
    });
    setOpenTabs((prev) => prev.filter((p) => p !== path));
    setActivePath((prevPath) => {
      if (prevPath !== path) return prevPath;
      const remaining = openTabs.filter((p) => p !== path);
      return remaining[0] || "";
    });
  };

  const handleNewFolder = () => {
    const name = window.prompt("Nama folder baru (mis. src/utils):");
    if (!name) return;
    const trimmed = name.trim().replace(/\/+$/, "");
    if (!trimmed) return;
    setFolders((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
  };

  const handleSelectTab = (path) => {
    setActivePath(path);
  };

  const handleCloseTab = (path) => {
    setOpenTabs((prev) => prev.filter((p) => p !== path));
    if (activePath === path) {
      const remaining = openTabs.filter((p) => p !== path);
      setActivePath(remaining[0] || "");
    }
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
            folders={folders}
            activePath={activePath}
            onOpenFile={handleOpenFile}
            onNewFile={handleNewFile}
            onNewFolder={handleNewFolder}
            onRenameFile={handleRenameFile}
            onDeleteFile={handleDeleteFile}
          />
        )}

        <section
          className={
            "cx-editor-shell" + (sidebarVisible ? "" : " cx-editor-shell-full")
          }
        >
          <TabsBar
            openTabs={openTabs}
            activePath={activePath}
            files={files}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
          />
          <div className={"cx-editor-container" + (previewVisible ? " cx-editor-with-preview" : "")}>
            <MonacoEditor
              height="100%"
              defaultLanguage={activeFile?.language || "javascript"}
              language={activeFile?.language || "javascript"}
              value={activeFile?.content ?? ""}
              theme="vs-dark"
              onChange={(val) => handleChangeCode(val ?? "")}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                monacoRef.current = monaco;
                const pos = editor.getPosition();
                if (pos) {
                  setCursorPos({
                    line: pos.lineNumber,
                    column: pos.column
                  });
                }
                editor.onDidChangeCursorPosition((e) => {
                  setCursorPos({
                    line: e.position.lineNumber,
                    column: e.position.column
                  });
                });
                // jalankan lint awal
                const value = editor.getValue();
                applyLint(value);
              }}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                smoothScrolling: true,
                automaticLayout: true,
                padding: { top: 8, bottom: 8 }
              }}
            />
            {previewVisible && activeFile && (
              <div className="cx-preview">
                <div className="cx-preview-header">
                  <span className="cx-preview-title">PREVIEW</span>
                </div>
                <div className="cx-preview-body">
                  {activePath.endsWith(".md") ? (
                    <MarkdownPreview content={activeFile.content} />
                  ) : activePath.endsWith(".html") ? (
                    <iframe
                      title="HTML Preview"
                      className="cx-preview-iframe"
                      srcDoc={activeFile.content}
                    />
                  ) : (
                    <div className="cx-preview-placeholder">
                      Preview hanya untuk file .md dan .html
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {problems.length > 0 && (
            <div className="cx-problems">
              <span className="cx-problems-title">
                Problems ({problems.length})
              </span>
              <ul className="cx-problems-list">
                {problems.map((p, idx) => (
                  <li key={idx} className={`cx-problem cx-problem-${p.severity}`}>
                    <span className="cx-problem-badge">{p.severity}</span>
                    <span className="cx-problem-text">
                      Ln {p.lineNumber}, Col {p.column} — {p.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {splitMode === "terminal" && (
            <>
              <div
                className="cx-terminal-resizer"
                onMouseDown={startResizeTerminal}
                onTouchStart={startResizeTerminal}
              />
              <div className="cx-terminal" style={{ height: terminalHeight }}>
                <div className="cx-terminal-header">
                  <span className="cx-terminal-title">TERMINAL</span>
                </div>
                <div className="cx-terminal-body">
                  <div className="cx-terminal-output">
                    <div className="cx-terminal-line">[mock] Terminal siap.</div>
                  </div>
                  <div className="cx-terminal-input-row">
                    <span className="cx-terminal-prompt">$</span>
                    <input
                      className="cx-terminal-input"
                      placeholder="Ketik perintah (belum berfungsi, mock)..."
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <footer className="cx-statusbar">
            <div className="cx-status-left">
              <span className="cx-status-pill">
                <span className="material-symbols-outlined">source_environment</span>
                main
              </span>
              {activeFile && (
                <span
                  className={
                    "cx-status-muted" +
                    (activeFile.content !== activeFile.savedContent
                      ? " cx-status-unsaved"
                      : "")
                  }
                >
                  {activeFile.content !== activeFile.savedContent
                    ? "● Unsaved"
                    : "Saved"}
                </span>
              )}
            </div>
            <div className="cx-status-right">
              <button
                className="cx-status-button"
                onClick={handleSaveActive}
                title="Save (aktif)"
              >
                <span className="material-symbols-outlined">save</span>
                <span className="cx-status-button-label">Save</span>
              </button>
              <button
                className={"cx-status-button" + (previewVisible ? " cx-status-button-active" : "")}
                onClick={togglePreview}
                title="Toggle preview"
              >
                <span className="material-symbols-outlined">visibility</span>
              </button>
              <button
                className={"cx-status-button" + (splitMode !== "single" ? " cx-status-button-active" : "")}
                onClick={toggleSplitMode}
                title="Toggle terminal"
              >
                <span className="material-symbols-outlined">
                  {splitMode === "single" ? "terminal" : "close_fullscreen"}
                </span>
              </button>
              <span className="cx-status-muted">
                Ln {cursorPos.line}, Col {cursorPos.column} ·{" "}
                {activeFile?.language || "javascript"}
              </span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

function MarkdownPreview({ content }) {
  const html = basicMarkdownToHtml(content || "");
  return (
    <div
      className="cx-preview-markdown"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function basicMarkdownToHtml(src) {
  let text = src;
  text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // heading ##
  text = text.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  text = text.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  text = text.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  // bold and italic
  text = text.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
  text = text.replace(/\*(.*?)\*/gim, "<em>$1</em>");
  // links [text](url)
  text = text.replace(
    /\[(.*?)\]\((https?:\/\/[^\s]+)\)/gim,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
  );
  // line breaks
  text = text.replace(/\n$/gim, "<br />");
  text = text.replace(/\n/gim, "<br />");
  return text;
}

export default App;