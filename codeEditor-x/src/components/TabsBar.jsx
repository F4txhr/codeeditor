function TabsBar({ files, activePath, onOpenFile }) {
  const paths = Object.keys(files);

  return (
    <div className="cx-tabs">
      {paths.map((p) => (
        <button
          key={p}
          className={
            "cx-tab" + (activePath === p ? " cx-tab-active" : "")
          }
          onClick={() => onOpenFile(p)}
        >
          <span className="cx-tab-label">{p}</span>
        </button>
      ))}
    </div>
  );
}

export default TabsBar;