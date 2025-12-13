function Sidebar({ files, activePath, onOpenFile }) {
  const paths = Object.keys(files);

  return (
    <aside className="cx-sidebar">
      <div className="cx-sidebar-header">
        <span className="cx-sidebar-title">EXPLORER</span>
        <button className="cx-sidebar-icon-button" title="New file">
          <span className="material-symbols-outlined">note_add</span>
        </button>
      </div>
      <div className="cx-sidebar-body">
        <div className="cx-sidebar-folder">
          <div className="cx-sidebar-folder-label">src</div>
          <ul className="cx-file-list">
            {paths.map((p) => (
              <li key={p}>
                <button
                  className={
                    "cx-file-item" +
                    (activePath === p ? " cx-file-item-active" : "")
                  }
                  onClick={() => onOpenFile(p)}
                >
                  <span className="material-symbols-outlined cx-file-icon">
                    description
                  </span>
                  <span className="cx-file-name">{p}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;