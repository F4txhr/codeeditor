import { useEffect, useRef, useState } from "react";

/**
 * EditorKode1
 *
 * Implementasi fungsional dari desain "Editor Kode 1":
 * - Header dengan nama file dan path
 * - Editor berbasis &lt;textarea&gt; dengan styling monospaced
 * - Tombol shortcut: { }, ( ), [ ], =, " dan TAB
 * - Tombol Save menyimpan konten ke localStorage dan menampilkan notifikasi sederhana
 */
function EditorKode1() {
  const [code, setCode] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const textareaRef = useRef(null);

  // Muat konten awal dari localStorage atau snippet default
  useEffect(() => {
    const stored = window.localStorage.getItem("editor_kode_1_code");
    if (stored != null) {
      setCode(stored);
    } else {
      setCode(defaultSnippet.trimStart());
    }
  }, []);

  // Helper untuk menyisipkan teks pada posisi kursor
  const insertAtCursor = (text, placeCursorBeforeClose = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;

    const before = code.slice(0, start);
    const after = code.slice(end);

    let newText = before + text + after;
    let cursorPos = start + text.length;

    // Untuk pasangan seperti "{ }" kita bisa tempatkan kursor di tengah
    if (placeCursorBeforeClose && text.length === 3) {
      // contoh format teks: "{ }"
      cursorPos = start + 2;
    }

    setCode(newText);

    // Set ulang posisi cursor setelah update state
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleKeyInsert = (key) => {
    switch (key) {
      case "brace":
        insertAtCursor("{ }", true);
        break;
      case "paren":
        insertAtCursor("( )", true);
        break;
      case "bracket":
        insertAtCursor("[ ]", true);
        break;
      case "equal":
        insertAtCursor("=");
        break;
      case "quote":
        insertAtCursor('"');
        break;
      case "tab":
        insertAtCursor("  "); // dua spasi sebagai TAB
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    try {
      window.localStorage.setItem("editor_kode_1_code", code);
      setSavedMessage("Disimpan ke localStorage.");
      setTimeout(() => setSavedMessage(""), 2000);
    } catch (e) {
      setSavedMessage("Gagal menyimpan (localStorage tidak tersedia).");
      setTimeout(() => setSavedMessage(""), 2000);
    }
  };

  return (
    <div className="ek1-root">
      {/* Header */}
      <header className="ek1-header">
        <div className="ek1-header-left">
          <button className="ek1-icon-button" aria-label="Menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="ek1-header-meta">
            <h1 className="ek1-file-name">index.js</h1>
            <span className="ek1-file-path">src/components/</span>
          </div>
        </div>
        <div className="ek1-header-right">
          <div className="ek1-dot" />
          <button className="ek1-icon-button primary" aria-label="Run">
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
        </div>
      </header>

      {/* Editor area */}
      <main className="ek1-main">
        {/* Gutter */}
        <aside className="ek1-gutter">
          {Array.from({ length: 30 }).map((_, idx) => (
            <div key={idx} className="ek1-gutter-line">
              {idx + 1}
            </div>
          ))}
        </aside>

        {/* Textarea editor */}
        <section className="ek1-editor">
          <textarea
            ref={textareaRef}
            className="ek1-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </section>
      </main>

      {/* Toolbar */}
      <div className="ek1-toolbar">
        <div className="ek1-toolbar-left">
          <button
            className="ek1-key-button"
            onClick={() => handleKeyInsert("brace")}
          >
            {"{ }"}
          </button>
          <button
            className="ek1-key-button"
            onClick={() => handleKeyInsert("paren")}
          >
            ( )
          </button>
          <button
            className="ek1-key-button"
            onClick={() => handleKeyInsert("bracket")}
          >
            [ ]
          </button>
          <button
            className="ek1-key-button"
            onClick={() => handleKeyInsert("equal")}
          >
            =
          </button>
          <button
            className="ek1-key-button"
            onClick={() => handleKeyInsert("quote")}
          >
            &quot;
          </button>
          <button
            className="ek1-key-button primary"
            onClick={() => handleKeyInsert("tab")}
          >
            TAB
          </button>
        </div>
        <div className="ek1-toolbar-right">
          <button className="ek1-icon-button" onClick={handleSave}>
            <span className="material-symbols-outlined">save</span>
          </button>
          {savedMessage && (
            <span className="ek1-save-message">{savedMessage}</span>
          )}
        </div>
      </div>
    </div>
  );
}

const defaultSnippet = `
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

// Main Counter Component
function Counter() {
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

export default Counter;
`;

export default EditorKode1;