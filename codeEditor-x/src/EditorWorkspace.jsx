import { useState } from "react";

/**
 * EditorWorkspace
 *
 * Adaptasi fungsional dari desain "Editor Kode 2":
 * - Dua panel editor (atas JS, bawah CSS)
 * - Tab bar sederhana
 * - Status bar di bawah
 */
function EditorWorkspace() {
  const [jsCode, setJsCode] = useState(defaultJs.trimStart());
  const [cssCode, setCssCode] = useState(defaultCss.trimStart());

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
            <div className="ew-gutter">
              {Array.from({ length: jsCode.split("\n").length || 1 }).map(
                (_, idx) => (
                  <div key={idx} className="ew-gutter-line">
                    {idx + 1}
                  </div>
                )
              )}
            </div>
            <textarea
              className="ew-textarea"
              value={jsCode}
              onChange={(e) => setJsCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="ew-resizer" />

          <div className="ew-pane">
            <div className="ew-gutter">
              {Array.from({ length: cssCode.split("\n").length || 1 }).map(
                (_, idx) => (
                  <div key={idx} className="ew-gutter-line">
                    {idx + 1}
                  </div>
                )
              )}
            </div>
            <textarea
              className="ew-textarea"
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              spellCheck={false}
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

const defaultJs = `
import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

// Main Component
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Workspace Mode
      </Text>
    </View>
  );
}
`;

const defaultCss = `
.container {
  flex: 1;
  background-color: #1e1e1e;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}
`;

export default EditorWorkspace;