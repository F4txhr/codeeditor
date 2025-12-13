import { useEffect, useState } from "react";
import EditorKode1 from "./EditorKode1";

const screens = [
  { id: "editor_kode_1", group: "Editor", label: "Editor Kode 1", type: "react" },
  { id: "editor_kode_2.html", group: "Editor", label: "Editor Kode 2 - Workspace", type: "iframe" },
  { id: "manajemen_git.html", group: "Proyek & Integrasi", label: "Manajemen Git", type: "iframe" },
  { id: "integrasi_ci_cd.html", group: "Proyek & Integrasi", label: "Integrasi CI/CD", type: "iframe" },
  { id: "manajemen_bahasa.html", group: "Proyek & Integrasi", label: "Manajemen Bahasa", type: "iframe" },
  { id: "manajer_dependensi.html", group: "Proyek & Integrasi", label: "Manajer Dependensi", type: "iframe" },
  { id: "manajer_snippet_kode.html", group: "Proyek & Integrasi", label: "Manajer Snippet Kode", type: "iframe" },
  { id: "marketplace_ekstensi.html", group: "Proyek & Integrasi", label: "Marketplace Ekstensi", type: "iframe" },
  { id: "cari_ganti_global_1.html", group: "Utilitas", label: "Cari & Ganti Global", type: "iframe" },
  { id: "pengaturan_aplikasi_1.html", group: "Utilitas", label: "Pengaturan Aplikasi", type: "iframe" },
  { id: "penampil_log_aplikasi.html", group: "Utilitas", label: "Penampil Log Aplikasi", type: "iframe" }
];

const groups = ["Editor", "Proyek & Integrasi", "Utilitas"];

function App() {
  const [currentId, setCurrentId] = useState("editor_kode_1");

  useEffect(() => {
    if (window.location.hash) {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const exists = screens.some((s) => s.id === hash);
      if (exists) {
        setCurrentId(hash);
      }
    }
  }, []);

  const handleSelect = (id) => {
    setCurrentId(id);
    window.location.hash = encodeURIComponent(id);
  };

  const currentScreen = screens.find((s) => s.id === currentId);

  const renderContent = () => {
    if (!currentScreen) return null;
    if (currentScreen.type === "react" && currentScreen.id === "editor_kode_1") {
      return <EditorKode1 />;
    }
    // fallback ke iframe untuk screen lain
    return (
      <iframe
        key={currentScreen.id}
        src={`/${currentScreen.id}`}
        title={currentScreen.id}
        className="app-iframe"
      />
    );
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-title">codeEditor-x</span>
          <span className="app-subtitle">Web Prototype</span>
        </div>
        <div className="app-header-right">
          <span className="app-current">
            {currentScreen ? currentScreen.label : ""}
          </span>
        </div>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <nav className="app-nav">
            {groups.map((group) => (
              <div key={group} className="app-nav-group">
                <div className="app-nav-group-title">{group}</div>
                {screens
                  .filter((s) => s.group === group)
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelect(s.id)}
                      className={
                        "app-nav-button" +
                        (currentId === s.id ? " app-nav-button-active" : "")
                      }
                    >
                      {s.label}
                    </button>
                  ))}
              </div>
            ))}
          </nav>
        </aside>

        <section className="app-content">{renderContent()}</section>
      </main>
    </div>
  );
}

export default App;