import React from "react";

function TabsBar({ openTabs, activePath, files, onSelectTab, onCloseTab }) {
  if (openTabs.length === 0) return null;

  return (
    <div className="cx-tabs">
      {openTabs.map((path) => {
        const file = files[path];
        const isActive = path === activePath;
        const name = path.split("/").slice(-1)[0] || path;
        const isDirty =
          file && file.content !== undefined && file.content !== file.savedContent;
        return (
          <button
            key={path}
            className={"cx-tab" + (isActive ? " cx-tab-active" : "")}
            onClick={() => onSelectTab(path)}
          >
            <span className="cx-tab-label">
              {name}
              {isDirty && <span className="cx-tab-dirty"> ●</span>}
            </span>
            <span
              className="material-symbols-outlined cx-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(path);
              }}
            >
              close
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default TabsBar;