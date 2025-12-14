import React, { useMemo, useState } from "react";

/**
 * Explorer Tahap 1
 * - Menampilkan tree file/folder
 * - Operasi dasar: pilih file, new file, rename, delete
 * - Sorting & filtering sederhana
 */

function Explorer({
  files,
  activePath,
  onOpenFile,
  onNewFile,
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
      return a.localeCompare(b);
    });
    return list;
  }, [paths, sortMode, filterExt]);

  const tree = useMemo(() => buildTree(visiblePaths), [visiblePaths]);

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
          </select>
          <input
            className="cx-sidebar-filter"
            placeholder=".js"
            value={filterExt}
            onChange={(e) => setFilterExt(e.target.value)}
          />
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
          description
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

function buildTree(paths) {
  const root = {};

  paths.forEach((fullPath) => {
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

export default Explorer;