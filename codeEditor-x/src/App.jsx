import { useEffect, useState } from "react";

const screens = [
  { id: "editor_kode_1.html", group: "Editor", label: "Editor Kode 1" },
  { id: "editor_kode_2.html", group: "Editor", label: "Editor Kode 2 - Workspace" },
  { id: "manajemen_git.html", group: "Proyek & Integrasi", label: "Manajemen Git" },
  { id: "integrasi_ci_cd.html", group: "Proyek & Integrasi", label: "Integrasi CI/CD" },
  { id: "manajemen_bahasa.html", group: "Proyek & Integrasi", label: "Manajemen Bahasa" },
  { id: "manajer_dependensi.html", group: "Proyek & Integrasi", label: "Manajer Dependensi" },
  { id: "manajer_snippet_kode.html", group: "Proyek & Integrasi", label: "Manajer Snippet Kode" },
  { id: "marketplace_ekstensi.html", group: "Proyek & Integrasi", label: "Marketplace Ekstensi" },
  { id: "cari_ganti_global_1.html", group: "Utilitas", label: "Cari & Ganti Global" },
  { id: "pengaturan_aplikasi_1.html", group: "Utilitas", label: "Pengaturan Aplikasi" },
  { id: "penampil_log_aplikasi.html", group: "Utilitas", label: "Penampil Log Aplikasi" }
];

const groups = ["Editor", "Proyek & Integrasi", "Utilitas"];

function App() {
  const [current, setCurrent] = useState("editor_kode_1.html");

  useEffect(() => {
    if (window.location.hash) {
      const file = decodeURIComponent(window.location.hash.slice(1));
      const exists = screens.some((s) => s.id === file);
      if (exists) {
        setCurrent(file);
      }
    }
  }, []);

  const handleSelect = (id) => {
    setCurrent(id);
    window.location.hash = encodeURIComponent(id);
  };

  const currentScreen = screens.find((s) => s.id === current);

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
                        (current === s.id ? " app-nav-button-active" : "")
                      }
                    >
                      {s.label}
                    </button>
                  ))}
              </div>
            ))}
          </nav>
        </aside>

        <section className="app-content">
          <iframe
            key={current}
            src={`/${current}`}
            title={current}
            className="app-iframe"
          />
        </section>
      </main>
    </div>
  );
}

export default App;