function StatusBar({ activePath }) {
  return (
    <footer className="cx-statusbar">
      <div className="cx-status-left">
        <span className="cx-status-pill">
          <span className="material-symbols-outlined">source_environment</span>
          main
        </span>
        <span className="cx-status-muted">
          <span className="material-symbols-outlined">error</span> 0
        </span>
        <span className="cx-status-muted">
          <span className="material-symbols-outlined">warning</span> 0
        </span>
      </div>
      <div className="cx-status-right">
        <span className="cx-status-muted">
          {activePath || "untitled"}
        </span>
        <span className="cx-status-muted">UTF-8</span>
        <span className="cx-status-muted">JavaScript</span>
      </div>
    </footer>
  );
}

export default StatusBar;