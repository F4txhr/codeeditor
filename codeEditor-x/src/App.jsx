import { useState } from "react";
import EditorPane from "./components/EditorPane";
import Sidebar from "./components/Sidebar";
import TabsBar from "./components/TabsBar";
import StatusBar from "./components/StatusBar";

/**
 * App shell untuk web IDE:
 * - Sidebar file/project
 * - Tabs bar
 * - Editor (Monaco)
 * - Status bar
 *
 * Untuk sekarang: file disimpan di state in-memory dan localStorage.
 */
const initialFiles = {
  "src/App.js": {
    language: "javascript",
    content: `import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        You clicked {count} times
      </Text>
      <Button onPress={() => setCount(count + 1)} />
    </View>
  );
}
`
  },
  "src/styles.css": {
    language: "css",
    content: `body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #020617;
  color: #e5e7eb;
}`
  }
};

function App() {
  const [files, setFiles] = useState(() => {
    const saved = window.localStorage.getItem("cx-files");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialFiles;
      }
    }
    return initialFiles;
  });

  const [activePath, setActivePath] = useState(
    Object.keys(files)[0] || "src/App.js"
  );

  const activeFile = files[activePath];

  const updateFileContent = (path, content) => {
    setFiles((prev) => {
      const next = {
        ...prev,
        [path]: {
          ...(prev[path] || { language: "javascript" }),
          content
        }
      };
      window.localStorage.setItem("cx-files", JSON.stringify(next));
      return next;
    });
  };

  const openFile = (path) => {
    setActivePath(path);
  };

  return (
    <div className="cx-root">
      <header className="cx-header">
        <div className="cx-header-left">
          <span className="cx-logo">codeEditor-x</span>
          <span className="cx-header-sub">Web IDE</span>
        </div>
        <div className="cx-header-right">
          <button className="cx-header-button" title="Command palette">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </header>
      <main className="cx-main">
        <Sidebar
          files={files}
          activePath={activePath}
          onOpenFile={openFile}
        />
        <div className="cx-center">
          <TabsBar
            files={files}
            activePath={activePath}
            onOpenFile={openFile}
          />
          <div className="cx-editor-container">
            {activeFile && (
              <EditorPane
                path={activePath}
                language={activeFile.language}
                value={activeFile.content}
                onChange={(value) => updateFileContent(activePath, value)}
              />
            )}
          </div>
          <StatusBar activePath={activePath} />
        </div>
      </main>
    </div>
  );
}

export default App;