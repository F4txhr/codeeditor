import { useEffect, useRef, useState } from "react";

/**
 * EditorKode1
 *
 * Implementasi fungsional dari desain "Editor Kode 1":
 * - Header dengan nama file dan path
 * - Editor berbasis &lt;textarea&gt; dengan styling monospaced
 * - Tombol shortcut: { }, ( ), [ ], =, " dan TAB
 * - Undo/redo sederhana
 * - Tombol Save menyimpan konten ke localStorage dan menampilkan notifikasi sederhana
 */
function EditorKode1() {
  const [code, setCode] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const textareaRef = useRef(null);

  // Muat konten awal dari localStorage atau snippet default
  useEffect(() => {
    const stored = window.localStorage.getItem("editor_kode_1_code");
    const initial = stored != null ? stored : defaultSnippet.trimStart();
    setCode(initial);
    setHistory([initial]);
    setHistoryIndex(0);
  }, []);

  // Helper untuk push state ke history
  const pushHistory = (nextCode) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      const updated = [...trimmed, nextCode].slice(-100); // batasi 100 langkah
      return updated;
    });
    setHistoryIndex((idx) => Math.min(idx + 1, 99));
  };

  // Undo / redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex >= 0 && historyIndex < history.length - 1;

  const handleUndo = () => {
    if (!canUndo) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    const value = history[nextIndex];
    setCode(value);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    const value = history[nextIndex];
    setCode(value);
  };

  // On change textarea
  const handleChange = (value) => {
    setCode(value);
    pushHistory(value);
  };

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
      cursorPos = start + 2;
    }

    setCode(newText);
    pushHistory(newText);

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

  const lines = code.split("\n").length;

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
          {Array.from({ length: lines || 1 }).map((_, idx) => (
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
            onChange={(e) => handleChange(e.target.value)}
            spellCheck={false}
          />
        </section>
      </main>

      {/* Toolbar */}
      <div className="ek1-toolbar">
        <div className="ek1-toolbar-left">
          <button
            className="ek1-key-button"
            onClick={handleUndo}
            disabled={!canUndo}
          >
            Undo
          </button>
          <button
            className="ek1-key-button"
            onClick={handleRedo}
            disabled={!canRedo}
          >
            Redo
          </button>

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
          <span className="ek1-save-message">
            Ln {lines}, Col {/* kolom kasar */}
            {(() => {
              const textarea = textareaRef.current;
              if (!textarea) return 1;
              return textarea.selectionStart ?? 1;
            })()}
          </span>
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