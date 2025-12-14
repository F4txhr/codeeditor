import React, { useMemo, useState } from "react";

/**
 * Explorer Tahap 1
 * - Menampilkan tree file/folder
 * - Operasi dasar: pilih file, new file, rename, delete
 * - Sorting & filtering sederhana
 */

function Explorer({
  files,
  folders,
  activePath,
  onOpenFile,
  onNewFile,
  onNewFolder,
  onRenameFile,
  onDeleteFile
}) {
  const paths = Object.keys(files);
  const [openFolders, setOpenFolders] = useState(new Set(["src"]));
  const [sortMode, setSortMode] = useState("name");
  const [filterExt, setFilterExt] = useState("");

  const visiblePaths = useMemo(() => {
    let list = paths;
    if (filterExt.trim()) {
      const ext = filterExt.trim().replace(/^\./, "");
      list = list.filter((p) => p.endsWith(`.${ext}`));
    }
    list = [...list].sort((a, b) => {
      if (sortMode === "name") return a.localeCompare(b);
      if (sortMode === "type") {
        const ea = a.split(".").pop() || "";
        const eb = b.split(".").pop() || "";
        if (ea === eb) return a.localeCompare(b);
        return ea.localeCompare(eb);
      }
      if (sortMode === "modified") {
        const ma = files[a]?.modifiedAt || 0;
        const mb = files[b]?.modifiedAt || 0;
        return mb - ma;
      }
      return a.localeCompare(b);
    });
    return list;
  }, [paths, sortMode, filterExt, files]);

  const tree = useMemo(
    () => buildTree(visiblePaths, folders),
    [visiblePaths, folders]
  );

  const gitSummary = useMemo(() => {
    const summary = { modified: 0, added: 0, untracked: 0, conflict: 0 };
    Object.values(files).forEach((f) => {
      if (!f.gitStatus) return;
      if (summary[f.gitStatus] != null) summary[f.gitStatus] += 1;
    });
    return summary;
  }, [files]);

  const toggleFolder = (path) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <aside className="cx-sidebar">
      <div className="cx-sidebar-header">
        <span className="cx-sidebar-title">EXPLORER</span>
        <div className="cx-sidebar-header-actions">
          <select
            className="cx-sidebar-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="modified">Modified</option>
          </select>
          <input
            className="cx-sidebar-filter"
            placeholder=".js"
            value={filterExt}
            onChange={(e) => setFilterExt(e.target.value)}
          />
          <button
            className="cx-sidebar-icon-button"
            title="New folder"
            onClick={onNewFolder}
          >
            <span className="material-symbols-outlined">create_new_folder</span>
          </button>
          <button
            className="cx-sidebar-icon-button"
            title="New file"
            onClick={onNewFile}
          >
            <span className="material-symbols-outlined">note_add</span>
          </button>
        </div>
      </div>
      <div className="cx-sidebar-body">
        {visiblePaths.length === 0 ? (
          <p className="cx-sidebar-placeholder">
            Tidak ada file yang cocok. Ubah filter atau buat file baru.
          </p>
        ) : (
          <ul className="cx-file-list">
            {Object.values(tree).map((node) => (
              <TreeNode
                key={node.path}
                node={node}
                level={0}
                openFolders={openFolders}
                toggleFolder={toggleFolder}
                activePath={activePath}
                onOpenFile={onOpenFile}
                onRenameFile={onRenameFile}
                onDeleteFile={onDeleteFile}
                files={files}
              />
            ))}
          </ul>
        )}
        <div className="cx-git-summary">
          <span className="cx-git-summary-item">
            M: {gitSummary.modified}
          </span>
          <span className="cx-git-summary-item">
            A: {gitSummary.added}
          </span>
          <span className="cx-git-summary-item">
            U: {gitSummary.untracked}
          </span>
          <span className="cx-git-summary-item">
            C: {gitSummary.conflict}
          </span>
        </div>
      </div>
    </aside>
  );
}

function TreeNode({
  node,
  level,
  openFolders,
  toggleFolder,
  activePath,
  onOpenFile,
  onRenameFile,
  onDeleteFile,
  files
}) {
  const indentStyle = { paddingLeft: `${level * 12}px` };

  if (node.isFolder) {
    const isOpen = openFolders.has(node.path);
    return (
      <>
        <li>
          <button
            className="cx-file-item"
            style={indentStyle}
            onClick={() => toggleFolder(node.path)}
          >
            <span className="material-symbols-outlined cx-file-icon">
              {isOpen ? "expand_more" : "chevron_right"}
            </span>
            <span className="cx-file-name folder-name">{node.name}</span>
          </button>
        </li>
        {isOpen &&
          node.children &&
          Object.values(node.children).map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              openFolders={openFolders}
              toggleFolder={toggleFolder}
              activePath={activePath}
              onOpenFile={onOpenFile}
              onRenameFile={onRenameFile}
              onDeleteFile={onDeleteFile}
              files={files}
            />
          ))}
      </>
    );
  }

  const gitStatus = files[node.path]?.gitStatus;

  return (
    <li>
      <button
        className={
          "cx-file-item" +
          (activePath === node.path ? " cx-file-item-active" : "")
        }
        style={indentStyle}
        onClick={() => onOpenFile(node.path)}
      >
        <span className="material-symbols-outlined cx-file-icon">
          {getFileIcon(node.path)}
        </span>
        <span className="cx-file-name">{node.name}</span>
        {gitStatus && (
          <span className={"cx-file-git cx-git-" + gitStatus}>
            {gitStatus === "modified" && "M"}
            {gitStatus === "added" && "A"}
            {gitStatus === "untracked" && "U"}
            {gitStatus === "conflict" && "C"}
          </span>
        )}
        <span className="cx-file-actions">
          <span
            className="material-symbols-outlined cx-file-action"
            onClick={(e) => {
              e.stopPropagation();
              onRenameFile && onRenameFile(node.path);
            }}
          >
            edit
          </span>
          <span
            className="material-symbols-outlined cx-file-action"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFile && onDeleteFile(node.path);
            }}
          >
            delete
          </span>
        </span>
      </button>
    </li>
  );
}

function buildTree(filePaths, folderPaths = []) {
  const root = {};

  // tambahkan folder eksplisit
  folderPaths.forEach((fullPath) => {
    const parts = fullPath.split("/");
    let current = root;
    let accumulated = "";

    parts.forEach((part, idx) => {
      accumulated = accumulated ? `${accumulated}/${part}` : part;
      if (!current[part]) {
        current[part] = {
          name: part,
          path: accumulated,
          isFolder: true,
          children: {}
        };
      }
      if (idx < parts.length - 1) {
        current = current[part].children;
      }
    });
  });

  // tambahkan file
  filePaths.forEach((fullPath) => {
    const parts = fullPath.split("/");
    let current = root;
    let accumulated = "";

    parts.forEach((part, idx) => {
      accumulated = accumulated ? `${accumulated}/${part}` : part;
      const isLast = idx === parts.length - 1;
      if (!current[part]) {
        current[part] = {
          name: part,
          path: accumulated,
          isFolder: !isLast,
          children: !isLast ? {} : undefined
        };
      }
      if (!isLast) {
        current = current[part].children;
      }
    });
  });

  return root;
}

function getFileIcon(path) {
  const ext = path.split(".").pop() || "";
  if (ext === "js" || ext === "jsx" || ext === "ts" || ext === "tsx") {
    return "javascript";
  }
  if (ext === "css" || ext === "scss") {
    return "css";
  }
  if (ext === "json") {
    return "data_object";
  }
  if (ext === "md") {
    return "article";
  }
  return "description";
}

export default Explorer;