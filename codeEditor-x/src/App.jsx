import { useEffect, useState } from "react";
import EditorScreen from "./EditorScreen";
import Sidebar from "./components/Sidebar";
import EditorWorkspace from "./EditorWorkspace";

/**
 * App shell:
 * - Sidebar (Explorer) yang berfungsi
 * - Editor utama dengan layout mirip "Editor Kode 1"
 * - Multi-file disimpan di localStorage
 *
 * Tiap file menyimpan:
 * - language
 * - content (current buffer)
 * - savedContent (snapshot terakhir disimpan)
 */
const STORAGE_KEY = "cx-files-main";

const initialFiles = {
  "src/components/index.js": {
    language: "javascript",
    content: `import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

// Main Counter Component
export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(\`Current count: \${count}\`);
  }, [count]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        You clicked {count} times
      </Text>

      <Button
        onPress={() => setCount(count + 1)}
      />
    </View>
  );
}
`,
    savedContent: `import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

// Main Counter Component
export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(\`Current count: \${count}\`);
  }, [count]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        You clicked {count} times
      </Text>

      <Button
        onPress={() => setCount(count + 1)}
      />
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
}`,
    savedContent: `body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #020617;
  color: #e5e7eb;
}`
  }
};

function App() {
  const [files, setFiles] = useState(initialFiles);
  const [activePath, setActivePath] = useState("src/components/index.js");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mode, setMode] = useState("single");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved != null) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setFiles(parsed);
          const firstPath = Object.keys(parsed)[0];
          if (firstPath) {
            setActivePath(firstPath);
          }
        }
      } catch {
        // abaikan, pakai initialFiles
      }
    }
  }, []);

  const persist = (nextFiles) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFiles));
  };

  const handleChangeFile = (path, content) => {
    setFiles((prev) => {
      const current = prev[path] || { language: "javascript" };
      const next = {
        ...prev,
        [path]: {
          ...current,
          content
        }
      };
      persist(next);
      return next;
    });
  };

  const handleSaveFile = (path) => {
    setFiles((prev) => {
      const current = prev[path];
      if (!current) return prev;
      const next = {
        ...prev,
        [path]: {
          ...current,
          savedContent: current.content
        }
      };
      persist(next);
      return next;
    });
  };

  const handleNewFile = (command) => {
    if (command === "__SWITCH_WORKSPACE__") {
      setMode("workspace");
      return;
    }

    const name = window.prompt("Nama file baru (mis. src/utils/helpers.js):");
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    if (files[trimmed]) {
      window.alert("File sudah ada.");
      return;
    }
    const ext = trimmed.split(".").pop() || "";
    let language = "plaintext";
    if (["js", "jsx"].includes(ext)) language = "javascript";
    else if (["ts", "tsx"].includes(ext)) language = "typescript";
    else if (ext === "css") language = "css";
    else if (ext === "json") language = "json";

    setFiles((prev) => {
      const next = {
        ...prev,
        [trimmed]: {
          language,
          content: "",
          savedContent: ""
        }
      };
      persist(next);
      return next;
    });
    setActivePath(trimmed);
    setMode("single");
  };

  const handleOpenFile = (path) => {
    setActivePath(path);
    setMode("single");
  };

  const activeFile = files[activePath];

  const toggleSidebar = () => {
    setSidebarVisible((v) => !v);
  };

  const isDirty =
    activeFile && activeFile.content !== activeFile.savedContent;

  const jsPath = "src/components/index.js";
  const cssPath = "src/styles.css";

  return (
    <div className="cx-root">
      <div className="cx-main">
        {sidebarVisible && (
          <Sidebar
            files={files}
            activePath={activePath}
            onOpenFile={handleOpenFile}
            onNewFile={handleNewFile}
          />
        )}
        <div
          className={
            "cx-editor-shell" +
            (sidebarVisible ? "" : " cx-editor-shell-full")
          }
        >
          {mode === "single" && activeFile && (
            <EditorScreen
              path={activePath}
              language={activeFile.language}
              value={activeFile.content}
              onChange={(val) => handleChangeFile(activePath, val)}
              onToggleSidebar={toggleSidebar}
              sidebarVisible={sidebarVisible}
              onSave={() => handleSaveFile(activePath)}
              isDirty={!!isDirty}
            />
          )}
          {mode === "workspace" && (
            <EditorWorkspace
              jsFile={files[jsPath]}
              cssFile={files[cssPath]}
              onChangeJs={(val) => handleChangeFile(jsPath, val)}
              onChangeCss={(val) => handleChangeFile(cssPath, val)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;