import { useEffect, useState } from "react";
import EditorScreen from "./EditorScreen";
import Sidebar from "./components/Sidebar";

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

  const handleOpenFile = (path) => {
    setActivePath(path);
  };

  const activeFile = files[activePath];

  const toggleSidebar = () => {
    setSidebarVisible((v) => !v);
  };

  const isDirty =
    activeFile && activeFile.content !== activeFile.savedContent;

  return (
    <div className="cx-root">
      <div className="cx-main">
        {sidebarVisible && (
          <Sidebar
            files={files}
            activePath={activePath}
            onOpenFile={handleOpenFile}
          />
        )}
        <div
          className={
            "cx-editor-shell" +
            (sidebarVisible ? "" : " cx-editor-shell-full")
          }
        >
          {activeFile && (
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
        </div>
      </div>
    </div>
  );
}

export default App;