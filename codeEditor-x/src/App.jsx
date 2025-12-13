import { useEffect, useState } from "react";
import EditorScreen from "./EditorScreen";

/**
 * App sekarang fokus ke satu layar utama:
 * - Editor tunggal dengan layout mirip desain "Editor Kode 1"
 * - Konten disimpan ke localStorage
 */
const STORAGE_KEY = "cx-editor-main";

const defaultCode = `import React, { useState, useEffect } from "react";
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
`;

function App() {
  const [code, setCode] = useState(defaultCode);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved != null) {
      setCode(saved);
    }
  }, []);

  const handleChange = (value) => {
    setCode(value);
    window.localStorage.setItem(STORAGE_KEY, value);
  };

  return (
    <div className="cx-root">
      <EditorScreen value={code} onChange={handleChange} />
    </div>
  );
}

export default App;