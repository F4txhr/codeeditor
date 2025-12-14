import { useMemo, useState } from "react";

function Sidebar({ files, activePath, onOpenFile, onNewFile }) {
  const paths = Object.keys(files);

  const tree = useMemo(() => buildTree(paths), [paths]);
  const [openFolders, setOpenFolders] = useState(new Set(["src", "src/components"]));

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
          <button
            className="cx-sidebar-icon-button"
            title="Workspace view"
            onClick={() => onNewFile && onNewFile("__SWITCH_WORKSPACE__")}
          >
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button
            className="cx-sidebar-icon-button"
            title="New file"
            onClick={() => onNewFile && onNewFile()}
          >
            <span className="material-symbols-outlined">note_add</span>
          </button>
        </div>
      </div>
      <div className="cx-sidebar-body">
        <ul className="cx-file-list">
          {Object.values(tree).map((node) => (
            <SidebarNode
              key={node.path}
              node={node}
              level={0}
              openFolders={openFolders}
              toggleFolder={toggleFolder}
              activePath={activePath}
              onOpenFile={onOpenFile}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}

function SidebarNode({
  node,
  level,
  openFolders,
  toggleFolder,
  activePath,
  onOpenFile
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
            <SidebarNode
              key={child.path}
              node={child}
              level={level + 1}
              openFolders={openFolders}
              toggleFolder={toggleFolder}
              activePath={activePath}
              onOpenFile={onOpenFile}
            />
          ))}
      </>
    );
  }

  // file
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

export default Sidebar;