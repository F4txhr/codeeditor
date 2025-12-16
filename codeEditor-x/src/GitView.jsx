import { useState } from "react";

/**
 * GitView
 *
 * Adaptasi fungsional dari desain "Manajemen Git":
 * - Header Source Control
 * - Status repo & branch
 * - Quick actions (Sync/Pull/Push/History)
 * - Commit message + tombol Commit
 * - Daftar staged & unstaged changes (mock data)
 */
function GitView() {
  const [commitMessage, setCommitMessage] = useState("");
  const [staged, setStaged] = useState(initialStaged);
  const [changes, setChanges] = useState(initialChanges);

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    // Simulasi commit: kosongkan staged, reset message
    setCommitMessage("");
    setStaged([]);
    // Di dunia nyata, di sini kita akan kirim ke backend/git
    // Bisa juga menambahkan ke riwayat commit
  };

  const stageAll = () => {
    setStaged([...staged, ...changes]);
    setChanges([]);
  };

  const unstageAll = () => {
    setChanges([...changes, ...staged]);
    setStaged([]);
  };

  return (
    <div className="git-root">
      {/* Header */}
      <header className="git-header">
        <div className="git-header-left">
          <div className="git-icon">
            <span className="material-symbols-outlined">source_environment</span>
          </div>
          <h1 className="git-title">Source Control</h1>
        </div>
        <div className="git-header-right">
          <button className="git-header-button">
            <span className="material-symbols-outlined">sort</span>
          </button>
          <button className="git-header-button">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
      </header>

      <main className="git-main">
        {/* Repo card */}
        <section className="git-repo-card">
          <div className="git-repo-icon">
            <span className="material-symbols-outlined">call_split</span>
          </div>
          <div className="git-repo-meta">
            <div className="git-repo-name">my-awesome-project</div>
            <div className="git-repo-branch">
              <span className="git-branch-dot" />
              <span>main</span>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="git-actions">
          <button className="git-action-tile">
            <span className="material-symbols-outlined">sync</span>
            <span>Sync</span>
          </button>
          <button className="git-action-tile">
            <span className="material-symbols-outlined">download</span>
            <span>Pull</span>
          </button>
          <button className="git-action-tile">
            <span className="material-symbols-outlined">upload</span>
            <span>Push</span>
          </button>
          <button className="git-action-main">
            <span className="material-symbols-outlined">history</span>
            <span>History</span>
          </button>
        </section>

        {/* Commit box */}
        <section className="git-commit">
          <div className="git-commit-box">
            <textarea
              className="git-commit-textarea"
              placeholder="Message (Enter to commit)"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
            />
          </div>
          <button className="git-commit-button" onClick={handleCommit}>
            <span className="material-symbols-outlined">check</span>
            <span>Commit to main</span>
          </button>
        </section>

        {/* Staged */}
        <section className="git-list">
          <div className="git-list-header">
            <div className="git-list-title">
              <span className="material-symbols-outlined">expand_more</span>
              <span>Staged Changes</span>
              <span className="git-badge-primary">{staged.length}</span>
            </div>
            {staged.length > 0 && (
              <button className="git-link" onClick={unstageAll}>
                Unstage All
              </button>
            )}
          </div>
          {staged.map((item) => (
            <FileRow key={item.id} item={item} />
          ))}
          {staged.length === 0 && (
            <div className="git-empty">Tidak ada file yang di-stage.</div>
          )}
        </section>

        {/* Changes */}
        <section className="git-list">
          <div className="git-list-header">
            <div className="git-list-title">
              <span className="material-symbols-outlined">expand_more</span>
              <span>Changes</span>
              <span className="git-badge-neutral">{changes.length}</span>
            </div>
            {changes.length > 0 && (
              <div className="git-list-actions">
                <button className="git-link">Discard All</button>
                <button className="git-link primary" onClick={stageAll}>
                  Stage All
                </button>
              </div>
            )}
          </div>
          {changes.map((item) => (
            <FileRow key={item.id} item={item} />
          ))}
          {changes.length === 0 && (
            <div className="git-empty">Tidak ada perubahan.</div>
          )}
        </section>
      </main>
    </div>
  );
}

function FileRow({ item }) {
  return (
    <div className="git-row">
      <div className="git-row-main">
        <span className={`material-symbols-outlined ${iconColor(item.kind)}`}>
          {iconName(item.kind)}
        </span>
        <div className="git-row-text">
          <span className="git-row-name">{item.name}</span>
          <span className="git-row-path">{item.path}</span>
        </div>
        <span className={badgeClass(item.kind)}>{badgeText(item.kind)}</span>
      </div>
      <button className="git-row-button">
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>
  );
}

function iconName(kind) {
  switch (kind) {
    case "modified":
      return "edit_document";
    case "added":
      return "article";
    case "deleted":
      return "delete";
    case "untracked":
      return "help";
    default:
      return "description";
  }
}

function iconColor(kind) {
  switch (kind) {
    case "modified":
      return "icon-yellow";
    case "added":
      return "icon-green";
    case "deleted":
      return "icon-red";
    case "untracked":
      return "icon-green";
    default:
      return "";
  }
}

function badgeClass(kind) {
  switch (kind) {
    case "modified":
      return "git-badge git-badge-modified";
    case "added":
      return "git-badge git-badge-added";
    case "deleted":
      return "git-badge git-badge-deleted";
    case "untracked":
      return "git-badge git-badge-added";
    default:
      return "git-badge";
  }
}

function badgeText(kind) {
  switch (kind) {
    case "modified":
      return "M";
    case "added":
      return "A";
    case "deleted":
      return "D";
    case "untracked":
      return "U";
    default:
      return "";
  }
}

const initialStaged = [
  {
    id: 1,
    kind: "modified",
    name: "App.js",
    path: "src/components"
  },
  {
    id: 2,
    kind: "added",
    name: "global.css",
    path: "src/styles"
  }
];

const initialChanges = [
  {
    id: 3,
    kind: "deleted",
    name: "utils.ts",
    path: "src/lib"
  },
  {
    id: 4,
    kind: "untracked",
    name: "README.md",
    path: "/"
  },
  {
    id: 5,
    kind: "modified",
    name: "Header.tsx",
    path: "src/components/layout"
  }
];

export default GitView;